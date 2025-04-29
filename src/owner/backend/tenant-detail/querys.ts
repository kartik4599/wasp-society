import {
  type GetTenantProfileByUnitId,
  type GetTenantAgreementByUnitId,
  type GetTenantParkingByUnitId,
} from "wasp/server/operations";
import { HttpError } from "wasp/server";
import {
  User,
  AdditionalInformation,
  PersonalInformation,
  MemberInformation,
  Agreement,
  ParkingSlot,
} from "wasp/entities";

export interface userProfile extends User {
  AdditionalInformation: AdditionalInformation | null;
  PersonalInformation: PersonalInformation | null;
  MemberInformation: MemberInformation[];
}

interface getTenantProfileByUnitIdResponse {
  userProfile: userProfile;
  unitDetail: {
    name: string;
    id: number;
    floor: number | null;
    allocatedUserId: number | null;
    building: {
      name: string;
      id: number;
    };
  };
  [key: string]: any;
}

export const getTenantProfileByUnitId: GetTenantProfileByUnitId<
  { id: string },
  getTenantProfileByUnitIdResponse
> = async ({ id }, ctx) => {
  const user = ctx.user;
  if (!user || !id)
    throw new HttpError(401, "User not authenticated or ID not provided");

  const { Unit, User } = ctx.entities;

  const unitDetail = await Unit.findUnique({
    where: { id: Number(id), building: { society: { createdById: user.id } } },
    select: {
      allocatedUserId: true,
      id: true,
      building: { select: { name: true, id: true } },
      name: true,
      floor: true,
    },
  });

  if (!unitDetail || !unitDetail.allocatedUserId)
    throw new HttpError(404, "Unit not found");

  const userProfile = await User.findUnique({
    where: { id: unitDetail.allocatedUserId },
    include: {
      AdditionalInformation: true,
      MemberInformation: true,
      PersonalInformation: true,
    },
  });

  if (!userProfile) throw new HttpError(404, "User not found");

  return { userProfile, unitDetail };
};

export const getTenantAgreementByUnitId: GetTenantAgreementByUnitId<
  { id: string },
  Agreement
> = async ({ id }, ctx) => {
  const user = ctx.user;
  if (!user || !id)
    throw new HttpError(401, "User not authenticated or ID not provided");

  const { Unit, Agreement } = ctx.entities;

  const unitDetail = await Unit.findUnique({
    where: { id: Number(id), building: { society: { createdById: user.id } } },
  });

  if (!unitDetail || !unitDetail.allocatedUserId)
    throw new HttpError(404, "Unit not found");

  const agreement = await Agreement.findFirst({
    where: {
      unitId: unitDetail.id,
      tenantId: unitDetail.allocatedUserId,
    },
  });

  if (!agreement) throw new HttpError(404, "Agreement not found");

  return agreement;
};

export const getTenantParkingByUnitId: GetTenantParkingByUnitId<
  {
    id: string;
  },
  ParkingSlot[]
> = async ({ id }, ctx) => {
  const user = ctx.user;
  if (!user || !id)
    throw new HttpError(401, "User not authenticated or ID not provided");

  const { ParkingSlot } = ctx.entities;

  const slots = await ParkingSlot.findMany({ where: { unitId: Number(id) } });

  return slots;
};
