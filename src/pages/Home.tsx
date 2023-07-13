import { authAtom } from "@/atoms/UserAtom";
import Header from "@/components/ui/header";
import { toTitleCase } from "@/lib/utils";
import { useAtom } from "jotai";

function Home() {
  const [{ user }] = useAtom(authAtom);

  return (
    <div>
      <Header
        title={`Welcome ${toTitleCase(
          user?.firstName + " " + user?.lastName
        )} !`}
        subtitle={`Organization: `}
        highlight={user?.organization.name}
      ></Header>
    </div>
  );
}

export default Home;
