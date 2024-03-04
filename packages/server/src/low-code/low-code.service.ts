import { PostReleaseRequest } from '@lowcode/share';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Component } from 'react';
import { TCurrentUser } from 'src/utils/GetUserMsg';
import { ComponentData, Page } from './entities/low-code.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LowCodeService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {}

  /**
   * 低代码组件发布接口服务（无优化）
   */
  async release(body: PostReleaseRequest, user: TCurrentUser) {
    const { components, ...otherBody } = body;

    let id = null;
    const queryRunner = this.dataSource.createQueryRunner();

    // 插入页面的组件到Component表
    async function insertComponents(pageId: number) {
      const insertComponents = [];
      for (const component of components) {
        const componentResult = await queryRunner.manager.insert(Component, {
          ...component,
          page_id: pageId,
          account_id: user.id,
        } as any);
        insertComponents.push(componentResult.identifiers[0].id);
      }

      await queryRunner.manager.update(Page, pageId, {
        components: insertComponents,
      });
    }

    // 创建页面和组件表数据
    async function createLowCodePage() {
      const lowcode = await queryRunner.manager.insert<Page>(Page, {
        ...otherBody,
        account_id: user.id,
        components: [],
      });
      id = lowcode.identifiers[0].id;
      const pageId = lowcode.identifiers[0].id;
      await insertComponents(pageId);
    }

    // 更新页面和组件表数据
    async function updateLowCodePage(findLowCode: Page) {
      // 更新数据，先将components置空
      await queryRunner.manager.update(Page, findLowCode.id, {
        ...otherBody,
        components: [],
      });

      // 删除掉存储在Component表中的组件
      for (const component of findLowCode.components)
        await queryRunner.manager.delete(Component, component);

      // 清空问卷的数据，如果有的话
      const componentDatas = await queryRunner.manager.findBy(ComponentData, {
        page_id: findLowCode.id,
      });
      for (const componentData of componentDatas)
        await queryRunner.manager.delete(ComponentData, componentData.id);

      // 将新的组件插入
      await insertComponents(findLowCode.id);
    }

    try {
      // 建立数据库连接
      await queryRunner.connect();
      // 开启一个新的数据库事务
      await queryRunner.startTransaction();

      const findLowCode = await queryRunner.manager.findBy(Page, {
        account_id: user.id,
      });

      // 先尝试查找一下看看是否已创建
      if (findLowCode?.length > 0) {
        // 如果创建好了就是更改数据
        id = findLowCode[0].id;
        await updateLowCodePage(findLowCode[0]);
      } else {
        await createLowCodePage();
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `发布失败, 请重试: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }

    return {
      msg: '发布成功',
      data: id,
    };
  }

  /**
   * 获取低代码组件接口服务（无缓存）
   */
  async getReleaseData(user?: TCurrentUser) {
    // 查找该用户是否发布过页面
    const lowCode = await this.pageRepository.findOneBy({
      account_id: user?.id,
    });
    if (!lowCode) return;

    const components = [];
    const componentIds = lowCode.components;

    for (const componentId of componentIds) {
      const component = await this.componentRepository.findOneBy({
        id: Number(componentId),
      } as any);
      components.push(component!);
    }

    return {
      components,
      componentIds,
    };
  }
}
