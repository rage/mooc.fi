import { useContext, useEffect, useState } from "react"
import LanguageContext from "/contexes/LanguageContext"
import getFAQTranslator from "/translations/faq"
import { useQueryParameter } from "/util/useQueryParameter"
import dynamic from "next/dynamic"

export default function FAQ() {
  const { language } = useContext(LanguageContext)
  const t = getFAQTranslator(language)

  const [render, setRender] = useState(false)
  const [error, setError] = useState(false)
  
  useEffect(() => setRender(true), [])

  const topic: string = useQueryParameter("topic")
  const sanitizedTopic = topic.replace(/[./\\]/g, "").trim()
  
  let Component: any

  Component = dynamic(() => import(`../../../../static/md_pages/${sanitizedTopic}_${language}.mdx`)
    .then((c) => {
      setRender(true)

      return c
    })
    .catch(() => {
      setError(true)

      return
    }))  

  if (error) {
    return (
      <div>
        unknown topic {sanitizedTopic}
      </div>
    )
  }
  return (
    <div>
      {render ?
        <Component />
      : null}
    </div>
  )
}