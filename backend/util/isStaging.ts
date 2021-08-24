require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const isStaging = () => (process.env.BACKEND_URL ?? "").includes("staging")

export default isStaging
