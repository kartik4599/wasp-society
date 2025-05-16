import { type CreateVisitor } from "wasp/server/operations";
import { VisitorFormData } from "../frontend/home/add-visitor-dialog";
import { HttpError } from "wasp/server";

export const createVisitor: CreateVisitor<VisitorFormData> = (args, ctx) => {
  const user = ctx.user;
  if (!user || !user.workingSocietyId)
    throw new HttpError(410, "User not found");

  const { Visitor } = ctx.entities;

  return Visitor.create({
    data: {
      name: args.name,
      phoneNumber: args.phone,
      visitorType: args.type,
      guardId: user.id,
      unitId: args.unit,
      notes: args.notes,
      reason: args.purpose,
      societyId: user.workingSocietyId,
    },
  });
};
