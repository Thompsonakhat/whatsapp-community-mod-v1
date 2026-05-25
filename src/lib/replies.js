const ADMIN_CONTACT_GUIDANCE = "Please send a short message explaining what you need, then tag or message one of the community admins using the approved admin contact method for this group.";

function menuOptions() {
  return [
    "1) Rules",
    "2) Announcements",
    "3) Contact Admin",
    "4) Settings",
    "5) About",
    "6) Help",
  ].join("\n");
}

export function mainMenu(event = {}) {
  if (event?.isGroup) {
    return [
      "I can help this group with community basics.",
      "Group admin features are coming soon.",
      "",
      menuOptions(),
      "",
      "Reply with a number or type rules, announcement, contact admin, settings, about, or help.",
    ].join("\n");
  }

  const name = event?.senderName && event.senderName !== "Member" ? `, ${event.senderName}` : "";

  return [
    `Hi${name}. I am your WhatsApp community assistant.`,
    "I help members find rules, announcements, admin contact guidance, settings, and help.",
    "",
    menuOptions(),
    "",
    "Reply with a number or type a command like rules, announcement, or help.",
  ].join("\n");
}

export function rulesReply(event = {}) {
  const intro = event?.isGroup ? "Community rules:" : "Here are the default community rules:";

  return [
    intro,
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
    "No active announcements yet.",
    "Admins can update announcements in a future version.",
    "",
    "Type menu to see other options.",
  ].join("\n");
}

export function contactAdminReply(event = {}) {
  if (event?.isGroup) {
    return [
      "To reach an admin:",
      ADMIN_CONTACT_GUIDANCE,
      "",
      "Group admin tools are coming soon.",
    ].join("\n");
  }

  return [
    "To reach an admin:",
    ADMIN_CONTACT_GUIDANCE,
    "",
    "Tip: include the topic, your question, and any urgent details.",
  ].join("\n");
}

export function settingsReply(event = {}) {
  return [
    "Current settings:",
    "Language: English",
    "Reply style: short",
    `Chat type: ${event?.isGroup ? "Group" : "Private"}`,
    "",
    "Editable settings are coming soon.",
    "Type menu to return to the main menu.",
  ].join("\n");
}

export function aboutReply(event = {}) {
  if (event?.isGroup) {
    return [
      "I am a WhatsApp community helper.",
      "I can show rules, announcements, admin contact guidance, settings, and help.",
      "Group admin features are coming soon.",
    ].join("\n");
  }

  return [
    "I am a WhatsApp community helper built for CookMyBots managed transport.",
    "I help members navigate community information, rules, announcements, and support options.",
    "",
    "Type menu anytime to see what I can do.",
  ].join("\n");
}

export function helpReply(event = {}) {
  if (event?.isGroup) {
    return [
      "Try these options:",
      "menu, rules, announcement, contact admin, settings, about, help",
      "You can also reply with 1 to 6 from the menu.",
    ].join("\n");
  }

  return [
    "You can type these plain-text commands:",
    "hi, hello, hey, start, menu",
    "rules, announcement, announcements",
    "contact admin, admin",
    "settings, about, help",
    "",
    "Numbered navigation:",
    "1) Rules",
    "2) Announcements",
    "3) Contact Admin",
    "4) Settings",
    "5) About",
    "6) Help",
  ].join("\n");
}

export function fallbackReply(event = {}, looksLikeCommunityQuestion = false) {
  if (looksLikeCommunityQuestion) {
    return "It sounds like you are asking about community basics. Try rules, help, contact admin, or type menu.";
  }

  if (event?.isGroup) {
    return "I did not understand that. Type menu or choose 1 to 6.";
  }

  return "I did not understand that. Please type menu or choose a number from the menu.";
}
