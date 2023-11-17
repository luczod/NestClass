import { Injectable, NotFoundException } from '@nestjs/common';
import { compare } from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dtos';
import { UserEntity } from 'src/user/model/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginDto: LoginDto): Promise<UserEntity> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = await compare(loginDto.password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException('Email or passord invalid');
    }

    return user;
  }
}
