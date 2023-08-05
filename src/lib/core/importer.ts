import { glob } from 'glob';
import { resolve } from 'path';
import { AUTO_INJECTABLE_WATERMARK } from '../interfaces/auto-injectable.contant';

type ClassType = new (...args: any[]) => any;

export interface AutoImportResult {
  providers: ClassType[];
}

export class Importer {
  constructor(private readonly patterns: string[]) {}

  static async load(patterns: string[]): Promise<AutoImportResult> {
    const importer = new Importer(patterns);
    const pathNames = await importer.matchGlob();
    const results = await Promise.all(
      pathNames.map((pathName) => importer.importFile(pathName)),
    );
    return {
      providers: results.flatMap((result) => result.providers),
    };
  }

  public async importFile(pathName: string): Promise<AutoImportResult> {
    const exports: Record<string, unknown> = await import(pathName);
    const providers = Object.values(exports)
      .filter((value) => typeof value === 'function')
      .filter((value) =>
        Reflect.hasMetadata(AUTO_INJECTABLE_WATERMARK, value),
      ) as ClassType[];

    return {
      providers,
    };
  }

  public async matchGlob() {
    const globs = this.patterns.map((pattern) =>
      glob(resolve(process.cwd(), pattern)),
    );
    return (await Promise.all(globs)).flat();
  }
}
