import { Controller, Get, Post, Param, Body, Delete, Query } from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';

@Controller('words') // all URLs start with /words
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get()
  getAll(@Query('categoryId') categoryId?: string) {
    return this.wordsService.findAll(categoryId ? parseInt(categoryId, 10) : undefined);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.wordsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateWordDto) {
    return this.wordsService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.wordsService.remove(id);
  }
}
