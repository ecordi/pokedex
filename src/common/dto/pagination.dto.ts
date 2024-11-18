import { IsObject, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { envs } from 'src/config/env';
export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = envs.defaulLimit;
  @IsOptional()
  @IsString()
  orderBy?: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsObject()
  filter?: Record<string, any>;
}
