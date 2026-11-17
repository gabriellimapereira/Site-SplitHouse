/**
 * SplitHouse Landing Page - Interactive Engine v3.0
 * Paleta Oficial: #5E2B97, #4A2278, #CC92C2, #F5ECF3, #FCFCFC, #2D2D2A
 * Padrão Oficial do APK: v1.0.0 | Android 8.0+
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileDrawer();
  initPhoneSimulator();
  initExpenseCalculator();
  initGamificationDemo();
  initFAQAccordion();
  initCopySha();
});

/* ==========================================================================
   1. Menu Mobile Hamburguer (Acessível e Fluido)
   ========================================================================== */
function initMobileDrawer() {
  const openBtn = document.getElementById("mobile-menu-open");
  const closeBtn = document.getElementById("mobile-menu-close");
  const drawer = document.getElementById("mobile-drawer");
  const overlay = document.getElementById("drawer-overlay");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add("open");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}

/* ==========================================================================
   2. Phone Simulator (Mockup Interativo)
   ========================================================================== */
function initPhoneSimulator() {
  const tabs = document.querySelectorAll(".tab-btn");
  const iframe = document.getElementById("phone-screen-frame");
  const caption = document.getElementById("mockup-caption");

  const screenData = {
    dashboard: {
      url: "screens/13_painel_principal.html",
      caption: "Painel Principal: Saldo da casa, escala do dia e mural de avisos"
    },
    expenses: {
      url: "screens/14_lista_despesas.html",
      caption: "Despesas: Divisão automática, filtros por categoria e status de pagamento"
    },
    tasks: {
      url: "screens/20_quadro_tarefas.html",
      caption: "Tarefas: Quadro Kanban rotativo com pontuação de XP por afazer"
    },
    ranking: {
      url: "screens/24_ranking_moradores.html",
      caption: "Ranking Gamificado: Pódio mensal e histórico de dedicação dos moradores"
    },
    store: {
      url: "screens/25_loja_casa.html",
      caption: "Loja da República: Resgate de privilégios usando SplitCoins acumuladas"
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-screen");
      if (!screenData[target]) return;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      if (iframe) {
        iframe.style.opacity = "0.2";
        setTimeout(() => {
          iframe.src = screenData[target].url;
          iframe.style.opacity = "1";
        }, 140);
      }

      if (caption) {
        caption.textContent = screenData[target].caption;
      }
    });
  });
}

/* ==========================================================================
   3. Simulador de Divisão de Contas em Tempo Real
   ========================================================================== */
function initExpenseCalculator() {
  const amountInput = document.getElementById("calc-amount");
  const residentsSlider = document.getElementById("calc-residents-slider");
  const residentsValDisplay = document.getElementById("calc-residents-count");
  const perPersonDisplay = document.getElementById("calc-per-person");
  const totalDisplay = document.getElementById("calc-total-display");
  const roommatesList = document.getElementById("calc-roommates-list");
  const pills = document.querySelectorAll(".quick-pill");

  const namesPool = [
    { name: "Você (Pagador)", role: "Organizador da Conta", avatar: "VC" },
    { name: "Lucas M.", role: "Morador Quarto 1", avatar: "LM" },
    { name: "Ana Beatriz", role: "Moradora Quarto 2", avatar: "AB" },
    { name: "Carlos E.", role: "Morador Quarto 3", avatar: "CE" },
    { name: "Mariana S.", role: "Moradora Quarto 4", avatar: "MS" },
    { name: "Gabriel T.", role: "Morador Quarto 5", avatar: "GT" },
    { name: "Fernanda L.", role: "Moradora Quarto 6", avatar: "FL" },
    { name: "Rodrigo P.", role: "Morador Suíte", avatar: "RP" },
    { name: "Camila V.", role: "Moradora Quarto 7", avatar: "CV" },
    { name: "Vinicius N.", role: "Morador Quarto 8", avatar: "VN" }
  ];

  function formatBRL(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function recalculate() {
    let rawAmount = parseFloat(amountInput.value) || 0;
    if (rawAmount < 0) rawAmount = 0;

    const count = parseInt(residentsSlider.value, 10) || 4;
    residentsValDisplay.textContent = count;

    const perPerson = count > 0 ? rawAmount / count : 0;

    perPersonDisplay.innerHTML = `${formatBRL(perPerson)} <span style="font-size: 1rem; color: #5B6271; font-weight: 500;">/pessoa</span>`;
    if (totalDisplay) {
      totalDisplay.textContent = formatBRL(rawAmount);
    }

    if (roommatesList) {
      roommatesList.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const item = namesPool[i] || { name: `Morador ${i + 1}`, role: "Morador", avatar: `M${i+1}` };
        const row = document.createElement("div");
        row.className = "roommate-row";
        row.innerHTML = `
          <div class="roommate-info">
            <div class="avatar-circle" style="${i === 0 ? 'background: #5E2B97;' : 'background: #CC92C2; color: #4A2278;'}">${item.avatar}</div>
            <div>
              <div class="roommate-name">${item.name}</div>
              <div class="roommate-role">${item.role}</div>
            </div>
          </div>
          <div class="roommate-val">${formatBRL(perPerson)}</div>
        `;
        roommatesList.appendChild(row);
      }
    }
  }

  if (amountInput) amountInput.addEventListener("input", recalculate);
  if (residentsSlider) residentsSlider.addEventListener("input", recalculate);

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const val = pill.getAttribute("data-val");
      if (val && amountInput) {
        amountInput.value = val;
        recalculate();
      }
    });
  });

  recalculate();
}

/* ==========================================================================
   4. Simulador de Gamificação e Nível
   ========================================================================== */
function initGamificationDemo() {
  let xp = 720;
  const xpMax = 1000;
  let coins = 145;
  let level = 3;
  let completedCount = 18;

  const levelTiers = {
    1: "Novato da República",
    2: "Morador Atento",
    3: "Guardião da República",
    4: "Lorde do SplitHouse",
    5: "Lenda da Moradia"
  };

  const xpFillEl = document.getElementById("demo-xp-fill");
  const xpCurrentEl = document.getElementById("demo-xp-current");
  const coinsEl = document.getElementById("demo-coins-count");
  const levelBadgeEl = document.getElementById("demo-level-badge");
  const tierTitleEl = document.getElementById("demo-tier-title");
  const completedCountEl = document.getElementById("demo-completed-count");
  const taskButtons = document.querySelectorAll(".btn-complete-task");

  function updateUI() {
    const pct = Math.min(100, Math.round((xp / xpMax) * 100));
    if (xpFillEl) xpFillEl.style.width = `${pct}%`;
    if (xpCurrentEl) xpCurrentEl.textContent = `${xp} / ${xpMax} XP (${pct}%)`;
    if (coinsEl) coinsEl.textContent = coins;
    if (levelBadgeEl) levelBadgeEl.textContent = `Nível ${level}`;
    if (tierTitleEl) tierTitleEl.textContent = levelTiers[level] || "Mestre Supremo";
    if (completedCountEl) completedCountEl.textContent = completedCount;
  }

  taskButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const xpGain = parseInt(btn.getAttribute("data-xp") || "30", 10);
      const coinGain = parseInt(btn.getAttribute("data-coins") || "15", 10);
      const taskTitle = btn.getAttribute("data-task") || "Tarefa";

      xp += xpGain;
      coins += coinGain;
      completedCount += 1;

      btn.disabled = true;
      btn.textContent = "Concluída";
      btn.style.background = "#059669";
      btn.style.color = "#FFFFFF";
      btn.style.borderColor = "#059669";

      showToast(`Tarefa "${taskTitle}" validada: +${xpGain} XP e +${coinGain} Moedas.`);

      if (xp >= xpMax) {
        level += 1;
        xp = xp - xpMax;
        showToast(`Novo Nível Atingido: Nível ${level} (${levelTiers[level] || 'Lorde'}).`);
      }

      updateUI();

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "Validar";
        btn.style.background = "";
        btn.style.color = "";
        btn.style.borderColor = "";
      }, 4500);
    });
  });

  updateUI();
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFAQAccordion() {
  const items = document.querySelectorAll(".accordion-item");
  items.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    if (header) {
      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        items.forEach((i) => i.classList.remove("open"));
        if (!isOpen) {
          item.classList.add("open");
        }
      });
    }
  });
}

/* ==========================================================================
   6. Copiar Hash SHA-256
   ========================================================================== */
function initCopySha() {
  const btn = document.getElementById("btn-copy-sha");
  const hashEl = document.getElementById("sha-hash-text");

  if (btn && hashEl) {
    btn.addEventListener("click", () => {
      const text = hashEl.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "Copiado";
        btn.style.background = "#059669";
        btn.style.color = "#FFFFFF";
        btn.style.borderColor = "#059669";
        showToast("Hash SHA-256 copiado para a área de transferência.");
        setTimeout(() => {
          btn.textContent = "Copiar";
          btn.style.background = "";
          btn.style.color = "";
          btn.style.borderColor = "";
        }, 2500);
      }).catch(() => {
        showToast("Não foi possível copiar automaticamente.");
      });
    });
  }
}

/* ==========================================================================
   7. Utilitário de Notificação Toast (Sem emojis)
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector(".toast-msg");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3800);
}
