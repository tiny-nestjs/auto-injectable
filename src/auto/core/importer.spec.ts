import { Importer } from './importer';

describe('Importer', () => {
  it('should get path of patterns', async () => {
    const importer = new Importer(['./test/fixture.ts']);
    const result = await importer.matchGlob();
    console.log(result);
  });

  it('should import file', async () => {
    const importer = new Importer(['./test/fixture.ts']);
    const pathName = await importer.matchGlob();
    const result = await importer.importFile(pathName[0]);
    console.log(result);
  });
});
