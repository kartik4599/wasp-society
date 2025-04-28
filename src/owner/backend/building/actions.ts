import { CreateBuilding } from "wasp/server/operations";
import { Building } from "../../frontend/building/create-building";
import { HttpError } from "wasp/server";

export const createBuilding: CreateBuilding<Building[], void> = async (
  args,
  ctx
) => {
  const { Society, Building } = ctx.entities;
  const user = ctx.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  const society = await Society.findUnique({ where: { createdById: user.id } });
  if (!society) throw new HttpError(401, "Unauthorized");

  await Promise.all(
    args.map(({ name, floors, units, parkingSpots }) =>
      Building.create({
        data: {
          name: name,
          floors: floors,
          societyId: society.id,
          Unit: {
            create: units.map(({ name, type, floor }) => ({
              name,
              type,
              floor,
            })),
          },
          ParkingSlot: {
            create: parkingSpots.map(({ name, buildingId, status, type }) => ({
              name,
              status,
              buildingId,
              type,
              vehicleType: type,
            })),
          },
        },
      })
    )
  );
};
