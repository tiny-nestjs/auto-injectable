// component-scan.decorator.ts

import { Module } from '@nestjs/common';
import * as glob from 'glob';
import { AUTO_INJECTABLE_METADATA } from './auto-injectable.decorator';
import * as path from 'path';

const MODULE_DIR_METADATA = 'module-dir';

export function ComponentScan(): ClassDecorator {
  return () => {
    const root = getRootDirectory();

    @Module({
      providers: [],
    })
    class ScannedModule {
      constructor() {
        getAutoInjectableClasses(root).then((autoInjectables) => {
          console.log('autoInjectables', autoInjectables);
          for (const autoInjectable of autoInjectables) {
            Module({
              providers: [
                {
                  provide: autoInjectable,
                  useClass: autoInjectable,
                },
              ],
            })(ScannedModule);
          }
          Reflect.defineMetadata(MODULE_DIR_METADATA, root, this);
        });
      }
    }

    return ScannedModule as any;
  };
}

async function getAutoInjectableClasses(scanDirectory: string): Promise<any[]> {
  const files = glob.sync(`${scanDirectory}/**/*.js`);
  const autoInjectableClasses = [];
  for (const file of files) {
    const requiredModule = await import(file);
    if (requiredModule) {
      for (const key in requiredModule) {
        if (requiredModule.hasOwnProperty(key)) {
          const moduleExports = requiredModule[key];
          if (
            moduleExports &&
            moduleExports.prototype &&
            Reflect.hasMetadata(AUTO_INJECTABLE_METADATA, moduleExports)
          ) {
            autoInjectableClasses.push(moduleExports);
          }
        }
      }
    }
  }
  return autoInjectableClasses;
}

function getRootDirectory(): string {
  const appModulePath = require.main?.filename;
  if (appModulePath) {
    return path.join(path.resolve(appModulePath), '..');
  }
  throw new Error('Could not determine AppModule path');
}
