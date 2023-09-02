import { Importer } from '../../lib/core/importer';

describe('Importer', () => {
  const paths = ['./test/**/*.spec.ts'];

  it('should get path of patterns', async () => {
    const result = await Importer.load(paths);
    console.log(result);
  });
});
