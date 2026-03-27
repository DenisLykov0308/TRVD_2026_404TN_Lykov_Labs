import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'ТОВ Рітейл Центр' })
  name!: string;

  @ApiProperty({ example: 'Олена Коваль', required: false })
  contact_person!: string | null;

  @ApiProperty({ example: '+380671234567', required: false })
  phone!: string | null;

  @ApiProperty({ example: 'office@example.com', required: false })
  email!: string | null;

  @ApiProperty({ example: 'м. Львів, вул. Галицька, 8', required: false })
  address!: string | null;
}