import { type GetPaymentSummary } from "wasp/server/operations";
import { HttpError } from "wasp/server";
import { lastDayOfMonth, startOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { PaymentStatus } from "@prisma/client";

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
