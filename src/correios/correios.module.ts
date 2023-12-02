import { Module } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { CorreiosController } from './correios.controller';

@Module({
  providers: [CorreiosService],
  controllers: [CorreiosController]
})
export class CorreiosModule {}
