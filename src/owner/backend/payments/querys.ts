import {
  type GetPaymentSummary,
  type GetPaymentList,
} from "wasp/server/operations";
import { HttpError } from "wasp/server";
import { lastDayOfMonth, startOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { PaymentStatus, PaymentType, Prisma } from "@prisma/client";
import { Payment, Unit, User, Building } from "wasp/entities";

interface PaymentSummary {
  monthAmount: number;
  pendingPayments: {
    amount: number;
    count: number;
  };
  overduePayments: {
    amount: number;
    count: number;
  };
  weekPayments: {
    amount: number;
    count: number;
  };
  [key: string]: any;
}

export interface GetPaymentListArgs {
  search?: string;
  buildingId?: number;
  type?: PaymentType;
  status?: PaymentStatus;
  dateRange?: { start: Date; end: Date };
  page: number;
  limit: number;
  sortBy: Prisma.PaymentOrderByWithRelationInput;
  [key: string]: any;
}

interface ExtendedUnit extends Unit {
  building: Building;
}

export interface ExtendedPayment extends Payment {
  unit: ExtendedUnit;
  tenant: User;
  [key: string]: any;
}

export const getPaymentSummary: GetPaymentSummary<
  void,
  PaymentSummary
> = async (_, ctx) => {
  const user = ctx.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  const { Society, Payment } = ctx.entities;

  const society = await Society.findUnique({ where: { createdById: user.id } });
  if (!society) throw new HttpError(401, "Unauthorized");

  const today = new Date();
  const firstDay = startOfMonth(today);
  const lastDay = lastDayOfMonth(today);
  const firstWeekDay = startOfWeek(today);
  const lastWeekDay = endOfWeek(today);

  const [month, pending, overdue, week] = await Promise.all([
    await Payment.aggregate({
      where: {
        societyId: society.id,
        status: PaymentStatus.PAID,
        dueDate: {
          gte: firstDay,
          lte: lastDay,
        },
      },
      _sum: { amount: true },
    }),
    await Payment.groupBy({
      by: ["tenantId"],
      where: {
        societyId: society.id,
        status: PaymentStatus.PENDING,
      },
      _sum: { amount: true },
    }),
    await Payment.groupBy({
      by: ["tenantId"],
      where: {
        societyId: society.id,
        status: PaymentStatus.OVERDUE,
      },
      _sum: { amount: true },
    }),
    await Payment.groupBy({
      by: ["tenantId"],
      where: {
        societyId: society.id,
        status: PaymentStatus.PENDING,
        dueDate: {
          gte: firstWeekDay,
          lte: lastWeekDay,
        },
      },
      _sum: { amount: true },
    }),
  ]);

  const paymentSummary = {
    monthAmount: month._sum.amount || 0,
    pendingPayments: {
      amount: 0,
      count: 0,
    },
    overduePayments: {
      amount: 0,
      count: 0,
    },
    weekPayments: {
      amount: 0,
      count: 0,
    },
  };

  await Promise.all([
    (async () => {
      pending.forEach((payment) => {
        paymentSummary.pendingPayments.amount += payment._sum.amount || 0;
        paymentSummary.pendingPayments.count++;
      });
    })(),
    (async () => {
      overdue.forEach((payment) => {
        paymentSummary.overduePayments.amount += payment._sum.amount || 0;
        paymentSummary.overduePayments.count++;
      });
    })(),
    (async () => {
      week.forEach((payment) => {
        paymentSummary.weekPayments.amount += payment._sum.amount || 0;
        paymentSummary.weekPayments.count++;
      });
    })(),
  ]);

  return paymentSummary;
};

export const getPaymentList: GetPaymentList<
  GetPaymentListArgs,
  ExtendedPayment[]
> = async (args, ctx) => {
  const user = ctx.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  const { Society, Payment } = ctx.entities;

  const society = await Society.findUnique({ where: { createdById: user.id } });
  if (!society) throw new HttpError(401, "Unauthorized");

  const filters: Prisma.PaymentWhereInput = {};

  if (args.buildingId) filters.unit = { buildingId: args.buildingId };
  if (args.search) {
    filters.OR = [
      { tenant: { name: { contains: args.search, mode: "insensitive" } } },
      { unit: { name: { contains: args.search, mode: "insensitive" } } },
      {
        unit: {
          building: { name: { contains: args.search, mode: "insensitive" } },
        },
      },
    ];
  }
  if (args.type) filters.type = args.type;
  if (args.status) filters.status = args.status;
  if (args.dateRange?.start && args.dateRange?.end) {
    filters.dueDate = {
      gte: args.dateRange.start,
      lte: args.dateRange.end,
    };
  }

  const payments = await Payment.findMany({
    where: { societyId: society.id, ...filters },
    include: { unit: { include: { building: true } }, tenant: true },
    take: args.limit,
    skip: (args?.page - 1) * args.limit,
    orderBy: args.sortBy,
  });

  return payments;
};
