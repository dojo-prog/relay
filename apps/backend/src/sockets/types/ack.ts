export interface AckSuccess {
  success: true;
  message?: string;
  data: Record<string, unknown>;
}

export interface AckFailure {
  success: false;
  message: string;
  errors?: Record<string, unknown>;
}

export type Ack<T = unknown> = (response: AckSuccess | AckFailure) => void;
