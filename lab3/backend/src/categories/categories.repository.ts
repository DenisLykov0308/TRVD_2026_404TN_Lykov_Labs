import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({ orderBy: { id: 'asc' } });
  }

  findById(id: number) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  findByName(name: string) {
    return this.prisma.category.findUnique({ where: { name } });
  }

  create(data: { name: string; description?: string }) {
    return this.prisma.category.create({ data });
  }

  update(id: number, data: { name?: string; description?: string }) {
    return this.prisma.category.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
