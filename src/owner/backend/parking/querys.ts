import { type GetBuildingParkingDetail } from "wasp/server/operations";
import { HttpError } from "wasp/server";
import { Building, ParkingSlot, User } from "wasp/entities";

export interface ParkingSlotDetailType extends ParkingSlot {
  assignedTo?: User;
}

export interface BuildingParkingDetailType extends Building {
  ParkingSlot: ParkingSlotDetailType[];
  [key: string]: any;
}

export const getBuildingParkingDetail: GetBuildingParkingDetail<
  void,
  BuildingParkingDetailType[]
> = async (_, ctx) => {
  const { Building, Society } = ctx.entities;
  const user = ctx.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  const society = await Society.findUnique({ where: { createdById: user.id } });
  if (!society) throw new HttpError(401, "Unauthorized");

  const buildings = await Building.findMany({
    where: { societyId: society.id },
    include: { ParkingSlot: { include: { assignedTo: true } } },
    orderBy: {},
  });

  return buildings as BuildingParkingDetailType[];
};
