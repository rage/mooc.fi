const currentUser = async (_, args, ctx) => {
  const { email } = args
  return ctx.user
}

export default currentUser
