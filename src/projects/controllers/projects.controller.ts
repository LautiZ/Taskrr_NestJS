import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDto } from '../dto/project.dto';
import { ProjectUpdateDto } from '../dto/project-update.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  public async createProject(@Body() body: ProjectDto) {
    return await this.projectsService.createProject(body);
  }

  @Get('all')
  public async findAllUsers() {
    return await this.projectsService.findProjects();
  }

  @Get(':id')
  public async findUserById(@Param('id') id: string) {
    return await this.projectsService.findProjectById(id);
  }

  @Patch('edit/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() body: ProjectUpdateDto,
  ) {
    return await this.projectsService.updateProject(body, id);
  }

  @Delete('delete/:id')
  public async deleteUser(@Param('id') id: string) {
    return await this.projectsService.deleteProject(id);
  }
}
