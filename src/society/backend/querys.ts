import { type GetMySociety } from "wasp/server/operations";
import { Society } from "wasp/entities";
import { Role } from "@prisma/client";

export const getSociety: GetMySociety<void, Society | null> = async (
  _,
  ctx
) => {
  const role = ctx.user?.role;
  const { Society } = ctx.entities;

  if (Role.owner === role)
    return Society.findUnique({
      where: { createdById: ctx.user?.id },
    });

  if (Role.staff === role && ctx.user?.workingSocietyId)
    return Society.findUnique({
      where: { id: ctx.user?.workingSocietyId },
    });

  return null;
};
