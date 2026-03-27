import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany({ orderBy: { id: 'asc' } });
  }

  findById(id: number) {
    return this.prisma.customer.findUnique({ where: { id } });
  }

  findByName(name: string) {
    return this.prisma.customer.findUnique({ where: { name } });
  }

  create(data: {
    name: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) {
    return this.prisma.customer.create({ data });
  }

  update(id: number, data: {
    name?: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) {
    return this.prisma.customer.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.customer.delete({ where: { id } });
  }
}