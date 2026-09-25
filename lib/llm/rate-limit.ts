type Bucket = { count: number; resetAt: number };

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterMs: number };

/**
 * Fixed-window counter per key, held in memory. State is per server instance
 * (it resets on restart and is not shared across serverless instances), so it
 * caps abuse of the API key rather than enforcing exact quotas.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
  maxKeys = 10_000,
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
  /** Bounds memory: on overflow, expired buckets go first, then the oldest. */
  maxKeys?: number;
}) {
  const buckets = new Map<string, Bucket>();

  function makeRoom(time: number) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= time) buckets.delete(key);
    }
    while (buckets.size >= maxKeys) {
      const oldest = buckets.keys().next().value;
      if (oldest === undefined) break;
      buckets.delete(oldest);
    }
  }

  return {
    check(key: string): RateLimitResult {
      const time = now();
      let bucket = buckets.get(key);

      if (!bucket || bucket.resetAt <= time) {
        if (!bucket && buckets.size >= maxKeys) makeRoom(time);
        bucket = { count: 0, resetAt: time + windowMs };
        buckets.set(key, bucket);
      }

      if (bucket.count >= limit) {
        return { ok: false, retryAfterMs: bucket.resetAt - time };
      }
      bucket.count += 1;
      return { ok: true };
    },
  };
}

function numberFromEnv(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/**
 * Identifies the caller by the proxy-provided address. These headers are only
 * trustworthy behind a proxy that overwrites them; otherwise a caller can
 * spoof them, which is why a global cap backs up the per-client one.
 */
export function getClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

// A full learning session makes 3 LLM calls, so the defaults allow about 6
// sessions per client every 10 minutes. Override with the env vars below.
const clientLimiter = createRateLimiter({
  limit: numberFromEnv("RATE_LIMIT_MAX", 20),
  windowMs: numberFromEnv("RATE_LIMIT_WINDOW_SECONDS", 600) * 1000,
});
const globalLimiter = createRateLimiter({
  limit: numberFromEnv("RATE_LIMIT_GLOBAL_MAX", 500),
  windowMs: numberFromEnv("RATE_LIMIT_GLOBAL_WINDOW_SECONDS", 3600) * 1000,
});

/**
 * Call first in an LLM-backed route handler. Returns a 429 response when the
 * caller (or the whole app) is over its limit, otherwise null.
 */
export function checkRateLimit(request: Request): Response | null {
  // Per-client first, so one abusive client cannot use up the global budget.
  const result = clientLimiter.check(getClientId(request));
  const overall = result.ok ? globalLimiter.check("global") : result;
  if (overall.ok) return null;

  const retryAfter = Math.ceil(overall.retryAfterMs / 1000);
  return Response.json(
    { error: `Too many requests. Please try again in ${retryAfter} seconds.` },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
