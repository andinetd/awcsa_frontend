"use client";

import { useGetEdirMembersQuery } from "@/hooks/social-affairs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import EdirMemberForm from "./edir-member-form";
import ImportEdirMembersDialog from "./import-edir-members-dialog";

interface EdirMembersListProps {
  associationId: number;
}

export default function EdirMembersList({
  associationId,
}: EdirMembersListProps) {
  const {
    data: members,
    isLoading,
    isError,
  } = useGetEdirMembersQuery(associationId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        Failed to load members.
      </div>
    );
  }

  const memberList = members || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Members ({memberList.length})</h3>
        <div className="flex items-center gap-2">
          <ImportEdirMembersDialog />
          <EdirMemberForm associationId={associationId} />
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Edir ID</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No members found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              memberList.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.fullName}
                  </TableCell>
                  <TableCell>{member.edirIdNumber}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {member.position}
                    </span>
                  </TableCell>
                  <TableCell>{member.phoneNumber}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <EdirMemberForm
                      associationId={associationId}
                      initialData={member}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
