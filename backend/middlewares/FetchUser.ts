import { AuthenticationError } from "apollo-server-core";
import TmcClient from "../services/tmc";
import { Prisma } from "../generated/prisma-client";

const fetchUser = async (resolve, root, args, context, info) => {
  if (context.userDetails) {
    const result = await resolve(root, args, context, info);
    return result;
  }
  let rawToken = null;
  if (context.request) {
    rawToken = context.request.get("Authorization");
  } else if (context.connection) {
    rawToken = context.connection.context["Authorization"];
  }
  if (!rawToken) {
    return new AuthenticationError("Please log in.");
  }
  const client = new TmcClient(rawToken);
  const details = await client.getCurrentUserDetails();
  context.userDetails = details;
  context.tmcClient = client;

  const prisma: Prisma = context.prisma;
  const id: number = details.id;
  const prismaDetails = {
    upstream_id: id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
  }
  context.user = await prisma.upsertUser({
    where: { upstream_id: id },
    create: prismaDetails,
    update: prismaDetails
  });

  const result = await resolve(root, args, context, info);
  return result;
};

export default fetchUser;
