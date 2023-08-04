import { Module } from '@nestjs/common';
import { ComponentScan } from './lib/component-scan.decorator';
import { TestController } from './modules/test/test.controller';
import { TestService } from './modules/test/test.service';

@ComponentScan()
@Module({
  controllers: [TestController],
  providers: [TestService],
})
export class AppModule {}
