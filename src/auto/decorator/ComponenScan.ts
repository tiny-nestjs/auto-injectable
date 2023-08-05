import { AutoModule } from '../auto.module';

import { Module } from '@nestjs/common';

export const ComponentScan = (
  options: string[] = ['dist/**/*.js'],
): ClassDecorator => {
  return (target: any) => {
    const originalImports = Reflect.getMetadata('imports', target) || [];
    const originalControllers =
      Reflect.getMetadata('controllers', target) || [];
    const originalProviders = Reflect.getMetadata('providers', target) || [];

    Module({
      imports: [...originalImports, AutoModule.forRootAsync(options)],
      controllers: [...originalControllers],
      providers: [...originalProviders],
    })(target);
  };
};
