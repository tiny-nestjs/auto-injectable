import { AUTO_INJECTABLE_WATERMARK } from '../interfaces';
import { Injectable } from '@nestjs/common';
import { InjectableOptions } from '@nestjs/common/decorators/core/injectable.decorator';

export function AutoInjectable(options?: InjectableOptions) {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_INJECTABLE_WATERMARK, true, target);

    /**
     * `@Injectable` decorator only has one type.
     */
    return Injectable(options)(target as new (...args: any[]) => any);
  };
}
