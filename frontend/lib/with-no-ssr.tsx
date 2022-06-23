import dynamic from "next/dynamic"

export function withNoSSR<T>(Component: React.ComponentType<T>) {
  return dynamic(() => Promise.resolve(Component), { ssr: false })
}
