export const AUTO_INJECTABLE_METADATA = 'auto-injectable';

export function AutoInjectable(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(AUTO_INJECTABLE_METADATA, true, target);
  };
}
