// test/deviceSubscriber.test.ts
import { DeviceSubscriber } from './device.entity.subscriber';
import { Device } from './device.entity';
import { UpdateEvent } from 'typeorm';

describe('DeviceSubscriber', () => {
  let subscriber: DeviceSubscriber;
  let event: UpdateEvent<Device>;

  beforeEach(() => {
    subscriber = new DeviceSubscriber();
    event = {
      entity: {
        state: 'active',
        updateStateAt: null,
      } as any,
    } as UpdateEvent<Device>;
  });

  it('상태가 변경되면 updateStateAt이 업데이트되어야 한다', () => {
    subscriber.beforeUpdate(event);
    expect(event.entity.updateStateAt).not.toBeNull();
    expect(new Date(event.entity.updateStateAt)).toBeInstanceOf(Date);
  });

  it('상태가 없으면 updateStateAt이 업데이트되지 않아야 한다', () => {
    event.entity.state = null;
    subscriber.beforeUpdate(event);
    expect(event.entity.updateStateAt).toBeNull();
  });
});
