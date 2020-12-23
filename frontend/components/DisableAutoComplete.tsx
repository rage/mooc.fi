export default function DisableAutoComplete() {
  return (
    <input
      name="disableAutocomplete"
      autoComplete="on"
      value=""
      style={{
        display: "hidden",
        opacity: 0,
        position: "absolute",
        left: "-100000px",
      }}
    />
  )
}
