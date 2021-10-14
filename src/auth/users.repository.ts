import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './user.entity';

const duplicateKeyCodeAtPostgres = '23505';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(userData: AuthCredentialsDTO): Promise<void> {
    const { username, password } = userData;

    const user = this.create({
      username,
      password,
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
