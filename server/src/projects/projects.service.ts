import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './projects.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { StaticPageGeneratorService } from 'src/static-page-generator/static-page-generator.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private readonly pageGenerator: StaticPageGeneratorService,
  ) {}

  getList(): Promise<Project[]> {
    return this.projectsRepository.find();
  }

  getById(id: number): Promise<Project | null> {
    return this.projectsRepository.findOneBy({ id });
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const newProject = this.projectsRepository.create({
      ...dto,
      tree: {
        uuid: '1',
        name: 'Body',
        type: 'body',
        content: [],
        background: '#000000',
      },
    });
    return this.projectsRepository.save(newProject);
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) throw new NotFoundException(`Проект с ID ${id} не найден`);

    if (dto.name !== undefined) project.name = dto.name;
    if (dto.url !== undefined) project.url = dto.url;
    if (dto.isActive !== undefined) project.isActive = dto.isActive;
    if (dto.tree !== undefined) project.tree = dto.tree;

    const updatedProject = await this.projectsRepository.save(project);

    // 🌐 Генерируем статику после успешного сохранения
    if (updatedProject.isActive) {
      this.pageGenerator.generatePage(updatedProject.url, updatedProject.tree, updatedProject.name);
    }

    return updatedProject;
  }

  async delete(id: number): Promise<void> {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Проект с ID ${id} не найден`);
    }

    await this.projectsRepository.remove(project);
  }
}
