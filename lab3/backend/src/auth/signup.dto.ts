import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'Іван Коваленко' })
  @IsString()
  @MinLength(2)
  full_name!: string;

  @ApiProperty({ example: 'user@warehouse.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'User123!' })
  @IsString()
  @MinLength(6)
  password!: string;
}
