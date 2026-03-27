import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';
import { UnitResponseDto } from './dto/unit-response.dto';
import { UnitsRepository } from './units.repository';

@Injectable()
export class UnitsService {
  constructor(private readonly unitsRepository: UnitsRepository) {}

  async findAll(): Promise<UnitResponseDto[]> {
    const units = await this.unitsRepository.findAll();
    return units.map((unit: UnitResponseDto) => this.toDto(unit));
  }

  async findOne(id: number): Promise<UnitResponseDto> {
    const unit = await this.unitsRepository.findById(id);
    if (!unit) {
      throw new NotFoundException('Одиницю виміру не знайдено.');
    }

    return this.toDto(unit as UnitResponseDto);
  }

  async create(dto: CreateUnitDto): Promise<UnitResponseDto> {
    await this.ensureUnique(dto.name, dto.short_name);
    const unit = await this.unitsRepository.create(dto);
    return this.toDto(unit as UnitResponseDto);
  }

  async update(id: number, dto: UpdateUnitDto): Promise<UnitResponseDto> {
    await this.findOne(id);
    await this.ensureUnique(dto.name, dto.short_name, id);
    const unit = await this.unitsRepository.update(id, dto);
    return this.toDto(unit as UnitResponseDto);
  }

  async remove(id: number): Promise<UnitResponseDto> {
    await this.findOne(id);
    const unit = await this.unitsRepository.delete(id);
    return this.toDto(unit as UnitResponseDto);
  }

  private async ensureUnique(name?: string, short_name?: string, currentId?: number) {
    if (name) {
      const existingByName = await this.unitsRepository.findByName(name);
      if (existingByName && existingByName.id !== currentId) {
        throw new BadRequestException('Одиниця виміру з такою назвою вже існує.');
      }
    }

    if (short_name) {
      const existingByShortName = await this.unitsRepository.findByShortName(short_name);
      if (existingByShortName && existingByShortName.id !== currentId) {
        throw new BadRequestException('Одиниця виміру з таким скороченням вже існує.');
      }
    }
  }

  private toDto(unit: UnitResponseDto): UnitResponseDto {
    return unit;
  }
}