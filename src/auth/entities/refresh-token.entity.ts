import {
  BaseEntity,
  Column,
  Entity, JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from '../../users/entities/user.entity';

@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: bigint;

  @Column()
  isRevoked: boolean;

  @Column()
  expiredAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
