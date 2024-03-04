import dayjs from 'dayjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CaptchaTool } from '../utils/Captcha';
import { RedisModule } from 'src/utils/modules/redis.module';
import { SendPhoneMsgTool } from 'src/utils/SendPhoneMsg';

@Injectable()
export class UserService {
  constructor(
    private readonly captchaTool: CaptchaTool,
    private readonly redis: RedisModule,
    private readonly sendPhoneMsgTool: SendPhoneMsgTool,
  ) {}

  /**
   * 图形验证码服务
   */
  async getCaptcha(key: string, type: string) {
    const svgCaptcha = await this.captchaTool.captche();
    this.redis.set(`${type}:captcha:${key}`, svgCaptcha.text, 600);
    return { data: svgCaptcha.data, text: svgCaptcha.text };
  }

  /**
   * 手机验证码服务
   * @param phone 手机
   * @param captcha 图形验证码
   * @param type 类型
   * @param key key
   * @param randomCode 随机验证码
   */
  async sendCode(
    phone: string,
    captcha: string,
    type: string,
    key: string,
    randomCode: number,
  ) {
    // 60秒内不能重复获取
    if (await this.redis.exists(`${type}:code:${phone}`)) {
      const dateRedis = dayjs(
        Number((await this.redis.get(`${type}:code:${phone}`))!.split('_')[0]),
      );
      if (dayjs(Date.now()).diff(dateRedis, 'second') <= 60)
        throw new BadRequestException('请勿重复获取短信验证码');
    }
    // 是否有图形验证
    if (!(await this.redis.exists(`${type}:captcha:${key}`)))
      throw new BadRequestException('请先获取图形验证码');
    if (!captcha) throw new BadRequestException('请输入图形验证码');

    // 对比用户的图形验证码和redis储存的是否一致
    const captchaRedis = await this.redis.get(`${type}:captcha:${key}`);
    if (!(String(captcha).toLowerCase() === captchaRedis!.toLowerCase()))
      throw new BadRequestException('图形验证码不正确');
    // 发送手机验证码
    const codeRes = await this.sendPhoneMsgTool.sendVeriCodeMsg(
      phone,
      randomCode,
    );

    // 获取当前时间拼接验证码
    const randomCodeTime = `${Date.now()}_${randomCode}`;
    this.redis.set(`${type}:code:${phone}`, randomCodeTime, 600);

    // 删除图形验证码
    this.redis.del(`${type}:captcha:${key}`);
    if (codeRes.isSend) {
      return null;
    } else {
      this.redis.del(`${type}:code:${phone}`);
      throw new BadRequestException('发送失败, 请重试');
    }
  }
}
