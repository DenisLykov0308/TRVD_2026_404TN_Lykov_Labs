import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../common/dto/id-param.dto';
import { CreateStockShipmentDto } from './dto/create-stock-shipment.dto';
import { StockShipmentResponseDto } from './dto/stock-shipment-response.dto';
import { StockShipmentsService } from './stock-shipments.service';

@ApiBearerAuth()
@ApiTags('stock-shipments')
@Controller('stock-shipments')
export class StockShipmentsController {
  constructor(private readonly stockShipmentsService: StockShipmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список документів відвантаження' })
  @ApiOkResponse({ type: StockShipmentResponseDto, isArray: true })
  findAll() {
    return this.stockShipmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати документ відвантаження за ідентифікатором' })
  @ApiOkResponse({ type: StockShipmentResponseDto })
  findOne(@Param() params: IdParamDto) {
    return this.stockShipmentsService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити документ відвантаження' })
  @ApiCreatedResponse({ type: StockShipmentResponseDto })
  create(@Body() dto: CreateStockShipmentDto) {
    return this.stockShipmentsService.create(dto);
  }
}
