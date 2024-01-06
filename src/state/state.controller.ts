import { Controller, Get } from '@nestjs/common';
import { StateEntity } from './model/state.entity';
import { StateService } from './state.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Address')
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  async getAllState(): Promise<StateEntity[]> {
    return this.stateService.getAllState();
  }
}
