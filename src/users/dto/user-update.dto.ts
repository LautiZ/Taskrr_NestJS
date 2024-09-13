import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ROLES } from 'src/constants/roles';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  userName: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(ROLES)
  role: ROLES;
}
