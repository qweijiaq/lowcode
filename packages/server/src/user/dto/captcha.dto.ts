import { IsNotEmpty, IsString } from 'class-validator';

export class CaptchaDto {
  @IsNotEmpty({ message: 'type 限制不为空!' })
  @IsString({ message: 'type 限制为 string 类型!' })
  type: string;
}
