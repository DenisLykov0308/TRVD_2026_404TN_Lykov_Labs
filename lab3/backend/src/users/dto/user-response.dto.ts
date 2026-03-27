import { ApiProperty } from '@nestjs/swagger';

class UserRoleDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Адміністратор' })
  name!: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Іван Коваленко' })
  full_name!: string;

  @ApiProperty({ example: 'user@warehouse.local' })
  email!: string;

  @ApiProperty({ example: true })
  is_active!: boolean;

  @ApiProperty({ type: UserRoleDto })
  role!: UserRoleDto;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  created_at!: Date;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  updated_at!: Date;
}