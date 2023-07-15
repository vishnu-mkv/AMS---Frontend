import ColorBanner from "@/components/ColorBanner";
import Loading from "@/components/Loading";
import { ErrorMessage } from "@/components/ui/Alert";
import Header from "@/components/ui/header";
import { useGetTopicQuery } from "@/features/api/TopicSlice";
import { useParams } from "react-router";

function TopicView() {
  const { id } = useParams();

  const {
    data: topic,
    isLoading: topicLoading,
    error: topicError,
  } = useGetTopicQuery(id ?? "", { skip: !id });

  if (topicLoading) return <Loading />;

  if (!id) return <div>Topic not found</div>;

  return (
    <div>
      {topic && (
        <ColorBanner color={topic?.color}>
          <Header
            title={topic.name}
            subtitle="Topic"
            className="text-white"
            subtitleClassName="text-gray-200"
            editUrl={`/topics/create?id=${topic.id}`}
          ></Header>
        </ColorBanner>
      )}
      <ErrorMessage error={topicError}></ErrorMessage>
    </div>
  );
}

export default TopicView;
