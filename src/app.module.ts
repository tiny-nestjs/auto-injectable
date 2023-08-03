import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutoModule } from './auto/auto.module';

@Module({
  imports: [AutoModule.forRootAsync(['dist/**/*.js'])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
