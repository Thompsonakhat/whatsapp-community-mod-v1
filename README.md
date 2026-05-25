# WhatsApp Community Assistant Bot

A WhatsApp-only CookMyBots managed-transport brain service for community help menus, rules, announcements, admin contact guidance, settings, about, and help.

CookMyBots manages the WhatsApp connection. This project only exposes the bot brain endpoint:

POST /webhook/cookmybots/whatsapp

## Features

1) Private and group chat aware replies
2) Plain-text commands, no slash-command dependency
3) Numbered WhatsApp-style menu
4) Friendly fallback for unknown messages
5) Production-safe logs with no secrets
6) No AI, database, polling loop, or extra platform code

## Run locally

npm install
cp .env.sample .env
npm run dev

Test locally:

curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"text":"menu"}'

Group-style test:

curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"chatId":"group@g.us","senderId":"user@s.whatsapp.net","text":"menu","isGroup":true}'

## Environment variables

PORT defaults to 3000 when missing.

CMB_WHATSAPP_WEBHOOK_SECRET is required for the CookMyBots webhook endpoint and is injected by CookMyBots for deployed bots.

No WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN, AI key, or MongoDB URI is used.

## Commands

hi, hello, hey, start, menu
rules or 1
announcement, announcements, or 2
contact admin, admin, or 3
settings or 4
about or 5
help or 6

See DOCS.md for full setup, payload examples, and expected replies.
