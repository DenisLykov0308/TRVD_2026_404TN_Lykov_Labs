import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUnitDto {
  @ApiProperty({ example: 'Штука' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'шт' })
  @IsString()
  short_name!: string;
}

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}