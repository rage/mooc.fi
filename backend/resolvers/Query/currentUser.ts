const currentUser = async (_, { email }, ctx) => {
    return ctx.user;
}

export default currentUser