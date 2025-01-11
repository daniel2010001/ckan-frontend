type FileSizeUnit = "B" | "KB" | "MB" | "GB" | "TB";
const unitMultipliers: { [key in FileSizeUnit]: number } = {
  B: 1,
  KB: 1000,
  MB: 1000 * 1000,
  GB: 1000 * 1000 * 1000,
  TB: 1000 * 1000 * 1000 * 1000,
};

export function convertFileSize(
  size: number,
  fromUnit: FileSizeUnit,
  toUnit: FileSizeUnit
): number {
  const sizeInBytes = size * unitMultipliers[fromUnit];
  const convertedSize = sizeInBytes / unitMultipliers[toUnit];
  return parseFloat(convertedSize.toFixed(2));
}
