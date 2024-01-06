import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressEntity } from './model/address.entity';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/userType.enum';
import { UserId } from '../decorators/userid.decorator';
import { ReturnAddressDto } from './dtos/returnAdress.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Address')
@Roles(UserType.User, UserType.Root, UserType.Admin)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(createAddressDto, userId);
  }

  @Get()
  async findAddressByUserId(@UserId() userId: number): Promise<ReturnAddressDto[]> {
    return (await this.addressService.findAddressByUserId(userId)).map(
      (address) => new ReturnAddressDto(address),
    );
  }
}

// UserId is custom decorator which reads the id in the jwt and attaches it
// to the request, avoiding writing the id manually in the request parameter
