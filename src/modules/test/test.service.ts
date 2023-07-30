import { Injectable } from '@nestjs/common';
import { CatService } from '../cat/cat.service';
import { Cat } from '../cat/cat.interface';

@Injectable()
export class TestService {
  constructor(private readonly catService: CatService) {}

  testCreateCat(cat: Cat) {
    this.catService.create(cat);
  }

  testGetCats() {
    return this.catService.findAll();
  }
}
