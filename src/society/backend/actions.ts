import { type CreateSociety } from "wasp/server/operations";
import { Society } from "wasp/entities";
import { HttpError } from "wasp/server";

export const createSocietyWithBasicDeatil: CreateSociety<
  Pick<Society, "name" | "type" | "address">
> = (args, ctx) => {
  const { Society } = ctx.entities;
  const user = ctx.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  return Society.create({ data: { ...args, createdById: user.id } });
};
