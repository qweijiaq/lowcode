import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'sendCode 限制不为空' })
  @IsString({ message: 'sendCode 限制为 string 类型' })
  sendCode: string;

  @IsNotEmpty({ message: 'phone 限制不为空' })
  @IsString({ message: 'phone 限制为 string 类型' })
  phone: string;

  @IsNotEmpty({ message: 'password 限制不为空' })
  @IsString({ message: 'password 限制为 string 类型' })
  password: string;

  @IsNotEmpty({ message: 'confirm 限制不为空' })
  @IsString({ message: 'confirm 限制为 string 类型' })
  confirm: string;
}
