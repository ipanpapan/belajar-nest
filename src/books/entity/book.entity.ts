import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: bigint;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  category: string;

  @Column()
  year: number;
}
