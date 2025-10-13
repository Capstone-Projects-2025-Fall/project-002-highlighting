import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Word } from '../vocabulary/words/word.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: 'user' })
  role: string; // "user" | "caretaker" | "admin"

  // Words added/owned by this user
  @OneToMany(() => Word, (word) => word.user)
  words: Word[];
}