import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KeyRound, Pencil, Trash } from "lucide-react";

interface UserActionsMenuProps {
  onEdit: () => void;
  onChangePermission: () => void;
  onDelete: () => void;
}

const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  onEdit,
  onChangePermission,
  onDelete,
}) => (
  <div className="relative">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v.01M12 12v.01M12 18v.01"
            />
          </svg>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil />
          Edit details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onChangePermission}>
          <KeyRound />
          Change permission
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
