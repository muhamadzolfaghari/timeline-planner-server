import { IsNotEmpty } from 'class-validator';
import { GoogleUserProfile } from '../types/google-profile.type';

export class GoogleRedirectDto {
  @IsNotEmpty()
  user: GoogleUserProfile;
}
