const MAX_DEGREES = 360;
const DEGREES_IN_PI_RADIANS = 180;


export default function degreesToRadians(degrees: number): number {
  degrees = degrees % MAX_DEGREES;

  if (degrees < 0)
    degrees += MAX_DEGREES;

  return degrees * Math.PI / DEGREES_IN_PI_RADIANS;
}
