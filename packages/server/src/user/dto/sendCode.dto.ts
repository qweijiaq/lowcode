import { IsString, IsNotEmpty } from 'class-validator';

export class SendCodeDto {
  @IsNotEmpty({ message: 'type 限制不为空' })
  @IsString({ message: 'type 限制为 string 类型' })
  type: string;

  @IsNotEmpty({ message: 'phone 限制不为空' })
  @IsString({ message: 'phone 限制为 string 类型' })
  phone: string;

  @IsNotEmpty({ message: 'captcha 限制不为空' })
  @IsString({ message: 'captcha 限制为 string 类型' })
  captcha: string;
}
