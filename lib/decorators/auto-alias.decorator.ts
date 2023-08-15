import { InjectableOptions } from '@nestjs/common/decorators/core/injectable.decorator';
import { AUTO_ALIAS_WATERMARK } from '../interfaces';

export function AutoAlias(options?: InjectableOptions) {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_ALIAS_WATERMARK, true, target);
  };
}
