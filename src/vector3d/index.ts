import Round from '../util/math/round';
import { IVector, VectorSetter, VectorMapper, VectorTest } from '../vector/index';


const round = Round.curry(2);


export interface IVector3D extends IVector {
  readonly z: number;

  is({ x, y, z }: Vector3DSetter): boolean;
  set({ x, y, z }: Vector3DSetter): IVector3D;
  add({ x, y, z }: Vector3DSetter): IVector3D;
  sustract({ x, y, z }: Vector3DSetter): IVector3D;
  multiply({ x, y, z }: Vector3DSetter): IVector3D;
  divide({ x, y, z }: Vector3DSetter): IVector3D;

  isValue(x: number, y?: number, z?: number): boolean;
  setValue(x: number, y?: number, z?: number): IVector3D;
  addValue(x: number, y?: number, z?: number): IVector3D;
  sustractValue(x: number, y?: number, z?: number): IVector3D;
  multiplyValue(x: number, y?: number, z?: number): IVector3D;
  divideValue(x: number, y?: number, z?: number): IVector3D;

  map(operation: Vector3DMapper): IVector3D;
  every(operation: Vector3DTest): boolean;
  some(operation: Vector3DTest): boolean;
}


export default class Vector3D implements IVector3D {
  static ZERO = Vector3D.of(0, 0, 0);
  static MAX = Vector3D.of(Infinity, Infinity, Infinity);


  static of(x: number, y: number, z: number): IVector3D {
    return new Vector3D(round(x), round(y), round(z));
  }


  static *iterate(vectorA: IVector3D, vectorB: IVector3D = Vector3D.of(0, 0, 0)) {
    const start = this.map(Math.min, vectorA, vectorB);
    const end = this.map(Math.max, vectorA, vectorB);

    for (let {z} = start; z < end.z; z++)
      for (let {y} = start; y < end.y; y++)
        for (let {x} = start; x < end.x; x++)
          yield Vector3D.of(x, y, z);
  }


  static map(action: (...values: number[]) => number, ...vectors: IVector3D[]) {
    return Vector3D.of(
      action(...vectors.map(vector => vector.x)),
      action(...vectors.map(vector => vector.y)),
      action(...vectors.map(vector => vector.z)),
    );
  }


  static fromMagnitude(value: number): IVector3D {
    return Vector3D.of(value, 0, 0);
  }


  static merge(vectorA: IVector3D, vectorB: IVector3D, ...others: IVector3D[]): IVector3D {
    let x = vectorA.x + vectorB.x;
    let y = vectorA.y + vectorB.y;
    let z = vectorA.z + vectorB.z;

    if (others.length) {
      for (const vector of others) {
        x += vector.x;
        y += vector.y;
        z += vector.z;
      }
    }

    return Vector3D.of(x, y, z);
  }


  static diff(vectorA: IVector3D, vectorB: IVector3D, ...others: IVector3D[]): IVector3D {
    let x = vectorA.x - vectorB.x;
    let y = vectorA.y - vectorB.y;
    let z = vectorA.z - vectorB.z;

    if (others.length) {
      for (const vector of others) {
        x -= vector.x;
        y -= vector.y;
        z -= vector.z;
      }
    }

    return Vector3D.of(x, y, z);
  }


  readonly DIMENSIONS: 3;
  constructor( readonly x: number, readonly y: number, readonly z: number) {}


  get isZero(): boolean {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }


  get magnitude(): number {
    return this.isZero ? 0 : Math.hypot(this.x, this.y, this.z);
  }


  is({ x = this.x, y = this.y, z = this.z }: Vector3DSetter): boolean {
    return this.x === x && this.y === y && this.z === z;
  }

  isValue(x: number, y = x, z = y): boolean {
    return this.x === x && this.y === y && this.z === z;
  }


  set({ x = this.x, y = this.y, z = this.z }: Vector3DSetter): IVector3D {
    return Vector3D.of(x, y, z);
  }

  setValue(x: number, y = x, z = y): IVector3D {
    return Vector3D.of(x, y, z);
  }


  add({ x = 0, y = 0, z = 0 }: Vector3DSetter): IVector3D {
    return Vector3D.of(this.x + x, this.y + y, this.z + z);
  }

  addValue(x: number, y = x, z = y): IVector3D {
    return Vector3D.of(this.x + x, this.y + y, this.z + z);
  }


  sustract({ x = 0, y = 0, z = 0 }: Vector3DSetter): IVector3D {
    return Vector3D.of(this.x - x, this.y - y, this.z - z);
  }

  sustractValue(x: number, y = x, z = y): IVector3D {
    return Vector3D.of(this.x - x, this.y - y, this.z - z);
  }


  multiply({ x = 1, y = 1, z = 1 }: Vector3DSetter): IVector3D {
    return Vector3D.of(this.x * x, this.y * y, this.z * z);
  }

  multiplyValue(x: number, y = x, z = y): IVector3D {
    return Vector3D.of(this.x * x, this.y * y, this.z * z);
  }


  divide({ x = 1, y = 1, z = 1 }: Vector3DSetter): IVector3D {
    return Vector3D.of(this.x / x, this.y / y, this.z / z);
  }

  divideValue(x: number, y = x, z = y): IVector3D {
    return Vector3D.of(this.x / x, this.y / y, this.z / z);
  }


  map(operation: Vector3DMapper): IVector3D {
    return Vector3D.of(
      operation(this.x, 'x', this),
      operation(this.y, 'y', this),
      operation(this.z, 'z', this),
    );
  }

  every(operation: Vector3DTest): boolean {
    return operation(this.x, 'x', this) && operation(this.y, 'y', this) && operation(this.z, 'z', this);
  }

  some(operation: Vector3DTest): boolean {
    return operation(this.x, 'x', this) || operation(this.y, 'y', this) || operation(this.z, 'z', this);
  }


  toString(): string {
    return `[Vector3D(${this.x},${this.y},${this.z})]`;
  }

  toArray(): number[] {
    return [ this.x, this.y, this.z ];
  }

  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }

  toJSON(): string {
    return `{x:${this.x},y:${this.y},z:${this.z}}`;
  }
}


export interface IZSetter {
  x?: number;
  y?: number;
  z: number;
}

export type Vector3DSetter = VectorSetter | IZSetter;
export type Vector3DTest = (coord: number, key: 'x' | 'y' | 'z', vector: IVector3D) => boolean;
export type Vector3DMapper = (coord: number, key: 'x' | 'y' | 'z', vector: IVector3D) => number;
