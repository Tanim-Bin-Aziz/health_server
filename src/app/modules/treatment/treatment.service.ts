import prisma from '../../../shared/prisma';
import { Prisma } from '@prisma/client';

export const getAllTreatments = async (
  search?: string,
  categoryId?: string,
) => {
  const where: Prisma.TreatmentWhereInput = {};

  if (search) {
    where.name = {
      contains: search,
      mode: Prisma.QueryMode.insensitive,
    };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  return prisma.treatment.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getTreatmentById = async (id: string) => {
  return prisma.treatment.findUnique({
    where: { id },
    include: { category: true },
  });
};

export const createTreatment = async (data: {
  name: string;
  price: number;
  categoryId: string;
}) => {
  return prisma.treatment.create({
    data: {
      name: data.name,
      price: data.price,
      categoryId: data.categoryId,
    },
    include: { category: true },
  });
};

export const updateTreatmentPrice = async (id: string, price: number) => {
  return prisma.treatment.update({
    where: { id },
    data: { price },
    include: { category: true },
  });
};

export const deleteTreatment = async (id: string) => {
  return prisma.treatment.delete({
    where: { id },
  });
};
