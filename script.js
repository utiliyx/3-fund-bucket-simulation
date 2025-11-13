document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calculator-form");
  const spendModeSelect = document.getElementById("spendMode");
  const withdrawRateField = document.getElementById("withdrawRateField");
  const fixedSpendingField = document.getElementById("fixedSpendingField");

  const warningsEl = document.getElementById("warnings");
  const resultsEl = document.getElementById("results");

  const portfolioInput = document.getElementById("portfolioValue");
  const withdrawalRateInput = document.getElementById("withdrawalRate");
  const fixedSpendingInput = document.getElementById("fixedSpending");
  const bucket1YearsInput = document.getElementById("bucket1Years");
  const bucket2YearsInput = document.getElementById("bucket2Years");
  const desiredStockPctInput = document.getElementById("desiredStockPct");
  const usStockSplitInput = document.getElementById("usStockSplit");

  function getNumber(input, fallback = 0) {
    const v = parseFloat(input.value);
    return Number.isFinite(v) ? v : fallback;
  }

  function formatCurrency(value) {
    if (!Number.isFinite(value)) return "-";
    return value.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    });
  }

  function formatPercent(value) {
    if (!Number.isFinite(value)) return "-";
    return value.toFixed(1) + " %";
  }

  function clearWarnings() {
    warningsEl.innerHTML = "";
  }

  function addWarning(text) {
    const div = document.createElement("div");
    div.className = "warning";
    div.textContent = text;
    warningsEl.appendChild(div);
  }

  function handleSpendModeChange() {
    const mode = spendModeSelect.value;
    if (mode === "percent") {
      withdrawRateField.classList.remove("hidden");
      fixedSpendingField.classList.add("hidden");
    } else {
      withdrawRateField.classList.add("hidden");
      fixedSpendingField.classList.remove("hidden");
    }
  }

  spendModeSelect.addEventListener("change", () => {
    handleSpendModeChange();
    calculate();
  });

  function calculate() {
    clearWarnings();

    const P = getNumber(portfolioInput, 0);
    if (P <= 0) {
      resultsEl.innerHTML = `<p class="muted">Enter a positive portfolio value to see results.</p>`;
      return;
    }

    const mode = spendModeSelect.value;
    let S = 0;
    let wrate = 0;

    if (mode === "percent") {
      wrate = getNumber(withdrawalRateInput, 4);
      if (wrate <= 0) {
        addWarning("Withdrawal rate must be greater than 0% when using percentage mode.");
        resultsEl.innerHTML = `<p class="muted">Adjust the withdrawal rate to continue.</p>`;
        return;
      }
      S = (wrate / 100) * P;
    } else {
      S = getNumber(fixedSpendingInput, 0);
      if (S <= 0) {
        addWarning("Annual spending must be greater than $0 when using fixed amount mode.");
        resultsEl.innerHTML = `<p class="muted">Adjust the annual spending to continue.</p>`;
        return;
      }
      wrate = (S / P) * 100;
    }

    const bucket1Years = Math.max(0, getNumber(bucket1YearsInput, 2));
    const bucket2Years = Math.max(0, getNumber(bucket2YearsInput, 8));

    const B1_target = S * bucket1Years;
    const B2_target = S * bucket2Years;
    const safeTotal = B1_target + B2_target;

    let B3_target = P - safeTotal;
    if (B3_target < 0) {
      addWarning(
        "Bucket 1 + Bucket 2 require more than your total portfolio. Bucket 3 (stocks) is forced to $0. Consider lowering years of spending or your withdrawal rate."
      );
      B3_target = 0;
    }

    const impliedStockPct = (B3_target / P) * 100;
    const impliedSafePct = (safeTotal / P) * 100;

    const desiredStockPctRaw = getNumber(desiredStockPctInput, 60);
    const desiredStockPct = Math.min(100, Math.max(0, desiredStockPctRaw));

    if (Math.abs(impliedStockPct - desiredStockPct) > 5) {
      addWarning(
        `Your bucket configuration implies about ${impliedStockPct.toFixed(
          1
        )}% in stocks, but your desired stock allocation is ${desiredStockPct.toFixed(
          1
        )}%. To align them, adjust years in buckets, portfolio value, or withdrawal rate.`
      );
    }

    if (wrate > 6) {
      addWarning(
        `Your effective withdrawal rate is ${wrate.toFixed(
          2
        )}%. Historically, long-term sustainable rates are often closer to ~3–4%. High withdrawal rates increase the risk of running out of money.`
      );
    }

    const B1_years_actual = S > 0 ? B1_target / S : 0;
    const B2_years_actual = S > 0 ? B2_target / S : 0;
    const B3_years_actual = S > 0 ? B3_target / S : 0;

    const usSplitRaw = getNumber(usStockSplitInput, 50);
    const usSplit = Math.min(100, Math.max(0, usSplitRaw));

    const usStock = B3_target * (usSplit / 100);
    const intlStock = B3_target - usStock;

    const cashTarget = B1_target; // Bucket 1
    const bondTarget = B2_target; // Bucket 2

    const html = `
      <div class="results-grid">
        <div class="result-block">
          <h3>Spending &amp; Coverage</h3>
          <p><span class="result-label">Annual spending (S):</span></p>
          <p class="result-value">${formatCurrency(S)}</p>
          <p><span class="result-label">Effective withdrawal rate:</span> ${formatPercent(wrate)}</p>
        </div>

        <div class="result-block">
          <h3>Bucket 1 – Cash</h3>
          <p><span class="result-label">Target amount:</span></p>
          <p class="result-value">${formatCurrency(cashTarget)}</p>
          <p><span class="result-label">Years of coverage:</span> ${B1_years_actual.toFixed(2)}</p>
        </div>

        <div class="result-block">
          <h3>Bucket 2 – Bonds</h3>
          <p><span class="result-label">Target amount:</span></p>
          <p class="result-value">${formatCurrency(bondTarget)}</p>
          <p><span class="result-label">Years of coverage:</span> ${B2_years_actual.toFixed(2)}</p>
        </div>

        <div class="result-block">
          <h3>Bucket 3 – Stocks</h3>
          <p><span class="result-label">Target amount:</span></p>
          <p class="result-value">${formatCurrency(B3_target)}</p>
          <p><span class="result-label">Years of coverage (if spending came from stocks only):</span> ${B3_years_actual.toFixed(
            2
          )}</p>
        </div>

        <div class="result-block">
          <h3>Implied Allocation</h3>
          <p><span class="result-label">Stocks (Bucket 3):</span> ${formatPercent(impliedStockPct)}</p>
          <p><span class="result-label">Bonds + Cash (Buckets 1+2):</span> ${formatPercent(impliedSafePct)}</p>
          <p><span class="result-label">Desired stock allocation:</span> ${desiredStockPct.toFixed(1)} %</p>
        </div>

        <div class="result-block">
          <h3>Asset Breakdown</h3>
          <p><span class="result-label">Cash (Bucket 1):</span> ${formatCurrency(cashTarget)}</p>
          <p><span class="result-label">Bonds (Bucket 2):</span> ${formatCurrency(bondTarget)}</p>
          <p><span class="result-label">US stocks (${usSplit.toFixed(0)}% of Bucket 3):</span> ${formatCurrency(
            usStock
          )}</p>
          <p><span class="result-label">International stocks (${(100 - usSplit).toFixed(
            0
          )}% of Bucket 3):</span> ${formatCurrency(intlStock)}</p>
        </div>
      </div>
    `;

    resultsEl.innerHTML = html;

    // Persist inputs in localStorage for convenience
    const state = {
      portfolioValue: P,
      mode,
      withdrawalRate: getNumber(withdrawalRateInput, 4),
      fixedSpending: getNumber(fixedSpendingInput, 0),
      bucket1Years,
      bucket2Years,
      desiredStockPct,
      usStockSplit: usSplit
    };
    try {
      window.localStorage.setItem("retirementBucketPlannerState", JSON.stringify(state));
    } catch (e) {
      // ignore storage issues
    }
  }

  // Restore saved state if present
  try {
    const saved = window.localStorage.getItem("retirementBucketPlannerState");
    if (saved) {
      const state = JSON.parse(saved);
      if (state && typeof state === "object") {
        if ("portfolioValue" in state) portfolioInput.value = state.portfolioValue;
        if ("mode" in state) spendModeSelect.value = state.mode;
        if ("withdrawalRate" in state) withdrawalRateInput.value = state.withdrawalRate;
        if ("fixedSpending" in state && state.fixedSpending > 0)
          fixedSpendingInput.value = state.fixedSpending;
        if ("bucket1Years" in state) bucket1YearsInput.value = state.bucket1Years;
        if ("bucket2Years" in state) bucket2YearsInput.value = state.bucket2Years;
        if ("desiredStockPct" in state) desiredStockPctInput.value = state.desiredStockPct;
        if ("usStockSplit" in state) usStockSplitInput.value = state.usStockSplit;
      }
    }
  } catch (e) {
    // ignore
  }

  handleSpendModeChange();
  calculate();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
  });

  // Live updates as you type
  form.addEventListener("input", () => {
    calculate();
  });
});
