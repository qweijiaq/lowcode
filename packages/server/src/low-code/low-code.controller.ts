import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { LowCodeService } from './low-code.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUserMess, TCurrentUser } from 'src/utils/GetUserMsg';
import { PostReleaseRequest } from '@lowcode/share';

@Controller('low-code')
export class LowCodeController {
  constructor(private readonly lowCodeService: LowCodeService) {}

  /**
   * 低代码发布控制器
   */
  @Post('release')
  @UseGuards(AuthGuard('jwt'))
  release(@Body() body: PostReleaseRequest, @GetUserMess() user: TCurrentUser) {
    return this.lowCodeService.release(body, user);
  }

  /**
   * 低代码页面数据获取控制器
   */
  @Get('releaseWithUser')
  @UseGuards(AuthGuard('jwt'))
  getReleaseDataWithUser(@GetUserMess() user: TCurrentUser) {
    return this.lowCodeService.getReleaseData(user);
  }
}
