import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisConfig, typeOrmConfig } from '../config';
import { UserModule } from './user/user.module';
import { RedisModule } from './utils/modules/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RedisModule.forRoot(redisConfig),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
