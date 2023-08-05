// app.module.ts

import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ComponentScan } from './auto/decorator/component-scan.decorator';

@ComponentScan()
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
