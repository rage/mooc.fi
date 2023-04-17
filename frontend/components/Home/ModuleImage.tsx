import { BackgroundImage } from "/components/Images/CardBackgroundFullCover"

import { StudyModuleFieldsFragment } from "/graphql/generated"

interface ModuleImageProps {
  image: StudyModuleFieldsFragment["image"]
  slug: StudyModuleFieldsFragment["slug"]
}
const ModuleImage = ({ image, slug }: ModuleImageProps) => {
  try {
    const imageSrc = image
      ? require(`/public/images/modules/${image}`)
      : require(`/public/images/modules/${slug}.jpg`)

    return (
      <BackgroundImage
        src={imageSrc}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt=""
        {...(imageSrc && { placeholder: "blur" })}
        fill
        aria-hidden
      />
    )
  } catch (e) {
    return null
  }
}

export default ModuleImage
