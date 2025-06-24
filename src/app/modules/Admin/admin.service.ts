import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {
  console.log({ params });
  const result = await prisma.admin.findMany({
    where: {
      name: {
        contains: params.searchTerm,
        mode: "insensitive",
      },
    },
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
};
