// apps/iam-service/src/auth/auth.controller.ts

import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards, // 1. Importar UseGuards
  Get,        // 2. Importar Get
  Request     // 3. Importar Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport'; // 4. Importar AuthGuard

@Controller('auth')
export class AuthController {
  // ... (el constructor y el método signIn/login se quedan igual) ...
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }


  @UseGuards(AuthGuard('jwt')) // 5. ¡AQUÍ ESTÁ LA MAGIA!
  @Get('profile') // Ruta completa: GET /auth/profile
  getProfile(@Request() req) {
    // 6. 'req.user' es el objeto que retornamos en 'validate'
    //    dentro de nuestra JwtStrategy (payload.sub, payload.email, payload.role)
    return req.user;
  // ... (Añade el siguiente método) ...
}
}