import Loading from "@/components/Loading";
import { UserAvatar } from "@/components/Profile";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Header from "@/components/ui/header";
import { useGetGroupQuery } from "@/features/api/groupSlice";
import { Session } from "@/interfaces/schedule";
import { Group, GroupSummary, UserSummary } from "@/interfaces/user";
import { DialogClose } from "@radix-ui/react-dialog";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface GroupBrowserProps {
  session: Session;
  setGroup: (group: Group) => void;
  setGroupAccessPath: (groups: Group[]) => void;
  groupAccessPath: Group[];
}

function GroupBrowser({
  session,
  setGroup,
  setGroupAccessPath,
  groupAccessPath,
}: GroupBrowserProps) {
  const [currentFetchId, setCurrentFetchId] = useState<string | undefined>();
  const {
    data: groupData,
    isFetching,
    error: groupError,
  } = useGetGroupQuery(currentFetchId ?? skipToken);

  // hash map of group id to group
  const [groups, setGroups] = useState<Record<string, Group>>({});
  const [groupAccessPathIds, setGroupAccessPathIds] = useState<string[]>([]);

  const groupAccessLength = groupAccessPathIds.length;
  const groupLoading =
    isFetching &&
    groupAccessPathIds &&
    groupAccessPathIds[groupAccessLength - 1] === currentFetchId;

  // function to fetch group data
  // if group is already fetched, return it from the hash map
  // else fetch it from the server
  async function fetchGroup(id: string) {
    if (groups[id]) return groups[id];
    setCurrentFetchId(id);
  }

  useEffect(() => {
    // from groupAccessPath to hash map

    const newMap = groupAccessPath.reduce((acc, g) => {
      acc[g.id] = g;
      return acc;
    }, {} as Record<string, Group>);

    setGroups(newMap);
    // from groupAccessPath to groupAccessPathIds
    setGroupAccessPathIds(groupAccessPath.map((g) => g.id));
  }, []);

  useEffect(() => {
    if (
      groupAccessLength !== 0 &&
      groups[groupAccessPathIds[groupAccessLength - 1]] === undefined
    ) {
      fetchGroup(groupAccessPathIds[groupAccessLength - 1]);
    }

    // construct groupAccessPath from groupAccessPathIds
    setGroupAccessPath(groupAccessPathIds.map((id) => groups[id]));
  }, [groupAccessPathIds, groups]);

  useEffect(() => {
    if (!groupData) return;
    setGroups((groups) => ({ ...groups, [groupData.id]: groupData }));
  }, [groupData]);

  function goToGroup(id: string) {
    setGroupAccessPathIds([...groupAccessPathIds, id]);
    fetchGroup(id);
  }

  function goBack() {
    setGroupAccessPathIds(
      groupAccessPathIds.slice(0, groupAccessPathIds.length - 1)
    );
  }

  function jumpToGroup(id: string) {
    const index = groupAccessPathIds.indexOf(id);
    if (index === -1) return;
    setGroupAccessPathIds(groupAccessPathIds.slice(0, index + 1));
  }

  function goToRoot() {
    setGroupAccessPathIds([]);
  }

  let groupId =
    groupAccessLength !== 0
      ? groupAccessPathIds[groupAccessLength - 1]
      : undefined;

  let group = groupId ? groups[groupId] : undefined;

  return (
    <div className="space-y-7">
      <Header
        title="Select Group"
        subtitle="You can select a group by navigating through the groups"
      ></Header>
      <div className="flex items-center -ml-2">
        <Button variant="link" onClick={goToRoot}>
          Session Home
        </Button>
        {groupAccessPathIds.map((gId) => {
          const g = groups[gId];
          if (!g) return null;
          return (
            <div key={g.id} className="flex items-center text-sm text-gray-500">
              <ChevronRight size={16}></ChevronRight>
              <Button
                variant="link"
                onClick={() => jumpToGroup(g.id)}
                className="text-sm"
              >
                {g.name}
              </Button>
            </div>
          );
        })}
      </div>
      {groupLoading && <Loading />}
      {groupError && (
        <ErrorMessage
          error={groupError}
          title="Something went wrong while fetching groups"
        />
      )}
      {!groupLoading && !groupError && group && (
        <GroupRender group={group} goToGroup={goToGroup}></GroupRender>
      )}
      {groupAccessPathIds.length === 0 && (
        <div className="flex flex-col gap-1">
          {session.groups.map((g) => (
            <GroupItem group={g} onClick={goToGroup}></GroupItem>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center gap-3">
        {groupAccessLength != 0 && (
          <Button variant={"outline"} onClick={goBack}>
            Go Back
          </Button>
        )}
        {group && group.groupType === 0 && (
          <DialogClose asChild>
            <Button
              onClick={() => {
                group && setGroup(group);
              }}
            >
              Select Group
            </Button>
          </DialogClose>
        )}
      </div>
    </div>
  );
}

function GroupRender({
  group,
  goToGroup,
}: {
  group: Group;
  goToGroup: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-semibold">{group.name}</h1>
      <div className="flex flex-col gap-3">
        {group.groupType === 1 &&
          group.groups.map((g) => (
            <GroupItem group={g} onClick={goToGroup}></GroupItem>
          ))}
        {group.groupType === 0 &&
          group.users.map((u) => <UserItem user={u}></UserItem>)}
      </div>
    </div>
  );
}

function GroupItem({
  group,
  onClick,
}: {
  group: GroupSummary;
  onClick: (id: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-4 bg-slate-100  cursor-pointer p-2 rounded-sm"
      onClick={() => onClick(group.id)}
    >
      <div
        className="w-4 h-4 bg-gray-300 rounded-full"
        style={
          group.color
            ? {
                backgroundColor: group.color,
              }
            : {}
        }
      ></div>
      <div className="text-sm font-medium">{group.name}</div>

      <ChevronRight size="14" className="ml-auto"></ChevronRight>
    </div>
  );
}

function UserItem({ user }: { user: UserSummary }) {
  return (
    <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-sm">
      <UserAvatar user={user}></UserAvatar>
      <div className="text-sm font-medium">
        {user.firstName + " " + user.lastName}
      </div>
    </div>
  );
}

export default GroupBrowser;
