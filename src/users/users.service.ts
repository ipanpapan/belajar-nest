import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(request: CreateUserDto): Promise<User> {
    return await this.userRepository.manager.transaction(async (manager) => {
      const user = this.userRepository.create();
      user.email = request.email;
      user.name = request.name;
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(request.password, user.salt);

      try {
        return await manager.save(user);
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
