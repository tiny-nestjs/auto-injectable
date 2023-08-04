// app.module.ts

import { Module } from '@nestjs/common';
import { TestModule } from './modules/test/test.module';
import { ComponentScan } from './lib/component-scan.decorator';

@ComponentScan()
@Module({
  imports: [TestModule],
})
export class AppModule {}
