export class HttpResponseDto {
  private readonly _success: boolean;
  private readonly _message?: string;
  private readonly _data: Record<string, unknown> | Record<string, unknown>[];
  private readonly _status_code: number;
  private readonly _error?: string;

  constructor(payload: {
    success?: boolean;
    message?: string;
    data: Record<string, unknown> | Record<string, unknown>[];
    status_code?: number;
    error?: string;
  }) {
    this._status_code = payload.status_code || 200;
    this._success = this._status_code >= 200 && this._status_code < 300;
    this._message = payload.message;
    this._data = payload.data;
    this._error = payload.error;
  }

  public toJSON() {
    return {
      success: this._success,
      message: this._message,
      data: this._data,
      status_code: this._status_code,
      error: this._error,
    };
  }

  public get success(): boolean {
    return this._success;
  }

  public get message(): string | undefined {
    return this._message;
  }

  public get data(): Record<string, unknown> | Record<string, unknown>[] {
    return this._data;
  }

  public get status_code(): number {
    return this._status_code;
  }

  public get error(): string | undefined {
    return this._error;
  }
}

