import { Prisma, PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {
  const addConditions: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    addConditions.push({
      OR: ["name", "email"].map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  console.dir(addConditions, { depth: "infinity" });
  const whereConditions: Prisma.AdminWhereInput = { AND: addConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
};
