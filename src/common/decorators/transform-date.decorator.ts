import { Transform } from 'class-transformer';

export function TransformDate() {
  return Transform(({ value }) => {
    const date = new Date(value);
    date.setSeconds(0, 0);
    return date;
  });
}
