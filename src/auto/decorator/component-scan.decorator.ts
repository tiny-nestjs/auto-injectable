import { AutoModule } from '../auto.module';
import { Module } from '@nestjs/common';
import * as path from 'path';

// export const ComponentScan = (
//   options: string[] = ['dist/**/*.js'],
// ): ClassDecorator => {
//   return (target: any) => {
//     const originalImports = Reflect.getMetadata('imports', target) || [];
//     const originalControllers =
//       Reflect.getMetadata('controllers', target) || [];
//     const originalProviders = Reflect.getMetadata('providers', target) || [];
//
//     Module({
//       imports: [...originalImports, AutoModule.forRootAsync(options)],
//       controllers: [...originalControllers],
//       providers: [...originalProviders],
//     })(target);
//   };
// };

export function ComponentScan(
  paths: string[] = [getRootPath()],
): ClassDecorator {
  return function (target: any) {
    const originalMetadata = {
      imports: Reflect.getMetadata('imports', target) || [],
      controllers: Reflect.getMetadata('controllers', target) || [],
      providers: Reflect.getMetadata('providers', target) || [],
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
