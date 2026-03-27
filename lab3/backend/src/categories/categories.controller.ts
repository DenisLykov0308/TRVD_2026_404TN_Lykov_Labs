import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../common/dto/id-param.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список категорій' })
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати категорію за ідентифікатором' })
  @ApiOkResponse({ type: CategoryResponseDto })
  findOne(@Param() params: IdParamDto) {
    return this.categoriesService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити категорію' })
  @ApiCreatedResponse({ type: CategoryResponseDto })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити категорію' })
  @ApiOkResponse({ type: CategoryResponseDto })
  update(@Param() params: IdParamDto, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(params.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити категорію' })
  @ApiOkResponse({ type: CategoryResponseDto })
  remove(@Param() params: IdParamDto) {
    return this.categoriesService.remove(params.id);
  }
}

