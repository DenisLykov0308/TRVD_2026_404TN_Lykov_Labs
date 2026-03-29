import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ADMIN_ROLE_NAMES } from '../auth/auth.constants';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { IdParamDto } from '../common/dto/id-param.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список товарів' })
  @ApiQuery({ name: 'search', required: false, description: 'Пошук товарів за назвою' })
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати товар за ідентифікатором' })
  @ApiOkResponse({ type: ProductResponseDto })
  findOne(@Param() params: IdParamDto) {
    return this.productsService.findOne(params.id);
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Створити товар' })
  @ApiCreatedResponse({ type: ProductResponseDto })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити товар' })
  @ApiOkResponse({ type: ProductResponseDto })
  update(@Param() params: IdParamDto, @Body() dto: UpdateProductDto) {
    return this.productsService.update(params.id, dto);
  }

  @ApiBearerAuth()
  @Roles(...ADMIN_ROLE_NAMES)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити товар' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiBadRequestResponse({
    description:
      'Товар пов’язаний з документами надходження, відвантаження або журналом руху товарів.',
  })
  remove(@Param() params: IdParamDto) {
    return this.productsService.remove(params.id);
  }
}
