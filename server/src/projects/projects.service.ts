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

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
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
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (dto.name !== undefined) project.name = dto.name;
    if (dto.url !== undefined) project.url = dto.url;
    if (dto.isActive !== undefined) project.isActive = dto.isActive;
    if (dto.tree !== undefined) project.tree = dto.tree;

    try {
      return await this.projectsRepository.save(project);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(`
          URL "${dto.url}" already busy with another project
          `);
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Проект с ID ${id} не найден`);
    }

    await this.projectsRepository.remove(project);
  }
}
