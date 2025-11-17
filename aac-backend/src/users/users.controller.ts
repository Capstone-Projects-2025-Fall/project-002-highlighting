import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { User } from './user.entity'; 
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() userData: { email: string; name: string; role?: string }) {
    return this.usersService.create(userData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() userData: Partial<User>) {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
