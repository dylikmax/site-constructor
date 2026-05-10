import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/projects.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AttachmentsModule } from './attachments/attachments.module';
import { Attachment } from './attachments/attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'KeyToMySQLServer123',
      database: 'site_constructor',
      entities: [Project, Attachment],
      synchronize: true,
    }),
    ProjectsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    AttachmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
