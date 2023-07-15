import ColorBanner from "@/components/ColorBanner";
import Loading from "@/components/Loading";
import { ErrorMessage } from "@/components/ui/Alert";
import Header from "@/components/ui/header";
import { useGetRoleQuery } from "@/features/api/authSlice";
import { useParams } from "react-router";
import PermissionList from "./PermissionList";
import Container from "@/components/Container";
import { UserItem } from "../Attendance/GroupBrowser";

function RoleView() {
  const { id } = useParams();

  const {
    data: role,
    isLoading: roleLoading,
    error: roleError,
  } = useGetRoleQuery(id ?? "", { skip: !id });

  if (roleLoading) return <Loading />;

  if (!id) return <div>Role not found</div>;

  return (
    <div>
      <Container className="space-y-8">
        {role && (
          <ColorBanner color={role?.color}>
            <Header
              title={role.name}
              subtitle={role.description}
              className="text-white"
              subtitleClassName="text-gray-200"
              editUrl={`/roles/create?id=${role.id}`}
            ></Header>
          </ColorBanner>
        )}
        <ErrorMessage error={roleError}></ErrorMessage>

        <div className="space-y-5 mt-5">
          <h2>Permissions</h2>
          <PermissionList
            items={role?.permissions ?? []}
            hideHeader
          ></PermissionList>
        </div>

        <div className="space-y-5 mt-5">
          <h2>Users</h2>
          {role?.users.length === 0 ? (
            <div>No users have this role</div>
          ) : (
            <div className="space-y-2">
              {role?.users.map((user) => (
                <UserItem user={user} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default RoleView;
