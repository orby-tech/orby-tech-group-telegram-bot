import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

import fs from "fs";

export class SubscribeController {
  private bot: Telegraf<Context<Update>>;
  private _subs: {
    userId: number;
    intervalInMiliSeconds: number;
    lastNotify: number;
    active: boolean;
  }[] = [];

  set subs(subs) {
    this._subs = subs;
    fs.writeFileSync("./value/subs.json", JSON.stringify(subs, null, 2));
  }

  get subs() {
    return this._subs;
  }

  constructor(bot: Telegraf<Context<Update>>) {
    if (!fs.existsSync("./value")) {
      fs.mkdirSync("./value");
    }
    if (!fs.existsSync("./value/subs.json")) {
      fs.writeFileSync("./value/subs.json", "[]");
    }
    const _subs = fs.readFileSync("./value/subs.json", "utf-8") || "[]";
    if (_subs) {
      this.subs = JSON.parse(_subs);
    }
    this.bot = bot;

    setInterval(() => {
      const usersToNotify = this.getAllUsersToNotify();
      usersToNotify.forEach((user) => {
        this.notifyUser(user.userId);
      });
    }, 1000);
  }

  getAllUsersToNotify() {
    const now = Date.now();
    return this.subs.filter((sub) => {
      return sub.active && now - sub.lastNotify > sub.intervalInMiliSeconds;
    });
  }

  notifyUser(userId: number) {
    this.bot.telegram.sendMessage(
      userId,
      "Time to rest and pass reaction test!",
      Markup.inlineKeyboard(
        [
          Markup.button.url(
            "Pass reaction test!",
            "http://orby-tech.space/reaction-metrics-tool"
          ),
        ],
        {
          wrap: (btn, index, currentRow) => currentRow.length >= 3,
        }
      )
    );
    this.subs = this.subs.map((sub) => {
      if (sub.userId === userId) {
        return {
          ...sub,
          lastNotify: Date.now(),
        };
      }
      return sub;
    });
  }

  public subscribe(userId: number) {
    this.subs = [
      ...this.subs,
      {
        userId,
        intervalInMiliSeconds: 1000 * 60 * 60,
        lastNotify: Date.now(),
        active: true,
      },
    ];

    this.bot.telegram.sendMessage(
      userId,
      `You was subscribed! \n\n Congratulations! \n\n Next notification will be in 1 hour!`
    );
  }

  unsubscribe(userId: number) {
    this.subs = this.subs.map((sub) => {
      if (sub.userId === userId) {
        return {
          ...sub,
          active: false,
        };
      }
      return sub;
    });

    this.bot.telegram.sendMessage(userId, `You was unsubscribed! We are sad!`);
  }

  setInterval(userId: number, value: number) {
    this.subs = this.subs.map((sub) => {
      if (sub.userId === userId) {
        return {
          ...sub,
          intervalInMiliSeconds: value,
        };
      }
      return sub;
    });

    this.bot.telegram.sendMessage(
      userId,
      `${value / 1000 / 60 / 60} hours was setted!`
    );
  }
}
