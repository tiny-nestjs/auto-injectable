import { Module } from '@nestjs/common';
import { CatService } from './cat.service';

@Module({
  providers: [CatService],
  exports: [CatService],
})
export class CatModule {}
