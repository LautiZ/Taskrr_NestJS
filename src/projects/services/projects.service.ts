import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { ProjectsEntity } from '../entities/projects.entity';
import { ProjectUpdateDto } from '../dto/project-update.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>,
  ) {}

  public async createProject(body: ProjectsEntity): Promise<ProjectsEntity> {
    try {
      return await this.projectsRepository.save(body);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async findProjects(): Promise<ProjectsEntity[]> {
    try {
      return await this.projectsRepository.find();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async findProjectById(id: string): Promise<ProjectsEntity> {
    try {
      return await this.projectsRepository
        .createQueryBuilder('project')
        .where({ id })
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateProject(
    body: ProjectUpdateDto,
    id: string,
  ): Promise<UpdateResult | undefined> {
    try {
      const project = await this.projectsRepository.update(id, body);

      if (project.affected === 0) {
        return undefined;
      }

      return project;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteProject(id: string): Promise<DeleteResult | undefined> {
    try {
      const project = await this.projectsRepository.delete(id);

      if (project.affected === 0) {
        return undefined;
      }

      return project;
    } catch (error) {
      throw new Error(error);
    }
  }
}
