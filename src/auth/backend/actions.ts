import { type UpdateUserDetail } from "wasp/server/operations";
import { User } from "wasp/entities";
import { HttpError } from "wasp/server";

export const updateUserInfo: UpdateUserDetail<
  Pick<User, "name" | "role" | "phoneNumber">
> = async (args, ctx) => {
  const { User } = ctx.entities;
  const user = ctx.user;

  if (!user) throw new HttpError(401, "Unauthorized");

  await User.update({ where: { id: user.id }, data: args });

  return;
};
