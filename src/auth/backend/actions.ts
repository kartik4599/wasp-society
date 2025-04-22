import {
  type UpdateUserDetail,
  type SaveMyPersonalDetail,
  type SaveMyAdditionalDetail,
} from "wasp/server/operations";
import { User } from "wasp/entities";
import { HttpError } from "wasp/server";
import { personalInformation } from "../frontend/personal-information";
import { Gender, IdentityType } from "@prisma/client";
import { AdditionalInformationFormData } from "../frontend/additional-information";

export const updateUserInfo: UpdateUserDetail<
  Pick<User, "name" | "role" | "phoneNumber">
> = async (args, ctx) => {
  const { User } = ctx.entities;
  const user = ctx.user;

  if (!user) throw new HttpError(401, "Unauthorized");

  await User.update({ where: { id: user.id }, data: args });

  return;
};

export const saveMyPersonalDetail: SaveMyPersonalDetail<
  personalInformation,
  void
> = async (args, ctx) => {
  const { PersonalInformation } = ctx.entities;
  const user = ctx.user;

  if (!user) throw new HttpError(401, "Unauthorized");

  const personalInformation = await PersonalInformation.findUnique({
    where: { userId: user.id },
  });

  if (personalInformation) {
    await PersonalInformation.update({
      where: { id: personalInformation.id },
      data: {
        dob: args.dateOfBirth || "",
        gender: args.gender || Gender.Male,
        primaryIdentityType: args.primaryIdentityType || IdentityType.aadhaar,
        primaryIdentityNumber: args.primaryIdentityNumber || "",
        secondaryIdentityType: args.secondaryIdentityType,
        secondaryIdentityNumber: args.secondaryIdentityNumber,
      },
    });
    return;
  }

  await PersonalInformation.create({
    data: {
      userId: user.id,
      dob: args.dateOfBirth || "",
      gender: args.gender || Gender.Male,
      primaryIdentityType: args.primaryIdentityType || IdentityType.aadhaar,
      primaryIdentityNumber: args.primaryIdentityNumber || "",
      secondaryIdentityType: args.secondaryIdentityType,
      secondaryIdentityNumber: args.secondaryIdentityNumber,
    },
  });
};

export const saveMyAdditionalDetail: SaveMyAdditionalDetail<
  AdditionalInformationFormData,
  void
> = async (args, ctx) => {
  const { AdditionalInformation, MemberInformation } = ctx.entities;
  const user = ctx.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  await AdditionalInformation.create({
    data: {
      userId: user.id,
      emergencyContactName: args.emergencyContactName || "",
      emergencyContactNumber: args.emergencyContactNumber || "",
      occupation: args.occupation || "",
      alternativeEmail: args.alternativeEmail,
      alternativePhoneNumber: args.alternativePhoneNumber,
      organizationName: args.organizationName,
    },
  });

  await MemberInformation.createMany({
    data: args.members
      ? args.members.map(({ name, dateOfBirth, relation }) => ({
          userId: user.id,
          name,
          dob: dateOfBirth,
          relation,
        }))
      : [],
  });
};
