export function calculateDuration(
  entryTime: string,
  exitTime: string
): number {
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);

  if (Number.isNaN(entry.getTime()) || Number.isNaN(exit.getTime())) {
    throw new Error("Invalid entry or exit time");
  }

  if (exit < entry) {
    throw new Error("Exit time cannot be before entry time");
  }

  const differenceMilliseconds = exit.getTime() - entry.getTime();

  return Math.floor(differenceMilliseconds / 60000);
}