/* eslint-disable @typescript-eslint/no-var-requires */
import { globSync } from 'glob';
import { resolve } from 'path';
import { AUTO_ALIAS_WATERMARK, AUTO_CONTROLLER_WATERMARK, AUTO_INJECTABLE_WATERMARK } from '../interfaces';
import { Provider } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { Abstract } from '@nestjs/common/interfaces/abstract.interface';

type ClassType = new (...args: any[]) => any;

interface AutoClasses {
  providers: Provider[];
  controllers: Type[];
  exports: Array<
    DynamicModule | Promise<DynamicModule> | string | symbol | Provider | ForwardReference | Abstract<any> | Function
  >;
}

export class Importer {
  private static instance: Importer;

  static getInstance(): Importer {
    if (!Importer.instance) {
      Importer.instance = new Importer();
    }
    return Importer.instance;
  }

  static load(patterns: string[]): AutoClasses {
    const importer = Importer.getInstance();
    const pathNames = importer.matchGlob(patterns);
    const foundClasses = pathNames.map((pathName) => importer.scan(pathName));
    return foundClasses.reduce(
      (merged, found) => ({
        providers: [...merged.providers, ...found.providers],
        controllers: [...merged.controllers, ...found.controllers],
        exports: [...merged.exports, ...found.providers],
      }),
      { providers: [], controllers: [], exports: [] },
    );
  }

  private scan(pathName: string): AutoClasses {
    const exports: Record<string, unknown> = require(pathName);
    const autoClasses = Object.values(exports).filter((value) => typeof value === 'function') as ClassType[];

    return autoClasses.reduce(
      (classes: AutoClasses, found: ClassType) => {
        if (Reflect.hasMetadata(AUTO_ALIAS_WATERMARK, found)) {
          classes.providers.push({
            provide: Reflect.getMetadata(AUTO_ALIAS_WATERMARK, found),
            useClass: found,
          });
        } else if (Reflect.hasMetadata(AUTO_INJECTABLE_WATERMARK, found)) {
          classes.providers.push(found);
        } else if (Reflect.hasMetadata(AUTO_CONTROLLER_WATERMARK, found)) {
          classes.controllers.push(found);
        }

        return classes;
      },
      { providers: [], controllers: [], exports: [] },
    );
  }

  private matchGlob(patterns: string[]) {
    const globs = patterns.map((pattern) =>
      globSync(resolve(require.main?.path || process.cwd(), pattern), {
        ignore: ['**/node_modules/**'],
      }),
    );
    return globs.flat();
  }
}
