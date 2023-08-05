import { AUTO_INJECTABLE_WATERMARK } from '../interfaces/auto-injectable.contant';
import { AutoInjectable } from './auto-injectable.decorator';

describe('AutoInjectable decorator', () => {
  @AutoInjectable()
  class Test {}

  it('should add metadata to class', () => {
    expect(Reflect.getMetadata(AUTO_INJECTABLE_WATERMARK, Test)).toBe(true);
  });
});