import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";

export async function runWithTryCatchBadRequestE<T>(callback: () => Promise<T>) {
    try {
      return await callback();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

export async function runWithTryCatchNotFoundE<T>(callback: () => Promise<T>) {
    try {
      return await callback();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }