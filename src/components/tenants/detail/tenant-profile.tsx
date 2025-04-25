import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Card, CardContent } from "../../ui/card";
import { User, Phone, Mail, Briefcase, Users } from "lucide-react";
import { differenceInYears, format } from "date-fns";
import { getTenantProfileByUnitId, useQuery } from "wasp/client/operations";
import { useParams } from "react-router-dom";

export default function TenantProfile() {
  const { tenentId } = useParams();
  const { data } = useQuery(getTenantProfileByUnitId, { id: tenentId || "" });
  if (!data) return null;

  const { userProfile, unitDetail } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center p-6 bg-white/30 rounded-lg border border-white/50">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage
                src={userProfile.picture || "/placeholder.svg"}
                alt={userProfile.name || ""}
              />
              <AvatarFallback className="text-3xl bg-blue-100 text-blue-600">
                {(userProfile.name || "")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{userProfile.name}</h2>
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {userProfile.phoneNumber}
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {userProfile.email}
              </div>
            </div>
          </div>

          <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
            <CardContent className="p-4">
              <h3 className="font-medium flex items-center mb-3">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-2 text-sm">
                {userProfile.PersonalInformation?.dob && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Date of Birth:</span>
                    <span>
                      {format(
                        userProfile.PersonalInformation?.dob,
                        "dd/MM/yyyy"
                      )}
                    </span>
                  </div>
                )}
                {userProfile.PersonalInformation?.gender && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Gender:</span>
                    <span>{userProfile.PersonalInformation?.gender}</span>
                  </div>
                )}
                {userProfile.PersonalInformation?.primaryIdentityType && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Primary ID Type:</span>
                    <span>
                      {userProfile.PersonalInformation?.primaryIdentityType}
                    </span>
                  </div>
                )}
                {userProfile.PersonalInformation?.primaryIdentityNumber && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">ID Number:</span>
                    <span>
                      {userProfile.PersonalInformation?.primaryIdentityNumber}
                    </span>
                  </div>
                )}
                {userProfile.PersonalInformation?.secondaryIdentityType && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Secondary ID Type:</span>
                    <span>
                      {userProfile.PersonalInformation?.secondaryIdentityType}
                    </span>
                  </div>
                )}
                {userProfile.PersonalInformation?.secondaryIdentityNumber && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">ID Number:</span>
                    <span>
                      {userProfile.PersonalInformation?.secondaryIdentityNumber}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
            <CardContent className="p-4">
              <h3 className="font-medium flex items-center mb-3">
                <Phone className="h-4 w-4 mr-2 text-green-600" />
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Primary Phone:</span>
                  <span>{userProfile.phoneNumber}</span>
                </div>
                {userProfile.AdditionalInformation?.alternativePhoneNumber && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Alternate Phone:</span>
                    <span>
                      {
                        userProfile.AdditionalInformation
                          ?.alternativePhoneNumber
                      }
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Email:</span>
                  <span className="truncate">{userProfile.email}</span>
                </div>
                {userProfile.AdditionalInformation?.emergencyContactName && (
                  <div className="grid grid-cols-2 truncate">
                    <span className="text-gray-500">Emergency Contact:</span>
                    <span>
                      {userProfile.AdditionalInformation?.emergencyContactName}
                    </span>
                  </div>
                )}
                {userProfile.AdditionalInformation?.emergencyContactNumber && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">
                      Emergency Contact Name:
                    </span>
                    <span>
                      {
                        userProfile.AdditionalInformation
                          ?.emergencyContactNumber
                      }
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
            <CardContent className="p-4">
              <h3 className="font-medium flex items-center mb-3">
                <Briefcase className="h-4 w-4 mr-2 text-amber-600" />
                Occupation Details
              </h3>
              <div className="space-y-2 text-sm">
                {userProfile.AdditionalInformation?.occupation && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Occupation:</span>
                    <span>{userProfile.AdditionalInformation?.occupation}</span>
                  </div>
                )}
                {userProfile.AdditionalInformation?.organizationName && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Company/Organization:</span>
                    <span>
                      {userProfile.AdditionalInformation?.organizationName}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
            <CardContent className="p-4">
              <h3 className="font-medium flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2 text-green-600"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Unit Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Building:</span>
                  <span>{unitDetail.building.name}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Unit Number:</span>
                  <span>{unitDetail.name}</span>
                </div>
                {unitDetail.floor && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Floor:</span>
                    <span>{unitDetail.floor}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
            <CardContent className="p-4">
              <h3 className="font-medium flex items-center mb-3">
                <Users className="h-4 w-4 mr-2 text-blue-600" />
                Family Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Family Members:</span>
                  <span>{userProfile.MemberInformation.length || 1}</span>
                </div>
                {userProfile.MemberInformation.length > 0 && (
                  <div className="mt-3">
                    <span className="text-gray-500 block mb-2">
                      Family Details:
                    </span>
                    <div className="space-y-2">
                      {userProfile.MemberInformation.map(
                        (member, index: number) => (
                          <div
                            key={index}
                            className="bg-white/30 p-2 rounded-md"
                          >
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-gray-500">
                              {member.relation},{" "}
                              {differenceInYears(new Date(), member.dob)} years
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
