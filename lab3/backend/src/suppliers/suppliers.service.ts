import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { SuppliersRepository } from './suppliers.repository';

@Injectable()
export class SuppliersService {
  constructor(private readonly suppliersRepository: SuppliersRepository) {}

  async findAll(): Promise<SupplierResponseDto[]> {
    const suppliers = await this.suppliersRepository.findAll();
    return suppliers.map((supplier: SupplierResponseDto) => this.toDto(supplier));
  }

  async findOne(id: number): Promise<SupplierResponseDto> {
    const supplier = await this.suppliersRepository.findById(id);
    if (!supplier) {
      throw new NotFoundException('Постачальника не знайдено.');
    }

    return this.toDto(supplier as SupplierResponseDto);
  }

  async create(dto: CreateSupplierDto): Promise<SupplierResponseDto> {
    const existingSupplier = await this.suppliersRepository.findByName(dto.name);
    if (existingSupplier) {
      throw new BadRequestException('Постачальник з такою назвою вже існує.');
    }

    const supplier = await this.suppliersRepository.create(dto);
    return this.toDto(supplier as SupplierResponseDto);
  }

  async update(id: number, dto: UpdateSupplierDto): Promise<SupplierResponseDto> {
    await this.findOne(id);

    if (dto.name) {
      const existingSupplier = await this.suppliersRepository.findByName(dto.name);
      if (existingSupplier && existingSupplier.id !== id) {
        throw new BadRequestException('Постачальник з такою назвою вже існує.');
      }
    }

    const supplier = await this.suppliersRepository.update(id, dto);
    return this.toDto(supplier as SupplierResponseDto);
  }

  async remove(id: number): Promise<SupplierResponseDto> {
    await this.findOne(id);
    const supplier = await this.suppliersRepository.delete(id);
    return this.toDto(supplier as SupplierResponseDto);
  }

  private toDto(supplier: SupplierResponseDto): SupplierResponseDto {
    return supplier;
  }
}
