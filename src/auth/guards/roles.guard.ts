import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  ADMIN_KEY,
  PUBLIC_KEY,
  ROLES_KEY,
} from '../../constants/key-decorators';
import { ErrorManager } from '../../utils/error.manager';
import { ROLES } from '../../constants/roles';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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

      const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());

      const req = context.switchToHttp().getRequest<Request>();
      const { roleUser } = req;

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

      if (roleUser === ROLES.ADMIN) {
        return true;
      }

      const isAuth = roles.some((role) => role === roleUser);

      if (!isAuth) {
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
