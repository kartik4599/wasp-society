import { type CreateTenant } from "wasp/server/operations";
import { TenantOnboardingData } from "../../frontend/tenent-onboarding/tenent-onboarding-page";
import { Role, AgreementType, RoomStatus, PaymentType } from "@prisma/client";

export const createTenant: CreateTenant<TenantOnboardingData, void> = async (
  args,
  ctx
) => {
  const { User, Agreement, Unit, ParkingSlot, Payment } = ctx.entities;
  const { tenant, building, unit, agreement, parkingSlots } = args;

  if (!tenant || !building || !unit || !agreement || !parkingSlots)
    throw new Error("Missing required data for tenant creation.");

  if (ctx.user?.role !== Role.owner)
    throw new Error("You are not authorized to create a tenant.");

  const tenantUser = await User.findUnique({ where: { id: tenant?.id } });
  if (!tenantUser) throw new Error("Tenant not found.");

  const tenantUnit = await Unit.findUnique({
    where: { id: unit.id },
    include: { building: { include: { society: true } } },
  });
  if (!tenantUnit) throw new Error("Unit not found.");

  await Promise.all([
    Agreement.create({
      data: {
        agreementType: agreement?.agreementType || AgreementType.rent,
        startDate: agreement.startDate || "",
        endDate: agreement.endDate,
        monthlyRent: agreement?.monthlyRent,
        depositAmount: agreement?.depositAmount,
        tenantId: tenantUser.id,
        unitId: tenantUnit.id,
        terms: agreement?.terms,
        agreementFile: agreement?.agreementFile,
      },
    }),
    Unit.update({
      where: { id: unit.id },
      data: { status: RoomStatus.occupied, allocatedUserId: tenantUser.id },
    }),
    Promise.all(
      parkingSlots.map(
        async ({ id, vehicleType, vehicleNumber, vehicleModel }) => {
          if (!id) return;
          await ParkingSlot.update({
            where: { id },
            data: {
              vehicleType,
              vehicleModel,
              vehicleNumber,
              assignedToId: tenantUser.id,
              unitId: unit.id,
              status: "occupied",
            },
          });
        }
      )
    ),
    (async () => {
      if (agreement?.monthlyRent) {
        await Payment.create({
          data: {
            type: PaymentType.RENT,
            amount: agreement?.monthlyRent,
            dueDate: agreement.startDate || "",
            tenantId: tenantUser.id,
            unitId: tenantUnit.id,
            societyId: tenantUnit.building.society.id,
          },
        });
      }
    })(),
    (async () => {
      if (agreement.depositAmount) {
        await Payment.create({
          data: {
            type: PaymentType.DEPOSIT,
            amount: agreement?.depositAmount,
            dueDate: agreement.startDate || "",
            tenantId: tenantUser.id,
            unitId: tenantUnit.id,
            societyId: tenantUnit.building.society.id,
          },
        });
      }
    })(),
    (async () => {
      if (agreement.maintenance) {
        await Payment.create({
          data: {
            type: PaymentType.MAINTENANCE,
            amount: agreement?.maintenance,
            dueDate: agreement.startDate || "",
            tenantId: tenantUser.id,
            unitId: tenantUnit.id,
            societyId: tenantUnit.building.society.id,
          },
        });
      }
    })(),
  ]);
};
