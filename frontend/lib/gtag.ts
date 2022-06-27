import ReactGA from "react-ga"

const GA_TRACKING_ID = "UA-47575342-4"

export const initGA = () => {
  ReactGA.initialize(GA_TRACKING_ID)
  ReactGA.ga("set", "anonymizeIP", true)
  ReactGA.ga("require", "displayfeatures")
}

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}
