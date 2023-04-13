import {
  ConflictException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, EntityRepository, Repository } from 'typeorm';
import { AuthCredsDto } from './dto/auth-creds.dto';
import { User } from './user.entity';
import * as crypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
