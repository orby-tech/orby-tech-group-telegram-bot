import { Context, Markup, NarrowedContext, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { SubscribeController } from "./src/reactions-metrics-tool";
import { Update, Message } from "telegraf/typings/core/types/typegram";

const BOT_TOKEN = process.env.BOT_TOKEN || "";

if (BOT_TOKEN === "") {
  throw new Error("BOT_TOKEN must be provided!");
}

const KEYS = {
  ROOT: {
    REACTION_METRICS_TOOL: "Reaction metrics tool notifications",
    GET_CONTACT: "Get contacts",
  },
  REACTION_METRICS_TOOL: {
    BACK_TO_ROOT: "<-- Back to root",
    PASS_TEST: "Pass reaction test!",
    SUBSCRIBE: "Subscribe to notifications",
    UNSUBSCRIBE: "Unsubscribe from notifications",
    SET_INTERVAL: "Set interval of notifications about necessary some rest",
    INTERVAL: {
      BACK_TO_REACTION_METRICS_TOOL: "<-- Back to reaction metrics tool",
      ONE_HAFL_HOUR: "30 minutes",
      ONE_HOUR: "1 hour",
      TWO_HOURS: "2 hours",
      THREE_HOURS: "3 hours",
      SIX_HOURS: "6 hours",
    },
  },
};

const bot = new Telegraf(BOT_TOKEN);
const subscribeController = new SubscribeController(bot);

bot.context.sendMessage?.("Hello world");

bot.start(async (ctx) => {
  ctx.reply("Welcome!");
  await keyboardRoot(ctx);
});

bot.on(message("text"), async (ctx) => {
  switch (ctx.message.text) {
    case KEYS.ROOT.REACTION_METRICS_TOOL:
      await keyboardReactionMetricsTool(ctx);
      break;

    case KEYS.ROOT.GET_CONTACT:
      await ctx.reply(
        "All my contacts",
        Markup.inlineKeyboard([
          Markup.button.url("Website", "http://orby-tech.space"),
          Markup.button.url("Telegram", "https://t.me/orby_tech"),
          Markup.button.url("Telegram Orby tech group", "https://t.me/orby_tech_group"),
          Markup.button.url("Twitter", "https://twitter.com/TimurOrby"),
          Markup.button.url(
            "LinkedIn",
            "https://www.linkedin.com/in/timur-bondarenko/"
          ),
        ])
      );
      break;
    case KEYS.REACTION_METRICS_TOOL.PASS_TEST:
      await ctx.reply(
        "Pass reaction test!",
        Markup.inlineKeyboard([
          Markup.button.url(
            "Pass reaction test!",
            "http://orby-tech.space/reaction-metrics-tool"
          ),
        ])
      );
      break;

    case KEYS.REACTION_METRICS_TOOL.SUBSCRIBE:
      subscribeController.subscribe(ctx.update.message.from.id);
      break;
    case KEYS.REACTION_METRICS_TOOL.UNSUBSCRIBE:
      subscribeController.unsubscribe(ctx.update.message.from.id);
      break;
    case KEYS.REACTION_METRICS_TOOL.SET_INTERVAL:
      await ctx.reply(
        KEYS.ROOT.REACTION_METRICS_TOOL +
          " > " +
          KEYS.REACTION_METRICS_TOOL.SET_INTERVAL,
        Markup.keyboard(
          [
            KEYS.REACTION_METRICS_TOOL.INTERVAL.ONE_HAFL_HOUR,
            KEYS.REACTION_METRICS_TOOL.INTERVAL.ONE_HOUR,
            KEYS.REACTION_METRICS_TOOL.INTERVAL.TWO_HOURS,
            KEYS.REACTION_METRICS_TOOL.INTERVAL.THREE_HOURS,
            KEYS.REACTION_METRICS_TOOL.INTERVAL.SIX_HOURS,
            KEYS.REACTION_METRICS_TOOL.INTERVAL.BACK_TO_REACTION_METRICS_TOOL,
          ],
          {
            wrap: (btn, index, currentRow) => currentRow.length >= 3,
          }
        )
      );
      break;

    case KEYS.REACTION_METRICS_TOOL.BACK_TO_ROOT:
      keyboardRoot(ctx);
      break;

    case KEYS.REACTION_METRICS_TOOL.INTERVAL.ONE_HAFL_HOUR:
      subscribeController.setInterval(
        ctx.update.message.from.id,
        1000 * 60 * 60 * 0.5
      );
      await keyboardReactionMetricsTool(ctx);
      break;
    case KEYS.REACTION_METRICS_TOOL.INTERVAL.ONE_HOUR:
      subscribeController.setInterval(
        ctx.update.message.from.id,
        1000 * 60 * 60
      );
      await keyboardReactionMetricsTool(ctx);
      break;
    case KEYS.REACTION_METRICS_TOOL.INTERVAL.TWO_HOURS:
      subscribeController.setInterval(
        ctx.update.message.from.id,
        1000 * 60 * 60 * 2
      );
      await keyboardReactionMetricsTool(ctx);
      break;
    case KEYS.REACTION_METRICS_TOOL.INTERVAL.THREE_HOURS:
      subscribeController.setInterval(
        ctx.update.message.from.id,
        1000 * 60 * 60 * 3
      );
      await keyboardReactionMetricsTool(ctx);
      break;
    case KEYS.REACTION_METRICS_TOOL.INTERVAL.SIX_HOURS:
      subscribeController.setInterval(
        ctx.update.message.from.id,
        1000 * 60 * 60 * 6
      );
      await keyboardReactionMetricsTool(ctx);
      break;
    case KEYS.REACTION_METRICS_TOOL.INTERVAL.BACK_TO_REACTION_METRICS_TOOL:
      await keyboardReactionMetricsTool(ctx);
      break;
    default:
      keyboardRoot(ctx);
  }
});

const keyboardReactionMetricsTool = async (
  ctx: NarrowedContext<
    Context<Update>,
    Update.MessageUpdate<Record<"text", {}> & Message.TextMessage>
  >
) => {
  return await ctx.reply(
    KEYS.ROOT.REACTION_METRICS_TOOL,
    Markup.keyboard(
      [
        KEYS.REACTION_METRICS_TOOL.SUBSCRIBE,
        KEYS.REACTION_METRICS_TOOL.UNSUBSCRIBE,
        KEYS.REACTION_METRICS_TOOL.SET_INTERVAL,
        KEYS.REACTION_METRICS_TOOL.PASS_TEST,
        KEYS.REACTION_METRICS_TOOL.BACK_TO_ROOT,
      ],
      {
        wrap: (btn, index, currentRow) => currentRow.length >= 2,
      }
    )
  );
};

const keyboardRoot = async (
  ctx: NarrowedContext<
    Context<Update>,
    Update.MessageUpdate<Record<"text", {}> & Message.TextMessage>
  >
) => {
  return await ctx.reply(
    "Orby tech bot functions:",
    Markup.keyboard([KEYS.ROOT.REACTION_METRICS_TOOL, KEYS.ROOT.GET_CONTACT], {
      wrap: (btn, index, currentRow) => currentRow.length >= 3,
    })
  );
};

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
