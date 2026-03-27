import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      include: { role: true },
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  create(data: {
    full_name: string;
    email: string;
    password_hash: string;
    role_id: number;
    is_active: boolean;
  }) {
    return this.prisma.user.create({
      data,
      include: { role: true },
    });
  }

  update(
    id: number,
    data: Partial<{
      full_name: string;
      email: string;
      password_hash: string;
      role_id: number;
      is_active: boolean;
    }>,
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });
  }

  delete(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { is_active: false },
      include: { role: true },
    });
  }
}