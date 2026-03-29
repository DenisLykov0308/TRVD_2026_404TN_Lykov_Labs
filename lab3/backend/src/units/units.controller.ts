import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ADMIN_ROLE_NAMES } from '../auth/auth.constants';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { IdParamDto } from '../common/dto/id-param.dto';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';
import { UnitResponseDto } from './dto/unit-response.dto';
import { UnitsService } from './units.service';

@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список одиниць виміру' })
  @ApiOkResponse({ type: UnitResponseDto, isArray: true })
  findAll() {
    return this.unitsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати одиницю виміру за ідентифікатором' })
  @ApiOkResponse({ type: UnitResponseDto })
  findOne(@Param() params: IdParamDto) {
    return this.unitsService.findOne(params.id);
  }

  @ApiBearerAuth()
  @Roles(...ADMIN_ROLE_NAMES)
  @Post()
  @ApiOperation({ summary: 'Створити одиницю виміру' })
  @ApiCreatedResponse({ type: UnitResponseDto })
  create(@Body() dto: CreateUnitDto) {
    return this.unitsService.create(dto);
  }

  @ApiBearerAuth()
  @Roles(...ADMIN_ROLE_NAMES)
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити одиницю виміру' })
  @ApiOkResponse({ type: UnitResponseDto })
  update(@Param() params: IdParamDto, @Body() dto: UpdateUnitDto) {
    return this.unitsService.update(params.id, dto);
  }

  @ApiBearerAuth()
  @Roles(...ADMIN_ROLE_NAMES)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити одиницю виміру' })
  @ApiOkResponse({ type: UnitResponseDto })
  remove(@Param() params: IdParamDto) {
    return this.unitsService.remove(params.id);
  }
}
