import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { TasksDto } from '../dto/tasks.dto';
import { AccessLevelGuard } from '../../auth/guards/access-level.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AccessLevel } from '../../auth/decorators/acces-level.decorator';
import { ACCESS_LEVEL } from '../../constants/roles';

@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @AccessLevel(ACCESS_LEVEL.DEVELOPER)
  @Post('create/:projectId')
  public async createTask(
    @Body() body: TasksDto,
    @Param('projectId') projectId: string,
  ) {
    return this.taskService.createTask(body, projectId);
  }
}
