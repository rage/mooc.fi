function DisableAutoComplete() {
  return (
    <input
      name="disableAutocomplete"
      autoComplete="on"
      readOnly
      style={{
        display: "hidden",
        opacity: 0,
        position: "absolute",
        left: "-100000px",
      }}
    />
  )
}

export default DisableAutoComplete
