import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ComponentScan } from '../lib';

/**
 * This code is a temporary module for testing purposes and will be removed when the library is officially published.
 * Therefore, any errors in the 'src' should be ignored.
 */
@ComponentScan()
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
