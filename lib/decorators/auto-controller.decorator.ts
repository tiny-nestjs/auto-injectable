import { Controller, ControllerOptions } from '@nestjs/common';
import { AUTO_CONTROLLER_WATERMARK } from '../interfaces';

interface AutoControllerDecorator {
  (prefix: string): ClassDecorator;

  (prefixOrOptions?: string[] | ControllerOptions): ClassDecorator;
}

export const AutoController: AutoControllerDecorator = function AutoController(
  prefixOrOptions?: string | string[] | ControllerOptions,
): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_CONTROLLER_WATERMARK, true, target);

    const controller = PREFIX_LOOKUP[typeof prefixOrOptions];
    const decorator = controller(prefixOrOptions);
    decorator(target as new (...args: any[]) => any);
  };
};

const PREFIX_LOOKUP: { [key: string]: (prefixOrOptions?: any) => any } = {
  undefined: Controller(),
  string: (prefix: string) => Controller(prefix),
  object: (options: ControllerOptions) => Controller(options),
};
