import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CustomersRepository } from './customers.repository';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.customersRepository.findAll();
    return customers.map((customer: CustomerResponseDto) => this.toDto(customer));
  }

  async findOne(id: number): Promise<CustomerResponseDto> {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(' л≥Їнта не знайдено.');
    }

    return this.toDto(customer as CustomerResponseDto);
  }

  async create(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const existingCustomer = await this.customersRepository.findByName(dto.name);
    if (existingCustomer) {
      throw new BadRequestException(' л≥Їнт з такою назвою вже ≥снуЇ.');
    }

    const customer = await this.customersRepository.create(dto);
    return this.toDto(customer as CustomerResponseDto);
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    await this.findOne(id);

    if (dto.name) {
      const existingCustomer = await this.customersRepository.findByName(dto.name);
      if (existingCustomer && existingCustomer.id !== id) {
        throw new BadRequestException(' л≥Їнт з такою назвою вже ≥снуЇ.');
      }
    }

    const customer = await this.customersRepository.update(id, dto);
    return this.toDto(customer as CustomerResponseDto);
  }

  async remove(id: number): Promise<CustomerResponseDto> {
    await this.findOne(id);
    const customer = await this.customersRepository.delete(id);
    return this.toDto(customer as CustomerResponseDto);
  }

  private toDto(customer: CustomerResponseDto): CustomerResponseDto {
    return customer;
  }
}
