import { AuthenticationError } from "apollo-server-core";
import TmcClient from "../services/tmc";
import { Prisma } from "../generated/prisma-client";

const fetchUser = async (resolve, root, args, context, info) => {
  if (context.userDetails) {
    const result = await resolve(root, args, context, info);
    return result;
  }
  const rawToken = context.request.get("Authorization");
  if (!rawToken) {
    return new AuthenticationError("Please log in.");
  }
  const client = new TmcClient(rawToken);
  const details = await client.getCurrentUserDetails();
  context.userDetails = details;
  context.tmcClient = client;

  const prisma: Prisma = context.prisma;
  const id: number = details.id;
  const users = await prisma.users({
    where: { upstream_id: id }
  });
  if (users.length > 1) {
    return new AuthenticationError("Could not match to user");
  }
  if (users.length == 0) {
    context.user = await prisma.createUser({
      administrator: details.administrator,
      email: details.email.trim(),
      first_name: details.user_field.first_name.trim(),
      last_name: details.user_field.last_name.trim(),
      upstream_id: details.id
    });
  } else {
    context.user = users[0];
  }

  const result = await resolve(root, args, context, info);
  return result;
};

export default fetchUser;
