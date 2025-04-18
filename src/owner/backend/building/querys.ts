import {
  type GetBuildingDetail,
  type GetBuildingList,
} from "wasp/server/operations";
import { HttpError } from "wasp/server";
import { Building, Unit, User } from "wasp/entities";

export interface UnitDeatil extends Unit {
  allocatedTo?: User;
}

export interface BuildingDetailType extends Building {
  Unit: UnitDeatil[];
  [key: string]: any;
}

export const getBuildingDetail: GetBuildingDetail<
  void,
  BuildingDetailType[]
> = async (_, ctx) => {
  const { Building, Society } = ctx.entities;
  const user = ctx.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  const society = await Society.findUnique({ where: { createdById: user.id } });
  if (!society) throw new HttpError(401, "Unauthorized");

  const buildings = await Building.findMany({
    where: { societyId: society.id },
    include: { Unit: { include: { allocatedTo: true } } },
    orderBy: {},
  });

  return buildings as BuildingDetailType[];
};

export const getBuildingList: GetBuildingList<void> = async (_, ctx) => {
  const { Building, Society, Unit } = ctx.entities;
  const user = ctx.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  const society = await Society.findUnique({ where: { createdById: user.id } });
  if (!society) throw new HttpError(401, "Unauthorized");

  const buildings = await Building.findMany({
    where: { societyId: society.id },
    orderBy: {},
  });

  const extendedBuildings = await Promise.all(
    buildings.map(async (building) => {
      const unit = await Unit.groupBy({
        by: ["status"],
        where: { buildingId: building.id },
        _count: true,
      });

      const unitCounts = {
        occupied: 0,
        available: 0,
        underMaintenance: 0,
        notAvailable: 0,
      };

      let totalCount = 0;

      unit.forEach((item) => {
        unitCounts[item.status] = item._count;
        totalCount += item._count;
      });

      return { ...building, unitCounts: { ...unitCounts, totalCount } };
    })
  );

  return extendedBuildings;
};
