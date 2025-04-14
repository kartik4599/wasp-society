import { type GetMySociety } from "wasp/server/operations";
import { Society } from "wasp/entities";

export const getSociety: GetMySociety<void, Society | null> = async (
  _,
  ctx
) => {
  const { Society } = ctx.entities;

  return Society.findUnique({
    where: { createdById: ctx.user?.id },
  });
};
