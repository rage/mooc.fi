import { createSvgIcon } from "@mui/material/utils"

const FlipchartIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={19}
    fill="none"
    viewBox="0 0 19 19"
  >
    <path
      stroke="#000000"
      stroke-width="2"
      d="M1 2h16v11H1Z M4 18L6 13M14 18L12 13 M7 1H11"
    ></path>
  </svg>,
  "Flipchart",
)

export default FlipchartIcon
