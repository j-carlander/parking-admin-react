export function calcOffset(currentFromMinutesOffset: number, currentToMinutesOffset: number): { from: string, to: string }{
    const now = new Date();

let fromHoursOffset = Math.trunc(
    Number(currentFromMinutesOffset) / 60
  );
  const fromMinutesOffset =
    now.getMinutes() -
    Math.abs(Number(currentFromMinutesOffset) % 60);
  let toHoursOffset = Math.trunc(
    Number(currentToMinutesOffset) / 60
  );
  let toMinutesOffset =
    now.getMinutes() + (Number(currentToMinutesOffset) % 60);

  if (fromMinutesOffset < 0) {
    fromHoursOffset--;
  }

  if (toMinutesOffset > 60) {
    toHoursOffset++;
    toMinutesOffset -= 60;
  }

  const minRoundDown =
    (Math.round((Math.abs(fromMinutesOffset) - 7.5) / 15) * 15) % 60; // nearest 15 min down, 00, 15, 30, 45
  const minRoundUp = (Math.round((toMinutesOffset + 7.4) / 15) * 15) % 60; // nearest 15 min up, 00, 15, 30, 45
  if (toMinutesOffset > 45) toHoursOffset++;

  let fromHour = new Date(
    new Date(now).setHours(
      now.getHours() + fromHoursOffset,
      minRoundDown,
      0
    )
  );

  let toHour = new Date(
    new Date(now).setHours(now.getHours() + toHoursOffset, minRoundUp, 0)
  );

  const from = new Intl.DateTimeFormat('sv-SE',{
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(fromHour);

  const to = new Intl.DateTimeFormat('sv-SE',{
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(toHour)

  return {from, to}
}