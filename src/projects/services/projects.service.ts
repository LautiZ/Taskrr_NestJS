import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { ProjectsEntity } from '../entities/projects.entity';
import { ProjectUpdateDto } from '../dto/project-update.dto';
import { ErrorManager } from '../../utils/error.manager';
import { ProjectDto } from '../dto/project.dto';
import { UsersProjectsEntity } from '../../users/entities/usersProjects.entity';
import { ACCESS_LEVEL } from '../../constants/roles';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>,

    @InjectRepository(UsersProjectsEntity)
    private readonly userProjectsRepository: Repository<UsersProjectsEntity>,

    private readonly userService: UsersService,
  ) {}

  public async createProject(
    body: ProjectDto,
    userId: string,
  ): Promise<UsersProjectsEntity> {
    try {
      const user = await this.userService.findUserById(userId);
      const project = await this.projectsRepository.save(body);
      return await this.userProjectsRepository.save({
        accessLevel: ACCESS_LEVEL.OWNER,
        user: user,
        project,
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findProjects(): Promise<ProjectsEntity[]> {
    try {
      const projects: ProjectsEntity[] = await this.projectsRepository.find();
      if (projects.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No projects found',
        });
      }

      return projects;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findProjectById(id: string): Promise<ProjectsEntity> {
    try {
      const project: ProjectsEntity = await this.projectsRepository
        .createQueryBuilder('project')
        .where({ id })
        .leftJoinAndSelect('project.usersIncludes', 'usersIncludes')
        .leftJoinAndSelect('usersIncludes.user', 'user')
        .getOne();

      if (!project) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Project not found',
        });
      }

      return project;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateProject(
    body: ProjectUpdateDto,
    id: string,
  ): Promise<UpdateResult | undefined> {
    try {
      const project = await this.projectsRepository.update(id, body);

      if (project.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Project could not be updated',
        });
      }

      return project;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteProject(id: string): Promise<DeleteResult | undefined> {
    try {
      const project = await this.projectsRepository.delete(id);

      if (project.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Project could not be deleted',
        });
      }

      return project;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
