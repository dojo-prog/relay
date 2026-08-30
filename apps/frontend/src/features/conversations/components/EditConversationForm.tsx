import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateConversationInputSchema,
  type ConversationWithRelations,
  type UpdateConversationInput,
} from "@relay/shared";
import { useForm } from "react-hook-form";
import { useUpdateConversation } from "../hooks/useUpdateConversation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditConversationFormProps {
  conversation: ConversationWithRelations;
  onSuccess: () => void;
}

const EditConversationForm = ({
  conversation,
  onSuccess,
}: EditConversationFormProps) => {
  const form = useForm<UpdateConversationInput>({
    resolver: zodResolver(UpdateConversationInputSchema),
    defaultValues: {
      conversationId: conversation.id,
      modified: {
        name: conversation.name ?? "",
      },
    },
  });

  const { mutateAsync: updateConversation, isPending } =
    useUpdateConversation();

  const onSubmit = async (data: UpdateConversationInput) => {
    try {
      await updateConversation(data);

      toast.success("Conversation updated");

      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Group Name</FieldLabel>

        <Input
          id="name"
          placeholder="Group name"
          {...form.register("modified.name")}
        />

        {form.formState.errors.modified?.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.modified.name.message}
          </p>
        )}
      </Field>

      <Button type="submit" className="w-full">
        {!isPending ? (
          "Save Changes"
        ) : (
          <Loader2 className="size-5 animate-spin" />
        )}
      </Button>
    </form>
  );
};

export default EditConversationForm;
