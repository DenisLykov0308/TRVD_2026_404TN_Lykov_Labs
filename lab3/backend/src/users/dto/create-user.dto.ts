import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Іван Коваленко' })
  @IsString()
  full_name!: string;

  @ApiProperty({ example: 'user@warehouse.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'User123!' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  role_id!: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}