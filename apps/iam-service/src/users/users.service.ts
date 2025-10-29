import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common'; // <-- Ensure NotFoundException is imported
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto'; // <-- Make sure UpdateUserDto is imported if needed for update

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password_hash'>> {
    const { email, password, role } = createUserDto;
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password_hash,
      role,
    });

    try {
      const newUser = await this.userRepository.save(user);

      // Move this line INSIDE the try block
      const { password_hash, ...result } = newUser;
      return result; // Return the result here

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El correo electrónico ya existe');
      }
      throw new InternalServerErrorException('Error al crear el usuario');
    }
    // Remove the old destructuring and return from here if they existed outside the try block
  }

  // --- ADD/VERIFY THE FOLLOWING METHODS ---

  /**
   * Método especial para autenticación. Retorna la entidad completa.
   */
  async findOneByEmailForAuth(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await this.userRepository.find();
    return users.map(user => {
      const { password_hash, ...result } = user;
      return result;
    });
  }

  async findOne(id: string): Promise<Omit<User, 'password_hash'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      // Use NotFoundException here for consistency
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }
    const { password_hash, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) { // Use UpdateUserDto if defined
    // TODO: Implementar lógica de actualización real
    const user = await this.findOne(id); // Check if user exists first
    // ... apply updates using userRepository.update or .save
    return `This action updates user #${id}`;
  }

  async remove(id: string) {
    // TODO: Implementar lógica de borrado real
    const user = await this.findOne(id); // Check if user exists first
    // await this.userRepository.delete(id);
    return `This action removes user #${id}`;
  }
  // --- END OF METHODS TO ADD/VERIFY ---
}