import { BackgroundImage } from "/components/Images/CardBackgroundFullCover"

import { StudyModuleFieldsFragment } from "/graphql/generated"

interface ModuleImageProps {
  module: StudyModuleFieldsFragment
}
const ModuleImage = ({ module }: ModuleImageProps) => {
  const imageUrl = module?.image ?? (module ? `${module.slug}.jpg` : "")

  try {
    return (
      <BackgroundImage
        src={`/static/images/${imageUrl}`}
        loading="lazy"
        alt=""
        fill
        aria-hidden={true}
      />
    )
  } catch (e) {
    return null
  }
}

export default ModuleImage
