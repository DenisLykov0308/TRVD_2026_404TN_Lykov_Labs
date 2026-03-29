import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InventoryTransactionResponseDto } from './dto/inventory-transaction-response.dto';
import { InventoryTransactionsQueryDto } from './dto/inventory-transactions-query.dto';
import { InventoryTransactionsService } from './inventory-transactions.service';

@ApiBearerAuth()
@ApiTags('inventory-transactions')
@Controller('inventory-transactions')
export class InventoryTransactionsController {
  constructor(private readonly inventoryTransactionsService: InventoryTransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати журнал руху товарів' })
  @ApiQuery({ name: 'product_id', required: false, description: 'Фільтрація за ідентифікатором товару' })
  @ApiOkResponse({ type: InventoryTransactionResponseDto, isArray: true })
  findAll(@Query() query: InventoryTransactionsQueryDto) {
    return this.inventoryTransactionsService.findAll(query);
  }
}
