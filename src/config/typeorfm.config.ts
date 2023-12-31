import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Book } from '../books/entity/book.entity';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'sql12.freemysqlhosting.net',
  port: 3306,
  username: 'sql12658933',
  password: 'AuMrbdwUxa',
  database: 'sql12658933',
  entities: [Book, User, RefreshToken],
  synchronize: true,
};
