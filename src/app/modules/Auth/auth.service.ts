import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";

import { jwtHelpers } from "../../../helpars/jwtHelpers";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password Incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcd",
    "5m"
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcde",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPassowordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  console.log("Refresh Token", token);
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
