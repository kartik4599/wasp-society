import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Calendar, FileText, Download, AlertTriangle } from "lucide-react";
import { useParams } from "react-router-dom";
import { getTenantAgreementByUnitId, useQuery } from "wasp/client/operations";
import { AgreementType } from "@prisma/client";
import { format, intervalToDuration } from "date-fns";

export default function TenantAgreement() {
  const { tenentId } = useParams();
  const { data: tenantAgreement } = useQuery(getTenantAgreementByUnitId, {
    id: tenentId || "",
  });

  if (!tenantAgreement) return;

  const interval = tenantAgreement.endDate
    ? intervalToDuration({
        start: tenantAgreement.startDate,
        end: tenantAgreement.endDate,
      })
    : null;

  const isExpiringSoon =
    !interval?.months &&
    interval?.days &&
    interval.days <= 30 &&
    interval.days > 0;
  const isExpired = interval?.days && interval.days <= 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Agreement details */}
        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Agreement Details
                </h3>
                <Badge
                  className={
                    tenantAgreement.agreementType === AgreementType.rent
                      ? "bg-blue-500"
                      : tenantAgreement.agreementType === AgreementType.buy
                      ? "bg-purple-500"
                      : ""
                  }
                >
                  {tenantAgreement.agreementType === AgreementType.rent
                    ? "Rental Agreement"
                    : "Purchase Agreement"}
                </Badge>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/30 p-3 rounded-md">
                    <div className="text-gray-500 text-xs mb-1">Start Date</div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      {format(tenantAgreement.startDate, "MMMM dd, yyyy")}
                    </div>
                  </div>
                  <div className="bg-white/30 p-3 rounded-md">
                    <div className="text-gray-500 text-xs mb-1">End Date</div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      {tenantAgreement.endDate
                        ? format(tenantAgreement.endDate, "MMMM dd, yyyy")
                        : "Not specified"}
                    </div>
                  </div>
                </div>

                {(isExpiringSoon || isExpired) && (
                  <div
                    className={`p-3 rounded-md flex items-start ${
                      isExpired
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
                    <div>
                      {isExpired
                        ? `Agreement expired ${Math.abs(
                            interval?.days || 0
                          )} days ago. Please renew the agreement.`
                        : `Agreement expires in ${interval?.days} days. Consider renewing soon.`}
                    </div>
                  </div>
                )}

                {tenantAgreement.agreementType === AgreementType.rent && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/30 p-3 rounded-md">
                        <div className="text-gray-500 text-xs mb-1">
                          Monthly Rent
                        </div>
                        <div className="font-medium">
                          ₹{tenantAgreement.monthlyRent?.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-white/30 p-3 rounded-md">
                        <div className="text-gray-500 text-xs mb-1">
                          Security Deposit
                        </div>
                        <div className="font-medium">
                          ₹{tenantAgreement.depositAmount?.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/30 p-3 rounded-md">
                        <div className="text-gray-500 text-xs mb-1">
                          Maintenance Charge
                        </div>
                        <div className="font-medium">
                          ₹{tenantAgreement.maintenance?.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-white/30 p-3 rounded-md">
                        <div className="text-gray-500 text-xs mb-1">
                          Rent Due Day
                        </div>
                        <div className="font-medium">
                          {format(tenantAgreement.startDate, "do")} of every
                          month
                        </div>
                      </div>
                    </div>
                  </>
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
                  className="h-5 w-5 mr-2 text-amber-600"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                Terms & Conditions
              </h3>
              <div className="bg-white/30 p-4 rounded-md text-sm">
                {tenantAgreement.terms || "No specific terms provided."}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Document viewer */}
        <div>
          <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Agreement Document
                </h3>
                {tenantAgreement.agreementFile && (
                  <Button variant="outline" size="sm" className="bg-white/50">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>

              {tenantAgreement.agreementFile ? (
                <div className="bg-white/30 rounded-md border border-white/50 h-[500px] flex items-center justify-center">
                  {/* In a real app, this would be a document viewer */}
                  <div className="text-center p-6">
                    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h4 className="font-medium text-gray-700 mb-2">
                      {tenantAgreement.agreementFile}
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      {tenantAgreement.agreementFile.toUpperCase()} •{" "}
                      {tenantAgreement.agreementFile}
                    </p>
                    <Button variant="outline" className="bg-white/50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Open Document
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/30 rounded-md border border-white/50 h-[500px] flex items-center justify-center">
                  <div className="text-center p-6">
                    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h4 className="font-medium text-gray-700 mb-2">
                      No Agreement Document
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      No agreement document has been uploaded yet.
                    </p>
                    <Button variant="outline" className="bg-white/50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Upload Document
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
