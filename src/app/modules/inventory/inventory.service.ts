import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 🔹 Fetch all inventory items
export const getAllInventoryItems = async () => {
  return prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } });
};

// 🔹 Create inventory item
export const createInventoryItem = async (data: {
  name: string;
  category?: string;
  description?: string;
  totalStock: number;
  unitCost: number;
  expiryDate?: Date;
}) => {
  return prisma.inventoryItem.create({ data });
};

// 🔹 Record usage of an inventory item
export const recordItemUsage = async (data: {
  inventoryItemId: string;
  doctorId: string;
  patientId: string;
  quantityUsed: number;
}) => {
  const item = await prisma.inventoryItem.findUnique({
    where: { id: data.inventoryItemId },
  });
  if (!item) throw new Error('Inventory item not found');
  if (item.totalStock < data.quantityUsed)
    throw new Error('Insufficient stock');

  const totalCost = item.unitCost * data.quantityUsed;

  const usage = await prisma.inventoryUsage.create({
    data: {
      inventoryItemId: data.inventoryItemId,
      doctorId: data.doctorId,
      patientId: data.patientId,
      quantityUsed: data.quantityUsed,
      totalCost,
    },
  });

  await prisma.inventoryItem.update({
    where: { id: data.inventoryItemId },
    data: { totalStock: { decrement: data.quantityUsed } },
  });

  return usage;
};

// 🔹 Restock inventory item (updated with oldUnitCost)
export const restockInventoryItem = async (data: {
  inventoryItemId: string;
  supplierName?: string;
  quantityAdded: number;
  unitCost: number;
  restockedById?: string;
}) => {
  // Fetch the current item to get oldUnitCost
  const item = await prisma.inventoryItem.findUnique({
    where: { id: data.inventoryItemId },
  });
  if (!item) throw new Error('Inventory item not found');

  const totalCost = data.unitCost * data.quantityAdded;

  const restock = await prisma.inventoryRestock.create({
    data: {
      inventoryItemId: data.inventoryItemId,
      supplierName: data.supplierName,
      quantityAdded: data.quantityAdded,
      unitCost: data.unitCost,
      oldUnitCost: item.unitCost, // store old unit cost
      totalCost,
      restockedById: data.restockedById,
    },
  });

  // Update item stock and unit cost
  await prisma.inventoryItem.update({
    where: { id: data.inventoryItemId },
    data: {
      totalStock: { increment: data.quantityAdded },
      unitCost: data.unitCost, // update to new unit cost
    },
  });

  return restock;
};

// 🔹 Fetch all restocks
export const getAllRestocks = async () => {
  return prisma.inventoryRestock.findMany({
    include: { inventoryItem: true },
    orderBy: { restockDate: 'desc' },
  });
};

// 🔹 Fetch inventory usage history
export const getInventoryUsageHistory = async () => {
  return prisma.inventoryUsage.findMany({
    include: { inventoryItem: true, doctor: true, patient: true },
    orderBy: { usedDate: 'desc' },
  });
};

// 🔹 Inventory dashboard summary
export const getInventoryDashboard = async () => {
  const totalItems = await prisma.inventoryItem.count();
  const totalStockValue = await prisma.inventoryItem.aggregate({
    _sum: { totalStock: true },
  });
  const totalUsageCost = await prisma.inventoryUsage.aggregate({
    _sum: { totalCost: true },
  });
  const totalRestockCost = await prisma.inventoryRestock.aggregate({
    _sum: { totalCost: true },
  });

  return {
    totalItems,
    totalStock: totalStockValue._sum.totalStock || 0,
    totalUsageCost: totalUsageCost._sum.totalCost || 0,
    totalRestockCost: totalRestockCost._sum.totalCost || 0,
  };
};
