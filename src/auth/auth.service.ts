import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { GoogleUserProfile } from './types/google-profile.type';
import { v4 as uuid } from 'uuid';
import { UserClient } from 'src/users/types/UserClient';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwsService: JwtService,
  ) {
    // usersService.create({
    //   name: 'admin',
    //   email: 'admin@example.com',
    //   password: 'admin',
    // });
    // usersService.findAll().then((users) => console.log(users));
  }

  async getProfile(username: string): Promise<UserClient | undefined> {
    try {
      const user = await this.usersService.findOne({ username });
      const {
        password,
        createdAt,
        updatedAt,
        sessions,
        id,
        ...userWithOutMetadata
      } = user;

      return userWithOutMetadata;
    } catch (error) {
      console.error('Error in getUser:', error);
    } finally {
      return undefined;
    }
  }

  signUp(signUpDto: SignUpDto) {}

  async afterGoogleRedirect(
    googleUser: GoogleUserProfile,
  ): Promise<string | undefined> {
    try {
      let user = await this.usersService.findOne({ email: googleUser.email });

      if (!user) {
        user = await this.usersService.create({ ...googleUser });
      }

      const token = await this.jwsService.signAsync({
        username: user.username,
      });

      return token;
    } catch (error) {
      console.error('Error in afterGoogleRedirect:', error);
    } finally {
      return undefined;
    }
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByName(username);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwsService.signAsync(payload),
      // refresh_token: await this.jwsService.signAsync(payload, {
      //   expiresIn: '7d',
      // }),
    };
  }
}
