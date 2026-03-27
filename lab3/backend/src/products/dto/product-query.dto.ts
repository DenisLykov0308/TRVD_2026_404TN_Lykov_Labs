import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional({ example: 'ноутбук' })
  @IsOptional()
  @IsString()
  search?: string;
}
