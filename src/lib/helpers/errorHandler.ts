import { HTTP500Error, HTTPClientError } from "../utils/httpError";

export const handleError = (error: Error | HTTPClientError) => {
  if(error instanceof HTTPClientError) {
    return error;
  }
  return new HTTP500Error(error.message);
}