import { Cat } from './cat.interface';
import { AutoInjectable } from 'src/auto/decorator/AutoInjectable';

@AutoInjectable()
export class CatService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
