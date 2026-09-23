(function () {
  "use strict";

  const {
    addDays,
    buildExample,
    clonePlan,
    fromISO,
    parseMoneyToCents,
    projectPlan,
    toISO,
    validatePlan,
  } = window.HastaCore;

  const $ = (id) => document.getElementById(id);
  const today = toISO(new Date());
  const countries = {
    PA: { currency: "PAB", symbol: "B/.", position: "before", locales: { es: "es-PA", en: "en-PA" }, labels: { es: "Panamá", en: "Panama" } },
    US: { currency: "USD", symbol: "$", position: "before", locales: { es: "es-US", en: "en-US" }, labels: { es: "Estados Unidos", en: "United States" } },
    MX: { currency: "MXN", symbol: "$", position: "before", locales: { es: "es-MX", en: "en-MX" }, labels: { es: "México", en: "Mexico" } },
    CO: { currency: "COP", symbol: "$", position: "before", locales: { es: "es-CO", en: "en-CO" }, labels: { es: "Colombia", en: "Colombia" } },
    CR: { currency: "CRC", symbol: "₡", position: "before", locales: { es: "es-CR", en: "en-CR" }, labels: { es: "Costa Rica", en: "Costa Rica" } },
    DO: { currency: "DOP", symbol: "RD$", position: "before", locales: { es: "es-DO", en: "en-DO" }, labels: { es: "República Dominicana", en: "Dominican Republic" } },
    ES: { currency: "EUR", symbol: "€", position: "after", locales: { es: "es-ES", en: "en-ES" }, labels: { es: "España", en: "Spain" } },
    GB: { currency: "GBP", symbol: "£", position: "before", locales: { es: "es-GB", en: "en-GB" }, labels: { es: "Reino Unido", en: "United Kingdom" } },
  };
  const numberLocales = { PA: "es-PA", US: "en-US", MX: "es-MX", CO: "es-CO", CR: "es-CR", DO: "es-DO", ES: "es-ES", GB: "en-GB" };
  const copy = {
    es: {
      sessionNote: "Solo vive en esta pestaña", preferences: "Preferencias", preferencesHint: "La moneda y el formato siguen el país elegido.", country: "País", language: "Idioma", darkMode: "Modo nocturno", lightMode: "Modo claro",
      eyebrow: "Proyección diaria de saldo", headline: "¿Cuánto te queda hasta cobrar?", introCopy: "Anota lo que tienes, lo que entra y lo que sale. Verás el saldo después de cada día.",
      originalPlan: "Plan original", simulation: "Simulación", simulationBannerTitle: "Estás probando una copia.", simulationBannerCopy: "Los cambios de esta vista no alteran el plan original.", copyOriginal: "Copiar de nuevo el original",
      workingData: "Datos de trabajo", testSpace: "Espacio de prueba", originalHint: "Datos ficticios basados en la fecha de hoy.", simulationHint: "Modifica esta copia sin afectar el original.", resetExample: "Restablecer ejemplo",
      balanceToday: "Saldo disponible hoy", planningPeriod: "Período de planificación", fortnightly: "Quincenal · 15 días", monthly: "Mensual · 30 días", customPeriod: "Fecha personalizada", fortnightHint: "15 días, contando hoy.", monthlyHint: "30 días, contando hoy.", customPeriodHint: "Elige libremente la fecha final.", projectUntil: "Proyectar hasta", movements: "Movimientos", movementsHint: "Cobros y pagos previstos dentro del período.", addExpense: "Añadir pago", addIncome: "Añadir cobro",
      result: "Resultado", dailyMargin: "Tu margen día a día", firstNegative: "Primer día con saldo negativo", projectionPending: "Proyección pendiente", finalBalance: "Saldo al final", withoutEstimated: "Escenario sin cobros estimados",
      comparisonTitle: "Original frente a simulación", comparison: "Comparación", endOfDayBalance: "Saldo al terminar cada día", sameDayNote: "Los movimientos del mismo día se agrupan. El banco podría procesarlos en otro orden.",
      keepInMind: "Ten presente:", disclaimer: "es una estimación basada en lo que introduces. No comprueba cargos bancarios ni decide qué obligación pagar. Los datos se pierden al actualizar o cerrar esta pestaña.",
      remove: "Eliminar", description: "Descripción", type: "Tipo", expense: "Pago", income: "Cobro", date: "Fecha", amount: "Importe", estimatedIncome: "Es un cobro estimado", estimatedIncomeHint: "No lo cuentes como dinero garantizado.", estimated: "estimado",
      invalidBalance: "Escribe un saldo válido con un máximo de dos decimales.", invalidEndDate: "Elige una fecha entre hoy y los próximos 365 días.", movementLimit: "Puedes incluir hasta 60 movimientos.", missingDescription: "Añade una descripción.", invalidAmount: "El importe debe ser mayor que cero y tener hasta dos decimales.", invalidMovementDate: "La fecha debe estar dentro del período de la proyección.", invalidMovementType: "Elige cobro o pago.",
      reviewMovement: "Revisa el movimiento señalado.", reviewMovements: "Revisa los {count} movimientos señalados.", reviewGeneral: "Revisa los datos generales señalados.", needsValidData: "Necesitamos datos válidos para mostrar el saldo diario.", correctFields: "Corrige los campos señalados para calcular la proyección.",
      today: "Hoy", noMovements: "Sin movimientos", day: "día", days: "días", movement: "movimiento", negativeDay: "Primer día negativo: {date}", noNegativeDays: "Sin días negativos",
      missingThatDay: "Al terminar ese día faltarían {amount}.", noShortfall: "No falta dinero en el período", favorableBalance: "Saldo favorable", staysPositive: "El saldo no baja de cero hasta el {date}.",
      withoutOneEstimated: "Sin contar ese cobro, {negative} y el saldo final sería {amount}.", withoutManyEstimated: "Sin contar esos cobros, {negative} y el saldo final sería {amount}.", wouldBeNegative: "el primer día negativo sería el {date}", wouldStayPositive: "no habría días negativos en el período",
      deleteItem: "Eliminar {description}", dailyBalancesLabel: "Saldos diarios", viewTabsLabel: "Plan que deseas consultar", brandLabel: "Hasta la quincena, ir a la herramienta",
      pendingPayment: "Pago pendiente", necessaryPurchase: "Compra necesaria", groceries: "Supermercado", nextIncome: "Próximo cobro",
    },
    en: {
      sessionNote: "Only available in this tab", preferences: "Preferences", preferencesHint: "Currency and number formats follow the selected country.", country: "Country", language: "Language", darkMode: "Dark mode", lightMode: "Light mode",
      eyebrow: "Daily balance projection", headline: "How much will you have left until payday?", introCopy: "Enter what you have, what is coming in and what is going out. You will see your balance at the end of each day.",
      originalPlan: "Original plan", simulation: "Simulation", simulationBannerTitle: "You are testing a copy.", simulationBannerCopy: "Changes in this view do not affect the original plan.", copyOriginal: "Copy the original again",
      workingData: "Working data", testSpace: "Test space", originalHint: "Sample data based on today's date.", simulationHint: "Change this copy without affecting the original.", resetExample: "Reset sample",
      balanceToday: "Balance available today", planningPeriod: "Planning period", fortnightly: "Fortnightly · 15 days", monthly: "Monthly · 30 days", customPeriod: "Custom date", fortnightHint: "15 days, including today.", monthlyHint: "30 days, including today.", customPeriodHint: "Choose the ending date freely.", projectUntil: "Project through", movements: "Transactions", movementsHint: "Expected income and payments within the period.", addExpense: "Add payment", addIncome: "Add income",
      result: "Result", dailyMargin: "Your daily margin", firstNegative: "First day with a negative balance", projectionPending: "Projection pending", finalBalance: "Ending balance", withoutEstimated: "Scenario without estimated income",
      comparisonTitle: "Original versus simulation", comparison: "Comparison", endOfDayBalance: "Balance at the end of each day", sameDayNote: "Transactions on the same day are grouped. The bank may process them in a different order.",
      keepInMind: "Keep in mind:", disclaimer: "this is an estimate based on what you enter. It does not check bank charges or decide which obligation to pay. Data is lost when you refresh or close this tab.",
      remove: "Remove", description: "Description", type: "Type", expense: "Payment", income: "Income", date: "Date", amount: "Amount", estimatedIncome: "This income is estimated", estimatedIncomeHint: "Do not count it as guaranteed money.", estimated: "estimated",
      invalidBalance: "Enter a valid balance with no more than two decimal places.", invalidEndDate: "Choose a date from today through the next 365 days.", movementLimit: "You can include up to 60 transactions.", missingDescription: "Add a description.", invalidAmount: "The amount must be greater than zero and have no more than two decimal places.", invalidMovementDate: "The date must be within the projection period.", invalidMovementType: "Choose income or payment.",
      reviewMovement: "Review the highlighted transaction.", reviewMovements: "Review the {count} highlighted transactions.", reviewGeneral: "Review the highlighted general information.", needsValidData: "Valid data is needed to show the daily balance.", correctFields: "Correct the highlighted fields to calculate the projection.",
      today: "Today", noMovements: "No transactions", day: "day", days: "days", movement: "transaction", negativeDay: "First negative day: {date}", noNegativeDays: "No negative days", 
      missingThatDay: "At the end of that day, you would be short {amount}.", noShortfall: "No shortfall in this period", favorableBalance: "Positive balance", staysPositive: "The balance does not fall below zero through {date}.",
      withoutOneEstimated: "Without counting that income, {negative} and the ending balance would be {amount}.", withoutManyEstimated: "Without counting those income items, {negative} and the ending balance would be {amount}.", wouldBeNegative: "the first negative day would be {date}", wouldStayPositive: "there would be no negative days in the period",
      deleteItem: "Remove {description}", dailyBalancesLabel: "Daily balances", viewTabsLabel: "Plan to view", brandLabel: "Hasta la quincena, go to the tool",
      pendingPayment: "Pending payment", necessaryPurchase: "Necessary purchase", groceries: "Groceries", nextIncome: "Next income",
    },
  };
  const settings = { country: "PA", language: "es", theme: "light" };
  let sequence = 0;
  const createId = () => `movement-${Date.now()}-${++sequence}`;
  let original = buildExample(today, createId, settings.language);
  let simulation = null;
  let activeView = "original";

  const elements = {
    countrySelect: $("country-select"),
    languageSelect: $("language-select"),
    themeToggle: $("theme-toggle"),
    themeToggleText: $("theme-toggle-text"),
    tabOriginal: $("tab-original"),
    tabSimulation: $("tab-simulation"),
    simulationBanner: $("simulation-banner"),
    resetSimulation: $("reset-simulation"),
    resetExample: $("reset-example"),
    planKicker: $("plan-kicker"),
    planHeading: $("plan-heading"),
    exampleNote: $("example-note"),
    startBalance: $("start-balance"),
    startBalanceError: $("start-balance-error"),
    periodSelect: $("period-select"),
    periodHint: $("period-hint"),
    endDate: $("end-date"),
    endDateError: $("end-date-error"),
    movementList: $("movement-list"),
    movementTemplate: $("movement-template"),
    movementCount: $("movement-count"),
    addExpense: $("add-expense"),
    addIncome: $("add-income"),
    formStatus: $("form-status"),
    activeViewBadge: $("active-view-badge"),
    summaryLabel: $("summary-label"),
    summaryValue: $("summary-value"),
    summaryDetail: $("summary-detail"),
    finalBalance: $("final-balance"),
    estimateCard: $("estimate-card"),
    estimateCopy: $("estimate-copy"),
    comparisonCard: $("comparison-card"),
    originalFinal: $("original-final"),
    originalNegative: $("original-negative"),
    simulationFinal: $("simulation-final"),
    simulationNegative: $("simulation-negative"),
    periodCount: $("period-count"),
    dailyList: $("daily-list"),
  };

  function activePlan() {
    return activeView === "simulation" ? simulation : original;
  }

  function t(key, variables) {
    let value = copy[settings.language][key] || key;
    for (const [name, replacement] of Object.entries(variables || {})) {
      value = value.replace(`{${name}}`, replacement);
    }
    return value;
  }

  function currentCountry() {
    return countries[settings.country];
  }

  function currentLocale() {
    return currentCountry().locales[settings.language];
  }

  function formatMoney(cents) {
    const sign = cents < 0 ? "−" : "";
    const formatted = new Intl.NumberFormat(numberLocales[settings.country], {
      style: "currency",
      currency: currentCountry().currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(cents) / 100);
    return `${sign}${formatted}`;
  }

  function formatInputMoney(cents) {
    return new Intl.NumberFormat(numberLocales[settings.country], {
      useGrouping: false,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  }

  function formatDate(iso, options) {
    const date = fromISO(iso);
    if (!date) return "—";
    if (!options) {
      const [year, month, day] = iso.split("-");
      return settings.country === "US" ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
    }
    return new Intl.DateTimeFormat(currentLocale(), options).format(date);
  }

  function negativeLabel(date) {
    return date ? t("negativeDay", { date: formatDate(date) }) : t("noNegativeDays");
  }

  function setInvalid(input, messageNode, message) {
    input.setAttribute("aria-invalid", message ? "true" : "false");
    messageNode.textContent = message ? t(message) : "";
  }

  function syncTopFields() {
    const plan = activePlan();
    plan.balance = elements.startBalance.value;
    plan.end = elements.endDate.value;
  }

  function translateWithin(root) {
    for (const node of root.querySelectorAll("[data-i18n]")) {
      node.textContent = t(node.dataset.i18n);
    }
  }

  function populateCountries() {
    const selected = settings.country;
    elements.countrySelect.replaceChildren();
    for (const [code, country] of Object.entries(countries)) {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${country.labels[settings.language]} · ${country.currency}`;
      elements.countrySelect.append(option);
    }
    elements.countrySelect.value = selected;
  }

  function applyLanguage() {
    document.documentElement.lang = settings.language;
    translateWithin(document);
    translateWithin(elements.movementTemplate.content);
    populateCountries();
    elements.languageSelect.value = settings.language;
    document.title = settings.language === "es"
      ? "Hasta la quincena · Proyección de saldo"
      : "Hasta la quincena · Balance projection";
    document.querySelector('meta[name="description"]').content = settings.language === "es"
      ? "Proyecta tu saldo diario y prueba cambios sin alterar tu plan original."
      : "Project your daily balance and test changes without altering your original plan.";
    document.querySelector(".brand").setAttribute("aria-label", t("brandLabel"));
    document.querySelector(".view-switcher").setAttribute("aria-label", t("viewTabsLabel"));
    elements.dailyList.setAttribute("aria-label", t("dailyBalancesLabel"));
    updateThemeControl();
  }

  function updateThemeControl() {
    const dark = settings.theme === "dark";
    elements.themeToggle.setAttribute("aria-pressed", String(dark));
    elements.themeToggleText.textContent = dark ? t("lightMode") : t("darkMode");
    elements.themeToggle.querySelector(".theme-icon").textContent = dark ? "☀" : "☾";
  }

  function applyTheme() {
    document.documentElement.dataset.theme = settings.theme;
    document.querySelector('meta[name="theme-color"]').content = settings.theme === "dark" ? "#071923" : "#102a43";
    updateThemeControl();
  }

  function reformatPlanMoney(plan) {
    if (!plan) return;
    const balance = parseMoneyToCents(plan.balance, { allowNegative: true });
    if (balance !== null) plan.balance = formatInputMoney(balance);
    for (const movement of plan.items) {
      const amount = parseMoneyToCents(movement.amount);
      if (amount !== null) movement.amount = formatInputMoney(amount);
    }
  }

  function translateSampleItems(plan) {
    if (!plan) return;
    for (const movement of plan.items) {
      if (movement.sampleKey) movement.description = t(movement.sampleKey);
    }
  }

  function updateCurrencyAffixes(root) {
    const scope = root || document;
    const country = currentCountry();
    for (const affix of scope.querySelectorAll(".currency-affix")) {
      affix.textContent = country.symbol;
      affix.closest(".money-input").classList.toggle("currency-after", country.position === "after");
    }
  }

  function updatePeriodHint() {
    const period = activePlan().period || "custom";
    const key = period === "fortnight" ? "fortnightHint" : period === "monthly" ? "monthlyHint" : "customPeriodHint";
    elements.periodHint.textContent = t(key);
  }

  function renderEditor() {
    const plan = activePlan();
    const simulationMode = activeView === "simulation";
    const lastAllowed = addDays(today, 365);

    elements.tabOriginal.setAttribute("aria-selected", String(!simulationMode));
    elements.tabSimulation.setAttribute("aria-selected", String(simulationMode));
    elements.simulationBanner.hidden = !simulationMode;
    elements.planKicker.textContent = simulationMode ? t("testSpace") : t("workingData");
    elements.planHeading.textContent = simulationMode ? t("simulation") : t("originalPlan");
    elements.exampleNote.textContent = simulationMode
      ? t("simulationHint")
      : t("originalHint");
    elements.resetExample.hidden = simulationMode;
    elements.activeViewBadge.textContent = simulationMode ? t("simulation") : t("originalPlan");

    elements.startBalance.value = plan.balance;
    plan.period = plan.period || "custom";
    elements.periodSelect.value = plan.period;
    updatePeriodHint();
    elements.endDate.value = plan.end;
    elements.endDate.min = today;
    elements.endDate.max = lastAllowed;
    elements.movementCount.textContent = settings.language === "es" ? `${plan.items.length} de 60` : `${plan.items.length} of 60`;
    elements.addExpense.disabled = plan.items.length >= 60;
    elements.addIncome.disabled = plan.items.length >= 60;
    elements.movementList.replaceChildren();

    const validation = validatePlan(plan, today);
    for (const movement of plan.items) {
      const fragment = elements.movementTemplate.content.cloneNode(true);
      const card = fragment.querySelector(".movement-card");
      const kind = fragment.querySelector(".movement-kind");
      const remove = fragment.querySelector(".remove-button");
      const description = fragment.querySelector(".movement-description");
      const descriptionError = fragment.querySelector(".movement-description-error");
      const type = fragment.querySelector(".movement-type");
      const date = fragment.querySelector(".movement-date");
      const dateError = fragment.querySelector(".movement-date-error");
      const amount = fragment.querySelector(".movement-amount");
      const amountError = fragment.querySelector(".movement-amount-error");
      const estimateLabel = fragment.querySelector(".estimated-toggle");
      const estimated = fragment.querySelector(".movement-estimated");
      const itemErrors = validation.errors.items[movement.id] || {};
      const idBase = String(movement.id).replace(/[^a-zA-Z0-9_-]/g, "");

      card.dataset.id = movement.id;
      kind.textContent = movement.type === "income" ? t("income") : t("expense");
      kind.classList.toggle("income", movement.type === "income");

      description.id = `${idBase}-description`;
      description.previousElementSibling.setAttribute("for", description.id);
      description.value = movement.description;
      description.setAttribute("aria-describedby", `${idBase}-description-error`);
      descriptionError.id = `${idBase}-description-error`;
      setInvalid(description, descriptionError, itemErrors.description);

      type.id = `${idBase}-type`;
      type.previousElementSibling.setAttribute("for", type.id);
      type.value = movement.type;

      date.id = `${idBase}-date`;
      date.previousElementSibling.setAttribute("for", date.id);
      date.value = movement.date;
      date.min = today;
      date.max = plan.end || lastAllowed;
      date.setAttribute("aria-describedby", `${idBase}-date-error`);
      dateError.id = `${idBase}-date-error`;
      setInvalid(date, dateError, itemErrors.date);

      amount.id = `${idBase}-amount`;
      amount.closest(".field-group").querySelector("label").setAttribute("for", amount.id);
      amount.value = movement.amount;
      amount.setAttribute("aria-describedby", `${idBase}-amount-error`);
      amountError.id = `${idBase}-amount-error`;
      setInvalid(amount, amountError, itemErrors.amount);

      estimated.checked = Boolean(movement.estimated);
      estimateLabel.hidden = movement.type !== "income";

      remove.setAttribute("aria-label", t("deleteItem", { description: movement.description || t("movement") }));
      remove.addEventListener("click", () => {
        plan.items = plan.items.filter((item) => item.id !== movement.id);
        renderAll();
      });

      description.addEventListener("input", () => {
        movement.description = description.value;
        delete movement.sampleKey;
        renderResults();
      });
      type.addEventListener("change", () => {
        movement.type = type.value;
        if (movement.type !== "income") movement.estimated = false;
        renderAll();
      });
      date.addEventListener("input", () => {
        movement.date = date.value;
        renderResults();
      });
      amount.addEventListener("input", () => {
        movement.amount = amount.value;
        renderResults();
      });
      estimated.addEventListener("change", () => {
        movement.estimated = estimated.checked;
        renderResults();
      });

      elements.movementList.append(fragment);
    }
    updateCurrencyAffixes();
  }

  function renderValidation(validation) {
    setInvalid(elements.startBalance, elements.startBalanceError, validation.errors.balance);
    setInvalid(elements.endDate, elements.endDateError, validation.errors.end);

    for (const card of elements.movementList.querySelectorAll(".movement-card")) {
      const errors = validation.errors.items[card.dataset.id] || {};
      setInvalid(card.querySelector(".movement-description"), card.querySelector(".movement-description-error"), errors.description);
      setInvalid(card.querySelector(".movement-date"), card.querySelector(".movement-date-error"), errors.date);
      setInvalid(card.querySelector(".movement-amount"), card.querySelector(".movement-amount-error"), errors.amount);
    }

    const invalidItems = Object.keys(validation.errors.items).length;
    if (validation.errors.limit) {
      elements.formStatus.textContent = t(validation.errors.limit);
    } else if (invalidItems) {
      elements.formStatus.textContent = invalidItems === 1
        ? t("reviewMovement")
        : t("reviewMovements", { count: invalidItems });
    } else if (validation.errors.balance || validation.errors.end) {
      elements.formStatus.textContent = t("reviewGeneral");
    } else {
      elements.formStatus.textContent = "";
    }
  }

  function resetResultState(messageKey) {
    elements.summaryLabel.textContent = t("projectionPending");
    elements.summaryValue.textContent = "—";
    elements.summaryValue.className = "summary-value";
    elements.summaryDetail.textContent = t(messageKey);
    elements.finalBalance.textContent = "—";
    elements.finalBalance.className = "";
    elements.estimateCard.hidden = true;
    elements.comparisonCard.hidden = true;
    elements.periodCount.textContent = "";
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("correctFields");
    elements.dailyList.replaceChildren(empty);
  }

  function renderDailyRows(result) {
    elements.dailyList.replaceChildren();
    elements.periodCount.textContent = `${result.rows.length} ${result.rows.length === 1 ? t("day") : t("days")}`;

    for (const row of result.rows) {
      const wrapper = document.createElement("article");
      wrapper.className = `day-row${row.date === today ? " today" : ""}${row.balanceCents < 0 ? " negative" : ""}`;
      const date = document.createElement("div");
      date.className = "day-date";
      const dateName = row.date === today
        ? t("today")
        : formatDate(row.date, { weekday: "short", day: "numeric", month: "short" });
      date.innerHTML = `<strong>${dateName}</strong><small>${formatDate(row.date)}</small>`;

      const events = document.createElement("div");
      events.className = "day-events";
      if (!row.events.length) {
        const noEvents = document.createElement("span");
        noEvents.className = "no-events";
        noEvents.textContent = t("noMovements");
        events.append(noEvents);
      } else {
        for (const movement of row.events) {
          const line = document.createElement("div");
          line.className = "event-line";
          const amount = parseMoneyToCents(movement.amount);
          const sign = document.createElement("span");
          sign.className = `event-sign ${movement.type}`;
          sign.textContent = `${movement.type === "income" ? "+" : "−"}${formatMoney(amount).replace("−", "")}`;
          const description = document.createElement("span");
          description.className = "event-description";
          description.textContent = movement.description;
          line.append(sign, description);
          if (movement.type === "income" && movement.estimated) {
            const chip = document.createElement("span");
            chip.className = "estimated-chip";
            chip.textContent = t("estimated");
            line.append(chip);
          }
          events.append(line);
        }
      }

      const balance = document.createElement("strong");
      balance.className = "day-balance";
      balance.textContent = formatMoney(row.balanceCents);
      wrapper.append(date, events, balance);
      elements.dailyList.append(wrapper);
    }
  }

  function renderComparison(simulationResult) {
    if (activeView !== "simulation") {
      elements.comparisonCard.hidden = true;
      return;
    }
    const originalResult = projectPlan(original, today);
    if (!originalResult.ok) {
      elements.comparisonCard.hidden = true;
      return;
    }
    elements.comparisonCard.hidden = false;
    elements.originalFinal.textContent = formatMoney(originalResult.finalCents);
    elements.originalNegative.textContent = negativeLabel(originalResult.firstNegative);
    elements.simulationFinal.textContent = formatMoney(simulationResult.finalCents);
    elements.simulationNegative.textContent = negativeLabel(simulationResult.firstNegative);
  }

  function renderResults() {
    syncTopFields();
    const plan = activePlan();
    const result = projectPlan(plan, today);
    renderValidation(result.validation);

    if (!result.ok) {
      resetResultState("needsValidData");
      return;
    }

    if (result.firstNegative) {
      const negativeRow = result.rows.find((row) => row.date === result.firstNegative);
      elements.summaryLabel.textContent = t("firstNegative");
      elements.summaryValue.textContent = formatDate(result.firstNegative);
      elements.summaryValue.className = "summary-value negative";
      elements.summaryDetail.textContent = t("missingThatDay", { amount: formatMoney(Math.abs(negativeRow.balanceCents)) });
    } else {
      elements.summaryLabel.textContent = t("noShortfall");
      elements.summaryValue.textContent = t("favorableBalance");
      elements.summaryValue.className = "summary-value";
      elements.summaryDetail.textContent = t("staysPositive", { date: formatDate(plan.end) });
    }

    elements.finalBalance.textContent = formatMoney(result.finalCents);
    elements.finalBalance.className = result.finalCents < 0 ? "negative" : "positive";

    if (result.estimatedCount) {
      elements.estimateCard.hidden = false;
      const negativeText = result.firstNegativeWithoutEstimated
        ? t("wouldBeNegative", { date: formatDate(result.firstNegativeWithoutEstimated) })
        : t("wouldStayPositive");
      elements.estimateCopy.textContent = t(result.estimatedCount === 1 ? "withoutOneEstimated" : "withoutManyEstimated", {
        negative: negativeText,
        amount: formatMoney(result.finalWithoutEstimatedCents),
      });
    } else {
      elements.estimateCard.hidden = true;
    }

    renderComparison(result);
    renderDailyRows(result);
  }

  function renderAll() {
    renderEditor();
    renderResults();
  }

  function switchView(nextView) {
    if (nextView === "simulation" && !simulation) simulation = clonePlan(original);
    activeView = nextView;
    renderAll();
  }

  function addMovement(type) {
    const plan = activePlan();
    if (plan.items.length >= 60) {
      elements.formStatus.textContent = t("movementLimit");
      return;
    }
    const movement = {
      id: createId(),
      type,
      description: "",
      date: today,
      amount: "",
      estimated: false,
    };
    plan.items.push(movement);
    renderAll();
    const card = elements.movementList.querySelector(`[data-id="${movement.id}"]`);
    if (card) {
      card.scrollIntoView({ block: "nearest", behavior: "smooth" });
      card.querySelector(".movement-description").focus();
    }
  }

  elements.startBalance.addEventListener("input", renderResults);
  elements.periodSelect.addEventListener("change", () => {
    const plan = activePlan();
    plan.period = elements.periodSelect.value;
    if (plan.period === "fortnight") plan.end = addDays(today, 14);
    if (plan.period === "monthly") plan.end = addDays(today, 29);
    renderAll();
  });
  elements.endDate.addEventListener("input", () => {
    const plan = activePlan();
    plan.end = elements.endDate.value;
    plan.period = "custom";
    elements.periodSelect.value = "custom";
    updatePeriodHint();
    renderResults();
  });
  elements.addExpense.addEventListener("click", () => addMovement("expense"));
  elements.addIncome.addEventListener("click", () => addMovement("income"));
  elements.tabOriginal.addEventListener("click", () => switchView("original"));
  elements.tabSimulation.addEventListener("click", () => switchView("simulation"));
  elements.resetSimulation.addEventListener("click", () => {
    simulation = clonePlan(original);
    renderAll();
  });
  elements.resetExample.addEventListener("click", () => {
    original = buildExample(today, createId, settings.language);
    simulation = null;
    renderAll();
  });

  elements.countrySelect.addEventListener("change", () => {
    syncTopFields();
    settings.country = elements.countrySelect.value;
    reformatPlanMoney(original);
    reformatPlanMoney(simulation);
    renderAll();
  });
  elements.languageSelect.addEventListener("change", () => {
    syncTopFields();
    settings.language = elements.languageSelect.value;
    reformatPlanMoney(original);
    reformatPlanMoney(simulation);
    translateSampleItems(original);
    translateSampleItems(simulation);
    applyLanguage();
    renderAll();
  });
  elements.themeToggle.addEventListener("click", () => {
    settings.theme = settings.theme === "dark" ? "light" : "dark";
    applyTheme();
  });

  applyLanguage();
  applyTheme();
  updateCurrencyAffixes();
  renderAll();
})();
