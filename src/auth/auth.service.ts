import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponse } from './interface/login-response.interface';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refresh-token.entity';
import { refreshTokenConfig } from '../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async login(request: LoginRequestDto): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: {
        email: request.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('invalid email / password');
    }

    const hashedPassword = await bcrypt.hash(request.password, user.salt);

    if (hashedPassword != user.password) {
      throw new UnauthorizedException('invalid email / password');
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, 1);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };

    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: User, ttl: number): Promise<string> {
    const refreshToken = await this.refreshTokenRepository.manager.transaction(
      async (manager) => {
        const refreshToken =
          (await this.refreshTokenRepository.findOne({
            relations: {
              user: true,
            },
            where: {
              user: {
                id: user.id,
              },
            },
          })) ?? this.refreshTokenRepository.create();

        refreshToken.user = user;
        refreshToken.isRevoked = false;

        const expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + ttl);
        refreshToken.expiredAt = expiredAt;

        return await manager.save(refreshToken);
      },
    );

    const payload = {
      jid: refreshToken.id,
    };

    return await this.jwtService.signAsync(payload, refreshTokenConfig);
  }
}
