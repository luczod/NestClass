import { IsString } from 'class-validator';

export class UpdatePasswordDTO {
  @IsString()
  lastPassword: string;

  @IsString()
  newPassword: string;
}
