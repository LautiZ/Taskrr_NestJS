import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ACCESS_LEVEL_KEY,
  ADMIN_KEY,
  PUBLIC_KEY,
  ROLES_KEY,
} from '../../constants/key-decorators';
import { ErrorManager } from '../../utils/error.manager';
import { ROLES } from '../../constants/roles';
import { Request } from 'express';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.get<boolean>(
        PUBLIC_KEY,
        context.getHandler(),
      );

      if (isPublic) {
        return true;
      }

      const roles = this.reflector.get<Array<keyof typeof ROLES>>(
        ROLES_KEY,
        context.getHandler(),
      );

      const accessLevel = this.reflector.get<number>(
        ACCESS_LEVEL_KEY,
        context.getHandler(),
      );

      const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());

      const req = context.switchToHttp().getRequest<Request>();
      const { roleUser, idUser } = req;

      if (accessLevel === undefined) {
        if (roles === undefined) {
          if (!admin) {
            return true;
          } else if (admin && roleUser === ROLES.ADMIN) {
            return true;
          } else {
            throw new ErrorManager({
              type: 'UNAUTHORIZED',
              message:
                'You do not have the proper permissions to perform this action.',
            });
          }
        }
      }

      if (roleUser === ROLES.ADMIN || roleUser === ROLES.CREATOR) {
        return true;
      }

      const user = await this.userService.findUserById(idUser);

      const userExistInProject = user.projectsIncludes.find(
        (project) => project.project.id === req.params.projectId,
      );

      if (userExistInProject === undefined) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'You are not a member of this project.',
        });
      }

      if (accessLevel !== userExistInProject.accessLevel) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message:
            'You do not have the proper permissions to perform this action.',
        });
      }

      return true;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
