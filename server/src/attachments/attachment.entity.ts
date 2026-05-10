import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column({ unique: true })
  filename: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ nullable: true })
  projectId?: number;

  @CreateDateColumn()
  createdAt: Date;
}