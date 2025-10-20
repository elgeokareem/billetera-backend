import { Elysia } from "elysia";

const color = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
} as const;

const useColor: boolean = Boolean(
  process.stdout.isTTY && !process.env.NO_COLOR,
);

function colorStatus(status: number | string): string {
  const numeric =
    typeof status === "number" ? status : Number.parseInt(status, 10) || 0;
  if (!useColor) return String(numeric);
  if (numeric >= 500) return `${color.red}${numeric}${color.reset}`;
  if (numeric >= 400) return `${color.yellow}${numeric}${color.reset}`;
  if (numeric >= 300) return `${color.cyan}${numeric}${color.reset}`;
  if (numeric >= 200) return `${color.green}${numeric}${color.reset}`;
  return `${color.gray}${numeric}${color.reset}`;
}

function colorMethod(method: string): string {
  if (!useColor) return method;
  switch (method) {
    case "GET":
      return `${color.blue}${method}${color.reset}`;
    case "POST":
      return `${color.magenta}${method}${color.reset}`;
    case "PUT":
      return `${color.yellow}${method}${color.reset}`;
    case "PATCH":
      return `${color.cyan}${method}${color.reset}`;
    case "DELETE":
      return `${color.red}${method}${color.reset}`;
    default:
      return `${color.gray}${method}${color.reset}`;
  }
}

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    // Error instance
    if (err instanceof Error && typeof err.message === "string") {
      return err.message;
    }
    // Elysia validation or custom response shapes with summary/message
    if (
      "message" in err &&
      typeof (err as { message: unknown }).message === "string"
    ) {
      return (err as { message: string }).message;
    }
    if (
      "summary" in err &&
      typeof (err as { summary: unknown }).summary === "string"
    ) {
      return (err as { summary: string }).summary;
    }
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export const logger = new Elysia({ name: "logger" })
  .derive(({ request }) => {
    const incomingId = request.headers.get("x-request-id");
    const requestId = incomingId || Math.random().toString(36).slice(2, 10);
    return {
      _start: performance.now(),
      requestId,
    };
  })
  .onAfterHandle(({ request, set, _start, requestId, response }) => {
    const start = _start ?? performance.now();
    const ms: string = (performance.now() - start).toFixed(1);
    const status = set.status ?? 200; // may be number or string per Elysia types
    const path: string = new URL(request.url).pathname;

    let size = "-";
    try {
      if (response instanceof Response) {
        size = response.headers.get("Content-Length") || size;
      } else if (response !== undefined && response !== null) {
        const raw =
          typeof response === "string" ? response : JSON.stringify(response);
        size = Buffer.byteLength(raw).toString();
      }
    } catch {
      // ignore size calc errors
    }

    const ts = new Date().toISOString();
    const prefix = useColor ? `${color.dim}[${ts}]${color.reset}` : `[${ts}]`;

    console.log(
      `${prefix} ${requestId} ${colorMethod(request.method)} ${path} ${colorStatus(status)} ${size}B ${ms}ms`,
    );
  })
  .onError(({ request, error, code, set, _start, requestId }) => {
    const start = _start ?? performance.now();
    const ms: string = (performance.now() - start).toFixed(1);
    const status = set.status ?? 500;
    const path: string = new URL(request.url).pathname;
    const ts = new Date().toISOString();
    const prefix = useColor ? `${color.dim}[${ts}]${color.reset}` : `[${ts}]`;
    const errorLabel = useColor ? `${color.red}ERROR${color.reset}` : "ERROR";
    const rawMessage = extractErrorMessage(error);
    const message = useColor ? `${color.red}${rawMessage}${color.reset}` : rawMessage;

    console.error(
      `${prefix} ${requestId} ${errorLabel} ${colorMethod(request.method)} ${path} ${colorStatus(status)} ${ms}ms ${code} ${message}`,
    );
  })
  .as("global");
