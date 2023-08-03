import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CatService } from './modules/cat/cat.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly catService: CatService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('cats')
  getCats(): string {
    return JSON.stringify(this.catService.findAll());
  }
}
