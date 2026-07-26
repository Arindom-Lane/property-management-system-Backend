import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkerCategory } from './worker-category.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
}
