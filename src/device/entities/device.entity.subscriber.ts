import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
  DataSource,
} from 'typeorm';
import { Device } from './device.entity';

@EventSubscriber()
export class DeviceSubscriber implements EntitySubscriberInterface<Device> {
  constructor(private readonly dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }
  listenTo() {
    return Device;
  }

  beforeUpdate(event: UpdateEvent<Device>) {
    if (event.entity.state) {
      event.entity.updateStateAt = new Date().toISOString();
    }
  }
}
