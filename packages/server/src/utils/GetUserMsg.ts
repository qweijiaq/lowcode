/**
 * 自定义参数装饰器
 * GetUserIp 从 Request 中获取用户的 IP
 * GetUserAgent 从 Request 中获取用户的 UA
 */
import type { ExecutionContext } from '@nestjs/common'; // 执行上下文的类型
import { createParamDecorator } from '@nestjs/common'; // 用于创建自定义参数装饰器
import { IUser } from '@lowcode/share';

// 用户数据类型剔除 password
export type TCurrentUser = Omit<IUser, 'password'>;

const GetUserIp = createParamDecorator((data, ctx: ExecutionContext) => {
  // 获取当前 HTTP 请求对象
  const request = ctx.switchToHttp().getRequest();
  // 从请求对象中获取用户的 IP 地址，使用正则表达式匹配 IPv4 地址，并将其转换为字符串
  return request.ip.match(/\d+\.\d+\.\d+\.\d+/)?.join('.');
});

const GetUserAgent = createParamDecorator((data, ctx: ExecutionContext) => {
  // 获取当前 HTTP 请求对象
  const request = ctx.switchToHttp().getRequest();
  // 获取请求对象的头部信息
  return request.headers['user-agent'];
});

// 获取用户的所有信息参数装饰器
const GetUserMess = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as TCurrentUser;
});

export { GetUserIp, GetUserAgent, GetUserMess };
