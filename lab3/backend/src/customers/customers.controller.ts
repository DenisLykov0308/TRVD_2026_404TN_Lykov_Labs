import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../common/dto/id-param.dto';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CustomersService } from './customers.service';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список клієнтів' })
  @ApiOkResponse({ type: CustomerResponseDto, isArray: true })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати клієнта за ідентифікатором' })
  @ApiOkResponse({ type: CustomerResponseDto })
  findOne(@Param() params: IdParamDto) {
    return this.customersService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити клієнта' })
  @ApiCreatedResponse({ type: CustomerResponseDto })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити клієнта' })
  @ApiOkResponse({ type: CustomerResponseDto })
  update(@Param() params: IdParamDto, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(params.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити клієнта' })
  @ApiOkResponse({ type: CustomerResponseDto })
  remove(@Param() params: IdParamDto) {
    return this.customersService.remove(params.id);
  }
}

