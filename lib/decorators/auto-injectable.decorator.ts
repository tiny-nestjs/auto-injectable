import { AUTO_INJECTABLE_WATERMARK } from '../interfaces';
import 'reflect-metadata';

export function AutoInjectable(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_INJECTABLE_WATERMARK, true, target);
  };
}
