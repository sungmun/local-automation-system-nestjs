import { EventSubscriber } from 'typeorm';
import type { UpdateEvent, EntitySubscriberInterface } from 'typeorm';
import { Device } from './device.entity';

@EventSubscriber()
export class DeviceSubscriber implements EntitySubscriberInterface<Device> {
  listenTo() {
    return Device;
  }

  beforeUpdate(event: UpdateEvent<Device>) {
    if (event.entity.state) {
      event.entity.updateStateAt = new Date().toISOString();
    }
  }
}
