import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CorreiosService } from './correios.service';
import { CorreiosController } from './correios.controller';

@Module({
  imports: [HttpModule],
  providers: [CorreiosService],
  controllers: [CorreiosController],
  exports: [CorreiosService],
})
export class CorreiosModule {}
