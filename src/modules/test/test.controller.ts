import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { Cat } from '../cat/cat.interface';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('c')
  createCat(@Body() cat: Cat) {
    this.testService.testCreateCat(cat);
  }

  @Get('g')
  getCats() {
    return this.testService.testGetCats();
  }
}
