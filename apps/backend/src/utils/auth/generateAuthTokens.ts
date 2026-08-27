import jwt from "jsonwebtoken";
import ENV from "../../config/env";

const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: "3d",
  });
};

export { generateAccessToken, generateRefreshToken };
