import { sortBy } from "remeda"

import { styled } from "@mui/material/styles"

import ContainedImage from "/components/Images/ContainedImage"

import { CourseSponsorFieldsFragment } from "/graphql/generated"

const ImageContainer = styled("div")`
  display: flex;
  position: relative;
  max-width: 9rem;
  width: 100vw;
  height: 2rem;
`

interface SponsorProps {
  data: CourseSponsorFieldsFragment
  ContainerProps?: React.HTMLAttributes<HTMLDivElement>
}

export const Sponsor = ({ data, ContainerProps }: SponsorProps) => {
  const logos = data.images?.filter((image) => image.type === "logo")

  if (!logos || logos.length === 0) {
    return null
  }
  const logo = logos[0]

  const imageUri = /^https?:\/\//.test(logo.uri)
    ? logo.uri
    : require(`/public/images/new/sponsors/${logo.uri}`)

  return (
    <ImageContainer {...ContainerProps}>
      <ContainedImage src={imageUri} alt={data.name} fill />
    </ImageContainer>
  )
}

const SponsorsContainer = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

interface SponsorsProps {
  data: CourseSponsorFieldsFragment[]
  ContainerProps?: React.HTMLAttributes<HTMLDivElement>
  ItemContainerProps?: React.HTMLAttributes<HTMLDivElement>
}

const Sponsors = ({
  data,
  ContainerProps,
  ItemContainerProps,
}: SponsorsProps) => {
  if (!data || data.length === 0) {
    return null
  }

  const orderedData = sortBy(
    data,
    (sponsor) => sponsor.order ?? 0,
    (sponsor) => sponsor.name?.toLowerCase() ?? "",
  )

  return (
    <SponsorsContainer {...ContainerProps}>
      {orderedData.map((sponsor) => (
        <Sponsor
          data={sponsor}
          key={sponsor.id}
          ContainerProps={ItemContainerProps}
        />
      ))}
    </SponsorsContainer>
  )
}

export default Sponsors
