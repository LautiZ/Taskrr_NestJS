import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDto } from '../dto/project.dto';
import { ProjectUpdateDto } from '../dto/project-update.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AccessLevelGuard } from '../../auth/guards/access-level.guard';
import { AccessLevel } from '../../auth/decorators/acces-level.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ROLES } from '../../constants/roles';

@Controller('projects')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Roles(ROLES.CREATOR)
  @Post('create/userOwner/:userId')
  public async createProject(
    @Body() body: ProjectDto,
    @Param('userId') userId: string,
  ) {
    return await this.projectsService.createProject(body, userId);
  }

  @Get('all')
  public async findAllProjects() {
    return await this.projectsService.findProjects();
  }

  @Get(':projectId')
  public async findProjectById(@Param('projectId') id: string) {
    return await this.projectsService.findProjectById(id);
  }

  @AccessLevel(50)
  @Patch('edit/:projectId')
  public async updateProject(
    @Param('projectId') id: string,
    @Body() body: ProjectUpdateDto,
  ) {
    return await this.projectsService.updateProject(body, id);
  }

  @Delete('delete/:projectId')
  public async deleteProject(@Param('projectId') id: string) {
    return await this.projectsService.deleteProject(id);
  }
}
