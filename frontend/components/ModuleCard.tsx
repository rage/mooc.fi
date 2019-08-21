import React from "react"
import { Grid, Typography, Button } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import AddIcon from "@material-ui/icons/Add"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import NextI18Next from "../i18n"
import { ObjectifiedModule } from "./../static/types/moduleTypes"
import styled from "styled-components"
import mime from "mime-types"

const Base = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  height: 200px;
  @media (min-width: 720px) {
    height: 300px;
  }
`
const ImageBackground = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-position: center 40%;
`

const IconBackground = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const ImageCover = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: white;
  opacity: 0.9;
  width: 70%;
`
const ContentArea = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: left;
  display: flex;
  flex-direction: column;
  padding-bottom: 1em;
  padding-top: 1em;
`

const NaviCardTitle = styled(Typography)`
  margin-bottom: 1rem;
  margin-left: 1rem;
  max-width: 60%;
  line-height: 1.2em;
  @media (min-width: 320px) {
    font-size: 26px;
  }
  @media (min-width: 420px) {
    font-size: 32px;
  }
  @media (min-width: 720px) {
    font-size: 46px;
  }
  @media (min-width: 720px) {
    font-size: 48px;
  }
`
const NaviCardBodyText = styled(Typography)`
  max-width: 60%;
  text-align: left;
  margin: 0;
  margin-left: 1rem;
  flex: 1;
  position: absolute;
  bottom: 20px;
  width: 100%;
  @media (min-width: 320px) {
    font-size: 18px;
  }
  @media (min-width: 420px) {
    font-size: 20px;
  }
  @media (min-width: 720px) {
    font-size: 24px;
  }
  @media (min-width: 1000px) {
    font-size: 24px;
  }
`

function ModuleCard({ module }: { module?: ObjectifiedModule }) {
  const imageUrl = module
    ? module.image
      ? `../static/images/${module.image}`
      : `../static/images/${module.slug}.jpg`
    : "" // TODO: placeholder

  //  require(`../static/images/courseimages/${course.slug}.png`)
  // removed doggos as a placeholder for the time being

  return (
    <Grid item xs={12} sm={6} lg={6}>
      <Base>
        {module ? (
          <picture>
            <source
              srcSet={imageUrl}
              type={mime.lookup(imageUrl) || "image/jpeg"}
            />
            <source srcSet={`${imageUrl}?webp`} type="image/webp" />
            <ImageBackground style={{ backgroundImage: `url(${imageUrl})` }} />
          </picture>
        ) : (
          <IconBackground>
            <AddCircleIcon
              style={{
                color: "rgba(100,100,255)",
                width: "100%",
                height: "100%",
              }}
            />
          </IconBackground>
        )}
        <ImageCover />
        <ContentArea>
          <NaviCardTitle align="left">
            {module ? module.name : "New module"}
          </NaviCardTitle>
          <NaviCardBodyText paragraph>
            {module ? (
              <NextI18Next.Link
                as={`/study-modules/${module.slug}/edit`}
                href="/study-modules/[id]/edit"
              >
                <a>
                  <Button variant="contained" color="secondary" fullWidth>
                    <EditIcon />
                    Edit
                  </Button>
                </a>
              </NextI18Next.Link>
            ) : (
              <NextI18Next.Link href={`/study-modules/new`}>
                <a>
                  <Button variant="contained" color="secondary" fullWidth>
                    <AddIcon />
                    Create
                  </Button>
                </a>
              </NextI18Next.Link>
            )}
          </NaviCardBodyText>
        </ContentArea>
      </Base>
    </Grid>
  )
}

/*
      <Card className={classes.card}>
        <CardMedia className={classes.media}
          image={module ? module.image ? require(`../static/images/${module.image}`) : require(`../static/images/${module.slug}.jpg`) : ''}
        >
          {module ? (
            null
             <img src={module.image ? `../static/images/${module.image}` : `../static/images/${module.slug}.jpg`} alt={module.name} />
          ) : (
  <NextI18Next.Link
  as={`/study-modules/new`}
  href={`/study-modules/new`}
>
  <a href="/study-modules/new">
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{ height: "100%" }}
    >
      <AddCircleIcon fontSize="large" />
    </Grid>
  </a>
</NextI18Next.Link>
)}
</CardMedia>
<CardContent>
<Typography variant="h5" component="h2" gutterBottom={true}>
{module ? module.name : "New Module"}
</Typography>
</CardContent>
<CardActionArea>
{module ? (
<React.Fragment>
  <NextI18Next.Link
    as={`/study-modules/${module.slug}`}
    href={`/study-modules/${module.slug}`}
  >
    <a
      href={`/study-modules/${module.slug}`}
      aria-label={`To the homepage of study module ${module.name}`}
    >
      <Button variant="contained" color="secondary" fullWidth>
        <DashboardIcon />
        Module Dashboard
      </Button>
    </a>
  </NextI18Next.Link>
  <NextI18Next.Link
    as={`/study-modules/${module.slug}/edit`}
    href={`/study-modules/${module.slug}/edit`}
  >
    <a href={`/study-modules/${module.slug}/edit`}>
      <Button variant="contained" color="secondary" fullWidth>
        <EditIcon />
        Edit
      </Button>
    </a>
  </NextI18Next.Link>
</React.Fragment>
) : (
<NextI18Next.Link
  as={`/study-modules/new`}
  href={`/study-modules/new`}
>
  <a href="/study-modules/new">
    <Button variant="contained" color="secondary" fullWidth>
      <AddIcon />
      Create
    </Button>
  </a>
</NextI18Next.Link>
)}
</CardActionArea>
</Card>
*/
export default ModuleCard
