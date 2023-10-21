/**
 * Removes `readonly` from type.
 *
 * @example
 * type A = Mutable<{readonly a: string; readonly b: number}>; // → {a: string, b: number}
 *
 * @example
 * type B = Mutable<readonly number[]>; // → number[]
 *
 * @example
 * type C = Mutable<readonly [string, boolean]>; // → [string, boolean]
 */
declare type Mutable<T> = {-readonly [P in keyof T]: T[P]};

/**
 * Collects type information from the values of array or object.
 *
 * @example
 * const FooBar = {
 *   FOO: 'foo',
 *   BAR: 'bar',
 * } as const;
 * type FooBar = ValuesOf<typeof FooBar>; // → 'foo' | 'bar'
 *
 * @example
 * const FooBar = ['foo', 'bar'] as const;
 * type FooBar = ValuesOf<typeof FooBar>; // → 'foo' | 'bar'
 */
declare type ValuesOf<T extends object> = Mutable<T> extends Array<infer U>
  ? U
  : T[keyof T];
