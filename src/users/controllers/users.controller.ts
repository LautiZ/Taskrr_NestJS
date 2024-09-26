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
import { UsersService } from '../services/users.service';
import { UserDto } from '../dto/user.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserToProjectDto } from '../dto/user-to-project.dto';
import { PublicAccess } from '../../auth/decorators/public.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @PublicAccess()
  @Post('register')
  public async registerUser(@Body() body: UserDto) {
    return await this.usersService.createUser(body);
  }

  @AdminAccess()
  @Get('all')
  public async findAllUsers() {
    return await this.usersService.findUsers();
  }

  @PublicAccess()
  @Get(':id')
  public async findUserById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }

  @Patch('edit/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() body: UserUpdateDto,
  ) {
    return await this.usersService.updateUser(body, id);
  }

  @Delete('delete/:id')
  public async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }

  @Post('add-to-project')
  public async addToProject(@Body() body: UserToProjectDto) {
    return await this.usersService.relationToProject(body);
  }
}
