import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../common/dto/id-param.dto';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список користувачів' })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати користувача за ідентифікатором' })
  @ApiOkResponse({ type: UserResponseDto })
  findOne(@Param() params: IdParamDto) {
    return this.usersService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити нового користувача' })
  @ApiCreatedResponse({ type: UserResponseDto })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити користувача' })
  @ApiOkResponse({ type: UserResponseDto })
  update(@Param() params: IdParamDto, @Body() dto: UpdateUserDto) {
    return this.usersService.update(params.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Деактивувати користувача' })
  @ApiOkResponse({ type: UserResponseDto })
  remove(@Param() params: IdParamDto) {
    return this.usersService.remove(params.id);
  }
}

