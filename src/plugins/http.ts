"use strict";

import Plugin from "../interfaces/Plugin";
import Result from "../interfaces/Result";


export default class HTTP implements Plugin {
  public async analyze(context): Promise<Result[]> {
    const errors = [];
    const res = await fetch(context.url, {
      method: "GET",
      headers: {
        "User-Agent": context.userAgent,
      }
    });

    if (res.status !== context.config.res.status) {
      errors.push({
        message: `Status code ${context.config.res.status} expected, but actually ${res.status} returned.`,
      });
    }

    if (context.config.res.redirectTo) {
      const redirectTo = res.headers.get("Location");

      if (redirectTo === null) {
        errors.push({
          message: `Expected redirect to ${context.config.res.redirectTo}, but no redirect happened.`,
        });
      } else if (redirectTo !== context.config.res.redirectTo) {
        errors.push({
          url,
          message: `Expected redirect to ${context.config.res.redirectTo}, but actually redirected to ${redirectTo}.`,
        });
      }
    }

    if (context.config.res.headers) {
      for (const [ header, expectedValue ] of Object.entries(context.config.res.headers)) {
        const actualValue = res.headers.get(header)

        if (Array.isArray(expectedValue)) {
          if (!expectedValue.some(expected => expected === actualValue)) {
            errors.push({
              url: context.url,
              message: `Expected ${header} to be one of ${expectedValue.join(", ")}, but actually ${actualValue}.`,
            });
          }
        } else {
          if (expectedValue !== actualValue) {
            errors.push({
              url: context.url,
              message: `Expected ${header} to be ${expectedValue}, but actually ${actualValue}.`,
            });
          }
        }
      }
    }


    return {
      url: context.url,
      errors: errors,
    };
  }
}
