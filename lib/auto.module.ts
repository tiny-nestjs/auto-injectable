import { DynamicModule, Module } from '@nestjs/common';
import { Importer, ImporterSync } from './core';

@Module({})
export class AutoModule {
  static async forRootAsync(patterns: string[]): Promise<DynamicModule> {
    const classes = await Importer.load(patterns);

    return {
      module: AutoModule,
      controllers: [...classes.controllers],
      providers: [...classes.providers],
      exports: [...classes.providers],
    };
  }

  static forRoot(patterns: string[]): DynamicModule {
    const classes = ImporterSync.load(patterns);

    return {
      module: AutoModule,
      controllers: [...classes.controllers],
      providers: [...classes.providers],
      exports: [...classes.providers],
    };
  }
}
