import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMIN_ROLE_NAMES } from '../auth/auth.constants';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleResponseDto } from './role-response.dto';
import { RolesService } from './roles.service';

@ApiBearerAuth()
@Roles(...ADMIN_ROLE_NAMES)
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
