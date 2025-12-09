import { Patient, Prisma, UserStatus } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IPatientFilterRequest, IPatientUpdate } from './patient.interface';
import { patientSearchableFields } from './patient.constants';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';

/**
 * GET ALL PATIENTS
 */
const getAllFromDB = async (
  filters: IPatientFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<any[]>> => {
  // Default limit 1000 per page
  if (!options.limit) options.limit = 1000;

  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  andConditions.push({ isDeleted: false });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Default orderBy oldest first
  const orderByObj =
    options.sortBy && options.sortOrder
      ? { [options.sortBy]: options.sortOrder }
      : { createdAt: 'asc' }; // ✅ oldest first

  const result = await prisma.patient.findMany({
    include: {
      medicalReport: true,
      patientHelthData: true,
      appointments: {
        include: { doctor: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy: orderByObj,
  });

  const total = await prisma.patient.count({ where: whereConditions });

  const mapped = result.map((p, idx) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    contactNumber: p.contactNumber,
    createdAt: p.createdAt,
    serial: skip + idx + 1, // ✅ fixed serial number across pages
    doctor: p.appointments?.[0]?.doctor
      ? { id: p.appointments[0].doctor.id, name: p.appointments[0].doctor.name }
      : null,
  }));

  return { meta: { total, page, limit }, data: mapped };
};

/**
 * GET BY ID
 */
const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  return prisma.patient.findUnique({
    where: { id },
    include: { medicalReport: true, patientHelthData: true },
  });
};

/**
 * GET PROFILE
 */
const getProfileById = async (id: string) => {
  const patient = await prisma.patient.findUnique({
    where: { id, isDeleted: false },
    include: {
      patientHelthData: true,
      medicalReport: true,
      appointments: {
        include: { doctor: true, prescription: true, review: true },
        orderBy: { createdAt: 'desc' },
      },
      inventoryUsage: { include: { inventoryItem: true } },
    },
  });

  if (!patient) throw new ApiError(httpStatus.NOT_FOUND, 'Patient not found');
  return patient;
};

/**
 * CREATE PATIENT
 */
const createIntoDB = async (payload: IPatientUpdate): Promise<Patient> => {
  return await prisma.$transaction(async tx => {
    const defaultPassword = payload.password || 'default123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: 'PATIENT',
        status: 'ACTIVE',
        needPasswordChange: true,
      },
    });

    const patient = await tx.patient.create({
      data: {
        userId: user.id,
        name: payload.name,
        profilePhoto: payload.profilePhoto,
        contactNumber: payload.contactNumber,
        address: payload.address,
      },
    });

    if (payload.patientHelthData) {
      await tx.patientHelthData.create({
        data: { patientId: patient.id, ...payload.patientHelthData },
      });
    }

    if (payload.medicalReport) {
      await tx.medicalReport.create({
        data: { patientId: patient.id, ...payload.medicalReport },
      });
    }

    return patient;
  });
};

/**
 * UPDATE PATIENT
 */
const updateIntoDB = async (
  id: string,
  payload: Partial<IPatientUpdate>,
): Promise<Patient | null> => {
  const { patientHelthData, medicalReport, ...patientData } = payload;

  await prisma.$transaction(async tx => {
    const result = await tx.patient.update({
      include: { medicalReport: true, patientHelthData: true },
      where: { id },
      data: patientData,
    });

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update Patient');

    if (result.patientHelthData && patientHelthData) {
      await tx.patientHelthData.update({
        where: { id: result.patientHelthData.id },
        data: patientHelthData,
      });
    } else if (!result.patientHelthData && patientHelthData) {
      await tx.patientHelthData.create({
        data: { patientId: id, ...patientHelthData },
      });
    }

    if (medicalReport) {
      await tx.medicalReport.create({
        data: { patientId: id, ...medicalReport },
      });
    }
  });

  return prisma.patient.findUnique({
    where: { id },
    include: { medicalReport: true, patientHelthData: true },
  });
};

/**
 * HARD DELETE PATIENT
 */
const deleteFromDB = async (id: string): Promise<Patient> => {
  return prisma.$transaction(async tx => {
    await tx.patientHelthData.deleteMany({ where: { patientId: id } });
    await tx.medicalReport.deleteMany({ where: { patientId: id } });

    const deletedPatient = await tx.patient.delete({ where: { id } });
    await tx.user.delete({ where: { id: deletedPatient.userId } });

    return deletedPatient;
  });
};

/**
 * SOFT DELETE PATIENT
 */
const softDelete = async (id: string): Promise<Patient> => {
  return prisma.$transaction(async tx => {
    const deletedPatient = await tx.patient.update({
      where: { id },
      data: { isDeleted: true },
    });

    await tx.user.update({
      where: { id: deletedPatient.userId },
      data: { status: UserStatus.BLOCKED },
    });

    return deletedPatient;
  });
};

export const PatientService = {
  getAllFromDB,
  getByIdFromDB,
  getProfileById,
  createIntoDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};
