// test.module.ts

import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
