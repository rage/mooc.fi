import TmcClient from "tmc-client-js";
import Router from "next/router";
import { NextContext } from "next";
import nookies from "nookies";

const tmcClient = new TmcClient(
  "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
  "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28"
);

export const isSignedIn = (ctx: NextContext) => {
  const accessToken = nookies.get(ctx)["access_token"];
  return typeof accessToken == "string";
};

export const signIn = async ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  const res = await tmcClient.authenticate({ username: email, password });
  document.cookie = `access_token=${res.accessToken}`;

  Router.push("/");
  return res;
};

export const signOut = async () => {
  document.cookie =
    "access_token" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  Router.push("/sign-in");
};

export const getAccessToken = (ctx: NextContext | undefined) => {
  // @ts-ignore
  return nookies.get(ctx)["access_token"];
};
