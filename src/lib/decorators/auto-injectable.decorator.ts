import 'reflect-metadata';
import { AUTO_INJECTABLE_WATERMARK } from '../interfaces/auto-injectable.contant';

export function AutoInjectable(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_INJECTABLE_WATERMARK, true, target);
  };
}
