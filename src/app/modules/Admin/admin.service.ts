import { Prisma, PrismaClient } from "../../../generated/prisma";
import { adminSearchAblefields } from "./admin.constant";

const prisma = new PrismaClient();

const getAllFromDB = async (params: any, options: any) => {
  const { page, limit } = options;
  const andConditions: Prisma.AdminWhereInput[] = [];

  const { searchTerm, ...filterData } = params;

  // console.log(filterData);

  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchAblefields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  // console.dir(andConditions, { depth: "infinity" });
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip: (Number(page) - 1) * limit,
    take: Number(limit),
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
};
