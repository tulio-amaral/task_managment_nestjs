import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './user.entity';

const duplicateKeyCodeAtPostgres = '23505';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(userData: AuthCredentialsDTO): Promise<void> {
    const { username, password } = userData;

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === duplicateKeyCodeAtPostgres) {
        throw new ConflictException('Username already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
