import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { GoogleUserProfile } from './types/google-profile.type';
import { v4 as uuid } from 'uuid';
import { UserClient } from 'src/users/types/UserClient';
import { User } from 'src/users/entities/user.entity';
import { AuthToken } from 'src/users/types/AuthToken';

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

  async getProfile(username: string): Promise<UserClient> {
    if (!username) {
      throw new UnauthorizedException('Username is required');
    }

    try {
      const user = await this.usersService.findOne({ username });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, createdAt, updatedAt, sessions, id, ...userClient } =
        user;
      return userClient;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw new UnauthorizedException('Failed to retrieve user profile');
    }
  }

  signUp(signUpDto: SignUpDto) {}

  async googleRedirect(
    googleUser: GoogleUserProfile,
  ): Promise<AuthToken | undefined> {
    try {
      let user = await this.usersService.findOne({ email: googleUser.email });

      if (!user) {
        user = await this.usersService.create({ ...googleUser });
      }

      return this.generateToken(user);
    } catch (error) {
      console.error('Error in afterGoogleRedirect:', error);
      throw new UnauthorizedException('Failed to generate auth token');
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

    return this.generateToken(user);
  }

  async generateToken(user: User): Promise<AuthToken | undefined> {
    try {
      const payload = { sub: user.id, username: user.username };

      return {
        access_token: await this.jwsService.signAsync(payload),
        refresh_token: await this.jwsService.signAsync(payload, {
          expiresIn: '7d',
        }),
      };
    } catch (error) {
      console.error('Error in signJwt:', error);
    }
  }
}
