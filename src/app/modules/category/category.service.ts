import prisma from '../../../shared/prisma';

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};

export const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name: name.trim() },
  });
};

export const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
  });
};
