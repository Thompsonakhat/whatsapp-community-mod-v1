import { BOT_PROFILE } from "./botProfile.js";

const ADMIN_CONTACT_GUIDANCE =
  "Send a short message explaining what you need, then tag or message one of the community admins using the approved admin contact method for this group.";

function commandList() {
  return BOT_PROFILE.commands.map((cmd) => "- " + cmd).join("\n");
}

function capabilityList() {
  return BOT_PROFILE.capabilities.map((item) => "- " + item).join("\n");
}

function menuOptions() {
  return [
    "1) Help",
    "2) Rules",
    "3) Announcements",
    "4) Contact Admin",
    "5) Settings",
    "6) About",
  ].join("\n");
}

export function mainMenu(event = {}) {
  const chatType = event?.isGroup ? "group" : "private chat";

  return [
    BOT_PROFILE.name,
    "",
    `I am active in this ${chatType}.`,
    "Choose an option:",
    "",
    menuOptions(),
    "",
    "You can reply with a number, or type a command like help, rules, settings, about, or contact admin.",
  ].join("\n");
}

export function rulesReply(event = {}) {
  const intro = event?.isGroup ? "Community rules for this group:" : "Default community rules:";

  return [
    intro,
    "",
    "1) Be respectful to everyone.",
    "2) Do not spam the chat.",
    "3) Stay on topic.",
    "4) Protect your privacy and other members' privacy.",
    "5) Contact admins if you see an issue.",
    "",
    "Type menu to return to the main menu.",
  ].join("\n");
}

export function announcementsReply() {
  return [
    "Announcements",
    "",
    "No active announcements have been configured yet.",
    "In a future version, admins will be able to set announcements directly from WhatsApp.",
    "",
    "Type menu to see other options.",
  ].join("\n");
}

export function contactAdminReply(event = {}) {
  return [
    "Contact Admin",
    "",
    ADMIN_CONTACT_GUIDANCE,
    "",
    event?.isGroup
      ? "Tip: include the topic and any urgent details so admins understand quickly."
      : "Tip: if this is related to a group, mention the group name too.",
  ].join("\n");
}

export function settingsReply(event = {}) {
  return [
    "Settings",
    "",
    `Platform: ${BOT_PROFILE.platform}`,
    `Chat type: ${event?.isGroup ? "Group" : "Private"}`,
    `Chat ID: ${event?.chatId || "unknown"}`,
    "",
    "Current behavior:",
    "- Plain-text commands enabled",
    "- Slash-style commands supported",
    "- Numbered menu replies supported",
    "- Short WhatsApp-style replies enabled",
    "",
    "Advanced editable settings are coming soon.",
    "Type menu to return to the main menu.",
  ].join("\n");
}

export function aboutReply(event = {}) {
  return [
    "About",
    "",
    BOT_PROFILE.description,
    "",
    "What I can do:",
    capabilityList(),
    "",
    "Commands:",
    commandList(),
    "",
    event?.isGroup
      ? "Group note: I can respond inside this group when CookMyBots receives group messages from the connected WhatsApp session."
      : "Private chat note: you can use me here directly, and group support works when group messages are routed by CookMyBots.",
  ].join("\n");
}

export function helpReply(event = {}) {
  return [
    "Help",
    "",
    "You can use these commands:",
    commandList(),
    "",
    "Numbered menu:",
    menuOptions(),
    "",
    event?.isGroup
      ? "This is a group chat. Group admin-only tools are coming soon."
      : "This is a private chat. Type menu anytime to return to the main menu.",
  ].join("\n");
}

export function fallbackReply(event = {}, looksLikeCommunityQuestion = false) {
  if (looksLikeCommunityQuestion) {
    return [
      "I can help with community basics.",
      "",
      "Try one of these:",
      "- rules",
      "- announcements",
      "- contact admin",
      "- help",
      "- menu",
    ].join("\n");
  }

  return [
    "I did not understand that as a command.",
    "",
    "Type menu to open the main menu, or type help to see what I can do.",
  ].join("\n");
}
