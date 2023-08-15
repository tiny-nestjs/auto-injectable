import { AUTO_ALIAS_WATERMARK } from '../interfaces';

export function AutoAlias(alias?: string) {
  return (target: object) => {
    Reflect.defineMetadata(AUTO_ALIAS_WATERMARK, alias, target);
  };
}
