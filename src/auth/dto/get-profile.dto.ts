import { IsNotEmpty } from 'class-validator';

export class GetProfileDto {
  @IsNotEmpty()
  user: {
    username: string;
  };
}
