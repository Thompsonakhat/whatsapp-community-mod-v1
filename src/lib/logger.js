import { safeErr } from "./errors.js";

function emit(level, msg, meta = {}) {
  const cleanMeta = Object.fromEntries(
    Object.entries(meta).filter(([, value]) => value !== undefined)
  );

  const payload = {
    level,
    msg,
    time: new Date().toISOString(),
    ...cleanMeta,
  };

  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (msg, meta = {}) => emit("info", msg, meta),
  warn: (msg, meta = {}) => emit("warn", msg, meta),
  error: (msg, meta = {}) => emit("error", msg, { ...meta, err: meta?.err ? safeErr(meta.err) : meta?.err }),
};
