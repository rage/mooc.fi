import React from "react"
import { mime } from "/util/imageUtils"
import { AllModules_study_modules } from "/static/types/generated/AllModules"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"
import { BackgroundImage } from "/components/Images/CardBackgroundFullCover"

const ModuleImage = ({
  module,
}: {
  module?: AllModules_study_modules | AllModules_study_modules_with_courses
}) => {
  const imageUrl = module ? module.image || `${module.slug}.jpg` : ""

  try {
    return (
      <picture>
        <source
          srcSet={require(`../../static/images/${imageUrl}?webp`)}
          type="image/webp"
        />
        <source
          srcSet={require(`../../static/images/${imageUrl}`)}
          type={mime(imageUrl)}
        />
        <BackgroundImage
          src={require(`../../static/images/${imageUrl}`)}
          alt=""
        />
      </picture>
    )
  } catch (e) {
    return null
  }
}

export default ModuleImage
