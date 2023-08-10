import 'reflect-metadata';
import { AUTO_CONTROLLER_WATERMARK } from '../interfaces';

export function AutoController(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_CONTROLLER_WATERMARK, true, target);
  };
}
