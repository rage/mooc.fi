import { BackgroundImage } from "/components/Images/CardBackgroundFullCover"

import { StudyModuleFieldsFragment } from "/graphql/generated"

interface ModuleImageProps {
  studyModule: StudyModuleFieldsFragment
}
const ModuleImage = ({ studyModule }: ModuleImageProps) => {
  try {
    const imageSrc = studyModule.image
      ? require(`/public/images/modules/${studyModule.image}`)
      : require(`/public/images/modules/${studyModule.slug}.jpg`)

    return (
      <BackgroundImage
        src={imageSrc?.src}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt=""
        placeholder="blur"
        fill
        aria-hidden={true}
      />
    )
  } catch (e) {
    return null
  }
}

export default ModuleImage
