import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CaptchaTool } from '../utils/Captcha';
import { SecretTool } from 'src/utils/Secret';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, CaptchaTool, SecretTool],
})
export class UserModule {}
