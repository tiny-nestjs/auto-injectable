<p align="center">
  <img src="https://github.com/tiny-nestjs/auto-injectable/assets/81916648/6d197834-bbf4-4370-b681-952d32712716" alt="tiny-nestjs" width="150" height="150" />
</p>

<div align="center">
  <img src="https://img.shields.io/badge/npm-v0.0.1-blue" alt="npm version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</div>

## Description

AutoInjectable is a utility library designed to simplify the usage of dependency injection
in [Nest](https://github.com/nestjs/nest). It enables seamless
handling of automatic injection of dependencies by the framework.
With this library, you can inject dependencies into classes without the need for module definitions.

## Features

- `@AutoInjectable()` decorator allows classes to be automatically injectable for DI.
- `@ComponentScan()` decorator enables automatic scanning and injection of classes within a module.

## Installation

```bash
npm install @tiny-nestjs/auto-injectable
```

## Usage

**1. `@ComponentScan()`**

   Use `@ComponentScan()` decorator to enable automatic scanning and injection of classes within a module:
   
    ```
    import { Module } from '@nestjs/common';
    import { AppService } from './app.service';
    import { AppController } from './app.controller';
    import { ComponentScan } from '@nestjs/auto-injectable';
    
    @ComponentScan()
    @Module({
      imports: [],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
    ```

   By applying the `@ComponentScan()` decorator to the AppModule class, Nest will automatically scan for classes and
   inject necessary dependencies.

**2. `@AutoInjectable()`**

   Use `@AutoInjectable()` decorator to make a class injectable for DI:

    ```
    import { AutoInjectable } from '@nestjs/auto-injectable';
    
    @AutoInjectable()
    export class CatService {
        // ...
    }
    ```

   In this case, by applying the @AutoInjectable() decorator to the CatService class, the class has become injectable, allowing it to be injected into other modules without the need for module definitions.

**3. Inject**

   ```
   @Controller()
   export class AppController {
     constructor(private readonly catService: CatService) {}
   
     @Get('cats')
     getCats() {
       return this.catService.findAll();
     }
   }
   ```

   The class with the @AutoInjectable() decorator has been successfully injected.

## Contribution

To contribute to this library, fork the GitHub repository, make your changes, and create a pull request. Your
contributions are highly appreciated. If you find any improvements or bugs, please open an issue.

## License

`@tiny-nestjs/auto-injectable` is distributed under the MIT license.