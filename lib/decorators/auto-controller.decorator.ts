import { Controller } from '@nestjs/common';
import { AUTO_CONTROLLER_WATERMARK } from '../interfaces';

export function AutoController(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_CONTROLLER_WATERMARK, true, target);

    /**
     * Unlike `@Provider`, in Nest, the presence of the `@Controller` decorator is essential
     * for defining request-handling controller classes. It designates routing and functionality,
     * and its absence leads to errors.
     */
    Controller()(target as new (...args: any[]) => any);
  };
}
