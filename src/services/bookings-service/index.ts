import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { forbiddenError } from "@/errors/forbiden-error";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function verifyTicketEnrollmentAndReservation(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getBooking(userId: number) {
  await verifyTicketEnrollmentAndReservation(userId);
  
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function postBooking(userId: number, roomId: number) {
  await verifyTicketEnrollmentAndReservation(userId);

  const verifyExistRoom = await bookingRepository.verifyRoomId(roomId);
  if (!verifyExistRoom) throw notFoundError();

  const reservationExists = await bookingRepository.reservationExists(userId);
  if (reservationExists) throw forbiddenError("user already has reservation");

  const capacityRoom = await bookingRepository.verifyCapacity(roomId);  
  const amountBookingsToRoom = await bookingRepository.amountBookingsToRoom(roomId);
  const availableVacancies = capacityRoom - amountBookingsToRoom;
  if (availableVacancies === 0) throw forbiddenError("no vacancies available");

  const bookingParams = { userId, roomId };
  const booking = await bookingRepository.postBooking(bookingParams);
  return booking;
}

async function putBooking(userId: number, roomId: number, bookingId: number) {
  await verifyTicketEnrollmentAndReservation(userId);

  const reservationExists = await bookingRepository.reservationExists(userId);
  if (!reservationExists) throw notFoundError();

  const amountBookingsToRoom = await bookingRepository.amountBookingsToRoom(roomId);
  if(amountBookingsToRoom !== 0) throw forbiddenError("room is not free");
  
  const booking = await bookingRepository.putBooking(userId, roomId, bookingId);
  return booking;
}

const bookingService = {
  getBooking,
  postBooking,
  putBooking
};

export default bookingService;
