import { Controller, ControllerOptions } from '@nestjs/common';
import { AUTO_CONTROLLER_WATERMARK } from '../interfaces';

type AutoControllerReturn = (target: object) => void | (new (...args: any[]) => any);

export function AutoController(): AutoControllerReturn;
export function AutoController(prefix: string | string[]): AutoControllerReturn;
export function AutoController(options: ControllerOptions): AutoControllerReturn;
export function AutoController(prefixOrOptions?: string | string[] | ControllerOptions): AutoControllerReturn {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_CONTROLLER_WATERMARK, true, target);

    /**
     * Listing of if statements due to `@Controller` overloading.
     */
    if (typeof prefixOrOptions === 'undefined') {
      return Controller()(target as new (...args: any[]) => any);
    }
    if (typeof prefixOrOptions === 'string' || Array.isArray(prefixOrOptions)) {
      return Controller(prefixOrOptions)(target as new (...args: any[]) => any);
    }
    return Controller(prefixOrOptions)(target as new (...args: any[]) => any);
  };
}
