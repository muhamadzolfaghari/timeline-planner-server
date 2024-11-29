import { IsNotEmpty } from 'class-validator';

export class GetProfileDto {
  @IsNotEmpty()
  username: string;
}
