import { Get, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { User } from './intefaces/user.interface';

@Injectable()
export class UserService {
  private users: User[] = [];

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const hashPass = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const user: User = {
      ...createUserDto,
      id: this.users.length + 1,
      password: hashPass,
    };

    this.users.push(user);

    return {
      ...user,
      password: undefined,
    };
  }

  @Get()
  async getAllUser(): Promise<User[]> {
    return this.users;
  }
}
