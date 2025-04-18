import { Prisma, Role } from "@prisma/client";
import { type GetTenantList } from "wasp/server/operations";
import { HttpError } from "wasp/server";

export interface tenant {
  name: string | null;
  id: number;
  email: string | null;
  phoneNumber: string | null;
  [key: string]: any;
}

export const getTenantList: GetTenantList<
  { query?: string },
  tenant[]
> = async (args, ctx) => {
  const { User } = ctx.entities;
  const user = ctx.user;
  const { query } = args;
  if (!user || user.role !== Role.owner)
    throw new HttpError(401, "Unauthorized");

  const searchQuery: { OR?: Prisma.UserWhereInput[] } = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { phoneNumber: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const tenants = await User.findMany({
    take: 10,
    where: { role: Role.tenant, ...searchQuery },
    select: { id: true, name: true, phoneNumber: true, email: true },
  });

  return tenants;
};
