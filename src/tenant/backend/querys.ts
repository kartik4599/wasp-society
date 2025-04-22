import { type GetMyPersonalDetail } from "wasp/server/operations";
import { Role } from "@prisma/client";
import { PersonalInformation, AdditionalInformation } from "wasp/entities";

interface getMyPersonalDetailReturnType {
  personalInformation: PersonalInformation | null;
  additionalInformation: AdditionalInformation | null;
  [key: string]: any;
}

export const getMyPersonalDetail: GetMyPersonalDetail<
  void,
  getMyPersonalDetailReturnType
> = async (_, ctx) => {
  const { AdditionalInformation, PersonalInformation } = ctx.entities;
  const user = ctx.user;

  if (!user || user.role !== Role.tenant)
    return {
      personalInformation: null,
      additionalInformation: null,
    };

  const [personalInformation, additionalInformation] = await Promise.all([
    PersonalInformation.findUnique({ where: { userId: user.id } }),
    AdditionalInformation.findUnique({ where: { userId: user.id } }),
  ]);

  return {
    personalInformation,
    additionalInformation,
  };
};
