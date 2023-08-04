// test.module.ts

import { Module } from '@nestjs/common';
import { ComponentScan } from '../../lib/component-scan.decorator';

@ComponentScan()
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class TestModule {}
