import { Importer } from './importer';

describe('Importer', () => {
  const paths = ['./test/fixture.ts'];

  it('should get path of patterns', async () => {
    const result = await Importer.load(paths);
    console.log(result);
  });

  it('should import file', async () => {
    const result = await Importer.load(paths);
    console.log(result);
  });
});
