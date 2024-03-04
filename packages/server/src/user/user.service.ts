import dayjs from 'dayjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CaptchaTool } from '../utils/Captcha';
import { RedisModule } from 'src/utils/modules/redis.module';
import { SendPhoneMsgTool } from 'src/utils/SendPhoneMsg';
import { RandomTool } from '../utils/Random';
import { SecretTool } from 'src/utils/Secret';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly captchaTool: CaptchaTool,
    private readonly redis: RedisModule,
    private readonly sendPhoneMsgTool: SendPhoneMsgTool,
    private readonly randomTool: RandomTool,
    private readonly secretTool: SecretTool,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

  /**
   * 注册服务
   * @param phone 账号
   * @param sendCode 验证码
   * @param password 密码
   * @param confirm 确认密码
   */
  async register(
    phone: string,
    sendCode: string,
    password: string,
    confirm: string,
  ) {
    // 手机号注册查重
    const existUser = await this.userRepository.findOne({ where: { phone } });
    if (existUser) throw new BadRequestException('该手机号已被注册');

    // 获取redis中的验证码和用户传入的进行对比
    if (await this.redis.exists(`register:code:${phone}`)) {
      const codeRes = (await this.redis.get(`register:code:${phone}`))!.split(
        '_',
      )[1];

      if (sendCode !== codeRes)
        throw new BadRequestException('短信验证码不正确');
    } else {
      throw new BadRequestException('请先获取短信验证码');
    }

    // 验证二次密码
    if (password !== confirm)
      throw new BadRequestException('输入的两次密码不一致');

    // 随机生成头像和昵称
    const name = this.randomTool.randomName();
    const avatar = this.randomTool.randomAvatar();

    // 生成加密密码
    const pwd = this.secretTool.getSecret(`${password}`);

    // 将新用户数据插入数据库
    const user = await this.userRepository.save({
      username: name,
      avatar: avatar,
      phone,
      password: pwd,
      openId: '',
    });

    // 生成token 7天过期
    const token = this.jwtService.sign({ id: user.id });

    return {
      data: token,
      msg: '注册成功！',
    };
  }

  /**
   * 账号密码登录服务
   */
  async passwordLogin({ phone, password }) {
    // 查找用户是否注册过
    const foundUser = await this.userRepository.findOneBy({ phone });
    if (!foundUser) {
      throw new BadRequestException('账号不存在！');
    }
    // 检查密码是否正确
    const isPasswordValid =
      this.secretTool.getSecret(password) === foundUser.password;
    if (!isPasswordValid) {
      throw new BadRequestException('密码错误！');
    }

    return {
      data: this.jwtService.sign({ id: foundUser.id }),
      msg: '登录成功！',
    };
  }

  /**
   * 验证码登录服务
   */
  async phoneLogin({ phone, sendCode }) {
    // 查找用户是否注册过
    const foundUser = await this.userRepository.findOneBy({ phone });
    if (!foundUser) {
      throw new BadRequestException('账号或密码错误！');
    }
    // 检查是否获取手机验证码
    const codeExist = await this.redis.exists(`login:code:${phone}`);
    if (!codeExist) throw new BadRequestException('请先获取手机验证码');

    // 检查手机验证码是否正确
    const codeRes = (await this.redis.get(`login:code:${phone}`))!.split(
      '_',
    )[1];
    if (codeRes !== sendCode) throw new BadRequestException('手机验证码不正确');

    return {
      data: this.jwtService.sign({ id: foundUser.id }),
      msg: '登录成功！',
    };
  }
}
