import { Module, OnModuleInit } from '@nestjs/common';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
} from '@nestjs/core';
import { Repository } from 'typeorm';

@Module({ imports: [DiscoveryModule] })
export class RepositoryCommentLoggingModule implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  static forRoot() {
    return {
      module: RepositoryCommentLoggingModule,
      global: true,
    };
  }

  onModuleInit() {
    this.discoveryService
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .filter(({ instance }) => this.isRepository(instance))
      .forEach(({ instance }) => {
        this.metadataScanner
          .getAllMethodNames(Object.getPrototypeOf(instance))
          .forEach(this.addEntryPointAtComment(instance));
      });
  }

  isRepository(instance: any) {
    return Object.getOwnPropertyNames(instance).some(
      (prop) => instance[prop] instanceof Repository,
    );
  }

  addEntryPointAtComment(instance: any) {
    return (methodName: string) => {
      const methodRef = instance[methodName];

      const originalMethod = methodRef;
      if (methodRef.constructor.name === 'AsyncFunction') {
        instance[methodName] = async (...args: unknown[]) => {
          const proxy = this.createProxy(
            instance,
            instance.constructor.name,
            methodName,
          );
          return await originalMethod.call(proxy, ...args);
        };
      } else {
        instance[methodName] = (...args: unknown[]) => {
          const proxy = this.createProxy(
            instance,
            instance.constructor.name,
            methodName,
          );
          return originalMethod.call(proxy, ...args);
        };
      }
    };
  }
  createProxy(thisArg: any, targetName: string, propertyKey: string) {
    return new Proxy(thisArg, {
      get: function (target, propKey, receiver) {
        const origin = target[propKey];
        const entrypoint = `${targetName}.${propertyKey}`;

        if (origin instanceof Repository) {
          return new Proxy(origin, {
            get: function (target, propKey, receiver) {
              if (propKey === 'createQueryBuilder') {
                return (firstArg: any, ...args: any[]) => {
                  if (firstArg && typeof firstArg === 'string') {
                    return Reflect.get(target, propKey, receiver)
                      .call(target, ...[firstArg, ...args])
                      .comment(entrypoint);
                  }
                  return Reflect.get(target, propKey, receiver).call(
                    target,
                    ...[firstArg, ...args],
                  );
                };
              }
              if (target[propKey] instanceof Function) {
                return (firstArg: any, ...args: any[]) => {
                  //   console.log('firstArg', firstArg);
                  if (
                    firstArg &&
                    firstArg instanceof Object &&
                    firstArg.where &&
                    !firstArg.comment
                  ) {
                    firstArg.comment = entrypoint;
                  }
                  return Reflect.get(target, propKey, receiver).call(
                    target,
                    ...[firstArg, ...args],
                  );
                };
              }

              return Reflect.get(target, propKey, receiver);
            },
          });
        }
        return Reflect.get(target, propKey, receiver);
      },
    });
  }
}
