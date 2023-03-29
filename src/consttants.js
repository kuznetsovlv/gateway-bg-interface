export const APP_TYPE = 'application/json';
export const RESPONSE_HEADERS = { 'Content-Type': APP_TYPE };
export const EMPTY_RESPONSE_HEADERS = { 'Content-Type': 'text/plain' };

export const ERROR_CODES = {
  wrongData: 'WRONG_DATA',
  wrongRequest: 'WRONG_REQUEST',
  unknown: 'UNKNOWN_ERROR'
};

export const BASE = '/api/v1/';
