import { type MakePaymentPaid } from "wasp/server/operations";
import { HttpError } from "wasp/server";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

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
