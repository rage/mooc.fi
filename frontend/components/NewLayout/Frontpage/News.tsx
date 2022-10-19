import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

const NewsContainer = styled("section")`
  background-color: #000;
  padding-left: 3rem;
  padding-right: 3rem;
  display: flex;
`

const NewsListContainer = styled("ul")`
  list-style: none;
  padding-left: 0;
  color: #fff;
  display: flex;
  flex-direction: column;
  margin: 0;
  width: 100%;

  li + li {
    border-top: 1px solid rgba(255, 255, 255, 0.5);
  }
`

const NewsItemContainer = styled("li")`
  padding: 0.5rem;
  width: 100%;
`

interface NewsItemProps {
  content: string
}

function NewsItem({ content }: NewsItemProps) {
  return (
    <NewsItemContainer>
      <Typography variant="body2">{content}</Typography>
    </NewsItemContainer>
  )
}

const news = [
  {
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    content: "Sama mutta eri.",
  },
]

function News() {
  return (
    <NewsContainer>
      <NewsListContainer>
        {news.map((item, index) => (
          <NewsItem key={index} content={item.content} />
        ))}
      </NewsListContainer>
    </NewsContainer>
  )
}

export default News
