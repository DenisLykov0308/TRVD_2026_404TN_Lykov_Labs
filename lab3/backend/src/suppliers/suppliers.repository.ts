import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.supplier.findMany({ orderBy: { id: 'asc' } });
  }

  findById(id: number) {
    return this.prisma.supplier.findUnique({ where: { id } });
  }

  findByName(name: string) {
    return this.prisma.supplier.findUnique({ where: { name } });
  }

  create(data: {
    name: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) {
    return this.prisma.supplier.create({ data });
  }

  update(id: number, data: {
    name?: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) {
    return this.prisma.supplier.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.supplier.delete({ where: { id } });
  }
}