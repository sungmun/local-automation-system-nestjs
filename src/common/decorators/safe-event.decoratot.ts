import { applyDecorators, Logger } from '@nestjs/common';
import { OnEvent, OnEventType } from '@nestjs/event-emitter';
import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';
function _OnSafeEvent() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const logger = new Logger(className + `(OnSafeEvent)`);
    const metaKeys = Reflect.getOwnMetadataKeys(descriptor.value);
    const metas = metaKeys.map((key) => [
      key,
      Reflect.getMetadata(key, descriptor.value),
    ]);

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.call(this, ...args);
      } catch (err) {
        logger.error(err);
      }
    };
    metas.forEach(([k, v]) => Reflect.defineMetadata(k, v, descriptor.value));
  };
}

export function OnSafeEvent(
  event: OnEventType,
  options?: OnEventOptions | undefined,
) {
  return applyDecorators(OnEvent(event, options), _OnSafeEvent());
}
