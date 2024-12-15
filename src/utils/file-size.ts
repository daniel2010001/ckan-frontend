type FileSizeUnit = "B" | "KB" | "MB" | "GB" | "TB";
const unitMultipliers: { [key in FileSizeUnit]: number } = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
};

export function convertFileSize(
  size: number,
  fromUnit: FileSizeUnit,
  toUnit: FileSizeUnit
): number {
  const sizeInBytes = size * unitMultipliers[fromUnit];
  const convertedSize = sizeInBytes / unitMultipliers[toUnit];
  return convertedSize;
}
