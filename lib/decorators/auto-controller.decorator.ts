import { Controller } from '@nestjs/common';
import { AUTO_CONTROLLER_WATERMARK } from '../interfaces';

export function AutoController(prefix: string | string[]): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_CONTROLLER_WATERMARK, true, target);

    /**
     * Unlike `@Injectable()`, in Nest,
     * the presence of the `@Controller()` decorator is essential
     * for defining request-handling controller classes.
     */
    Controller(prefix)(target as new (...args: any[]) => any);
  };
}
