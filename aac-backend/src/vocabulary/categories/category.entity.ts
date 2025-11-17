import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Word } from '../words/word.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  tileColor: string;

  // Many-to-many with words
  @ManyToMany(() => Word, (word) => word.categories)
  words: Word[];
}