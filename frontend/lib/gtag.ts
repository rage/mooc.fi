export const GA_TRACKING_ID = "UA-47575342-4"

export const pageview = (url: string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  })
}

interface EventProps {
  action: any
  category: string
  label: string
  value: any
}

export const event = (props: EventProps) => {
  window.gtag("event", props.action, {
    event_category: props.category,
    event_label: props.label,
    value: props.value,
  })
}
