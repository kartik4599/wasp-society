import { type GetStaffSummary } from "wasp/server/operations";
import { Role, VisitorType, Visitor, Unit } from "@prisma/client";
import { HttpError } from "wasp/server";

interface ExtendedVisitor extends Visitor {
  unit: Unit;
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
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    Visitor.count({
      where: {
        societyId: ctx.user.workingSocietyId,
        guardId: ctx.user.id,
        checkOutAt: null,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    Visitor.count({
      where: {
        societyId: ctx.user.workingSocietyId,
        guardId: ctx.user.id,
        visitorType: VisitorType.DELIVERY,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    Visitor.count({
      where: {
        societyId: ctx.user.workingSocietyId,
        guardId: ctx.user.id,
        isFlagged: true,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    Visitor.findMany({
      where: {
        societyId: ctx.user.workingSocietyId,
        guardId: ctx.user.id,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
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
