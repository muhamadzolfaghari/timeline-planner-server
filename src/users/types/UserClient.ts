import { IsNotEmpty } from 'class-validator';

export class UserClient {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  username: string;

  photo: string;

  telegramId: string;

  isEmailVerified: boolean;
}
