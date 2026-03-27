import { Injectable } from '@nestjs/common';
import { RoleResponseDto } from './role-response.dto';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.rolesRepository.findAll();

    return roles.map((role: { id: number; name: string }) => ({
      id: role.id,
      name: role.name,
    }));
  }
}