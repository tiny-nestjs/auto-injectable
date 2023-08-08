import { AutoModule } from '../auto.module';
import { Module } from '@nestjs/common';
import * as path from 'path';

export function ComponentScan(
  paths: string[] = [getRootPath()],
): ClassDecorator {
  return function (target: any) {
    const originalMetadata = {
      imports: Reflect.getMetadata(MODULE_OPTIONS.IMPORTS, target) || [],
      controllers:
        Reflect.getMetadata(MODULE_OPTIONS.CONTROLLERS, target) || [],
      providers: Reflect.getMetadata(MODULE_OPTIONS.PROVIDERS, target) || [],
    };

    const options = paths.map((path) => `${path}/**/*.js`);
    Module({
      ...originalMetadata,
      imports: [...originalMetadata.imports, AutoModule.forRootAsync(options)],
    })(target);
  };
}

function getRootPath(): string {
  return path.join(path.resolve(require.main?.filename), '..') || 'dist';
}

const MODULE_OPTIONS = {
  IMPORTS: 'imports',
  PROVIDERS: 'providers',
  CONTROLLERS: 'controllers',
};
