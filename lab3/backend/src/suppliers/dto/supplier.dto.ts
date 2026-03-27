import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'ТОВ ТехноПостач' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Іван Петренко' })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @ApiPropertyOptional({ example: '+380501112233' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'sales@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'м. Київ, вул. Центральна, 10' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}