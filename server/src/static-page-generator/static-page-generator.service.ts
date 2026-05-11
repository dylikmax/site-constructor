import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

@Injectable()
export class StaticPageGeneratorService {
  private readonly logger = new Logger(StaticPageGeneratorService.name);
  private readonly baseDir = join(process.cwd(), 'public');

  /**
   * Генерирует статический HTML по JSON-дереву проекта
   */
  async generatePage(url: string, tree: Record<string, any>, projectName: string): Promise<void> {
    if (!tree) {
      this.logger.warn(`Skipped generation for /${url}: tree is empty`);
      return;
    }

    try {
      const dirPath = join(this.baseDir, url);
      if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
      }

      const bodyHtml = this.buildTreeHtml(tree);
      const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(projectName)}</title>
</head>
<body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif;">
  ${bodyHtml}
</body>
</html>`;

      await writeFile(join(dirPath, 'index.html'), fullHtml, 'utf-8');
      this.logger.log(`✅ Static page generated: /${url}/index.html`);
    } catch (error) {
      this.logger.error(`❌ Failed to generate static page for /${url}: ${error.message}`);
      // Не бросаем ошибку, чтобы PATCH-запрос не падал
    }
  }

  /** Рекурсивный обход дерева */
  private buildTreeHtml(element: Record<string, any>): string {
    const styles: string[] = [];
    
    if (element.background) styles.push(`background-color: ${element.background}`);
    if (element.backgroundImage) {
      // Экранируем кавычки в URL на всякий случай
      const safeUrl = element.backgroundImage.replace(/"/g, '&quot;');
      styles.push(`background-image: url("${safeUrl}"); background-size: cover; background-position: center; background-repeat: no-repeat;`);
    }

    let tag = 'div';
    let innerContent = '';

    switch (element.type) {
      case 'body':
        tag = 'main';
        styles.push('min-height: 100vh; width: 100%;');
        break;
      case 'container':
        tag = 'section';
        styles.push('padding: 1rem; display: grid; gap: 0.5rem;');
        const cols = Number(element.columns) || 1;
        styles.push(`grid-template-columns: repeat(${cols}, 1fr);`);
        break;
      case 'text':
        tag = 'p';
        styles.push(
          `color: ${element.color || '#000000'}; ` +
          `font-size: ${element.size || 16}px; ` +
          `text-align: ${element.align || 'left'}; ` +
          `margin: 0; line-height: 1.5;`
        );
        innerContent = this.escapeHtml(String(element.content || ''));
        break;
      default:
        tag = 'div';
    }

    // Рекурсивно обрабатываем дочерние элементы (только если это не текст)
    if (Array.isArray(element.content) && element.type !== 'text') {
      innerContent = element.content.map((child: any) => this.buildTreeHtml(child)).join('');
    }

    const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
    return `<${tag}${styleAttr}>${innerContent}</${tag}>`;
  }

  /** Защита от XSS в текстовом контенте */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}