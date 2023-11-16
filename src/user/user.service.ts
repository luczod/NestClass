import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './model/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRespository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const saltOrRounds = 10;
    const hashPass = await bcrypt.hash(createUserDto.password, saltOrRounds);

    return this.userRespository.save({
      ...createUserDto,
      typeUser: 1,
      password: hashPass,
    });
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    return this.userRespository.findOne({
      where: {
        id: userId,
      },
      relations: ['addresses'],
    });
  }

  @Get()
  async getAllUser(): Promise<UserEntity[]> {
    return this.userRespository.find();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRespository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`userId: ${userId} not found`);
    }

    return user;
  }
}
