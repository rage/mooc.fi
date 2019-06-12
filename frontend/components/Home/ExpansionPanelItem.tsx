import React, { useState, useEffect } from "react"
import { Typography, Button, ButtonBase } from "@material-ui/core"
import { Motion, spring } from "react-motion"
import styled from "styled-components"
import grey from "@material-ui/core/colors/grey"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { trackElementHeight } from "../../util/trackHeight"

const Header = styled.div`
  display: flex;
`

const Heading = styled(Typography)`
  font-size: 1.3rem !important;
  color: ${grey[800]} !important;
  font-weight: 400 !important;
  flex: 1;
`

const Card = styled(ButtonBase)`
  margin-bottom: 2rem;
  display: block !important;
  text-align: left !important;
  padding: 1rem !important;
  overflow: hidden;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px !important;
  &:hover {
    background-color: ${grey[50]} !important;
  }
`

const LongDescription = styled.p`
  height: calc(var(--open-ratio) * var(--calculated-height) * 1px);
  overflow: hidden;
  padding: 0 1.85rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px !important;
  font-weight: 400 !important;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif !important;
  line-height: 1.46429em !important;
`

const ShortDescription = styled.div`
  padding: 0 1.85rem;
  font-size: 16px !important;
  font-weight: 400 !important;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif !important;
  line-height: 1.46429em !important;
`

const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  align-self: right;
  transition: all 0.3s !important;
  transform: rotateZ(${props => (props.expanded ? "-180" : "0")}deg);
`

const StyledButton = styled(Button)`
  margin: 1rem !important;
`

export default function ExpansionPanelItem(props: any) {
  const longDescriptionRef = React.createRef()
  const [expanded, setExpanded] = useState(false)
  const [disableRipple, setDisableRipple] = useState(false)

  useEffect(() => {
    const current = longDescriptionRef.current
    trackElementHeight(current)
  }, [])

  const { item } = props
  const Icon = styled(item.icon)`
    margin-right: 0.3rem;
    color: ${grey[700]};
  `

  return (
    <Card
      component="div"
      disableRipple={disableRipple}
      onClick={() => setExpanded(!expanded)}
    >
      <Header>
        <Icon />
        <Heading>{item.title}</Heading>
        <StyledExpandMoreIcon expanded={expanded ? "1" : undefined} />
      </Header>
      <ShortDescription>{item.shortDescription}</ShortDescription>
      <Motion style={{ openRatio: spring(expanded ? 1 : 0) }}>
        {({ openRatio }) => {
          return (
            <LongDescription
              style={{ ["--open-ratio" as any]: `${openRatio}` }}
              expanded={expanded ? "1" : undefined}
              ref={longDescriptionRef}
            >
              {item.longDescription}
              {item.buttonLink && (
                <StyledButton
                  variant="contained"
                  color="primary"
                  href={item.buttonLink}
                  onClick={e => {
                    e.stopPropagation()
                    setDisableRipple(true)
                    setTimeout(() => {
                      setDisableRipple(false)
                    }, 1000)
                  }}
                >
                  {item.buttonText}
                </StyledButton>
              )}
            </LongDescription>
          )
        }}
      </Motion>
    </Card>
  )
}
