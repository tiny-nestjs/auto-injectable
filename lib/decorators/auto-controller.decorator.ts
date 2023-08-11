import { Controller, ControllerOptions } from '@nestjs/common';
import { AUTO_CONTROLLER_WATERMARK } from '../interfaces';

export function AutoController(prefixOrOptions?: string | string[] | ControllerOptions) {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_CONTROLLER_WATERMARK, true, target);

    /**
     * Listing of if statements due to `@Controller` overloading
     */
    if (typeof prefixOrOptions === 'undefined') {
      return Controller()(target as new (...args: any[]) => any);
    }
    if (typeof prefixOrOptions === 'string' || Array.isArray(prefixOrOptions)) {
      return Controller(prefixOrOptions)(target as new (...args: any[]) => any);
    }
    if (typeof prefixOrOptions === 'object') {
      return Controller(prefixOrOptions)(target as new (...args: any[]) => any);
    }
  };
}
