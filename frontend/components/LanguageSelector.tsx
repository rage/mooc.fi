import React, {useState} from "react"
import {
  BottomNavigation,
  BottomNavigationAction,
  Popover,
  Checkbox,
  FormGroup,
  FormControlLabel
} from "@material-ui/core"
import LanguageIcon from '@material-ui/icons/Language'



function LanguageSelectorPopover({open, anchorEl, onClose, handleLanguageChange, languageValue}){
    return(
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}>
            <FormGroup >
                <FormControlLabel 
                    control={
                        <Checkbox 
                            checked={languageValue.en}
                            onChange={handleLanguageChange('en')} />} 
                    label='EN'/>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            checked={languageValue.fi}
                            onChange={handleLanguageChange('fi')}/>} 
                    label='FI'/>
                <FormControlLabel 
                    control={
                        <Checkbox
                            checked={languageValue.se}
                            onChange={handleLanguageChange('se')} />} 
                    label='SE'/>
            </FormGroup>
        </Popover>
    )
}

function LanguageSelector({ handleLanguageChange, languageValue }) {
    const value = 0
    const changeValue = () => {
        console.log('here')
    }
    const [anchorEl, setAnchorEl] = useState(null)

    function handleClick(event){
        setAnchorEl(event.currentTarget)
    }
    function handleClose() {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
  return (
    <BottomNavigation
        value={value}
        onChange={handleClick}
        showLabels
    >
        <BottomNavigationAction label='Course Language' icon={<LanguageIcon />} />
        <LanguageSelectorPopover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            handleLanguageChange={handleLanguageChange}
            languageValue={languageValue}
        />

    </BottomNavigation>
  )
}

export default LanguageSelector