import { AutoModule } from '../auto.module';
import { Module } from '@nestjs/common';
import { COMPONENT_SCAN_WATERMARK } from '../interfaces';
import { resolve } from 'path';

export function ComponentScan(pathParameter?: string | string[]): ClassDecorator {
  return function (target: any) {
    Reflect.defineMetadata(COMPONENT_SCAN_WATERMARK, true, target);

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
  if (Array.isArray(pathParameter)) return pathParameter.map(toForRootPath);
  return [pathParameter].map(toForRootPath);
}

function getFolderPath(): string {
  const stackTrace = new Error().stack;
  const filePathRegex = /at __decorate * \((.*\.js)/;
  const matches = stackTrace?.match(filePathRegex);
  if (matches && matches.length > 1) {
    const matchedPath = resolve(matches[1], '..');
    return `${matchedPath}/**/*.js`;
  }
  throw new Error('Could not extract file path from stack trace');
}

function toForRootPath(path: string) {
  return `${require.main?.path || process.cwd()}/**/${path}/**/*.js`;
}

const MODULE_OPTIONS = {
  IMPORTS: 'imports',
  PROVIDERS: 'providers',
  CONTROLLERS: 'controllers',
  EXPORTS: 'exports',
};
