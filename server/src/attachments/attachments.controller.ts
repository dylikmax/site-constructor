import { 
  Controller, Post, Get, Query, UploadedFile, 
  UseInterceptors, BadRequestException, HttpCode, HttpStatus 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AttachmentsService } from './attachments.service';
import { IsOptional, IsString } from 'class-validator';

class SearchAttachmentDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() projectId?: string; // строка, чтобы не ломать валидацию при пустом ?projectId=
}

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.cwd() + '/uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, uniqueSuffix);
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 МБ
    fileFilter: (req, file, cb) => {
      // Разрешаем изображения, PDF, архивы, видео. Добавьте нужные MIME-типы.
      const allowed = [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif',
        'application/pdf', 'application/zip', 'application/x-tar',
        'video/mp4', 'video/webm'
      ];
      if (!allowed.includes(file.mimetype)) {
        cb(new BadRequestException('Неподдерживаемый тип файла'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('projectId') projectId?: string
  ) {
    if (!file) throw new BadRequestException('Файл не передан');
    
    const attachment = await this.attachmentsService.create(
      file, 
      projectId ? Number(projectId) : undefined
    );

    return { ...attachment, url: this.attachmentsService.getPublicUrl(attachment.filename) };
  }

  @Get()
  async findAll(@Query() query: SearchAttachmentDto) {
    const attachments = await this.attachmentsService.findAll({
      search: query.search,
      type: query.type,
      projectId: query.projectId ? Number(query.projectId) : undefined,
    });

    return attachments.map((a) => ({
      ...a,
      url: this.attachmentsService.getPublicUrl(a.filename),
    }));
  }
}
