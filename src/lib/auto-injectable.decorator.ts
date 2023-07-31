import { Logger } from '@nestjs/common';

const autoInjectableServices = new Map<object, object>();
const trackedInstances = new Set<object>();

export function AutoInjectable<T extends new (...args: any[]) => any>(
  target: T,
): T {
  if (trackedInstances.has(target)) {
    const circularDependencyError = new CircularDependencyError(target);
    const logger = new Logger(target.name);

    logger.error(circularDependencyError.message);
    logger.error('Circular references detected between the following objects:');

    const circularReferences = getTrackedInstancesChain(target);
    circularReferences.forEach((obj, index) => {
      logger.error(`${index + 1}. ${obj.constructor.name}`);
    });

    const possibleSolutions = [
      'Ensure that there are no circular dependencies between services.',
      'Consider splitting the services into smaller, more focused modules.',
      'Check for any accidental import or usage of the same service within itself.',
      'Review the overall architecture to identify and resolve the circular dependencies.',
    ];

    logger.error('Possible solutions:');
    possibleSolutions.forEach((solution, index) => {
      logger.error(`${index + 1}. ${solution}`);
    });

    throw circularDependencyError;
  }

  class AutoInjectableClass extends target {
    constructor(...args: any[]) {
      super(...args);
      autoInjectableServices.set(target, this);
    }
  }

  // Track the instances
  trackedInstances.add(target);

  // You can add options similar to NestJS' built-in Injectable, such as useClass, useValue, useFactory, etc.
  for (const key of Reflect.ownKeys(target.prototype)) {
    if (key !== 'constructor') {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      if (descriptor) {
        Object.defineProperty(AutoInjectableClass.prototype, key, descriptor);
      }
    }
  }

  return AutoInjectableClass as any;
}

// Get the chain of tracked instances in case of circular dependencies
function getTrackedInstancesChain(target: object): object[] {
  const chain: object[] = [];
  const trackedInstancesIterator = trackedInstances.values();
  let instance = trackedInstancesIterator.next().value;
  while (instance) {
    if (instance.constructor === target) {
      chain.push(instance);
      instance = trackedInstancesIterator.next().value;
      while (instance && instance !== chain[0]) {
        chain.push(instance);
        instance = trackedInstancesIterator.next().value;
      }
      break;
    }
    instance = trackedInstancesIterator.next().value;
  }
  return chain;
}

// Error class to throw when a circular dependency is detected
class CircularDependencyError extends Error {
  constructor(target: object) {
    super(`Circular dependency detected in ${target.constructor.name}`);
    this.name = 'CircularDependencyError';
  }
}
