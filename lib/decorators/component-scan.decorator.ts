import { AutoModule } from '../auto.module';
import { Module } from '@nestjs/common';
import * as path from 'path';

export function ComponentScan(pathParameter?: string | string[]): ClassDecorator {
  return function (target: any) {
    const originalMetadata = {
      imports: Reflect.getMetadata(MODULE_OPTIONS.IMPORTS, target) || [],
      controllers: Reflect.getMetadata(MODULE_OPTIONS.CONTROLLERS, target) || [],
      providers: Reflect.getMetadata(MODULE_OPTIONS.PROVIDERS, target) || [],
      exports: Reflect.getMetadata(MODULE_OPTIONS.EXPORTS, target) || [],
    };

    const module = AutoModule.forRoot(getForRootPath(pathParameter));
    Module({
      ...originalMetadata,
      imports: [...originalMetadata.imports],
      controllers: [...originalMetadata.controllers, ...(module.controllers ?? [])],
      providers: [...originalMetadata.providers, ...(module.providers ?? [])],
      exports: [...originalMetadata.exports, ...(module.providers ?? [])],
    })(target);
  };
}

function getForRootPath(pathParameter?: string | string[]): string[] {
  if (!pathParameter) return [getFolderPath()];
  return Array.isArray(pathParameter) ? pathParameter.map(toForRootPath) : [pathParameter].map(toForRootPath);
}

function toForRootPath(path: string) {
  return `${require.main?.path || process.cwd()}/**/${path}/**/*.js`;
}

function getFolderPath(): string {
  const stackTrace = new Error().stack;
  const filePathRegex = /at __decorate * \((.*\.js)/;
  const matches = stackTrace?.match(filePathRegex);
  if (matches && matches.length > 1) {
    const filePath = matches[1];
    const matchedPath = path.join(path.resolve(filePath), '..');
    return `${matchedPath}/**/*.js`;
  }
  throw new Error('Could not extract file path from stack trace');
}

const MODULE_OPTIONS = {
  IMPORTS: 'imports',
  PROVIDERS: 'providers',
  CONTROLLERS: 'controllers',
  EXPORTS: 'exports',
};
