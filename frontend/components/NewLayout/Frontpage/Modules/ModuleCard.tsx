import styled from "@emotion/styled"
import { Button } from "@mui/material"

import {
  CardBody,
  CardDescription,
  CardHeader,
  CardHeaderBackground,
  CardTitle,
  CardWrapper,
} from "/components/NewLayout/Common/Card"

import { StudyModuleFieldsFragment } from "/graphql/generated"

interface ModuleCardProps {
  module: StudyModuleFieldsFragment
  hue?: number
  brightness?: number
}

const ModuleButton = styled(Button)<{ hue?: number; brightness?: number }>`
  filter: hue-rotate(${(props) => props.hue ?? 0}deg)
    brightness(${(props) => props.brightness ?? 1});
`

const CardActionArea = styled.div`
  text-align: right;
`

export const ModuleCard = ({
  module: { name, image, description },
  hue,
  brightness,
}: ModuleCardProps) => {
  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardHeaderBackground
          hue={hue}
          brightness={brightness}
          image={image ?? ""}
        />
      </CardHeader>
      <CardBody>
        <CardDescription>{description}</CardDescription>
        <CardActionArea>
          <ModuleButton hue={hue} brightness={brightness}>
            Kokonaisuuden tiedot
          </ModuleButton>
        </CardActionArea>
      </CardBody>
    </CardWrapper>
  )
}
