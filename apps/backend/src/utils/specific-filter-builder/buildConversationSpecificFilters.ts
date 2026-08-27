import { ConversationSpecificQuery } from "@relay/shared";

const buildConversationSpecificFilters = (
  specific: ConversationSpecificQuery,
) => {
  const conditions = [];
  const values = [];

  const { type } = specific;

  if (type) {
    values.push(type);

    conditions.push(`c.type = $${values.length}`);
  }

  return {
    conditions,
    values,
  };
};

export default buildConversationSpecificFilters;
