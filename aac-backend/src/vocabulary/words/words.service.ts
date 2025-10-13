import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './word.entity';
import { CreateWordDto } from './dto/create-word.dto';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,
  ) {}

  findAll() {
    return this.wordRepo.find({ relations: ['categories', 'user'] });
  }

  findOne(id: number) {
    return this.wordRepo.findOne({ where: { id }, relations: ['categories', 'user'] });
  }

  create(dto: CreateWordDto) {
    const word = this.wordRepo.create(dto);
    return this.wordRepo.save(word);
  }

async remove(id: number) {
  const word = await this.findOne(id);
  
  if (!word) {
    throw new Error(`Word with id ${id} not found`);
  }
  return this.wordRepo.remove(word);
}
}
