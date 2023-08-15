import { DynamicModule, Module } from '@nestjs/common';
import { Importer } from './core';

@Module({})
export class AutoModule {
  static forRoot(patterns: string[]): DynamicModule {
    const classes = Importer.load(patterns);

    return {
      module: AutoModule,
      controllers: [...classes.controllers],
      providers: [...classes.providers],
      exports: [...classes.providers],
    };
  }
}
