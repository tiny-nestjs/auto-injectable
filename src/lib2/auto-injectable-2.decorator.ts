import { Injectable } from '@nestjs/common';
import 'reflect-metadata';

export function AutoInjectable(): ClassDecorator {
  return (target) => {
    const dependencies = Reflect.getMetadata('design:paramtypes', target) || [];
    const instances = dependencies.map((dependency: any) => new dependency());

    // @ts-ignore
    const InjectedClass = class extends target {
      constructor(...args: any[]) {
        super(...args, ...instances);
      }
    };

    // @ts-ignore
    Reflect.defineMetadata('design:paramtypes', dependencies, InjectedClass);
    Injectable()(InjectedClass);
    return;
  };
}
