import {
  type GetStaffSummary,
  type GetCheckInVisitor,
} from "wasp/server/operations";
import { Role, VisitorType, Visitor, Unit, Prisma } from "@prisma/client";
import { HttpError } from "wasp/server";

interface ExtendedVisitor extends Visitor {
  unit: Unit;
  [key: string]: any;
}

interface CheckInVisitor {
  name: string;
  id: number;
  visitorType: VisitorType;
  checkInAt: Date;
  unit: {
    name: string;
  };
  [key: string]: any;
}

export const getStaffSummary: GetStaffSummary<
  void,
  {
    totalCheckIns: number;
    totalInside: number;
    totalDeliveries: number;
    totalFlagged: number;
    recentVisitors: ExtendedVisitor[];
  }
> = async (_, ctx) => {
  if (ctx.user?.role !== Role.staff || !ctx.user.workingSocietyId)
    throw new HttpError(401, "Unauthorized");

  const { Visitor } = ctx.entities;

  const createdAt = {
    gte: new Date(new Date().setHours(0, 0, 0, 0)),
    lte: new Date(new Date().setHours(23, 59, 59, 999)),
  };

  const [
    totalCheckIns,
    totalInside,
    totalDeliveries,
    totalFlagged,
    recentVisitors,
  ] = await Promise.all([
    Visitor.count({
      where: {
        societyId: ctx.user.workingSocietyId,
        guardId: ctx.user.id,
        createdAt,
      },
    }),
    Visitor.count({
      where: {
        societyId: ctx.user.workingSocietyId,
        guardId: ctx.user.id,
        checkOutAt: null,
        createdAt,
      },
    }),
    Visitor.count({
      where: {
        societyId: ctx.user.workingSocietyId,
        guardId: ctx.user.id,
        visitorType: VisitorType.DELIVERY,
        createdAt,
      },
    }),
    Visitor.count({
      where: {
        societyId: ctx.user.workingSocietyId,
        guardId: ctx.user.id,
        isFlagged: true,
        createdAt,
      },
    }),
    Visitor.findMany({
      where: {
        societyId: ctx.user.workingSocietyId,
        guardId: ctx.user.id,
        createdAt,
      },
      include: { unit: true },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    totalCheckIns,
    totalInside,
    totalDeliveries,
    totalFlagged,
    recentVisitors,
  };
};

export const getCheckInVisitor: GetCheckInVisitor<
  { query: string },
  CheckInVisitor[]
> = async (args, ctx) => {
  if (ctx.user?.role !== Role.staff || !ctx.user.workingSocietyId)
    throw new HttpError(401, "Unauthorized");

  const { Visitor } = ctx.entities;

  const serachQuery: Prisma.VisitorWhereInput = {};

  if (args.query) {
    serachQuery.OR = [
      { name: { contains: args.query, mode: "insensitive" } },
      { reason: { contains: args.query, mode: "insensitive" } },
    ];
  }

  const checkInVisitors = await Visitor.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
      societyId: ctx.user.workingSocietyId,
      guardId: ctx.user.id,
      checkOutAt: null,
      ...serachQuery,
    },
    select: {
      id: true,
      name: true,
      visitorType: true,
      checkInAt: true,
      unit: { select: { name: true } },
    },
  });

  return checkInVisitors;
};
