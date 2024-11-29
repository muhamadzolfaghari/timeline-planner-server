import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { GetProfileDto } from './dto/get-profile';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    // console.log(signUpDto);
    this.authService.signUp(signUpDto);

    return 'This action adds a new cat';
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() getProfileDto: GetProfileDto) {
    const user = this.authService.getProfile(getProfileDto.username);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  async googleLogin() {}

  @Get('google/redirect')
  @UseGuards(PassportAuthGuard('google'))
  async googleRedirect(@Request() req) {
    const token = await this.authService.afterGoogleRedirect(req.user);

    if (!token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return {
      access_token: token,
    };
  }
}
