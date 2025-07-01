import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcd",
    {
      algorithm: "HS256",
      expiresIn: "5m",
    }
  );

  const refreshToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcde",
    {
      algorithm: "HS256",
      expiresIn: "30d",
    }
  );

  return {
    accessToken,
    refreshToken,
    needPassowrdChange: userData.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};
