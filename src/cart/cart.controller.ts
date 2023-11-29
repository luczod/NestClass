import { Controller } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/userType.enum';

@Roles(UserType.User)
@Controller('cart')
export class CartController {}
