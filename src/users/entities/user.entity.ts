import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  salt: string;

  @Column()
  password: string;

  @Column({ unique: true })
  name: string;
}
