import { routeCommunityMessage } from "./lib/router.js";
import { clampWhatsAppText } from "./lib/normalize.js";
import { safeErr } from "./lib/errors.js";
import { log } from "./lib/logger.js";

export async function handleText(event = {}) {
  try {
    const result = routeCommunityMessage(event);

    log.info("inbound_message_handled", {
      platform: "whatsapp",
      source: event?.source || "unknown",
      isGroup: Boolean(event?.isGroup),
      hasMessageId: Boolean(event?.messageId && event.messageId !== "unknown"),
      matchedCommand: result.matchedCommand || "fallback",
    });

    return clampWhatsAppText(result.reply);
  } catch (err) {
    log.error("message_handling_failed", {
      platform: "whatsapp",
      isGroup: Boolean(event?.isGroup),
      err: safeErr(err),
    });

    return "Sorry, I had trouble with that. Please type menu and try again.";
  }
}
