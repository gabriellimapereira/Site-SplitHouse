/**
 * SplitHouse - Controlador de Navegação e Apresentação
 * Suporta navegação por teclado (← / →), HUD flutuante para apresentação direta,
 * e sincronização bidirecional com o Hub Simulador (index.html).
 */
(function() {
  const SCREENS = [
    { file: '01_tela_abertura.html', block: 'Bloco 1: Autenticação', title: '01 • Tela de Abertura' },
    { file: '02_boas_vindas.html', block: 'Bloco 1: Autenticação', title: '02 • Boas-Vindas' },
    { file: '03_login.html', block: 'Bloco 1: Autenticação', title: '03 • Login' },
    { file: '04_cadastro.html', block: 'Bloco 1: Autenticação', title: '04 • Cadastro' },
    { file: '05_recuperar_senha.html', block: 'Bloco 1: Autenticação', title: '05 • Recuperar Senha' },
    { file: '06_selecao_casa.html', block: 'Bloco 2: Onboarding', title: '06 • Seleção de Imóvel' },
    { file: '07_cadastrar_casa.html', block: 'Bloco 2: Onboarding', title: '07 • Cadastrar Moradia (Passo 1)' },
    { file: '08_configurar_regras_casa.html', block: 'Bloco 2: Onboarding', title: '08 • Regras Iniciais (Passo 2)' },
    { file: '09_convite_qr_casa.html', block: 'Bloco 2: Onboarding', title: '09 • QR Code de Convite' },
    { file: '10_escanear_entrar_casa.html', block: 'Bloco 2: Onboarding', title: '10 • Escanear / Digitar Código' },
    { file: '11_solicitacao_pendente.html', block: 'Bloco 2: Onboarding', title: '11 • Solicitação Pendente' },
    { file: '12_gerenciar_moradores.html', block: 'Bloco 2: Onboarding', title: '12 • Gerenciar Moradores' },
    { file: '13_painel_principal.html', block: 'Bloco 3: Dashboard', title: '13 • Painel Principal (Home)' },
    { file: '14_lista_despesas.html', block: 'Bloco 4: Financeiro', title: '14 • Lista de Despesas' },
    { file: '15_cadastrar_despesa.html', block: 'Bloco 4: Financeiro', title: '15 • Nova Despesa' },
    { file: '16_detalhes_despesa.html', block: 'Bloco 4: Financeiro', title: '16 • Detalhes da Conta' },
    { file: '17_acerto_contas.html', block: 'Bloco 4: Financeiro', title: '17 • Acerto de Contas' },
    { file: '18_confirmar_pagamento.html', block: 'Bloco 4: Financeiro', title: '18 • Confirmar Pagamento' },
    { file: '19_relatorios_financeiros.html', block: 'Bloco 4: Financeiro', title: '19 • Relatórios Financeiros' },
    { file: '20_quadro_tarefas.html', block: 'Bloco 5: Tarefas', title: '20 • Quadro de Tarefas' },
    { file: '21_cadastrar_tarefa.html', block: 'Bloco 5: Tarefas', title: '21 • Cadastrar Tarefa' },
    { file: '22_detalhes_tarefa.html', block: 'Bloco 5: Tarefas', title: '22 • Detalhes da Tarefa' },
    { file: '23_validacao_tarefa.html', block: 'Bloco 5: Tarefas', title: '23 • Validação por Pares' },
    { file: '24_ranking_moradores.html', block: 'Bloco 6: Gamificação', title: '24 • Ranking da Casa' },
    { file: '25_loja_casa.html', block: 'Bloco 6: Gamificação', title: '25 • Loja da Casa' },
    { file: '26_notificacoes.html', block: 'Bloco 6: Gamificação', title: '26 • Central de Alertas' },
    { file: '27_perfil_usuario.html', block: 'Bloco 6: Gamificação', title: '27 • Perfil do Morador' },
    { file: '28_propor_recompensa.html', block: 'Bloco 6: Gamificação', title: '28 • Propor Recompensa' },
    { file: '29_editar_perfil.html', block: 'Bloco 6: Gamificação', title: '29 • Editar Perfil' },
    { file: '30_regras_convivencia.html', block: 'Bloco 6: Gamificação', title: '30 • Regras de Convivência' },
    { file: '31_editar_regras_convivencia.html', block: 'Bloco 6: Gamificação', title: '31 • Editar Regras da Casa' },
    { file: '32_desvincular_casa.html', block: 'Bloco 6: Gamificação', title: '32 • Desvincular da Casa' }
  ];

  const currentFile = window.location.pathname.split('/').pop() || '01_tela_abertura.html';
  const currentIndex = SCREENS.findIndex(s => s.file === currentFile);
  const isInsideIframe = (window.self !== window.top);

  // Notificar parent iframe se estiver no index.html
  if (isInsideIframe) {
    try {
      window.parent.postMessage({
        type: 'SPLITHOUSE_SCREEN_CHANGE',
        file: currentFile,
        index: currentIndex,
        title: currentIndex >= 0 ? SCREENS[currentIndex].title : document.title
      }, '*');
    } catch(e) {}
  }

  function goToIndex(idx) {
    if (idx >= 0 && idx < SCREENS.length) {
      window.location.href = SCREENS[idx].file;
    }
  }

  function goPrev() {
    if (currentIndex > 0) goToIndex(currentIndex - 1);
  }

  function goNext() {
    if (currentIndex < SCREENS.length - 1) goToIndex(currentIndex + 1);
  }

  // Atalhos de teclado (Setas Esquerda / Direita / Home)
  window.addEventListener('keydown', (e) => {
    // Ignorar se estiver digitando em campo de input/textarea
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    if (e.key === 'ArrowLeft') {
      goPrev();
    } else if (e.key === 'ArrowRight') {
      goNext();
    } else if (e.key === 'h' || e.key === 'H') {
      if (!isInsideIframe) window.location.href = 'index.html';
    }
  });

  // Renderizar HUD flutuante quando visualizado em aba avulsa (fora de iframe e fora do html.to.design)
  const isDesignTool = window.__HTML_TO_DESIGN__ || 
                       navigator.userAgent.includes('html.to.design') || 
                       navigator.userAgent.includes('HeadlessChrome') ||
                       window.location.search.includes('nohud');

  if (!isInsideIframe && !isDesignTool) {
    window.addEventListener('DOMContentLoaded', () => {
      injectFloatingHUD();
    });
  }

  function injectFloatingHUD() {
    if (document.getElementById('splithouse-hud')) return;

    const hud = document.createElement('div');
    hud.id = 'splithouse-hud';
    hud.style.cssText = `
      position: fixed;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      background: rgba(26, 26, 30, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(204, 146, 194, 0.25);
      border-radius: 9999px;
      padding: 6px 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 15px rgba(94, 43, 151, 0.3);
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #FCFCFC;
      user-select: none;
      transition: all 0.2s ease;
    `;

    // Botão Anterior
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&#9664;';
    prevBtn.title = 'Tela anterior (Seta ←)';
    prevBtn.style.cssText = `
      background: ${currentIndex > 0 ? '#5E2B97' : '#333'};
      color: ${currentIndex > 0 ? '#FCFCFC' : '#777'};
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      cursor: ${currentIndex > 0 ? 'pointer' : 'default'};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      transition: transform 0.15s, background 0.15s;
    `;
    if (currentIndex > 0) {
      prevBtn.onclick = goPrev;
      prevBtn.onmouseenter = () => prevBtn.style.transform = 'scale(1.1)';
      prevBtn.onmouseleave = () => prevBtn.style.transform = 'scale(1)';
    }

    // Seletor Dropdown com agrupamento por blocos
    const select = document.createElement('select');
    select.style.cssText = `
      background: #2D2D2A;
      color: #FCFCFC;
      border: 1px solid rgba(204, 146, 194, 0.3);
      border-radius: 8px;
      padding: 5px 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      outline: none;
      max-width: 240px;
    `;

    let currentOptGroup = null;
    let currentGroupName = '';
    SCREENS.forEach((scr, i) => {
      if (scr.block !== currentGroupName) {
        currentGroupName = scr.block;
        currentOptGroup = document.createElement('optgroup');
        currentOptGroup.label = scr.block;
        select.appendChild(currentOptGroup);
      }
      const opt = document.createElement('option');
      opt.value = scr.file;
      opt.textContent = scr.title;
      if (i === currentIndex) opt.selected = true;
      currentOptGroup.appendChild(opt);
    });

    select.onchange = (e) => {
      window.location.href = e.target.value;
    };

    // Botão Próxima
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&#9654;';
    nextBtn.title = 'Próxima tela (Seta →)';
    nextBtn.style.cssText = `
      background: ${currentIndex < SCREENS.length - 1 ? '#5E2B97' : '#333'};
      color: ${currentIndex < SCREENS.length - 1 ? '#FCFCFC' : '#777'};
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      cursor: ${currentIndex < SCREENS.length - 1 ? 'pointer' : 'default'};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      transition: transform 0.15s, background 0.15s;
    `;
    if (currentIndex < SCREENS.length - 1) {
      nextBtn.onclick = goNext;
      nextBtn.onmouseenter = () => nextBtn.style.transform = 'scale(1.1)';
      nextBtn.onmouseleave = () => nextBtn.style.transform = 'scale(1)';
    }

    // Botão Hub / Simulador
    const hubLink = document.createElement('a');
    hubLink.href = 'index.html';
    hubLink.title = 'Abrir Simulador Interativo / Hub';
    hubLink.innerHTML = '&#128241; Hub';
    hubLink.style.cssText = `
      background: rgba(204, 146, 194, 0.15);
      border: 1px solid rgba(204, 146, 194, 0.4);
      color: #CC92C2;
      padding: 4px 10px;
      border-radius: 9999px;
      text-decoration: none;
      font-weight: 700;
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: background 0.15s;
    `;
    hubLink.onmouseenter = () => hubLink.style.background = 'rgba(204, 146, 194, 0.3)';
    hubLink.onmouseleave = () => hubLink.style.background = 'rgba(204, 146, 194, 0.15)';

    // Botão Minimizar / Fechar
    const minBtn = document.createElement('button');
    minBtn.innerHTML = '&times;';
    minBtn.title = 'Ocultar barra de apresentação';
    minBtn.style.cssText = `
      background: transparent;
      border: none;
      color: #84828F;
      cursor: pointer;
      font-size: 16px;
      padding: 0 4px;
      margin-left: 2px;
      line-height: 1;
    `;
    minBtn.onclick = () => {
      hud.style.display = 'none';
      injectRestoreBadge();
    };

    hud.appendChild(prevBtn);
    hud.appendChild(select);
    hud.appendChild(nextBtn);
    hud.appendChild(hubLink);
    hud.appendChild(minBtn);

    document.body.appendChild(hud);
  }

  function injectRestoreBadge() {
    if (document.getElementById('splithouse-restore-badge')) return;
    const badge = document.createElement('button');
    badge.id = 'splithouse-restore-badge';
    badge.title = 'Reabrir menu de apresentação';
    badge.innerHTML = '&#9776; Telas';
    badge.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 99999;
      background: #5E2B97;
      color: #FCFCFC;
      border: 1px solid #CC92C2;
      border-radius: 9999px;
      padding: 6px 14px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    `;
    badge.onclick = () => {
      badge.remove();
      const hud = document.getElementById('splithouse-hud');
      if (hud) hud.style.display = 'flex';
    };
    document.body.appendChild(badge);
  }
})();
