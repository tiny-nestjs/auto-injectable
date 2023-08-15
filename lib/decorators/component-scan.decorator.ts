import { AutoModule } from '../auto.module';
import { Module } from '@nestjs/common';
import * as path from 'path';

export function ComponentScan(paths = [getRootGlobPath()]): ClassDecorator {
  return function (target: any) {
    const originalMetadata = {
      imports: Reflect.getMetadata(MODULE_OPTIONS.IMPORTS, target) || [],
      controllers: Reflect.getMetadata(MODULE_OPTIONS.CONTROLLERS, target) || [],
      providers: Reflect.getMetadata(MODULE_OPTIONS.PROVIDERS, target) || [],
      exports: Reflect.getMetadata(MODULE_OPTIONS.EXPORTS, target) || [],
    };

    const module = AutoModule.forRoot(paths);
    Module({
      ...originalMetadata,
      imports: [...originalMetadata.imports],
      controllers: [...originalMetadata.controllers, ...(module.controllers ?? [])],
      providers: [...originalMetadata.providers, ...(module.providers ?? [])],
      exports: [...originalMetadata.exports, ...(module.providers ?? [])],
    })(target);
  };
}

function getRootGlobPath(): string {
  const rootPath = path.join(path.resolve(require.main?.filename ?? ''), '..') || 'dist';
  return `${rootPath}/**/*.js`;
}

const MODULE_OPTIONS = {
  IMPORTS: 'imports',
  PROVIDERS: 'providers',
  CONTROLLERS: 'controllers',
  EXPORTS: 'exports',
};
