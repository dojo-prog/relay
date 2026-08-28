import axios from "axios";

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again",
): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (!error.response) {
    if (error.code === "ERR_NETWORK") {
      return "Unable to connect to the server. Please check your internet connection or try again";
    }

    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again";
    }

    return "Unable to connect to the server. Please try again.";
  }

  return error.response?.data?.message ?? fallback;
};
