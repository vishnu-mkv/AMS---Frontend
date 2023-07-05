import { authAtom } from "@/atoms/UserAtom";
import { Logo2 } from "@/components/Logo";
import { ErrorMessage, Message } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Fields";
import Header from "@/components/ui/header";
import { useLoginMutation } from "@/features/api/authSlice";
import { getFormData } from "@/lib/utils";
import * as Form from "@radix-ui/react-form";
import { useAtom } from "jotai";
import { FormEvent, FormEventHandler, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

function Login() {
  const [login, { isLoading, error, data }] = useLoginMutation();

  const [_, setAuthState] = useAtom(authAtom);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (!data) return;

    setAuthState(data);
    navigate("/");
  }, [data]);

  async function handleLoginIn(e: FormEvent<HTMLFormElement>) {
    await login(getFormData(e));
  }

  function getInfoMessage() {
    if (searchParams.get("code") == "loginRequired")
      return "You need to login to access this page";
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className=" rounded-md shadow-md bg-white w-full max-w-[900px] lg:flex gap-10">
        <Logo2 className="rounded-tl-md rounded-tr-md lg:rounded-tr-none lg:rounded-bl-md "></Logo2>
        <div className="grow mt-10 lg:mt-0 p-5 py-10">
          <Header
            title="Sign In"
            subtitle="Enter your login credentials"
          ></Header>
          <ErrorMessage title="Login Failed" error={error}></ErrorMessage>

          {!error && (
            <Message
              title="Please Login"
              message={getInfoMessage() || ""}
            ></Message>
          )}
          <Form.Root onSubmit={handleLoginIn}>
            <Input
              field={{
                props: { name: "username", type: "text", required: true },
                type: "input",
              }}
              label={{ children: "User Name" }}
            />
            <Input
              field={{
                props: { name: "password", type: "password", required: true },
                type: "input",
              }}
              label={{ children: "Password" }}
            />
            <Form.Submit asChild>
              <Button
                width="fullWidth"
                className="mt-6"
                loader={{ loading: isLoading, text: "Signing you in..." }}
              >
                Sign in
              </Button>
            </Form.Submit>
          </Form.Root>
        </div>
      </div>
    </div>
  );
}

export default Login;
