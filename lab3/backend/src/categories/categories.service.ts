import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.findAll();
    return categories.map((category: { id: number; name: string; description: string | null }) => this.toDto(category));
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Категорію не знайдено.');
    }

    return this.toDto(category);
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const existingCategory = await this.categoriesRepository.findByName(dto.name);
    if (existingCategory) {
      throw new BadRequestException('Категорія з такою назвою вже існує.');
    }

    const category = await this.categoriesRepository.create(dto);
    return this.toDto(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    await this.findOne(id);

    if (dto.name) {
      const existingCategory = await this.categoriesRepository.findByName(dto.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestException('Категорія з такою назвою вже існує.');
      }
    }

    const category = await this.categoriesRepository.update(id, dto);
    return this.toDto(category);
  }

  async remove(id: number): Promise<CategoryResponseDto> {
    await this.findOne(id);
    const category = await this.categoriesRepository.delete(id);
    return this.toDto(category);
  }

  private toDto(category: { id: number; name: string; description: string | null }): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  }
}
