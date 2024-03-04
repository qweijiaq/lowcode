import { Injectable } from '@nestjs/common';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { msgConfig } from '../../msgConfig';

interface SendPhoneMsgRes {
  isSend: boolean;
  data?: string;
}

const SmsClient = tencentcloud.sms.v20210111.Client;
const { SECRET_ID, SECRET_KEY } = msgConfig;

const client = new SmsClient({
  credential: {
    // SecretId、SecretKey 查询: https://console.cloud.tencent.com/cam/capi
    secretId: SECRET_ID,
    secretKey: SECRET_KEY,
  },
  /* 必填：地域信息，可以直接填写字符串ap-guangzhou，支持的地域列表参考 https://cloud.tencent.com/document/api/382/52071#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8 */
  region: 'ap-guangzhou',
  /* 非必填:
   * 客户端配置对象，可以指定超时时间等配置 */
  profile: {
    /* SDK 默认用 TC3-HMAC-SHA256 进行签名，非必要请不要修改这个字段 */
    signMethod: 'HmacSHA256',
    httpProfile: {
      /* SDK 默认使用 POST 方法。
       * 如果您一定要使用 GET 方法，可以在这里设置。GET方法无法处理一些较大的请求 */
      reqMethod: 'POST',
      /* SDK 有默认的超时时间，非必要请不要进行调整
       * 如有需要请在代码中查阅以获取最新的默认值 */
      reqTimeout: 30,
      /**
       * 指定接入地域域名，默认就近地域接入域名为 sms.tencentcloudapi.com ，也支持指定地域域名访问，例如广州地域的域名为 sms.ap-guangzhou.tencentcloudapi.com
       */
      endpoint: 'sms.tencentcloudapi.com',
    },
  },
});

/**
 * 短信发送装饰器
 */
@Injectable()
export class SendPhoneMsgTool {
  /**
   * 创建短信 req 对象
   * @param {string} templateId 短信模板 id
   */
  genSmsRequest() {
    const req = {} as any;
    // 短信应用ID
    req.SmsSdkAppId = '1400884133';
    // 短信签名内容
    req.SignName = '卫佳编程案例分析公众号';
    // 模板 ID: 必须填写已审核通过的模板 ID。模板ID可登录 [短信控制台] 查看
    req.TemplateId = '2053681';

    return req;
  }

  /**
   * 发送短信验证码
   * @param {string} phoneNumber 手机号
   * @param {string} code 验证码
   */
  async sendVeriCodeMsg(
    phoneNumber: string,
    code: number,
  ): Promise<SendPhoneMsgRes> {
    if (!phoneNumber || !code)
      return { isSend: false, data: '手机号或验证码不存在' };

    const req = this.genSmsRequest();
    req.PhoneNumberSet = [`+86${phoneNumber}`]; // 手机号，可群发
    req.TemplateParamSet = [code]; // 为模板内容注入参数

    try {
      const response = await client.SendSms(req);
      return { isSend: true };
    } catch (err) {
      console.log(err);
      return { isSend: false, data: '短信发送失败' };
    }
  }
}
