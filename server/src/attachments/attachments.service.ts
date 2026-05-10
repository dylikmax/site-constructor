import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Attachment } from './attachment.entity';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

@Injectable()
export class AttachmentsService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepo: Repository<Attachment>,
  ) {
    if (!existsSync(this.uploadDir)) mkdirSync(this.uploadDir, { recursive: true });
  }

  async create(file: Express.Multer.File, projectId?: number): Promise<Attachment> {
    const attachment = this.attachmentsRepo.create({
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      projectId,
    });
    return this.attachmentsRepo.save(attachment);
  }

  async findAll(query: { search?: string; type?: string; projectId?: number }): Promise<Attachment[]> {
    const { search, type, projectId } = query;
    const where: any = {};

    if (search) where.originalName = ILike(`%${search}%`);
    if (type) where.mimeType = type;
    if (projectId) where.projectId = projectId;

    return this.attachmentsRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  getPublicUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}