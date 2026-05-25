import { normalizeText } from "./normalize.js";
import {
  aboutReply,
  announcementsReply,
  contactAdminReply,
  fallbackReply,
  helpReply,
  mainMenu,
  rulesReply,
  settingsReply,
} from "./replies.js";

const commandAliases = new Map([
  ["menu", ["hi", "hello", "hey", "hiya", "start", "menu", "main menu", "good morning", "good afternoon", "good evening", "0"]],
  ["rules", ["1", "rules", "rule", "community rules"]],
  ["announcements", ["2", "announcement", "announcements", "latest announcement", "news"]],
  ["contact_admin", ["3", "contact admin", "admin", "contact admins", "moderator", "support"]],
  ["settings", ["4", "settings", "setting", "preferences"]],
  ["about", ["5", "about", "info", "who are you", "bot info"]],
  ["help", ["6", "help", "commands", "what can you do", "how does this work"]],
]);

function detectCommand(normalizedText) {
  for (const [command, aliases] of commandAliases.entries()) {
    if (aliases.includes(normalizedText)) return command;
  }

  return null;
}

function looksLikeCommunityBasics(normalizedText) {
  return [
    "rule",
    "rules",
    "admin",
    "announcement",
    "announcements",
    "community",
    "group",
    "help",
    "support",
    "moderator",
    "privacy",
    "spam",
  ].some((word) => normalizedText.includes(word));
}

export function routeCommunityMessage(event = {}) {
  const normalizedText = normalizeText(event?.text || "");
  const matchedCommand = detectCommand(normalizedText);

  if (!normalizedText) {
    return {
      matchedCommand: "empty",
      reply: "Please send a message, or type menu to see options.",
    };
  }

  if (matchedCommand === "menu") return { matchedCommand, reply: mainMenu(event) };
  if (matchedCommand === "rules") return { matchedCommand, reply: rulesReply(event) };
  if (matchedCommand === "announcements") return { matchedCommand, reply: announcementsReply(event) };
  if (matchedCommand === "contact_admin") return { matchedCommand, reply: contactAdminReply(event) };
  if (matchedCommand === "settings") return { matchedCommand, reply: settingsReply(event) };
  if (matchedCommand === "about") return { matchedCommand, reply: aboutReply(event) };
  if (matchedCommand === "help") return { matchedCommand, reply: helpReply(event) };

  return {
    matchedCommand: "fallback",
    reply: fallbackReply(event, looksLikeCommunityBasics(normalizedText)),
  };
}
