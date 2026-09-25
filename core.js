(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CashPlanCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

  function toISO(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  function fromISO(value) {
    if (!ISO_DATE.test(String(value))) return null;
    const [year, month, day] = String(value).split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) return null;
    return date;
  }

  function addDays(iso, amount) {
    const date = fromISO(iso);
    if (!date) return "";
    date.setDate(date.getDate() + amount);
    return toISO(date);
  }

  function parseMoneyToCents(value, options) {
    const allowNegative = Boolean(options && options.allowNegative);
    const normalized = String(value == null ? "" : value).trim().replace(",", ".");
    const pattern = allowNegative
      ? /^(-)?(\d+)(?:\.(\d{1,2}))?$/
      : /^(\d+)(?:\.(\d{1,2}))?$/;
    const match = normalized.match(pattern);
    if (!match) return null;

    const negative = allowNegative && Boolean(match[1]);
    const whole = Number(match[allowNegative ? 2 : 1]);
    const decimals = (match[allowNegative ? 3 : 2] || "").padEnd(2, "0");
    const cents = whole * 100 + Number(decimals);
    if (!Number.isSafeInteger(cents)) return null;
    return negative ? -cents : cents;
  }

  function clonePlan(plan) {
    return {
      balance: String(plan.balance),
      end: plan.end,
      period: plan.period || "custom",
      items: plan.items.map((item) => ({ ...item })),
    };
  }

  function buildExample(today, createId, language) {
    let fallbackId = 0;
    const id = typeof createId === "function" ? createId : () => `example-${++fallbackId}`;
    const english = language === "en";
    return {
      balance: "150.00",
      end: addDays(today, 14),
      period: "fortnight",
      items: [
        { id: id(), sampleKey: "pendingPayment", type: "expense", description: english ? "Pending payment" : "Pago pendiente", date: addDays(today, 1), amount: "50.00", estimated: false },
        { id: id(), sampleKey: "necessaryPurchase", type: "expense", description: english ? "Necessary purchase" : "Compra necesaria", date: addDays(today, 2), amount: "55.00", estimated: false },
        { id: id(), sampleKey: "groceries", type: "expense", description: english ? "Groceries" : "Supermercado", date: addDays(today, 3), amount: "70.00", estimated: false },
        { id: id(), sampleKey: "nextIncome", type: "income", description: english ? "Next income" : "Próximo cobro", date: addDays(today, 7), amount: "600.00", estimated: false },
      ],
    };
  }

  function validatePlan(plan, today) {
    const errors = { balance: "", end: "", items: {} };
    const balanceCents = parseMoneyToCents(plan.balance, { allowNegative: true });
    if (balanceCents === null) {
      errors.balance = "invalidBalance";
    }

    const endDate = fromISO(plan.end);
    const lastAllowed = addDays(today, 365);
    if (!endDate || plan.end < today || plan.end > lastAllowed) {
      errors.end = "invalidEndDate";
    }

    if (plan.items.length > 60) {
      errors.limit = "movementLimit";
    }

    for (const movement of plan.items) {
      const itemErrors = {};
      if (!String(movement.description || "").trim()) {
        itemErrors.description = "missingDescription";
      }
      const amountCents = parseMoneyToCents(movement.amount);
      if (amountCents === null || amountCents <= 0) {
        itemErrors.amount = "invalidAmount";
      }
      if (!fromISO(movement.date) || movement.date < today || movement.date > plan.end) {
        itemErrors.date = "invalidMovementDate";
      }
      if (movement.type !== "income" && movement.type !== "expense") {
        itemErrors.type = "invalidMovementType";
      }
      if (Object.keys(itemErrors).length) errors.items[movement.id] = itemErrors;
    }

    const valid = !errors.balance && !errors.end && !errors.limit && !Object.keys(errors.items).length;
    return { valid, errors, balanceCents };
  }

  function projectPlan(plan, today) {
    const validation = validatePlan(plan, today);
    if (!validation.valid) return { ok: false, validation };

    const byDay = new Map();
    let estimatedCount = 0;
    for (const movement of plan.items) {
      if (!byDay.has(movement.date)) byDay.set(movement.date, []);
      byDay.get(movement.date).push(movement);
      if (movement.type === "income" && movement.estimated) estimatedCount += 1;
    }

    let balanceCents = validation.balanceCents;
    let guaranteedCents = validation.balanceCents;
    let firstNegative = null;
    let firstNegativeWithoutEstimated = null;
    const rows = [];

    for (let day = today; day <= plan.end; day = addDays(day, 1)) {
      const events = byDay.get(day) || [];
      let dayNetCents = 0;
      let dayNetWithoutEstimatedCents = 0;

      for (const movement of events) {
        const amountCents = parseMoneyToCents(movement.amount);
        const delta = movement.type === "income" ? amountCents : -amountCents;
        dayNetCents += delta;
        if (!(movement.type === "income" && movement.estimated)) {
          dayNetWithoutEstimatedCents += delta;
        }
      }

      balanceCents += dayNetCents;
      guaranteedCents += dayNetWithoutEstimatedCents;
      if (balanceCents < 0 && !firstNegative) firstNegative = day;
      if (guaranteedCents < 0 && !firstNegativeWithoutEstimated) {
        firstNegativeWithoutEstimated = day;
      }

      rows.push({
        date: day,
        events,
        dayNetCents,
        balanceCents,
        balanceWithoutEstimatedCents: guaranteedCents,
      });
    }

    return {
      ok: true,
      validation,
      rows,
      finalCents: balanceCents,
      finalWithoutEstimatedCents: guaranteedCents,
      firstNegative,
      firstNegativeWithoutEstimated,
      estimatedCount,
    };
  }

  return {
    addDays,
    buildExample,
    clonePlan,
    fromISO,
    parseMoneyToCents,
    projectPlan,
    toISO,
    validatePlan,
  };
});
