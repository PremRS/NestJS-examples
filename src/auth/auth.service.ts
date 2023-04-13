import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredsDto } from './dto/auth-creds.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as crypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: UserRepository,
    private jwt: JwtService,
  ) {}

  async signUp(creds: AuthCredsDto): Promise<void> {
    const { userName, password } = creds;

    const salt = await crypt.genSalt();
    const hashedPassword = await crypt.hash(password, salt);

    const user = this.userRepository.create({
      userName,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(creds: AuthCredsDto): Promise<{ accessToken: string }> {
    const { userName, password } = creds;
    const user = await this.userRepository.findOneBy({ userName });

    if (user && (await crypt.compare(password, user.password))) {
      const payload: JwtPayload = { userName };
      const accessToken = this.jwt.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid user credentials.');
    }
  }
}
