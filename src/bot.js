import crypto from "node:crypto";
import express from "express";
import { handleText } from "./brain.js";
import { cfg } from "./lib/config.js";
import { safeErr } from "./lib/errors.js";
import { clampWhatsAppText } from "./lib/normalize.js";
import { log } from "./lib/logger.js";

function timingSafeSecretEquals(actual, expected) {
  const actualValue = String(actual || "").trim();
  const expectedValue = String(expected || "").trim();

  if (!actualValue || !expectedValue) return false;

  const actualBuffer = Buffer.from(actualValue);
  const expectedBuffer = Buffer.from(expectedValue);

  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

export function normalizeInbound(body = {}) {
  const from = String(body?.from || body?.chatId || "unknown").trim() || "unknown";
  const chatId = String(body?.chatId || body?.groupId || body?.from || from || "unknown").trim() || "unknown";
  const senderId = String(body?.senderId || body?.participant || body?.author || body?.from || from || "unknown").trim() || "unknown";
  const chatType = String(body?.chatType || body?.type || body?.metadata?.chatType || "").trim().toLowerCase();
  const groupId = body?.groupId || body?.group?.id || body?.metadata?.groupId || null;
  const isGroup = Boolean(
    body?.isGroup === true ||
    chatType === "group" ||
    groupId ||
    String(chatId).endsWith("@g.us")
  );

  return {
    from,
    text: String(body?.text || body?.body || body?.message?.text || "").trim(),
    messageId: String(body?.messageId || body?.id || "unknown").trim() || "unknown",
    projectId: String(body?.projectId || "").trim(),
    platform: "whatsapp",
    source: String(body?.source || "cookmybots-managed").trim(),
    timestamp: Number(body?.timestamp || Date.now()) || Date.now(),
    chatId,
    senderId,
    senderName: String(body?.senderName || body?.pushName || body?.name || "Member").trim() || "Member",
    chatType: isGroup ? "group" : "private",
    isGroup,
    groupId: groupId ? String(groupId) : null,
  };
}

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) => {
    res.status(200).send("OK");
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({
      ok: true,
      platform: "whatsapp",
      managedTransport: true,
      webhookSecretSet: Boolean(cfg.CMB_WHATSAPP_WEBHOOK_SECRET),
    });
  });

  app.post("/webhook/cookmybots/whatsapp", async (req, res) => {
    try {
      const expectedSecret = cfg.CMB_WHATSAPP_WEBHOOK_SECRET;
      const providedSecret = req.headers["x-cookmybots-webhook-secret"];

      if (!expectedSecret) {
        log.error("webhook_secret_missing", { platform: "whatsapp" });
        return res.status(503).json({
          ok: false,
          error: "webhook_secret_not_configured",
          reply: "Service is not configured yet.",
        });
      }

      if (!timingSafeSecretEquals(providedSecret, expectedSecret)) {
        log.warn("webhook_unauthorized", { platform: "whatsapp", secretProvided: Boolean(providedSecret) });
        return res.status(401).json({ ok: false, error: "unauthorized" });
      }

      const event = normalizeInbound(req.body || {});
      const reply = await handleText(event);

      return res.status(200).json({
        ok: true,
        reply: clampWhatsAppText(reply || "I received your message. Type menu to see options."),
      });
    } catch (err) {
      log.error("webhook_handler_failed", { platform: "whatsapp", err: safeErr(err) });
      return res.status(500).json({
        ok: false,
        error: "server_error",
        reply: "Sorry, I had trouble with that. Please try menu again.",
      });
    }
  });

  app.post("/test", async (req, res) => {
    try {
      const event = normalizeInbound({
        ...req.body,
        source: "local-test",
        from: req.body?.from || "local-user@s.whatsapp.net",
      });
      const reply = await handleText(event);
      return res.status(200).json({ ok: true, reply });
    } catch (err) {
      log.error("local_test_failed", { platform: "whatsapp", err: safeErr(err) });
      return res.status(500).json({
        ok: false,
        error: "server_error",
        reply: "Sorry, I had trouble with that. Please try menu again.",
      });
    }
  });

  return app;
}
