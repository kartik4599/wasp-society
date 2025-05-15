import {
  type MakePaymentPaid,
  type CreatePayment,
} from "wasp/server/operations";
import { z } from "zod";
import { HttpError } from "wasp/server";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { formSchema } from "../../../components/payments/add-payment-dialog";

export const makePaymentPaid: MakePaymentPaid<{
  paymentIds: number[];
}> = async (args, ctx) => {
  const user = ctx.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  const { Society, Payment } = ctx.entities;

  const society = await Society.findUnique({ where: { createdById: user.id } });
  if (!society) throw new HttpError(401, "Unauthorized");

  const { paymentIds } = args;

  await Payment.updateMany({
    where: { id: { in: paymentIds } },
    data: {
      status: PaymentStatus.PAID,
      method: PaymentMethod.CASH,
      paidDate: new Date(),
    },
  });
};

export const createPayment: CreatePayment<z.infer<typeof formSchema>> = async (
  args,
  ctx
) => {
  const user = ctx.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  const { Society, Payment, Unit } = ctx.entities;

  const society = await Society.findUnique({ where: { createdById: user.id } });
  if (!society) throw new HttpError(401, "Unauthorized");

  const unit = await Unit.findUnique({
    where: { id: Number(args.tenantId), allocatedUserId: { not: null } },
  });

  if (!unit || !unit.allocatedUserId)
    throw new HttpError(401, "Unit Not found");

  const payment = await Payment.create({
    data: {
      amount: Number(args.amount),
      dueDate: args.paymentDate,
      tenantId: unit.allocatedUserId,
      unitId: unit.id,
      societyId: society.id,
      status: args.isPaid ? PaymentStatus.PAID : PaymentStatus.PENDING,
      type: args.paymentType,
      method: args.isPaid ? args.paymentMethod : null,
      referenceId: args.transactionId,
      notes: args.notes,
      paidDate: args.isPaid ? new Date() : null,
    },
  });

  return payment;
};
