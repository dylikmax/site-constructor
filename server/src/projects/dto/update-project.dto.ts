import {
  IsOptional,
  IsString,
  IsBoolean,
  IsObject,
  MinLength,
} from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  tree?: Record<string, any>;
}