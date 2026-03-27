import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ example: 'admin@warehouse.local' })
  email!: string;

  @ApiProperty({ example: 'Адміністратор' })
  role!: string;
}
