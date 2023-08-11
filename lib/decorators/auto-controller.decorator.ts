import { Controller, ControllerOptions } from "@nestjs/common";
import { AUTO_CONTROLLER_WATERMARK } from '../interfaces';

export function AutoController(
  prefixOrOptions?: string | string[] | ControllerOptions,
): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_CONTROLLER_WATERMARK, true, target);

    /**
     * Unlike `@Injectable()`, in Nest,
     * the presence of the `@Controller()` decorator is essential
     * for defining request-handling controller classes.
     */
    Controller(prefixOrOptions)(target as new (...args: any[]) => any);
  };
}
