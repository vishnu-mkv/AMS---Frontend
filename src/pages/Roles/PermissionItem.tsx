import { Permission } from "@/interfaces/user";
import { toTitleCase } from "@/lib/utils";

interface PermissionItemProps {
  permission: Permission;
}

function PermissionItem({ permission }: PermissionItemProps) {
  return (
    <div className="bg-terinary rounded-sm p-3 px-5 gap-10 w-full space-y-2 min-w-[400px]">
      <h2 className="text-gray-700 font-medium">
        {toTitleCase(permission.name)}
      </h2>
      {/* <span className="text-gray-500 text-sm">{permission.description}</span> */}
    </div>
  );
}

export default PermissionItem;
