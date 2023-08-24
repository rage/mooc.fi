import { createSvgIcon } from "@mui/material/utils"

const HamburgerIcon = createSvgIcon(
  <svg viewBox="0 0 1000 1000">
    <path d="M903 419H65v162h870V419h-32zm0 258H65v162h870V677h-32zm0-516H65v162h870V161h-32z" />{" "}
  </svg>,
  "Hamburger",
)

export default HamburgerIcon
