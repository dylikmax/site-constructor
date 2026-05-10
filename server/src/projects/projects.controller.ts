import {
  Controller,
  Get,
  Param,
  NotFoundException,
  ParseIntPipe,
  Post,
  HttpCode,
  Body,
  Patch,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getAll() {
    return this.projectsService.getList();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const project = await this.projectsService.getById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.projectsService.delete(id);
  }
}
