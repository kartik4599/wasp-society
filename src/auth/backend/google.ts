import { defineUserSignupFields } from "wasp/server/auth";

export const userSignupFields = defineUserSignupFields({
  email: (data: any) => data?.profile?.email,
  picture: (data: any) => data?.profile?.picture,
});

export const getConfig = () => ({
  scopes: ["email"],
});
