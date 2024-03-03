import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Body } from '@nestjs/common/decorators';
import { GetUserAgent, GetUserIp } from 'src/utils/GetUserMsg';
import { CaptchaDto } from './dto/captcha.dto';
import { SecretTool } from '../utils/Secret';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly secretTool: SecretTool,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 图形验证码控制器
   */
  @Post('captcha')
  async getCaptcha(
    @Body() body: CaptchaDto,
    @GetUserIp() ip: string,
    @GetUserAgent() agent: string,
  ) {
    const { type } = body;
    // 用户的ip+设备加密
    const _key = this.secretTool.getSecret(ip + agent);
    return this.userService.getCaptcha(_key, type);
  }
}
