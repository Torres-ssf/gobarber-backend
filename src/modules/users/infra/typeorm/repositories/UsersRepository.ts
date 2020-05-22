import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserCreateDTO from '@modules/users/dtos/ICreateUserDTO';

import { getRepository, Repository } from 'typeorm';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  async create(userData: IUserCreateDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    return this.ormRepository.save(user);
  }

  async findById(userId: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(userId);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
