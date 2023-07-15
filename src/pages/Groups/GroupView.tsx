import ColorBanner from "@/components/ColorBanner";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import { ErrorMessage } from "@/components/ui/Alert";
import Header from "@/components/ui/header";
import { useGetGroupQuery } from "@/features/api/groupSlice";
import { useParams } from "react-router";
import { GroupItem, UserItem, ScheduleItem } from "../Attendance/GroupBrowser";

function GroupView() {
  const { id } = useParams();

  const {
    data: group,
    isLoading: groupLoading,
    error: groupError,
  } = useGetGroupQuery(id ?? "", { skip: !id });

  if (groupLoading) return <Loading />;

  if (!id) return <div>Group not found</div>;

  return (
    <Container>
      {group && (
        <ColorBanner color={group?.color}>
          <Header
            title={group.name}
            subtitle={
              group.groupType === 0 ? "Group of Users" : "Group of Groups"
            }
            className="text-white"
            subtitleClassName="text-gray-200"
            editUrl={`/groups/create?id=${group.id}`}
          ></Header>
        </ColorBanner>
      )}
      <ErrorMessage error={groupError}></ErrorMessage>
      <div className="space-y-7">
        <div className="space-y-5">
          <h2 className="font-medium">Schedule</h2>
          {group?.schedule ? (
            <ScheduleItem schedule={group?.schedule} />
          ) : (
            <div>No schedule</div>
          )}
        </div>
        {group?.groupType === 1 && (
          <div className="space-y-5">
            <h2 className="font-medium">Groups</h2>
            <div className="space-y-3">
              {group?.groups.map((group) => (
                <GroupItem key={group.id} group={group} />
              ))}
            </div>
          </div>
        )}
        {group?.groupType === 0 && (
          <div className="space-y-5">
            <h2 className="font-medium">Users</h2>
            <div className="space-y-3">
              {group?.users.map((user) => (
                <UserItem user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default GroupView;
