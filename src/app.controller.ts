import { Controller, Get } from '@nestjs/common';
import { CatService } from './modules/cat/cat.service';

@Controller()
export class AppController {
  constructor(private readonly catService: CatService) {}

  @Get('cats')
  getCats() {
    return this.catService.findAll();
  }
}
