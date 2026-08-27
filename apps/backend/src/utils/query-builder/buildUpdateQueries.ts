interface BuildUpdateQueriesResult {
  setClause: string;
  values: unknown[];
}

const buildUpdateQueries = <T extends object>(
  changes: T,
): BuildUpdateQueriesResult => {
  const entries = Object.entries(changes);

  const setFields = entries.map(([k], i) => `${k} = $${i + 1}`).join(", ");
  const values = entries.map(([_, value]) => value);

  return {
    setClause: `SET ${setFields}`,
    values,
  };
};

export default buildUpdateQueries;
