import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { LoginResponseDto } from './login-response.dto';
import { SignUpDto } from './signup.dto';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({
    description: 'Некоректні дані або email вже використовується.',
  })
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вхід користувача в систему' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Некоректні дані запиту.' })
  @ApiUnauthorizedResponse({ description: 'Невірні облікові дані.' })
  signIn(@Body() dto: LoginDto) {
    return this.authService.signIn(dto);
  }

  @Post('login')
  @ApiExcludeEndpoint()
  login(@Body() dto: LoginDto) {
    return this.authService.signIn(dto);
  }
}

