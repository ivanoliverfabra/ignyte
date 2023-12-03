import type { PrismaClient } from "@prisma/client";
import type { Resend } from 'resend';

declare global {
  var db: PrismaClient;
  var resend: Resend;
}