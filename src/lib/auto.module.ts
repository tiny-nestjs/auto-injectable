import { DynamicModule, Module } from '@nestjs/common';
import { Importer } from './core';

@Module({})
export class AutoModule {
  static async forRootAsync(string: string[]): Promise<DynamicModule> {
    const autoInjectable = await Importer.load(string);

    return {
      module: AutoModule,
      imports: [],
      providers: [...autoInjectable.providers],
      exports: [...autoInjectable.providers],
    };
  }
}
