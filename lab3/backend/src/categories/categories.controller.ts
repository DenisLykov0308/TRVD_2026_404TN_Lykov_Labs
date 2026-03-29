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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список категорій' })
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати категорію за ідентифікатором' })
  @ApiOkResponse({ type: CategoryResponseDto })
  findOne(@Param() params: IdParamDto) {
    return this.categoriesService.findOne(params.id);
  }

  @ApiBearerAuth()
  @Roles(...ADMIN_ROLE_NAMES)
  @Post()
  @ApiOperation({ summary: 'Створити категорію' })
  @ApiCreatedResponse({ type: CategoryResponseDto })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @ApiBearerAuth()
  @Roles(...ADMIN_ROLE_NAMES)
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити категорію' })
  @ApiOkResponse({ type: CategoryResponseDto })
  update(@Param() params: IdParamDto, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(params.id, dto);
  }

  @ApiBearerAuth()
  @Roles(...ADMIN_ROLE_NAMES)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити категорію' })
  @ApiOkResponse({ type: CategoryResponseDto })
  remove(@Param() params: IdParamDto) {
    return this.categoriesService.remove(params.id);
  }
}
