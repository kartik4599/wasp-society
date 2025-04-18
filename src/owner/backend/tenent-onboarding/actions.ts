import { type CreateTenant } from "wasp/server/operations";
import { TenantOnboardingData } from "../../frontend/tenent-onboarding/tenent-onboarding-page";
import { Role, AgreementType, RoomStatus } from "@prisma/client";

export const createTenant: CreateTenant<TenantOnboardingData, void> = async (
  args,
  ctx
) => {
  const { User, Agreement, Unit } = ctx.entities;
  const { tenant, building, unit, agreement } = args;

  if (!tenant || !building || !unit || !agreement)
    throw new Error("Missing required data for tenant creation.");

  if (ctx.user?.role !== Role.owner)
    throw new Error("You are not authorized to create a tenant.");

  const tenantUser = await User.findUnique({ where: { id: tenant?.id } });
  if (!tenantUser) throw new Error("Tenant not found.");

  const tenantUnit = await Unit.findUnique({ where: { id: unit.id } });
  if (!tenantUnit) throw new Error("Unit not found.");

  await Agreement.create({
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
  });

  await Unit.update({
    where: { id: unit.id },
    data: { status: RoomStatus.occupied, allocatedUserId: tenantUser.id },
  });
};
