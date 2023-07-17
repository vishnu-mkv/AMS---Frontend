import * as Form from "@radix-ui/react-form";
import { FunctionComponent, ReactNode } from "react";
import { BaseTextareaProps, Textarea } from "./textarea";
import { BaseInput, BaseInputProps } from "./input";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Label } from "./label";
import { Checkbox } from "./checkbox";
import clsx from "clsx";
import { cn } from "@/lib/utils";

interface TextAreaProps {
  type: "textarea";
  props: BaseTextareaProps;
}

interface PhoneProps {
  type: "phone";
  props: {
    value: string | undefined;
    onChange: (value: string) => void;
    name: string;
    required: boolean;
    readOnly?: boolean;
  };
}

interface InputProps {
  type: "input";
  props: BaseInputProps;
}

type CheckboxPropsType = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;

interface CheckboxProps {
  type: "checkbox";
  props: CheckboxPropsType;
}

type SelectRootProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Root
>;
interface BaseSelectProps<T> extends SelectRootProps {
  data: T[];
  getValue: (item: T) => string;
  getText: (item: T) => string;
  getExtras?: (item: T) => string;
  placeholder?: string;
  className?: string;
}

interface SelectProps<T = {}> {
  type: "select";
  props: BaseSelectProps<T>;
}

type BaseInputElementProps<T = {}> =
  | TextAreaProps
  | InputProps
  | CheckboxProps
  | SelectProps<T>
  | PhoneProps;

export interface InputElementProps<T = {}> {
  field: BaseInputElementProps<T>;
  label?: React.ComponentProps<typeof LabelPrimitive.Root>;
  messages?: Form.FormMessageProps[];
  className?: string;
}

export const ErrorMessage = ({
  match,
}: {
  children: ReactNode;
  match: boolean | undefined;
}) => {
  return (
    <div
      className={clsx("text-red-500 block my-1 text-sm", { hidden: match })}
    ></div>
  );
};

export const FormMessage: FunctionComponent<Form.FormMessageProps> = (
  props
) => {
  return (
    <Form.Message
      className="text-red-500 block my-1 text-sm"
      {...props}
    ></Form.Message>
  );
};

function GenerateMessages({
  field: { props },
  messages = [],
  label,
}: InputElementProps) {
  const newMessages: Form.FormMessageProps[] = [];
  const availableKeys = new Set(messages?.map((item) => item.match));

  if (props.required && !availableKeys.has("valueMissing")) {
    newMessages.push({
      children: `${label?.children || props.name} is required`,
      name: props.name,
      match: "valueMissing",
    });
  }

  if (!availableKeys.has("typeMismatch")) {
    newMessages.push({
      children: `Please provide a valid ${label?.children ?? props.name}`,
      name: props.name,
      match: "typeMismatch",
    });
  }

  return (
    <>
      {messages?.concat(newMessages).map((item) => {
        return (
          <FormMessage {...item} key={`message-${props.name}-${item.match}`} />
        );
      })}
    </>
  );
}

export function Input<T = {}>({
  field,
  messages = [],
  label,
  className,
}: InputElementProps<T>) {
  let labelComp = label ? (
    <Form.Label className="" asChild>
      <Label {...label} className={field.type === "checkbox" ? "mb-0" : ""} />
    </Form.Label>
  ) : (
    <></>
  );

  const { type, props: _props } = field;

  let inputBase;

  let props: any = _props;
  switch (type) {
    case "checkbox":
      inputBase = <Checkbox {...props}></Checkbox>;
      break;
    case "input":
      inputBase = <BaseInput {...props}></BaseInput>;
      break;
    case "select":
      inputBase = (
        <Select className="w-full" {...props}>
          <SelectTrigger className={cn("w-full", props.className)}>
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* <SelectLabel>{placeholder}</SelectLabel> */}
              {props.data?.map((item: T) => {
                let val = props.getValue(item);
                return (
                  <SelectItem
                    key={`select-${val}-${props.name}`}
                    value={val}
                    extras={props.getExtras && props.getExtras(val)}
                  >
                    {props.getText(item)}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      break;
    case "textarea":
      inputBase = <Textarea {...props} />;
      break;
    default:
      inputBase = <></>;
  }

  let InputComp = <Form.Control asChild>{inputBase}</Form.Control>;

  return (
    <Form.Field
      className={cn(
        field.type === "checkbox" ? "my-2 mb-5" : "my-5",
        className
      )}
      name={field.props.name || ""}
    >
      {field.type === "checkbox" ? (
        <div className="flex gap-2 items-center">
          {InputComp}
          {labelComp}
        </div>
      ) : (
        <>
          {labelComp}
          {InputComp}
        </>
      )}
      <GenerateMessages
        field={field as any}
        messages={messages}
        label={label}
      ></GenerateMessages>
    </Form.Field>
  );
}
