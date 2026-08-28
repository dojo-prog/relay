import { ConversationSpecificQuery } from "@relay/shared";

const buildConversationSpecificFilters = (
  specific: ConversationSpecificQuery,
  baseConditions: string[] = [],
  baseValues: unknown[] = [],
) => {
  const conditions = [...baseConditions];
  const values = [...baseValues];

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
