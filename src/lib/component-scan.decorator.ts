import { Module } from '@nestjs/common';
import * as path from 'path';
import { AUTO_INJECTABLE_METADATA } from './auto-injectable.decorator';

const MODULE_DIR_METADATA = 'module-dir';

export function SetAutoInjectable(target: any) {
  Reflect.defineMetadata(AUTO_INJECTABLE_METADATA, true, target);
}

export function ComponentScan(): ClassDecorator {
  return (target: any) => {
    const parentModuleFile = module.parent?.filename || '';
    const moduleDir = path.dirname(
      require.resolve(
        path.join(
          path.dirname(parentModuleFile),
          target.name.replace(/([a-z])([A-Z])/g, '$1.$2').toLowerCase(),
        ),
      ),
    );

    SetAutoInjectable(target);

    @Module({
      providers: [
        {
          provide: target,
          useClass: target,
        },
      ],
    })
    class ScannedModule {
      constructor() {
        Reflect.defineMetadata(
          MODULE_DIR_METADATA,
          path.resolve(moduleDir),
          this,
        );
      }
    }

    return ScannedModule as any;
  };
}
