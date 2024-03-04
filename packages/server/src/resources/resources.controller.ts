import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Delete,
  Query,
  Get,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserMess, TCurrentUser } from '../utils/GetUserMsg';
import type { ResourcesRequest, DeleteResourcesRequest } from '@lowcode/share';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  /**
   * 资源上传控制器
   */
  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @GetUserMess() user: TCurrentUser,
    @Body() body: ResourcesRequest,
  ) {
    return this.resourcesService.upload(file, body.type, user.id);
  }

  // 删除资源控制器
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteResource(
    @GetUserMess() user: TCurrentUser,
    @Query() params: DeleteResourcesRequest,
  ) {
    return this.resourcesService.deleteResource(params.id, user.id);
  }

  // 资源获取的控制器
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getResources(
    @GetUserMess() user: TCurrentUser,
    @Query() params: ResourcesRequest,
  ) {
    return this.resourcesService.getResources(params.type, user.id);
  }
}
