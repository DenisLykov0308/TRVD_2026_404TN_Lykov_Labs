import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleResponseDto } from './role-response.dto';
import { RolesService } from './roles.service';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список ролей' })
  @ApiOkResponse({ type: RoleResponseDto, isArray: true })
  findAll() {
    return this.rolesService.findAll();
  }
}

