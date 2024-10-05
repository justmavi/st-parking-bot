import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

export function InjectReq() {
  return Inject(REQUEST);
}
