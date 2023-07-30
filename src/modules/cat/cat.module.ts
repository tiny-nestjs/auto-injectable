import { Module } from '@nestjs/common';
import { CatService } from './cat.service';

@Module({
  providers: [CatService],
})
export class CatModule {}
