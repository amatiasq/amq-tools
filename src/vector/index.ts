import { DEGREES_IN_PI_RADIANS, MAX_DEGREES } from '../util/math/constants';
import degreeToRadian from '../util/math/degree-to-radian';
import Round from '../util/math/round';


const round = Round.curry(2);


export interface IVector {
  readonly DIMENSIONS: number;
  readonly x: number;
  readonly y: number;
  readonly isZero: boolean;
  readonly magnitude: number;

  is({ x, y }: VectorSetter): boolean;
  set({ x, y }: VectorSetter): IVector;
  add({ x, y }: VectorSetter): IVector;
  sustract({ x, y }: VectorSetter): IVector;
  multiply({ x, y }: VectorSetter): IVector;
  divide({ x, y }: VectorSetter): IVector;

  isValue(x: number, y?: number): boolean;
  // setValue(x: number, y?: number): IVector;
  addValue(x: number, y?: number): IVector;
  sustractValue(x: number, y?: number): IVector;
  multiplyValue(x: number, y?: number): IVector;
  divideValue(x: number, y?: number): IVector;

  map(operation: VectorMapper): IVector;
  every(operation: VectorTest): boolean;
  some(operation: VectorTest): boolean;

  toString(): string;
  toArray(): number[];
  toObject(): {x: number, y: number};
  toJSON(): string;
}


export default class Vector implements IVector {
  static ZERO = Vector.of(0, 0);
  static MAX = Vector.of(Infinity, Infinity);


  static of(x: number, y: number): IVector {
    return new Vector(round(x), round(y));
  }


  static *iterate(vectorA: IVector, vectorB: IVector = Vector.of(0, 0)) {
    const start = this.map(Math.min, vectorA, vectorB);
    const end = this.map(Math.max, vectorA, vectorB);

    for (let {y} = start; y < end.y; y++)
      for (let {x} = start; x < end.x; x++)
        yield Vector.of(x, y);
  }


  static map(action: (...values: number[]) => number, ...vectors: IVector[]) {
    return Vector.of(
      action(...vectors.map(vector => vector.x)),
      action(...vectors.map(vector => vector.y)),
    );
  }


  /*
  static fromRadians(radians: number): Vector {
    return this.construct(Math.cos(radians), Math.sin(radians));
  }


  static fromDegrees(degrees: number): Vector {
    return this.fromRadians(degreesToRadians(degrees));
  }


  static fromMagnitude(value: number): Vector {
    return this.construct(value, 0);
  }


  static from(degrees: number, magnitude: number): Vector {
    const vector = this.fromDegrees(degrees);
    return this.construct(vector.x * magnitude, vector.y * magnitude);
  }
  */


  static merge(vectorA: IVector, vectorB: IVector, ...others: IVector[]): IVector {
    let x = vectorA.x + vectorB.x;
    let y = vectorA.y + vectorB.y;

    if (others.length) {
      for (const vector of others) {
        x += vector.x;
        y += vector.y;
      }
    }

    return Vector.of(x, y);
  }


  static diff(vectorA: IVector, vectorB: IVector, ...others: IVector[]): IVector {
    let x = vectorA.x - vectorB.x;
    let y = vectorA.y - vectorB.y;

    if (others.length) {
      for (const vector of others) {
        x -= vector.x;
        y -= vector.y;
      }
    }

    return Vector.of(x, y);
  }


  readonly DIMENSIONS: 2;
  constructor(readonly x: number, readonly y: number) {}


  get isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }


  get radians(): number {
    if (this.isZero)
      return 0;

    let arctan = Math.atan(this.y / this.x);

    if (arctan < 0)
      arctan += Math.PI;

    if (this.y < 0 || (this.y === 0 && this.x < 0))
      arctan += Math.PI;

    return arctan;
  }


  get degrees(): number {
    const degrees = (this.radians / Math.PI * DEGREES_IN_PI_RADIANS) % MAX_DEGREES;
    return degrees < 0 ? degrees + MAX_DEGREES : degrees;
  }


  get magnitude(): number {
    return this.isZero ? 0 : round(Math.hypot(this.x, this.y));
  }


  is({ x = this.x, y = this.y }: VectorSetter): boolean {
    return this.x === x && this.y === y;
  }

  isValue(x: number, y = x): boolean {
    return this.x === x && this.y === y;
  }

  set({ x = this.x, y = this.y }: VectorSetter): IVector {
    return Vector.of(x, y);
  }

  // setValue(x: number, y = x): IVector {
  //   return Vector.of(x, y);
  // }

  add({ x = 0, y = 0 }: VectorSetter): IVector {
    return Vector.of(this.x + x, this.y + y);
  }

  addValue(x: number, y = x): IVector {
    return Vector.of(this.x + x, this.y + y);
  }

  sustract({ x = 0, y = 0 }: VectorSetter): IVector {
    return Vector.of(this.x - x, this.y - y);
  }

  sustractValue(x: number, y = x): IVector {
    return Vector.of(this.x - x, this.y - y);
  }

  multiply({ x = 1, y = 1 }: VectorSetter): IVector {
    return Vector.of(this.x * x, this.y * y);
  }

  multiplyValue(x: number, y = x): IVector {
    return Vector.of(this.x * x, this.y * y);
  }

  divide({ x = 1, y = 1 }: VectorSetter): IVector {
    return Vector.of(this.x / x, this.y / y);
  }

  divideValue(x: number, y = x): IVector {
    return Vector.of(this.x / x, this.y / y);
  }


  map(operation: VectorMapper): IVector {
    return Vector.of(operation(this.x, 'x', this), operation(this.y, 'y', this));
  }

  every(operation: VectorTest): boolean {
    return operation(this.x, 'x', this) && operation(this.y, 'y', this);
  }

  some(operation: VectorTest): boolean {
    return operation(this.x, 'x', this) || operation(this.y, 'y', this);
  }


  toString(): string {
    return `[Vector(${this.x},${this.y})]`;
  }

  toArray(): number[] {
    return [ this.x, this.y ];
  }

  toObject() {
    return { x: this.x, y: this.y };
  }

  toJSON(): string {
    return `{x:${this.x},y:${this.y}}`;
  }
}


export interface IXSetter {
  x: number;
  y?: number;
  z?: number;
}

export interface IYSetter {
  x?: number;
  y: number;
  z?: number;
}

export type VectorSetter = IXSetter | IYSetter;
export type VectorTest = (coord: number, key: 'x' | 'y' | 'z', vector: IVector) => boolean;
export type VectorMapper = (coord: number, key: 'x' | 'y' | 'z', vector: IVector) => number;
