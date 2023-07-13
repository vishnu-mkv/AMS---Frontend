import ColorPicker from "@/components/ColorPicker";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import { ErrorMessage } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Fields";
import Header from "@/components/ui/header";
import {
  useCreateTopicMutation,
  useGetTopicQuery,
  useUpdateTopicMutation,
} from "@/features/api/TopicSlice";
import { CreateTopic } from "@/interfaces/schedule";
import { Form, FormSubmit } from "@radix-ui/react-form";
import React, { FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function TopicCreator() {
  // get id from url search params

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const mode = id ? "edit" : "create";

  const {
    data: topic,
    isLoading: topicLoading,
    error: topicError,
  } = useGetTopicQuery(id ?? "", { skip: !id });

  const [createTopic, { isLoading: loading, error, data }] =
    useCreateTopicMutation();

  const [
    updateTopic,
    { isLoading: updateLoading, error: updateError, data: updateData },
  ] = useUpdateTopicMutation();

  const [newTopic, setNewTopic] = React.useState<CreateTopic>({
    name: "",
    color: "",
  });

  const navigate = useNavigate();

  function onChange(key: string, value: any) {
    setNewTopic({ ...newTopic, [key]: value });
  }

  useEffect(() => {
    if (data) {
      navigate(`/topics/${data.id}`);
    }
    if (updateData) {
      navigate(`/topics/${updateData.id}`);
    }
  }, [data, updateData]);

  useEffect(() => {
    if (topic) {
      setNewTopic(topic);
    }
  }, [topic]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (mode === "create") {
      createTopic(newTopic);
    } else {
      if (!topic?.id) return;
      updateTopic({ id: topic.id, ...newTopic });
    }
  }

  if (topicLoading) return <Loading />;

  return (
    <Container className="space-y-10">
      <Header
        title={mode === "create" ? "Create Topic" : "Edit Topic"}
        subtitle={mode === "create" ? "" : topic?.name}
      ></Header>
      <Form onSubmit={onSubmit} className="space-y-7">
        <ColorPicker
          color={newTopic.color}
          setColor={(color) => {
            onChange("color", color);
          }}
        ></ColorPicker>

        <ErrorMessage error={error || updateError || topicError}></ErrorMessage>
        <Input
          field={{
            type: "input",
            props: {
              required: true,
              name: "name",
              placeholder: "Enter topic name",
              value: newTopic?.name,
              onChange: (e) => {
                onChange("name", e.target.value);
              },
              type: "text",
            },
          }}
          label={{
            children: "Name",
          }}
        ></Input>
        <FormSubmit asChild>
          <Button
            width={"fullWidth"}
            loader={{
              loading: mode === "create" ? loading : updateLoading,
              text: mode === "create" ? "Creating" : "Saving",
            }}
          >
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </FormSubmit>
      </Form>
    </Container>
  );
}

export default TopicCreator;
