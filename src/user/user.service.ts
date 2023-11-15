import { Get, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './intefaces/user.entity';
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
      password: hashPass,
    });
  }

  @Get()
  async getAllUser(): Promise<UserEntity[]> {
    return this.userRespository.find();
  }
}
