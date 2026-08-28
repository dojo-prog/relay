import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateConversationBodySchema,
  type CreateConversationBody,
} from "@relay/shared";
import { Controller, useForm } from "react-hook-form";
import DirectConversationInput from "./DirectConversationInput";
import GroupConversationInputs from "./GroupConversationInputs";

const CreateConversationForm = () => {
  const form = useForm<CreateConversationBody>({
    resolver: zodResolver(CreateConversationBodySchema),
    defaultValues: {
      type: "direct",
      name: "",
      memberIds: [],
    },
  });

  const type = form.watch("type");
  const memberIds = form.watch("memberIds");

  const onSubmit = (values: CreateConversationBody) => {
    console.log(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Conversation type */}
      <Controller
        name="type"
        control={form.control}
        render={({ field }) => (
          <ToggleGroup
            variant="outline"
            value={[field.value]}
            onValueChange={(values) => {
              const value = values[0];

              if (value) {
                field.onChange(value);
              }

              form.setValue("name", "");
              form.setValue("memberIds", [], {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            className="mb-4 w-full"
          >
            <ToggleGroupItem value="direct" className="flex-1">
              Direct
            </ToggleGroupItem>

            <ToggleGroupItem value="group" className="flex-1">
              Group
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      />

      {/* Direct conversation */}
      {type === "direct" && <DirectConversationInput form={form} />}

      {/* Group conversation */}
      {type === "group" && <GroupConversationInputs form={form} />}

      {memberIds!.length > 0 && (
        <Button type="submit" className="mt-4 w-full">
          Create conversation
        </Button>
      )}
    </form>
  );
};

export default CreateConversationForm;
