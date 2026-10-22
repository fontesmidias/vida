import { z } from "zod";

// O fuso é opcional e validado depois (inválido → padrão, R1); aqui só limitamos o tamanho
export const timezoneQuerySchema = z.string().max(100).nullable();
export const cursorQuerySchema = z.string().max(200).nullable();
