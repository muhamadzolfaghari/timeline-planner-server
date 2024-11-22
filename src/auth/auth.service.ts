import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';

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

  signUp(signUpDto: SignUpDto) {}

  async validateGoogleUser(user: any) {
    /**
     * 
     * const existingUser = await this.userRepository.findOne({ email: user.email });
    if (existingUser) return existingUser;

    // Create a new user if they don't exist
    const newUser = this.userRepository.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      photo: user.photo,
    });
    return this.userRepository.save(newUser);
     * 
     */

    return user;
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
