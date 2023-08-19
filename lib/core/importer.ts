/* eslint-disable @typescript-eslint/no-var-requires */
import { globSync } from 'glob';
import { resolve } from 'path';
import {
  AUTO_ALIAS_WATERMARK,
  AUTO_CONTROLLER_WATERMARK,
  AUTO_INJECTABLE_WATERMARK,
  COMPONENT_SCAN_WATERMARK,
} from '../interfaces';
import { Logger, Provider } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { Abstract } from '@nestjs/common/interfaces/abstract.interface';
import { locate } from 'func-loc';

type ClassType = new (...args: any[]) => any;

interface AutoClasses {
  providers: Provider[];
  controllers: Type[];
  exports: Array<
    DynamicModule | Promise<DynamicModule> | string | symbol | Provider | ForwardReference | Abstract<any> | Function
  >;
}

export class Importer {
  private rootPath = '';

  static load(patterns: string[]): AutoClasses {
    const importer = new Importer();
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
    return (Object.values(exports) as ClassType[]).reduce(
      (classes: AutoClasses, value: ClassType) => {
        if (typeof value === 'function') {
          Reflect.hasMetadata(COMPONENT_SCAN_WATERMARK, value) && this.catchOverlappedScanScope(value, pathName);

          if (Reflect.hasMetadata(AUTO_ALIAS_WATERMARK, value)) {
            classes.providers.push({
              provide: Reflect.getMetadata(AUTO_ALIAS_WATERMARK, value),
              useClass: value,
            });
          } else if (Reflect.hasMetadata(AUTO_INJECTABLE_WATERMARK, value)) {
            classes.providers.push(value);
          } else if (Reflect.hasMetadata(AUTO_CONTROLLER_WATERMARK, value)) {
            classes.controllers.push(value);
          }
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

  /**
   * This code is intentionally structured to execute the callback function registered with `.then()`
   * and proceed through the event loop only after the asynchronous task of the `locate` function is completed.
   * Designed to handle potential errors after the scan is completed.
   */
  private catchOverlappedScanScope(value: { new (...args: any[]): any; name: string }, pathName: string) {
    locate(value as any).then(({ path }: { path: string }) => {
      if (!this.rootPath) this.rootPath = pathName;
      if (this.rootPath !== path) {
        new Logger('ExceptionHandler').error(
          `ComponentScan() module scope cannot be overlapped.\n\nPotential causes:\n- An overlapped dependency between modules.\n- Please check the module in '${this.rootPath}' and '${path}'\n\nScope [${value.name}]`,
        );
        process.exit(1);
      }
    });
  }
}
