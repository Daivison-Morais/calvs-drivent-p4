import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/bookings-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(Number(userId));
    
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const roomId = Number(req.body.roomId);
    if (!roomId) return res.sendStatus(httpStatus.BAD_REQUEST);

    const booking = await bookingService.postBooking(Number(userId), roomId);

    return res.status(httpStatus.OK).send({ "bookingId": booking.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const roomId = Number(req.body.roomId);
    if (!roomId) return res.sendStatus(httpStatus.BAD_REQUEST);

    const bookingId = Number(req.params.bookingId);
    if(bookingId <= 0) return res.sendStatus(httpStatus.NOT_FOUND);

    const booking = await bookingService.putBooking(userId, roomId, bookingId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
