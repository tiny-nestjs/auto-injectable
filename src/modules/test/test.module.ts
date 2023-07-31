// test.module.ts

import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { CatModule } from '../cat/cat.module';

@Module({
  imports: [CatModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
