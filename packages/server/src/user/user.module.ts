import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CaptchaTool } from '../utils/Captcha';
import { SecretTool } from 'src/utils/Secret';
import { SendPhoneMsgTool } from '../utils/SendPhoneMsg';
import { RandomTool } from 'src/utils/Random';
import { JWTStrategy } from 'src/utils/JwtStrategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    CaptchaTool,
    SecretTool,
    SendPhoneMsgTool,
    RandomTool,
  ],
})
export class UserModule {}
