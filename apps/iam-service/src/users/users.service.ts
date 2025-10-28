import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password_hash'>> {
    const { email, password, role } = createUserDto;

    // 1. Hashear la contraseña
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    // 2. Crear la entidad de usuario
    const user = this.userRepository.create({
      email,
      password_hash,
      role,
    });

    try {
      // 3. Guardar en la base de datos
      const newUser = await this.userRepository.save(user);

      // 4. Nunca retornar la contraseña hasheada
     // delete newUser.password_hash;
      //return newUser;
      const { password_hash, ...result } = newUser;
      return result;

    } catch (error) {
      // Manejar error de email duplicado (código '23505' en PostgreSQL)
      if (error.code === '23505') {
        throw new ConflictException('El correo electrónico ya existe');
      }
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  // ... (después del método create) ...

  /**
   * Método especial para autenticación.
   * Retorna la entidad de usuario completa (incluyendo el hash de contraseña).
   */
async findAll(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await this.userRepository.find();
    // Mapeamos para quitar el hash de todos
    return users.map(user => {
      const { password_hash, ...result } = user; // <-- APLICA LA SOLUCIÓN AQUÍ
      return result;
    });
  
  }
  // ...
  // Este método 'findOne' ya lo deberíamos tener del paso anterior,
  // pero asegúrate de que exista y esté correcto.
  async findOne(id: string): Promise<Omit<User, 'password_hash'>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const { password_hash, ...result } = user; // <-- APLICA LA SOLUCIÓN AQUÍ
    return result;
  
    //delete user.password_hash;
    //return user;
  }

  async update(id: string, updateUserDto: any) {
    // TODO: Implementar lógica de actualización
    // (Por ahora solo retornamos un mensaje)
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    // TODO: Implementar lógica de borrado
    // (Por ahora solo retornamos un mensaje)
    return `This action removes a #${id} user`;
  }
}