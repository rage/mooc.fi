import { createTheme, Theme } from "@mui/material/styles"

export const withPalette = (theme: Theme) =>
  createTheme({
    ...theme,
    palette: {
      primary: {
        main: "#0e688b",
      },
      secondary: {
        main: "#fff",
      },
      common: {
        brand: {
          main: "#0e688b",
          soft: "#b1e7ff",
          bright: "#48c5f8",
          light: "#107eab",
          active: "#005379",
          dark: "#003146",
          nearlyBlack: "#000222",
        },
        grayscale: {
          white: "#fff",
          slightlyGray: "#fefefe",
          light: "#f8f8f8",
          medium: "#d2d2d2",
          backgroundBox: "#f5f5f5",
          tabsBorder: "#e6e6e6",
          backgroundArrow: "#dfdfdf",
          mediumDark: "#979797",
          dark: "#555555",
          darkText: "#222222",
          black: "#000",
        },
        additional: {
          red: {
            light: "#e5053a",
            dark: "#a31621",
          },
          purple: {
            light: "#420039",
          },
          yellow: {
            light: "#f9a21a",
            main: "#c47f1b",
          },
          skyblue: "#48c5f8",
          orange: "#d14600",
          green: {
            light: "#96ba3c",
            dark: "#006400",
          },
        },
        link: {
          blue: "#0479a4",
          disabled: "#767676",
        },
        hover: {
          gray: "#eaeaea",
        },
      },
      blue: {
        light3: "#DAE3EB",
        light2: "#B5C7D7",
        light1: "#90ABC3",
        main: "#6B8FAF",
        dark1: "#46749B",
        dark2: "#215887",
        dark3: "#08457A",
        contrastText: "#FFF",
      },
      clear: {
        light3: "#F5F6F7",
        light2: "#EBEDEE",
        light1: "#E2E4E6",
        main: "#D8DBDD",
        dark1: "#CED2D5",
        dark2: "#C4C9CD",
        dark3: "#BEC3C7",
        contrastText: "#FFF",
      },
      crimson: {
        light3: "#EADBDD",
        light2: "#D5B7BA",
        light1: "#C09397",
        main: "#AC6E75",
        dark1: "#974A53",
        dark2: "#822630",
        dark3: "#740E19",
        contrastText: "#FFF",
      },
      gray: {
        light3: "#DDDEE0",
        light2: "#BABDC2",
        light1: "#989CA3",
        main: "#767B85",
        dark1: "#535A66",
        dark2: "#313947",
        dark3: "#1A2333",
        contrastText: "#FFF",
      },
      green: {
        light3: "#DAE6E5",
        light2: "#B4CDCB",
        light1: "#8FB4B2",
        main: "#6A9B98",
        dark1: "#44827E",
        dark2: "#1F6964",
        dark3: "#065853",
        contrastText: "#FFF",
      },
      purple: {
        light3: "#E5E0F1",
        light2: "#CBC1E2",
        light1: "#B1A2D4",
        main: "#9783C5",
        dark1: "#7C64B7",
        dark2: "#6245A9",
        dark3: "#51309F",
        contrastText: "#FFF",
      },
      red: {
        light3: "#F0E1DD",
        light2: "#E2C2BC",
        light1: "#D3A49A",
        main: "#C58579",
        dark1: "#B66757",
        dark2: "#A84835",
        dark3: "#9E341F",
        contrastText: "#FFF",
      },
      yellow: {
        light3: "#FAF6E3",
        light2: "#F6EDC6",
        light1: "#F1E4A9",
        main: "#ECDB8D",
        dark1: "#E8D270",
        dark2: "#E3C954",
        dark3: "#E0C341",
        contrastText: "#FFF",
      },
      contrastThreshold: 4.5,
    },
  })
