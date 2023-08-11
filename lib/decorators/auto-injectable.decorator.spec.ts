import { AutoInjectable } from './auto-injectable.decorator';
import { AUTO_INJECTABLE_WATERMARK } from '../interfaces';

describe('AutoInjectable decorator', () => {
  @AutoInjectable()
  class Test {}

  it('should add metadata to class', () => {
    expect(Reflect.getMetadata(AUTO_INJECTABLE_WATERMARK, Test)).toBe(true);
  });
});
