import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users/user.entity';

import { Word } from './vocabulary/words/word.entity';
import { WordsModule } from './vocabulary/words/words.module';

import { Category } from './vocabulary/categories/category.entity';
import { CategoriesModule } from './vocabulary/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // or your DB host
      port: 5432,
      username: 'aacuser', // replace with your DB username
      password: 'aacpassword', // replace with your DB password
      database: 'aacdb',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ auto-create tables in dev (turn off in prod)
    }),
    WordsModule,
    CategoriesModule
  ],
})
export class AppModule {}