import { type GetTenentDetailList } from "wasp/server/operations";
import { Role, RoomStatus, AgreementType, Prisma } from "@prisma/client";
import { HttpError } from "wasp/server";
import { Building } from "wasp/entities";

export interface TenantListDetail {
  id: number;
  tenantName?: string | null;
  tenantPhone?: string | null;
  tenantEmail?: string | null;
  unitNo: string;
  floor: number | null;
  buildingName: string;
  type?: AgreementType;
  rent?: number | null;
  dueDate: null;
  createdAt?: Date;
}

interface getTenentDetailListReturnType {
  tenantList: TenantListDetail[];
  buildings: Building[];
  total: number;
  [key: string]: any;
}

export interface GetTenentDetailListArgs {
  search?: string;
  buildingId?: number;
  floor?: number;
  type?: AgreementType;
  page?: number;
  limit?: number;
  [key: string]: any;
}

export const getTenentDetailList: GetTenentDetailList<
  GetTenentDetailListArgs,
  getTenentDetailListReturnType
> = async (args, ctx) => {
  const { Unit, Building } = ctx.entities;
  const user = ctx.user;
  if (!user || user.role !== Role.owner)
    throw new HttpError(401, "Unauthorized");

  let conditions: Prisma.UnitWhereInput = {
    building: { society: { createdById: user.id } },
    status: RoomStatus.occupied,
    allocatedUserId: { not: null },
  };

  if (args.search) {
    conditions = {
      ...conditions,
      OR: [
        {
          allocatedTo: { name: { contains: args.search, mode: "insensitive" } },
        },
        {
          allocatedTo: {
            email: { contains: args.search, mode: "insensitive" },
          },
        },
        {
          allocatedTo: {
            phoneNumber: { contains: args.search, mode: "insensitive" },
          },
        },
      ],
    };
  }

  if (args.buildingId) {
    conditions = {
      ...conditions,
      buildingId: args.buildingId,
    };
  }

  if (args.floor) {
    conditions = {
      ...conditions,
      floor: args.floor,
    };
  }

  if (args.type) {
    conditions = {
      ...conditions,
      Agreement: { some: { agreementType: args.type } },
    };
  }

  const [count, units, buildings] = await Promise.all([
    Unit.count({ where: conditions }),
    Unit.findMany({
      where: conditions,
      include: { Agreement: true, allocatedTo: true, building: true },
      take: args.limit || 10,
      skip: ((args.page || 1) - 1) * (args.limit || 10),
    }),
    Building.findMany({ where: { society: { createdById: user.id } } }),
  ]);

  const tenantList = units.map((unit) => {
    const agreement = unit.Agreement?.find(
      (agreement) => agreement.tenantId === unit.allocatedTo?.id
    );

    return {
      id: unit.id,
      tenantName: unit.allocatedTo?.name,
      tenantPhone: unit.allocatedTo?.phoneNumber,
      tenantEmail: unit.allocatedTo?.email,
      unitNo: unit.name,
      floor: unit.floor,
      buildingName: unit.building.name,
      type: agreement?.agreementType,
      rent: agreement?.monthlyRent,
      dueDate: null,
      createdAt: agreement?.createdAt,
    };
  });

  return { tenantList, total: count, buildings };
};
