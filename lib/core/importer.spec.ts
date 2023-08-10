import { Importer } from './importer';
import { AUTO_INJECTABLE_WATERMARK } from '../interfaces';

describe('Importer', () => {
  it('should get path of patterns', async () => {
    const importer = new Importer(['./test/fixture.ts']);
    const result = await importer.matchGlob();
    console.log(result);
  });

  it('should import file', async () => {
    const importer = new Importer(['./test/fixture.ts']);
    const pathName = await importer.matchGlob();
    const result = await importer.importProvider(
      pathName[0],
      AUTO_INJECTABLE_WATERMARK,
    );
    console.log(result);
  });
});
