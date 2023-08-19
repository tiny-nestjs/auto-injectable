<p align="center">
  <img src="https://github.com/tiny-nestjs/auto-injectable/assets/81916648/6d197834-bbf4-4370-b681-952d32712716" alt="tiny-nestjs" width="150" height="150" />
</p>

<div align="center">
  <img src="https://img.shields.io/badge/npm-v0.3.1-blue" alt="npm version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</div>

## Description

[AutoInjectable](https://github.com/tiny-nestjs/auto-injectable) is a utility library designed to simplify the usage of
dependency injection
in [Nest](https://github.com/nestjs/nest). It enables seamless
handling of automatic injection of dependencies by the framework.
With this library, you can inject dependencies into classes without the need for module definitions.

## Features

- **@ComponentScan()** enables automatic scanning and injection of classes within a module.
- **@AutoInjectable()** allows classes to be automatically injectable for DI.
- **@AutoController()** automatically registers controllers.
- **@AutoAlias()** defines an alias for the `@AutoInjectable()` class.

## Installation

```bash
npm install @tiny-nestjs/auto-injectable
```

```bash
yarn add @tiny-nestjs/auto-injectable
```

## Usage

**1. `@ComponentScan()` basic usage**

```ts
import { Module } from '@nestjs/common';
import { ComponentScan } from '@tiny-nestjs/auto-injectable';

@ComponentScan()
@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {
}
``` 

By applying the `@ComponentScan()` decorator to the `AppModule` class, Nest will automatically scan for classes and
inject necessary dependencies.

**2. `@AutoInjectable()`**

```ts
import { AutoInjectable } from '@tiny-nestjs/auto-injectable';

@AutoInjectable()
export class CatService {
  // ...
}
```

In this case, by applying the `@AutoInjectable()` decorator to the `CatService` class, the class has become injectable,
allowing it to be injected into other modules without the need for module definitions. (The parameter
of `@AutoInjectable()` is the same as `@Injectable()`)

**3. `@AutoController()` and dependency injection**

```ts
import { AutoController } from '@tiny-nestjs/auto-injectable';

@AutoController()
export class CatController {
  constructor(private readonly catService: CatService) {
  }

  @Get('cats')
  getCats() {
    return this.catService.findAll();
  }
}
```

The class with the `@AutoInjectable()` decorator has been successfully injected and `/cats` api can be accessed by
applying `@AutoController()` on `CatController` service. (The parameter of `@AutoController()` is the same
as `@Controller()`)

| You can see actual [project example](https://github.com/tiny-nestjs/auto-injectable-example) here. |
|----------------------------------------------------------------------------------------------------|

<br>

---

<br>

- _Below are **advanced** usages of the library. In most cases, utilizing the methods above will suffice._

<br>

**4. `@AutoAlias()`**

```ts
import { AutoAlias } from '@tiny-nestjs/auto-injectable';
import { AutoInjectable } from '@tiny-nestjs/auto-injectable';

@AutoAlias('kitty')
@AutoInjectable()
export class CatService {
  // ...
}
```

```ts
import { Inject } from '@nestjs/common';
import { AutoController } from '@tiny-nestjs/auto-injectable';

@AutoController()
export class CatController {
  constructor(@Inject('kitty') private readonly catService: CatService) {
  }
}
```

`@AutoAlias()` is a decorator used to specify an alias. In the constructor of the `CatService` class, `@Inject('kitty')`
is used to configure the injection of a `CatService` instance with the alias 'kitty'.
As the library is fully compatible with the `Nest` core, you can use `Nest`'s built-in `@Inject()` decorator.

**5. Define DI scope with the `@ComponentScan()`**

```ts
import { Module } from '@nestjs/common';
import { ComponentScan } from '@tiny-nestjs/auto-injectable';

@ComponentScan()
@Module({})
export class AnimalModule {
}
``` 

The library recommends using `@ComponentScan()` in the `AppModule`. However, to enable seamless DI within the desired
scope, you can also specify `@ComponentScan()` in other modules.

**6. `@ComponentScan()` parameters**

```bash
# normal case
- /cat
  - cat.module.ts
  - ...
```

```bash
# special case
- /animal
  - /cat
    - /module
      - cat.module.ts
    - /service
      - cat.service.ts
```

`@ComponentScan()` defaults to managing dependencies based on the directory path of the module class with the attached
decorator, just like in the normal case.

However, you can use a `string` or `string[]` to specify which locations the component scan should explore and manage
dependencies.
Since this string path is a pattern, it will scan all matching paths, so you should provide a unique pattern. For
example, in the above instance, instead of simply defining the directory path as 'cat', you should specify it as '
animal/cat' to ensure uniqueness. The directory 'cat' could be used somewhere else, after all, such
as `@ComponentScan('animal/cat')`.

By supporting such custom scope definitions, you can apply the library seamlessly to all projects, even handling
exceptional cases without exceptions.

For more refined scope specification, you can use `@ComponentScan(['animal/cat/module', 'animal/cat/service'])`.

## FYI

- The scanning scope of `@ComponentScan()` cannot overlap. If there is an overlap, Nest will throw an error. Please
  handle it by referring to the error log.

<br>

## Contribution

To contribute to this library, fork the [GitHub repository](https://github.com/tiny-nestjs/auto-injectable), make your
changes, and create a pull request. Your
contributions are highly appreciated. If you find any improvements or bugs, please open an issue.

## License

`@tiny-nestjs/auto-injectable` is distributed under
the [MIT license](https://github.com/tiny-nestjs/auto-injectable/blob/main/LICENSE).