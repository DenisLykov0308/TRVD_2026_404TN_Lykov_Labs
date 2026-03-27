import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.unit.findMany({ orderBy: { id: 'asc' } });
  }

  findById(id: number) {
    return this.prisma.unit.findUnique({ where: { id } });
  }

  findByName(name: string) {
    return this.prisma.unit.findUnique({ where: { name } });
  }

  findByShortName(short_name: string) {
    return this.prisma.unit.findUnique({ where: { short_name } });
  }

  create(data: { name: string; short_name: string }) {
    return this.prisma.unit.create({ data });
  }

  update(id: number, data: { name?: string; short_name?: string }) {
    return this.prisma.unit.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.unit.delete({ where: { id } });
  }
}