import { Button, Skeleton } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  CardBody,
  CardDescription,
  CardHeader,
  CardHeaderBackground,
  CardHeaderBackgroundSkeleton,
  CardImageHeaderBackground,
  CardTitle,
  CardWrapper,
} from "/components/NewLayout/Common/Card"

import { StudyModuleFieldsFragment } from "/graphql/generated"

interface ModuleCardProps {
  module: StudyModuleFieldsFragment
  hue?: number
  brightness?: number
  variant?: "small" | "large"
}

const ModuleButton = styled(Button)<{ hue?: number; brightness?: number }>`
  /*filter: hue-rotate(${(props) => props.hue ?? 0}deg)
    brightness(${(props) => props.brightness ?? 1});*/
`

const CardActions = styled("div")`
  display: flex;
  justify-content: flex-end;
`

export const ModuleCard = ({
  module: { name, slug, image, description },
}: ModuleCardProps) => {
  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle variant="h3" component="h2">
          {name}
        </CardTitle>
        {image ? (
          <CardImageHeaderBackground
            src={require(`/public/images/modules/${image}`)}
            alt=""
            placeholder="blur"
          />
        ) : (
          <CardHeaderBackground />
        )}
      </CardHeader>
      <CardBody>
        <CardDescription>{description}</CardDescription>
        <CardActions>
          <ModuleButton href={`/_new/study-modules/#${slug}`}>
            Kokonaisuuden tiedot
          </ModuleButton>
        </CardActions>
      </CardBody>
    </CardWrapper>
  )
}

export const ModuleCardSkeleton = () => {
  return (
    <CardWrapper>
      <CardHeader>
        <Skeleton width="40%" />
        <CardHeaderBackgroundSkeleton />
      </CardHeader>
      <CardBody>
        <CardDescription>
          <Skeleton />
          <Skeleton />
          <Skeleton width="30%" />
        </CardDescription>
        <CardActions>
          <ModuleButton disabled={true} style={{ width: "40%" }}>
            <Skeleton width="100%" />
          </ModuleButton>
        </CardActions>
      </CardBody>
    </CardWrapper>
  )
}

/*const SmallModuleCard = ({
  module: { name, slug, image, description },
  hue,
  brightness,
}: ModuleCardProps) => {

}*/
