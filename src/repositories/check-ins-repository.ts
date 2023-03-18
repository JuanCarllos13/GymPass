import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByIdDate(userId: string, date: Date): Promise<CheckIn | null>;
}
