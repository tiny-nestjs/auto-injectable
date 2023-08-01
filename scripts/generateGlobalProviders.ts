// generateGlobalProviders.ts

import { ClassDeclaration, Project, SyntaxKind } from 'ts-morph';

const targetDir = './src'; // 대상 디렉토리
const decoratorName = 'AutoInjectable'; // @AutoInjectable() 데코레이터 이름

function main() {
  const project = new Project({
    tsConfigFilePath: 'tsconfig.json', // 프로젝트의 tsconfig.json 파일 경로를 설정합니다.
  });

  const sourceFile = project.getSourceFileOrThrow(`${targetDir}/app.module.ts`);
  const decorators = sourceFile.getDescendantsOfKind(SyntaxKind.Decorator);

  const autoInjectableDecorators = decorators.filter((decorator) => {
    return decorator.getText().includes(decoratorName);
  });

  for (const decorator of autoInjectableDecorators) {
    const classDeclaration = decorator.getFirstAncestorByKind(
      SyntaxKind.ClassDeclaration,
    ) as ClassDeclaration;
    const globalProviders = `@Global()\n  @Module({\n    providers: [${classDeclaration.getText()}],\n    exports: [${classDeclaration.getText()}],\n  })`;

    // Calculate the range to replace, starting from the end of the class declaration
    const rangeToReplace: [number, number] = [
      classDeclaration.getEnd(),
      classDeclaration.getEnd(),
    ];

    sourceFile.replaceText(rangeToReplace, `\n\n${globalProviders}`);
  }

  sourceFile.saveSync();

  console.log('Global providers generation complete.');
}

main();

module.exports = {
  main,
};
