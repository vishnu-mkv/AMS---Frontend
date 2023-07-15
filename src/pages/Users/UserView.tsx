import ColorBanner from "@/components/ColorBanner";
import Loading from "@/components/Loading";
import { ErrorMessage } from "@/components/ui/Alert";
import Header from "@/components/ui/header";
import { useGetUserQuery } from "@/features/api/usersSlics";
import { toTitleCase } from "@/lib/utils";
import { useParams } from "react-router";
import { GroupItem, RoleItem, ScheduleItem } from "../Attendance/GroupBrowser";
import Container from "@/components/Container";
import { CalendarIcon, KeyIcon, LogInIcon, PersonStanding } from "lucide-react";
import moment from "moment";

function UserView() {
  const { id } = useParams();

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useGetUserQuery(id ?? "", { skip: !id });

  if (userLoading) return <Loading />;

  if (!id) return <div>User not found</div>;

  return (
    <Container>
      {user && (
        <ColorBanner imageUrl={user?.picture}>
          <Header
            title={toTitleCase(user.firstName + " " + user.lastName)}
            className="text-white"
            subtitleClassName="text-gray-200"
            editUrl={`/users/create?id=${user.id}`}
          ></Header>
        </ColorBanner>
      )}
      <ErrorMessage error={userError}></ErrorMessage>
      <div className="space-y-7">
        <div className="pt-4 pb-7 grid grid-cols-[max-content_max-content_auto] gap-7 gap-y-5 items-center">
          <CalendarIcon size="14"></CalendarIcon>
          <span className="font-medium">Birthday</span>
          <span>
            {user?.dob ? moment(user?.dob).format("MMMM Do YYYY") : "-"}
          </span>
          <PersonStanding size="14"></PersonStanding>
          <span className="font-medium">Gender</span>
          <span>{user?.gender ? user.gender : "-"}</span>
          <LogInIcon size={14}></LogInIcon>
          <span className="font-medium">Can Login</span>
          <span>{user?.signInAllowed ? "Yes" : "No"}</span>
          <KeyIcon size="14"></KeyIcon>
          <span className="font-medium">User Name</span>
          <span>{user?.userName ? user.userName : "-"}</span>
        </div>
        <div className="space-y-5">
          <h2 className="font-medium">Groups</h2>
          <div className="space-y-3">
            {user?.groups.map((group) => (
              <GroupItem key={group.id} group={group} />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <h2 className="font-medium">Roles</h2>
          <div className="space-y-3">
            {user?.roles.map((role) => (
              <RoleItem key={role.id} role={role} />
            ))}
          </div>
          <div className="space-y-5">
            <h2 className="font-medium">Schedule</h2>
            {user?.schedule ? (
              <ScheduleItem schedule={user?.schedule} />
            ) : (
              <div>No schedule</div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default UserView;
