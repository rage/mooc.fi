import { isValidElement, useCallback, useMemo, useState } from "react"

const isClipboardSupported =
  typeof window !== "undefined" && navigator?.clipboard

const isCopyable = (content: unknown) => isValidElement(content)

export const useClipboard = (content: unknown) => {
  const [isCopied, setIsCopied] = useState(false)
  const hasClipboard = useMemo(
    () => isClipboardSupported && !isCopyable(content),
    [isClipboardSupported, content],
  )
  const onCopyToClipboard = useCallback(() => {
    if (!hasClipboard) {
      return
    }
    navigator.clipboard.writeText(String(content)).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [content, hasClipboard])

  return {
    isCopied,
    hasClipboard,
    onCopyToClipboard,
  }
}
