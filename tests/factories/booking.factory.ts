import { prisma } from "@/config";

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export async function verifyBooking(bookingId: number) {
  return await prisma.booking.findFirst({
    where: {
      id: bookingId
    }
  });
}
