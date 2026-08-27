import { ConversationSpecificQuery } from "../../schemas/conversations";

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
