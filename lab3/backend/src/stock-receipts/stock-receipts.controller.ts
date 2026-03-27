import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../common/dto/id-param.dto';
import { CreateStockReceiptDto } from './dto/create-stock-receipt.dto';
import { StockReceiptResponseDto } from './dto/stock-receipt-response.dto';
import { StockReceiptsService } from './stock-receipts.service';

@ApiTags('stock-receipts')
@Controller('stock-receipts')
export class StockReceiptsController {
  constructor(private readonly stockReceiptsService: StockReceiptsService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список документів надходження' })
  @ApiOkResponse({ type: StockReceiptResponseDto, isArray: true })
  findAll() {
    return this.stockReceiptsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати документ надходження за ідентифікатором' })
  @ApiOkResponse({ type: StockReceiptResponseDto })
  findOne(@Param() params: IdParamDto) {
    return this.stockReceiptsService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити документ надходження' })
  @ApiCreatedResponse({ type: StockReceiptResponseDto })
  create(@Body() dto: CreateStockReceiptDto) {
    return this.stockReceiptsService.create(dto);
  }
}

