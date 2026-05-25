# WhatsApp Community Assistant Bot

This project is a WhatsApp-only community assistant brain service for CookMyBots managed WhatsApp transport.

CookMyBots handles the WhatsApp connection, phone pairing, session management, inbound message forwarding, and reply delivery. This service only receives managed webhook events and returns reply text.

It does not implement WhatsApp Cloud API webhooks and does not require WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN, Telegram, X, Discord, or any other platform code.

## What the bot does

The bot helps community members find basic community information in private chats and group chats.

It can show:

1) Rules
2) Announcements
3) Contact Admin guidance
4) Settings
5) About
6) Help

Private chats get a short introduction plus the menu. Group chats get shorter replies and a note that group admin features are coming soon.

No AI, external LLM, database, queue, or background worker is used in this version.

## HTTP endpoints

### GET /health

Returns service health and platform metadata.

### POST /webhook/cookmybots/whatsapp

CookMyBots managed WhatsApp transport sends inbound messages here.

The request must include:

Header:

X-CookMyBots-Webhook-Secret: your deployed CookMyBots webhook secret

Body fields accepted safely:

from, text, messageId, projectId, platform, source, timestamp, chatId, senderId, senderName, pushName, isGroup, chatType, groupId, metadata

The endpoint returns:

{
  "ok": true,
  "reply": "..."
}

### POST /test

Local test endpoint that does not require the webhook secret.

## Environment variables

PORT

Server port. Optional. Defaults to 3000 when missing.

CMB_WHATSAPP_WEBHOOK_SECRET

Required for the managed WhatsApp webhook endpoint. CookMyBots injects this for deployed bots. It is used only to verify the X-CookMyBots-Webhook-Secret request header.

No WhatsApp Cloud API variables are required.

## Setup

Install dependencies:

npm install

Create a local environment file:

cp .env.sample .env

For local webhook testing, set CMB_WHATSAPP_WEBHOOK_SECRET in .env. The /test endpoint can be used without it.

Run in development:

npm run dev

Run production start:

npm start

Build check:

npm run build

## Supported commands

The bot uses plain text commands, not slash commands.

hi, hello, hey, start, menu

Shows the main menu. In private chat, the bot introduces itself and explains what it can help with. In group chat, it keeps the reply concise and mentions that group admin features are coming soon.

rules or 1

Shows a concise default community rules list: respectful behavior, no spam, stay on topic, protect privacy, and contact admins for issues.

announcement, announcements, or 2

Shows: No active announcements yet. Admins can update this in a future version.

contact admin, admin, or 3

Explains how members can reach an admin using the built-in placeholder guidance.

settings or 4

Shows current preferences: language English, short reply style, and chat type. Editable settings are coming soon.

about or 5

Describes the assistant as a WhatsApp community helper for navigation, rules, announcements, and support.

help or 6

Lists available plain-text commands and explains numbered menu navigation.

Unknown messages

The bot replies with a friendly fallback and suggests typing menu or choosing a number. If the message appears to ask about community basics, it guides the user to rules, help, or contact admin without pretending to know unavailable community-specific details.

## Private chat test examples

Start the server:

npm run dev

Test menu:

curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"from":"user@s.whatsapp.net","text":"hi","messageId":"local-1"}'

Expected style:

Hi. I am your WhatsApp community assistant.
I help members find rules, announcements, admin contact guidance, settings, and help.

1) Rules
2) Announcements
3) Contact Admin
4) Settings
5) About
6) Help

Test rules:

curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"from":"user@s.whatsapp.net","text":"1","messageId":"local-2"}'

## Group-style test examples

curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"from":"group@g.us","chatId":"group@g.us","senderId":"user@s.whatsapp.net","text":"menu","messageId":"group-1","isGroup":true}'

Expected style:

I can help this group with community basics.
Group admin features are coming soon.

1) Rules
2) Announcements
3) Contact Admin
4) Settings
5) About
6) Help

Test group admin guidance:

curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"chatId":"group@g.us","senderId":"user@s.whatsapp.net","text":"contact admin","messageId":"group-2","isGroup":true}'

## Deployment notes

Deploy as a single Node.js service.

Set these environment variables in the hosting platform:

1) PORT if your host does not inject it automatically
2) CMB_WHATSAPP_WEBHOOK_SECRET from CookMyBots

In CookMyBots, connect your WhatsApp number using managed transport. The bot service must expose:

POST /webhook/cookmybots/whatsapp

## Logging and diagnostics

Startup logs include only booleans such as whether PORT and the webhook secret are set. The bot logs inbound handling attempts with non-sensitive metadata: platform, source, whether the chat is a group, whether a message id exists, and the matched command.

Errors use safe extraction:

err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || String(err)

No secrets are logged.
