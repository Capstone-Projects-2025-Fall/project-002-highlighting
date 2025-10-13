import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.userRepo.find({ relations: ['words'] });
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id }, relations: ['words'] });
  }

  create(userData: Partial<User>) {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  async update(id: number, userData: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new Error(`User not found`);
    Object.assign(user, userData);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new Error(`User not found`);
    return this.userRepo.remove(user);
  }
}
