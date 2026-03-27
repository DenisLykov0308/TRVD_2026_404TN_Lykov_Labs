import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './login.dto';
import { LoginResponseDto } from './login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findByEmail(dto.email);

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Невірний email або пароль.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірний email або пароль.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      email: user.email,
      role: user.role.name,
    };
  }
}