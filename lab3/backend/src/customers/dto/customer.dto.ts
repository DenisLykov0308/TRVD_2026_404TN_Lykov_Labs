import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'ТОВ Рітейл Центр' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Олена Коваль' })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @ApiPropertyOptional({ example: '+380671234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'office@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'м. Львів, вул. Галицька, 8' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}