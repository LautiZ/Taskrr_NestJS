import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/services/users.service';
import { PUBLIC_KEY } from '../../constants/key-decorators';
import { Request } from 'express';
import { useToken } from '../../utils/use.token';
import { IUseToken } from '../interfaces/auth.interface';
import { ErrorManager } from '../../utils/error.manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
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

      const req = context.switchToHttp().getRequest<Request>();
      const token = req.headers['taskrr_token'];

      if (!token || Array.isArray(token)) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid token',
        });
      }

      const manageToken: IUseToken | string = useToken(token);

      if (typeof manageToken === 'string') {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: manageToken,
        });
      }

      if (!manageToken.isExpired) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Expired token',
        });
      }

      const { sub } = manageToken;
      const user = await this.userService.findUserById(sub);

      if (!user) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid user',
        });
      }

      req.idUser = user.id;
      req.roleUser = user.role;

      return true;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
