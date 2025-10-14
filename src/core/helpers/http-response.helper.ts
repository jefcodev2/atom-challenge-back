import { Response } from 'express';
import { HttpResponseDto } from '../dto/http-response.dto';

export class HttpResponse {

  static success(
    res: Response,
    data: Record<string, unknown> | Record<string, unknown>[],
    message?: string
  ): Response {
    const response = new HttpResponseDto({
      status_code: 200,
      message,
      data,
    });

    return res.status(response.status_code).json(response.toJSON());
  }


  static created(
    res: Response,
    data: any,
    message?: string
  ): Response {
    const response = new HttpResponseDto({
      status_code: 201,
      message,
      data,
    });

    return res.status(response.status_code).json(response.toJSON());
  }


  static badRequest(
    res: Response,
    message: string,
    data?: Record<string, unknown> | Record<string, unknown>[]
  ): Response {
    const response = new HttpResponseDto({
      status_code: 400,
      data: data || {},
      message: message,
    });

    return res.status(response.status_code).json(response.toJSON());
  }


  static serverError(
    res: Response,
    message: string = 'Error interno del servidor',
    error?: string,
    data?: Record<string, unknown> | Record<string, unknown>[]
  ): Response {
    const response = new HttpResponseDto({
      status_code: 500,
      data: data || {},
      message: message,
      error: error,
    });

    return res.status(response.status_code).json(response.toJSON());
  }
}

