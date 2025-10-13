import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ nullable: true })
  symbol: string; // image path for AAC board tile

  // Many-to-many with categories
  @ManyToMany(() => Category, (category) => category.words, { cascade: true })
  @JoinTable()
  categories: Category[];

  // Each word may belong to a user (custom vocab), or null = shared/global word
  @ManyToOne(() => User, (user) => user.words, { nullable: true })
  user: User;
}