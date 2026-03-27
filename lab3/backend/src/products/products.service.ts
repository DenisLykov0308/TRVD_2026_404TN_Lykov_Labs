import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { decimalToNumber } from '../common/mappers/decimal.util';
import { CategoriesRepository } from '../categories/categories.repository';
import { SuppliersRepository } from '../suppliers/suppliers.repository';
import { UnitsRepository } from '../units/units.repository';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductsRepository } from './products.repository';

type ProductWithRelations = {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  price: Prisma.Decimal;
  quantity: number;
  min_quantity: number;
  category: { id: number; name: string };
  supplier: { id: number; name: string };
  unit: { id: number; name: string; short_name: string };
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly suppliersRepository: SuppliersRepository,
    private readonly unitsRepository: UnitsRepository,
  ) {}

  async findAll(query: ProductQueryDto): Promise<ProductResponseDto[]> {
    const products = await this.productsRepository.findAll(query.search);
    return products.map((product: ProductWithRelations) => this.toDto(product));
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Товар не знайдено.');
    }

    return this.toDto(product as ProductWithRelations);
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    await this.ensureRelations(dto.category_id, dto.supplier_id, dto.unit_id);
    const existingProduct = await this.productsRepository.findBySku(dto.sku);
    if (existingProduct) {
      throw new BadRequestException('Товар з таким артикулом вже існує.');
    }

    const product = await this.productsRepository.create({
      ...dto,
      quantity: dto.quantity ?? 0,
      min_quantity: dto.min_quantity ?? 0,
    });

    return this.toDto(product as ProductWithRelations);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    await this.findOne(id);

    if (dto.sku) {
      const existingProduct = await this.productsRepository.findBySku(dto.sku);
      if (existingProduct && existingProduct.id !== id) {
        throw new BadRequestException('Товар з таким артикулом вже існує.');
      }
    }

    await this.ensureRelations(dto.category_id, dto.supplier_id, dto.unit_id);
    const product = await this.productsRepository.update(id, dto);
    return this.toDto(product as ProductWithRelations);
  }

  async remove(id: number): Promise<ProductResponseDto> {
    await this.findOne(id);

    const dependencies = await this.productsRepository.getDeleteDependencies(id);
    if (dependencies.receiptItems > 0 || dependencies.shipmentItems > 0 || dependencies.transactions > 0) {
      throw new BadRequestException(
        'Товар не можна видалити, оскільки він використовується у документах надходження, відвантаження або журналі руху товарів.',
      );
    }

    try {
      const product = await this.productsRepository.delete(id);
      return this.toDto(product as ProductWithRelations);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new BadRequestException(
          'Товар не можна видалити, оскільки він пов’язаний з іншими записами в базі даних.',
        );
      }

      throw error;
    }
  }

  private async ensureRelations(category_id?: number, supplier_id?: number, unit_id?: number) {
    if (category_id !== undefined) {
      const category = await this.categoriesRepository.findById(category_id);
      if (!category) {
        throw new NotFoundException('Категорію не знайдено.');
      }
    }

    if (supplier_id !== undefined) {
      const supplier = await this.suppliersRepository.findById(supplier_id);
      if (!supplier) {
        throw new NotFoundException('Постачальника не знайдено.');
      }
    }

    if (unit_id !== undefined) {
      const unit = await this.unitsRepository.findById(unit_id);
      if (!unit) {
        throw new NotFoundException('Одиницю виміру не знайдено.');
      }
    }
  }

  private toDto(product: ProductWithRelations): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: decimalToNumber(product.price),
      quantity: product.quantity,
      min_quantity: product.min_quantity,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
      supplier: {
        id: product.supplier.id,
        name: product.supplier.name,
      },
      unit: {
        id: product.unit.id,
        name: product.unit.name,
        short_name: product.unit.short_name,
      },
    };
  }
}