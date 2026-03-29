import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { LoginDto } from './login.dto';
import { LoginResponseDto } from './login-response.dto';
import { SignUpDto } from './signup.dto';

const DEFAULT_JWT_EXPIRES_IN = '30m';
const INVALID_CREDENTIALS_MESSAGE = 'Невірні облікові дані.';

type UserWithRole = {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  role: {
    id: number;
    name: string;
  };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignUpDto): Promise<UserResponseDto> {
    return this.usersService.register(dto);
  }

  async signIn(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateCredentials(dto);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer',
      expires_in: this.getExpiresInSeconds(),
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role.name,
        is_active: user.is_active,
      },
    };
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    return this.signIn(dto);
  }

  private async validateCredentials(dto: LoginDto): Promise<UserWithRole> {
    const user = await this.usersRepository.findByEmail(dto.email);

    if (!user || !user.is_active) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return user as UserWithRole;
  }

  private getExpiresInSeconds(): number {
    const rawValue =
      this.configService.get<string>('JWT_EXPIRES_IN', DEFAULT_JWT_EXPIRES_IN) ??
      DEFAULT_JWT_EXPIRES_IN;

    if (/^\d+$/.test(rawValue)) {
      return Number(rawValue);
    }

    const match = /^(\d+)([smhd])$/i.exec(rawValue.trim());
    if (!match) {
      return 30 * 60;
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    const unitToSeconds: Record<string, number> = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 24 * 60 * 60,
    };

    return value * unitToSeconds[unit];
  }
}
