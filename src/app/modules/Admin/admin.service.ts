import { Prisma } from "../../../generated/prisma";
import { paginationHelpar } from "../../../helpars/paginationHelpar";
import prisma from "../../../shared/prisma";
import { adminSearchAblefields } from "./admin.constant";

const getAllFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelpar.calculatePagination(options);
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
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const AdminService = {
  getAllFromDB,
};
