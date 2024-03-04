import { Module } from '@nestjs/common';
import { LowCodeService } from './low-code.service';
import { LowCodeController } from './low-code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component, ComponentData, Page } from './entities/low-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Page, Component, ComponentData])],
  controllers: [LowCodeController],
  providers: [LowCodeService],
})
export class LowCodeModule {}
