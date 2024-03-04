import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Body } from '@nestjs/common/decorators';
import { GetUserAgent, GetUserIp } from 'src/utils/GetUserMsg';
import { CaptchaDto } from './dto/captcha.dto';
import { SecretTool } from '../utils/Secret';
import { SendPhoneMsgTool } from '../utils/SendPhoneMsg';
import { SendCodeDto } from './dto/sendCode.dto';
import { RandomTool } from '../utils/Random';
import { CaptchaTool } from '../utils/Captcha';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly secretTool: SecretTool,
    private readonly randomTool: RandomTool,
    private readonly captchaTool: CaptchaTool,
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

  /**
   * 短信验证码控制器
   */
  @Post('send_code')
  async sendCode(
    @Body() body: SendCodeDto,
    @GetUserIp() ip: string,
    @GetUserAgent() agent: string,
  ) {
    const { phone, captcha, type } = body;
    // 用户的 IP + 设备加密
    const _key = this.secretTool.getSecret(ip + agent);
    return this.userService.sendCode(
      phone,
      captcha,
      type,
      _key,
      this.randomTool.randomCode(),
    );
  }
}
