import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Pencil, Trash } from "lucide-react";

interface UserActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  onEdit,
  onDelete,
}) => (
  <div className="relative">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisIcon
          className="h-4 w-4  cursor-pointer"
          aria-label="Open user actions menu"
          style={{ transform: "rotate(90deg)" }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil />
          Edit details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash />
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export default UserActionsMenu;
