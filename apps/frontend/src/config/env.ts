const getReqEnv = (name: string): string => {
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
  socketUrl: getReqEnv("VITE_SOCKET_URL"),

  devApiUrl: getReqEnv("VITE_DEV_API_URL"),
  devSocketUrl: getReqEnv("VITE_DEV_SOCKET_URL"),
} as const;

export { env };
