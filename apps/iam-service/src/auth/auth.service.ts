// apps/iam-service/src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    // 1. Inyectar los servicios necesarios
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida un usuario por email y contraseña.
   * (Este método es privado, solo lo usará el servicio)
   */
  private async validateUser(email: string, pass: string): Promise<any> {
    // Usamos el servicio de usuarios para encontrar el usuario por email
    // Necesitamos acceso a la entidad completa (con el hash)
    const user = await this.usersService.findOneByEmailForAuth(email);

    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      // Si el usuario existe y las contraseñas coinciden,
      // retornamos el usuario sin el hash
      delete user.password_hash;
      return user;
    }
    return null; // Si no, retornamos null
  }

  /**
   * Maneja el inicio de sesión.
   */
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    // 1. Validar las credenciales
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Crear el "Payload" del token
    // (La información que queremos guardar dentro del token)
    const payload = { 
      sub: user.id, // 'sub' (subject) es el ID del usuario
      email: user.email, 
      role: user.role,
    };

    // 3. Firmar y retornar el token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}