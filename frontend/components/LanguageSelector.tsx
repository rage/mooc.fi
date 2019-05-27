import React, { useState } from "react"
import {
  Button,
  Popover,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core"
import LanguageIcon from "@material-ui/icons/Language"

function LanguageSelectorPopover({
  open,
  anchorEl,
  onClose,
  handleLanguageChange,
  languageValue,
}) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={languageValue.en}
              onChange={handleLanguageChange("en")}
            />
          }
          label="EN"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={languageValue.fi}
              onChange={handleLanguageChange("fi")}
            />
          }
          label="FI"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={languageValue.se}
              onChange={handleLanguageChange("se")}
            />
          }
          label="SE"
        />
      </FormGroup>
    </Popover>
  )
}

function LanguageSelector({ handleLanguageChange, languageValue }) {
  const [anchorEl, setAnchorEl] = useState(null)

  function handleClick(event) {
    console.log("click")
    anchorEl ? setAnchorEl(null) : setAnchorEl(event.currentTarget)
  }
  function handleClose(event) {
    setAnchorEl(event.currentTarget)
  }

  const open = Boolean(anchorEl)
  return (
    <Button onClick={handleClick}>
      <LanguageIcon />
      <LanguageSelectorPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        handleLanguageChange={handleLanguageChange}
        languageValue={languageValue}
      />
    </Button>
  )
}

export default LanguageSelector
