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
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { SuppliersService } from './suppliers.service';

@ApiTags('suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список постачальників' })
  @ApiOkResponse({ type: SupplierResponseDto, isArray: true })
  findAll() {
    return this.suppliersService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати постачальника за ідентифікатором' })
  @ApiOkResponse({ type: SupplierResponseDto })
  findOne(@Param() params: IdParamDto) {
    return this.suppliersService.findOne(params.id);
  }

  @ApiBearerAuth()
  @Roles(...ADMIN_ROLE_NAMES)
  @Post()
  @ApiOperation({ summary: 'Створити постачальника' })
  @ApiCreatedResponse({ type: SupplierResponseDto })
  create(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(dto);
  }

  @ApiBearerAuth()
  @Roles(...ADMIN_ROLE_NAMES)
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити постачальника' })
  @ApiOkResponse({ type: SupplierResponseDto })
  update(@Param() params: IdParamDto, @Body() dto: UpdateSupplierDto) {
    return this.suppliersService.update(params.id, dto);
  }

  @ApiBearerAuth()
  @Roles(...ADMIN_ROLE_NAMES)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити постачальника' })
  @ApiOkResponse({ type: SupplierResponseDto })
  remove(@Param() params: IdParamDto) {
    return this.suppliersService.remove(params.id);
  }
}
