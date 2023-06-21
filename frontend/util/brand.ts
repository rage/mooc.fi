// from https://github.com/kourge/ts-brand
export type Brand<
  Base,
  Branding,
  ReservedName extends string = "__type__",
> = Base & { [K in ReservedName]: Branding } & { __witness__: Base }

export type AnyBrand = Brand<unknown, any>

export type BaseOf<B extends AnyBrand> = B["__witness__"]

export type Brander<B extends AnyBrand> = (underlying: BaseOf<B>) => B

export function identity<B extends AnyBrand>(underlying: BaseOf<B>): B {
  return underlying as B
}

export function make<B extends AnyBrand>(): Brander<B> {
  return identity
}
