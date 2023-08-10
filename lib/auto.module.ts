import { DynamicModule, Module } from '@nestjs/common';
import { Importer } from './core';

@Module({})
export class AutoModule {
  static async forRootAsync(patterns: string[]): Promise<DynamicModule> {
    const autoInjectable = await Importer.loadProviders(patterns);
    const autoController = await Importer.loadControllers(patterns);

    return {
      module: AutoModule,
      controllers: [...autoController.controllers],
      providers: [...autoInjectable.providers],
      exports: [...autoInjectable.providers],
    };
  }
}
