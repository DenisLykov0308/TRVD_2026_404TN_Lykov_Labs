import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RolesRepository } from '../roles/roles.repository';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './users.repository';

const PASSWORD_SALT_ROUNDS = 10;
const DEFAULT_SIGNUP_ROLE_NAME = 'User';

type UserWithRole = {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  role: {
    id: number;
    name: string;
  };
};

type RegisterUserInput = {
  full_name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user: UserWithRole) => this.toDto(user));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено.');
    }

    return this.toDto(user as UserWithRole);
  }

  async register(input: RegisterUserInput): Promise<UserResponseDto> {
    const role = await this.rolesRepository.getOrCreateByName(DEFAULT_SIGNUP_ROLE_NAME);

    return this.createUser({
      full_name: input.full_name,
      email: input.email,
      password: input.password,
      role_id: role.id,
      is_active: true,
    });
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    await this.ensureRoleExists(dto.role_id);

    return this.createUser({
      full_name: dto.full_name,
      email: dto.email,
      password: dto.password,
      role_id: dto.role_id,
      is_active: dto.is_active ?? true,
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    await this.findOne(id);

    if (dto.role_id !== undefined) {
      await this.ensureRoleExists(dto.role_id);
    }

    if (dto.email) {
      const userWithEmail = await this.usersRepository.findByEmail(dto.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new BadRequestException('Користувач з таким email вже існує.');
      }
    }

    const user = await this.usersRepository.update(id, {
      full_name: dto.full_name,
      email: dto.email,
      password_hash: dto.password ? await this.hashPassword(dto.password) : undefined,
      role_id: dto.role_id,
      is_active: dto.is_active,
    });

    return this.toDto(user as UserWithRole);
  }

  async remove(id: number): Promise<UserResponseDto> {
    await this.findOne(id);
    const user = await this.usersRepository.delete(id);
    return this.toDto(user as UserWithRole);
  }

  private async ensureRoleExists(roleId: number) {
    const role = await this.rolesRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException('Роль не знайдено.');
    }
  }

  private async createUser(input: {
    full_name: string;
    email: string;
    password: string;
    role_id: number;
    is_active: boolean;
  }): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(input.email);
    if (existingUser) {
      throw new BadRequestException('Користувач з таким email вже існує.');
    }

    const user = await this.usersRepository.create({
      full_name: input.full_name,
      email: input.email,
      password_hash: await this.hashPassword(input.password),
      role_id: input.role_id,
      is_active: input.is_active,
    });

    return this.toDto(user as UserWithRole);
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  }

  private toDto(user: UserWithRole): UserResponseDto {
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      is_active: user.is_active,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
