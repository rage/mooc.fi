// from https://github.com/kourge/ts-brand
declare const __type__: unique symbol
declare const __witness__: unique symbol

export type Brand<Base, Branding> = Base & { [__type__]: Branding } & {
  [__witness__]: Base
}

export type AnyBrand = Brand<unknown, any>

export type BaseOf<B extends AnyBrand> = B[typeof __witness__]

export type Brander<B extends AnyBrand> = (underlying: BaseOf<B>) => B

export function identity<B extends AnyBrand>(underlying: BaseOf<B>): B {
  return underlying as B
}

export function brand<const B extends AnyBrand>(): Brander<B> {
  return identity
}
