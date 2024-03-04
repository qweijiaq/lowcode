import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, redisConfig, typeOrmConfig } from '../config';
import { UserModule } from './user/user.module';
import { RedisModule } from './utils/modules/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { LowCodeModule } from './low-code/low-code.module';
import { JWTStrategy } from './utils/JwtStrategy';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RedisModule.forRoot(redisConfig),
    JwtModule.register(jwtConfig),
    UserModule,
    LowCodeModule,
    TypeOrmModule.forFeature([User, Repository<User>]),
  ],
  controllers: [],
  providers: [JWTStrategy],
  exports: [JWTStrategy],
})
export class AppModule {}
