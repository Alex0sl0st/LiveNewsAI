async function handleRateLimit(ctx, task) {
  const {
    limiter,
    scheduleParams,
    scheduleTask,
    setIsPaused,
    pause429Duration,
    isPaused,
  } = ctx;

  function schedule() {
    return scheduleTask(limiter, scheduleParams, task);
  }

  if (isPaused()) {
    console.log("⏳ Bottleneck already paused, waiting...");
    schedule();
    return;
  }

  console.log("🛑 Received 429 — pausing requests for 2 minutes...");
  limiter.updateSettings({ reservoir: 0 });

  setIsPaused(true);
  await new Promise((res) => setTimeout(res, pause429Duration));

  limiter.updateSettings({ reservoir: null });
  setIsPaused(false);

  console.log("▶️ Resuming after 2-minute cooldown...");

  schedule();
}

export { handleRateLimit };
