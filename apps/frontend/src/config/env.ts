const getReqEnv = async (name: string) => {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const env = {
  appName: getReqEnv("VITE_APP_NAME"),
  environment: getReqEnv("VITE_ENVIRONMENT"),
  apiUrl: getReqEnv("VITE_API_URL"),
} as const;

export { env };
