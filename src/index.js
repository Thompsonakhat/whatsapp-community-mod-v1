import "dotenv/config";

function localSafeErr(err) {
  return err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || String(err);
}

process.on("unhandledRejection", (err) => {
  console.error(JSON.stringify({ level: "error", msg: "unhandled_rejection", err: localSafeErr(err) }));
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error(JSON.stringify({ level: "error", msg: "uncaught_exception", err: localSafeErr(err) }));
  process.exit(1);
});

async function boot() {
  try {
    const [{ cfg }, { createApp }, { log }, { BOT_PROFILE }] = await Promise.all([
      import("./lib/config.js"),
      import("./bot.js"),
      import("./lib/logger.js"),
      import("./lib/botProfile.js"),
    ]);

    const app = createApp();
    const port = Number(cfg.PORT || 3000) || 3000;

    log.info("boot_start", {
      platform: "whatsapp",
      portSet: Boolean(process.env.PORT),
      webhookSecretSet: Boolean(cfg.CMB_WHATSAPP_WEBHOOK_SECRET),
    });

    log.info("bot_profile_loaded", {
      platform: "whatsapp",
      profile: BOT_PROFILE,
    });

    app.listen(port, () => {
      log.info("server_listening", {
        platform: "whatsapp",
        port,
        managedTransport: true,
      });
    });
  } catch (err) {
    console.error(JSON.stringify({
      level: "error",
      msg: "boot_failed",
      err: localSafeErr(err),
      hint: "Check that dependencies are installed and all relative imports exist. Run npm run build before starting.",
    }));
    process.exit(1);
  }
}

boot();
