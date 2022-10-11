import { format } from "mathjs";

export function fmt(frc) {
  if (frc.d === 1) return frc.toString();
  return format(frc);
}
