import { BackgroundImage } from "/components/Images/CardBackgroundFullCover"
import { mime } from "/util/imageUtils"

import { StudyModuleFieldsFragment } from "/graphql/generated"

interface ModuleImageProps {
  module: StudyModuleFieldsFragment
}
const ModuleImage = ({ module }: ModuleImageProps) => {
  const imageUrl = module?.image ?? (module ? `${module.slug}.jpg` : "")

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
          loading="lazy"
          alt=""
        />
      </picture>
    )
  } catch (e) {
    return null
  }
}

export default ModuleImage
