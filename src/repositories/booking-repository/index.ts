import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    }, 
    include: {
      Room: true
    }
  });
}

async function reservationExists(userId: number) {
  return prisma.booking.findFirst({
    where: { userId }
  });
}

async function postBooking(bookingParams: bookingData): Promise<Booking> {
  return prisma.booking.create({
    data: bookingParams
  });
}
export type bookingData = Omit<Booking, "id" | "createdAt" | "updatedAt">

async function verifyCapacity(roomId: number) {
  const capacity = await prisma.room.findFirst({
    where: {
      id: roomId
    }
  });
  return capacity.capacity;
}

async function amountBookingsToRoom(roomId: number): Promise<number> {
  return await prisma.booking.count({
    where: {
      roomId,
    }
  });
}

async function verifyRoomId(roomId: number) {
  return await prisma.room.findFirst({
    where: { id: roomId, }
  });
}

async function putBooking(userId: number, roomId: number, bookingId: number): Promise<Booking> {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
      userId,
    }
  });
} 

const bookingRepository = {
  getBooking,
  postBooking,
  verifyCapacity,
  reservationExists,
  amountBookingsToRoom,
  putBooking,
  verifyRoomId
};

export default bookingRepository;
