import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Plus,
} from "lucide-react";

interface TenantDocumentsProps {
  tenant: any;
}

export default function TenantDocuments({ tenant }: TenantDocumentsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDocumentTypeBadge = (type: string) => {
    switch (type) {
      case "agreement":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-blue-300 text-blue-700"
          >
            Agreement
          </Badge>
        );
      case "id_proof":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-green-300 text-green-700"
          >
            ID Proof
          </Badge>
        );
      case "address_proof":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-purple-300 text-purple-700"
          >
            Address Proof
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-white/30 border-gray-300">
            {type}
          </Badge>
        );
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return (
          <div className="h-8 w-8 bg-red-100 text-red-600 rounded flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
        );
      case "jpg":
      case "jpeg":
      case "png":
        return (
          <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        );
      case "doc":
      case "docx":
        return (
          <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 bg-gray-100 text-gray-600 rounded flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
        );
    }
  };

  // Filter documents based on search term
  const filteredDocuments = tenant.documents.filter((doc: any) => {
    return (
      searchTerm === "" ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/50 border border-gray-200"
          />
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
        <CardContent className="p-4">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Documents Found
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {searchTerm
                  ? "No documents match your search criteria."
                  : "No documents have been uploaded for this tenant yet."}
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload First Document
              </Button>
            </div>
          ) : (
            <div className="rounded-md border border-white/50 bg-white/20 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/30">
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc: any) => (
                    <TableRow key={doc.id} className="hover:bg-white/30">
                      <TableCell>
                        <div className="flex items-center">
                          {getFileIcon(doc.fileType)}
                          <div className="ml-3">
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-xs text-gray-500">
                              .{doc.fileType}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getDocumentTypeBadge(doc.type)}</TableCell>
                      <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                      <TableCell>{doc.fileSize}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Upload New Document</h3>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="document-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white/30 hover:bg-white/40 border-gray-300"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG or DOC (MAX. 10MB)
                </p>
              </div>
              <Input id="document-upload" type="file" className="hidden" />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
