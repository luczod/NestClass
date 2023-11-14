import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
//npx nest g controller 'name'
//npx nest g module 'name'
@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
