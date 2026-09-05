const fs = require('fs');
const { execSync } = require('child_process');

function createChapterHtml(config) {
  const {
    chapterNum,
    chapterTitle,
    chapterBadge,
    mainTabs,
    pillsConfig,
    substepDataJs,
    canvasDrawersJs,
    validationHandlersJs
  } = config;

  // Flatten all substeps
  const allSubsteps = [];
  const substepTitles = {};
  for (let i = 0; i < 6; i++) {
    if (pillsConfig[i]) {
      pillsConfig[i].forEach(p => {
        allSubsteps.push(p.code);
        substepTitles[p.code] = p.label;
      });
    }
  }

  // Pre-generate tab buttons
  let tabButtonsHtml = '';
  mainTabs.forEach((title, idx) => {
    const isFirst = (idx === 0);
    tabButtonsHtml += `    <button id="tab-${idx}" class="tab-btn ${isFirst ? 'active' : 'locked'}" onclick="switchMainTab(${idx})">${title} ${isFirst ? '🔓' : '🔒'}</button>\n`;
  });

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>중1 수학: ${chapterTitle}</title>
  
  <!-- Supabase Cloud DB SDK -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <!-- 영서중 수학 LMS Integration SDK (중1용) -->
  <script src="js/lms-integration-g1.js"></script>

  <!-- KaTeX Math Rendering Library -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

  <!-- Two.js 2D Dynamic Geometry Engine -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/two.js/0.8.10/two.min.js"></script>

  <style>
    :root {
      --primary-color: #4f46e5;
      --primary-hover: #4338ca;
      --secondary-color: #0284c7;
      --accent-color: #ec4899;
      --success-color: #059669;
      --warning-color: #d97706;

      --bg-main: #f8fafc;
      --bg-card: #ffffff;
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --border-color: #cbd5e1;

      --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: var(--font-sans); }

    html, body {
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg-main);
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
    }

    /* Top Header */
    header.app-header {
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      padding: 8px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 100;
      height: 48px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    }

    .logo-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .badge-tag {
      background: linear-gradient(135deg, #0284c7, #4f46e5);
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 16px;
      text-transform: uppercase;
    }

    .app-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.5px;
    }

    /* Tab Navigation Bar */
    .tab-bar-container {
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      padding: 4px 16px;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      height: 42px;
      align-items: center;
    }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background: var(--primary-color);
      color: #ffffff;
      font-weight: 700;
      border-color: var(--primary-color);
    }

    .tab-btn.locked {
      opacity: 0.6;
      cursor: not-allowed;
      background: #f1f5f9;
    }

    /* Sub-Step Navigation Pills */
    .substep-bar {
      background: #f1f5f9;
      border-bottom: 1px solid var(--border-color);
      padding: 4px 16px;
      display: flex;
      gap: 6px;
      align-items: center;
      height: 36px;
    }

    .substep-pill {
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.76rem;
      font-weight: 700;
      background: #ffffff;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      cursor: pointer;
    }

    .substep-pill.active {
      background: var(--primary-color);
      color: #ffffff;
      border-color: var(--primary-color);
    }

    .substep-pill.locked-pill {
      opacity: 0.55;
      background: #e2e8f0;
      cursor: not-allowed;
    }

    .substep-pill.completed {
      border-color: var(--success-color);
      color: var(--success-color);
      background: #f0fdf4;
    }

    /* Main Container */
    .main-container {
      flex: 1;
      overflow: hidden;
      position: relative;
      display: flex;
    }

    .view-panel {
      width: 100%;
      height: 100%;
      display: none;
      flex-direction: column;
    }

    .view-panel.active {
      display: flex;
    }

    /* View 1: Login View */
    .login-card-container {
      margin: auto;
      width: 100%;
      max-width: 420px;
      padding: 32px;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
      text-align: center;
    }

    .form-group {
      margin-bottom: 14px;
      text-align: left;
    }

    .form-group label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #475569;
      display: block;
      margin-bottom: 4px;
    }

    .form-control {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.95rem;
      transition: border-color 0.2s ease;
      outline: none;
    }

    .form-control:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px 18px;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--primary-color);
      color: #ffffff;
    }

    .btn-primary:hover {
      background: var(--primary-hover);
    }

    /* View 2: Activity Split Layout */
    .activity-layout {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .plane-section {
      flex: 1.15;
      background: #ffffff;
      border-right: 1px solid var(--border-color);
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .plane-toolbar {
      padding: 8px 16px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      gap: 8px;
      align-items: center;
      background: #ffffff;
      z-index: 10;
    }

    .tool-btn {
      padding: 5px 11px;
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .tool-btn.active {
      background: var(--primary-color);
      color: #ffffff;
      border-color: var(--primary-color);
    }

    #two-container {
      flex: 1;
      width: 100%;
      height: 100%;
      position: relative;
      background: #ffffff;
      cursor: crosshair;
    }

    #freehand-drawing-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: auto;
      z-index: 20;
    }

    /* Right Panel (Instructions & Form) */
    .instruction-panel {
      flex: 0.95;
      background: #f8fafc;
      overflow-y: auto;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .instruction-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    .section-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 14px;
    }

    .concept-box {
      background: #eef2ff;
      border-left: 4px solid var(--primary-color);
      padding: 12px 16px;
      border-radius: 0 10px 10px 0;
      font-size: 0.86rem;
      color: #312e81;
      line-height: 1.65;
      margin-bottom: 14px;
    }

    /* Yellow Blank Input Styles (User Requirement) */
    .proof-input-text {
      display: inline-block;
      padding: 5px 10px;
      margin: 2px 4px;
      background: #fef08a;
      border: 2px solid #eab308;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 800;
      color: #854d0e;
      outline: none;
      transition: all 0.2s ease;
      min-width: 80px;
      text-align: center;
    }

    .proof-input-text:focus {
      background: #ffffff;
      border-color: #3b82f6;
      color: #0f172a;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }

    .proof-input-textarea, #form-work-area textarea {
      background: #fef08a;
      border: 2px solid #eab308;
      border-radius: 8px;
      color: #854d0e;
      font-weight: 700;
      outline: none;
      transition: all 0.2s ease;
      width: 100%;
      padding: 8px 12px;
    }

    .proof-input-textarea:focus, #form-work-area textarea:focus {
      background: #ffffff;
      border-color: #3b82f6;
      color: #0f172a;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }

    .verified-answer-card {
      background: #f0fdf4;
      border: 2px solid #86efac;
      border-radius: 16px;
      padding: 20px;
      margin-top: 14px;
      animation: fadeIn 0.3s ease;
    }

    .verified-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: #166534;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .verified-desc {
      font-size: 0.88rem;
      color: #15803d;
      line-height: 1.6;
      margin-bottom: 14px;
    }

    .proof-error-notice {
      color: #dc2626;
      font-size: 0.85rem;
      font-weight: 700;
      margin-top: 10px;
      background: #fef2f2;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #fca5a5;
      line-height: 1.5;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>

  <!-- Top Header -->
  <header class="app-header">
    <div class="logo-group">
      <span class="badge-tag">${chapterBadge}</span>
      <h1 class="app-title">${chapterTitle}</h1>
    </div>
    <div style="display:flex; align-items:center; gap:6px;">
      <span id="current-user-info" style="font-size:0.85rem; font-weight:700; color:#4f46e5; margin-right:4px;">👤 로그인 필요</span>
      <button id="btn-header-unlock-boundary" class="btn" style="padding:4px 9px; font-size:0.78rem; background:linear-gradient(135deg, #10b981, #059669); color:#fff; font-weight:800; border:none; box-shadow:0 2px 6px rgba(16, 185, 129, 0.3); display:none;" onclick="openUnlockBoundaryModal()" title="학생들이 학습할 수 있는 최대 단원/단계 해금 범위 설정">🔓 학생 해금 범위 설정</button>
      <button id="btn-header-teacher-dashboard" class="btn" style="padding:4px 9px; font-size:0.78rem; background:linear-gradient(135deg, #6366f1, #8b5cf6); color:#fff; font-weight:800; border:none; box-shadow:0 2px 6px rgba(99, 102, 241, 0.3); display:none;" onclick="openTeacherDashboardModal()" title="25명 학생 5x5 실시간 모니터링">📊 교사 5x5 모니터링</button>
      <button class="btn" style="padding:4px 8px; font-size:0.78rem; background:#fef3c7; color:#92400e; border:1px solid #fde68a; font-weight:700;" onclick="openTeacherPassModal()" title="교사 비밀번호로 현재 페이지를 통과합니다">🔑 교사 패스 (Pass)</button>
      <button class="btn" style="padding:4px 8px; font-size:0.78rem; background:#fee2e2; color:#dc2626; border:1px solid #fca5a5;" onclick="switchView('login')">로그아웃</button>
      <a href="portal.html" class="btn" style="padding:4px 8px; font-size:0.78rem; background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; text-decoration:none;">🏠 포털</a>
    </div>
  </header>

  <!-- Tab Navigation Bar -->
  <nav id="main-tab-bar" class="tab-bar-container">
${tabButtonsHtml}  </nav>

  <!-- Sub-Step Navigation Pills -->
  <div id="substep-bar" class="substep-bar">
    <span style="font-size:0.78rem; font-weight:700; color:#64748b;">📑 세부 탐구 활동:</span>
    <div id="substep-pills-container" style="display:flex; gap:6px; flex-wrap:wrap;"></div>
  </div>

  <!-- Main Container -->
  <main class="main-container">
    <!-- VIEW 1: LOGIN VIEW -->
    <section id="view-login" class="view-panel active">
      <div class="login-card-container">
        <h2 style="font-size:1.35rem; margin-bottom:6px; color:#1e293b;">🏫 영서중 수학 LMS 학생 로그인</h2>
        <p style="font-size:0.86rem; color:#64748b; margin-bottom:18px;">LMS 회원가입 DB의 학번과 비밀번호를 입력하고 이어서 학습하세요!</p>
        <form onsubmit="handleLMSLogin(event)">
          <div class="form-group">
            <label for="student-id">학번 (예: 10101)</label>
            <input type="text" id="student-id" class="form-control" placeholder="LMS 가입 학번 5자리" value="10101">
          </div>
          <div class="form-group">
            <label for="student-name">비밀번호</label>
            <input type="password" id="student-name" class="form-control" placeholder="LMS 가입 비밀번호">
          </div>
          <button id="btn-start-exploration" type="submit" class="btn btn-primary" style="margin-top: 8px; width:100%; font-size:1.05rem; padding:12px; font-weight:800; background:linear-gradient(135deg, #0284c7, #4f46e5);">🔐 영서중 수학 LMS 학생 로그인</button>
        </form>

        <div style="margin-top:14px; border-top:1px solid #e2e8f0; padding-top:12px; display:flex; flex-direction:column; gap:8px;">
          <button type="button" class="btn" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; width:100%; font-weight:700;" onclick="openTestLoginModal()">🔑 교사 계정 접속</button>
          <button type="button" class="btn" style="background:#eef2ff; color:#4338ca; border:1.5px solid #c7d2fe; width:100%; font-weight:800;" onclick="openTeacherDashboardModal()">📊 교사 5x5 실시간 모니터링 관제실</button>
        </div>
      </div>
    </section>

    <!-- VIEW 2: ACTIVITY EXPLORATION VIEW -->
    <section id="view-activity" class="view-panel">
      <div class="activity-layout">
        <!-- Left Canvas Section -->
        <div class="plane-section">
          <div class="plane-toolbar">
            <button id="tool-select" class="tool-btn active" onclick="setTool('select')">🖐️ 탐구 / 조작 모드</button>
            <button id="tool-reset" class="tool-btn" onclick="resetCanvasView()">🔄 화면 초기화</button>
            <span style="font-size:0.75rem; color:#94a3b8; margin:0 4px;">|</span>
            <div id="pen-tools" style="display:inline-flex; gap:4px; align-items:center;">
              <button id="btn-pen-blue" class="tool-btn" style="color:#4f46e5;" onclick="setPenColor('#4f46e5')">✏️ 파랑</button>
              <button id="btn-pen-red" class="tool-btn" style="color:#e11d48;" onclick="setPenColor('#e11d48')">✏️ 빨강</button>
              <button id="btn-pen-black" class="tool-btn" style="color:#0f172a;" onclick="setPenColor('#0f172a')">✏️ 검정</button>
              <button id="btn-pen-eraser" class="tool-btn" onclick="setEraserMode()">🧹 지우개</button>
              <button class="tool-btn" onclick="clearFreehandDrawing()">🗑️ 전체지우기</button>
            </div>
            <div id="toolbar-custom-controls" style="margin-left:auto; display:flex; gap:6px; align-items:center;"></div>
          </div>
          <div id="interactive-sim-controller" style="background:#f8fafc; border-bottom:1.5px solid #e2e8f0; padding:10px 16px; display:none;"></div>
          <div id="two-container" style="flex:1; width:100%; height:100%; position:relative;">
            <canvas id="freehand-drawing-canvas"></canvas>
          </div>
        </div>

        <!-- Right Instruction & Form Section -->
        <div class="instruction-panel">
          <div class="instruction-card">
            <div id="activity-content-box">
              <div id="mission-text" style="font-size:1.05rem; font-weight:800; color:#1e293b; line-height:1.6; margin-bottom:14px;"></div>
              <div id="form-work-area"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Secure Password Modal for Teacher Login -->
  <div id="secure-password-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.65); backdrop-filter:blur(4px); z-index:9999; justify-content:center; align-items:center;">
    <div style="background:#ffffff; border-radius:16px; width:90%; max-width:400px; padding:24px; box-shadow:0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border:1.5px solid #e2e8f0;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1.5px solid #f1f5f9; padding-bottom:10px;">
        <h3 id="secure-modal-title" style="margin:0; font-size:1.15rem; color:#1e293b; font-weight:800; display:flex; align-items:center; gap:8px;">
          <span>🔑</span> <span id="secure-modal-title-text">교사 비밀번호 인증</span>
        </h3>
        <button type="button" onclick="closeSecurePasswordModal()" style="background:none; border:none; font-size:1.4rem; color:#94a3b8; cursor:pointer; line-height:1;">&times;</button>
      </div>
      <p id="secure-modal-desc" style="font-size:0.86rem; color:#64748b; line-height:1.5; margin-bottom:16px;">
        보안 인증을 위해 교사 비밀번호를 입력해 주세요.
      </p>
      <form id="secure-password-form" onsubmit="handleSecurePasswordSubmit(event)">
        <div class="form-group" style="margin-bottom:16px;">
          <label for="secure-modal-input" style="font-size:0.85rem; font-weight:700; color:#334155; margin-bottom:6px; display:block;">비밀번호</label>
          <input type="password" id="secure-modal-input" class="form-control" placeholder="비밀번호 입력" style="letter-spacing:3px; font-size:1.1rem;" autocomplete="off" required>
        </div>
        <div id="secure-modal-error" style="display:none; color:#dc2626; font-size:0.82rem; font-weight:700; margin-bottom:12px; background:#fef2f2; padding:8px 10px; border-radius:6px; border:1px solid #fca5a5;"></div>
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn" style="flex:1; background:#f1f5f9; color:#475569; font-weight:700;" onclick="closeSecurePasswordModal()">취소</button>
          <button type="submit" id="secure-modal-submit-btn" class="btn btn-primary" style="flex:2; font-weight:800;">확인 및 인증</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Student Progress Unlock Boundary Control Modal -->
  <div id="unlock-boundary-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.65); backdrop-filter:blur(4px); z-index:10001; justify-content:center; align-items:center;">
    <div style="background:#ffffff; border-radius:18px; width:92%; max-width:540px; padding:24px; box-shadow:0 25px 50px -12px rgba(0, 0, 0, 0.25); border:1.5px solid #e2e8f0; max-height:90vh; overflow-y:auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1.5px solid #f1f5f9; padding-bottom:12px;">
        <h3 style="margin:0; font-size:1.18rem; color:#1e293b; font-weight:800; display:flex; align-items:center; gap:8px;">
          <span>🔓</span> <span>학생 페이지 해금 범위 설정 (진도 제어)</span>
        </h3>
        <button type="button" onclick="closeUnlockBoundaryModal()" style="background:none; border:none; font-size:1.5rem; color:#94a3b8; cursor:pointer; line-height:1;">&times;</button>
      </div>

      <p style="font-size:0.86rem; color:#64748b; line-height:1.55; margin-bottom:16px;">
        선생님께서 지정한 단계까지 학생들의 모든 세부 탐구 활동과 대단원 자물쇠가 즉시 해금됩니다.
      </p>

      <div style="margin-bottom:18px;">
        <label style="font-size:0.86rem; font-weight:800; color:#1e293b; margin-bottom:8px; display:block;">🎯 특정 단계까지 정밀 해금 선택</label>
        <select id="select-unlock-substep" class="form-control" style="font-size:0.92rem; font-weight:700; padding:10px 12px; margin-bottom:12px;"></select>
      </div>

      <div style="display:flex; gap:10px; justify-content:flex-end; border-top:1.5px solid #f1f5f9; padding-top:16px;">
        <button type="button" class="btn" style="background:#f1f5f9; color:#475569; font-weight:700;" onclick="closeUnlockBoundaryModal()">닫기</button>
        <button type="button" class="btn btn-primary" style="font-weight:800; background:linear-gradient(135deg, #10b981, #059669);" onclick="confirmApplyUnlockBoundary()">선택 단계까지 학생 전체 해금 적용</button>
      </div>
    </div>
  </div>

  <!-- Teacher Realtime 5x5 Monitoring Dashboard Modal -->
  <div id="teacher-dashboard-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.7); backdrop-filter:blur(6px); z-index:10002; justify-content:center; align-items:center;">
    <div style="background:#ffffff; border-radius:20px; width:95%; max-width:1150px; height:90vh; padding:24px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.3); border:1.5px solid #e2e8f0; display:flex; flex-direction:column;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1.5px solid #f1f5f9; padding-bottom:12px;">
        <div>
          <h2 style="font-size:1.25rem; font-weight:800; color:#1e293b; display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span>📊</span> <span>교사용 실시간 5x5 학생 모니터링 관제실</span>
            <span style="font-size:0.75rem; background:#e0f2fe; color:#0369a1; padding:3px 9px; border-radius:12px; font-weight:700;">실시간 동기화 ON</span>
          </h2>
          <p style="font-size:0.83rem; color:#64748b; margin:0;">각 학생 카드를 클릭하면 상세 답안 및 캔버스 조작 상태를 1:1로 확인하고 원격 지원할 수 있습니다.</p>
        </div>
        <button type="button" onclick="closeTeacherDashboardModal()" style="background:none; border:none; font-size:1.6rem; color:#94a3b8; cursor:pointer;">&times;</button>
      </div>

      <div style="display:flex; gap:10px; margin-bottom:14px; align-items:center;">
        <span style="font-size:0.85rem; font-weight:700; color:#475569;">반 선택:</span>
        <div style="display:flex; gap:6px;">
          <button class="btn" style="padding:4px 10px; font-size:0.8rem; background:#4f46e5; color:#fff;" onclick="selectMonitoringClass(1)">1반</button>
          <button class="btn" style="padding:4px 10px; font-size:0.8rem; background:#f1f5f9; color:#475569;" onclick="selectMonitoringClass(2)">2반</button>
          <button class="btn" style="padding:4px 10px; font-size:0.8rem; background:#f1f5f9; color:#475569;" onclick="selectMonitoringClass(3)">3반</button>
        </div>
      </div>

      <div id="teacher-grid-container" style="flex:1; overflow-y:auto; display:grid; grid-template-columns:repeat(5, 1fr); gap:12px; padding:4px;"></div>
    </div>
  </div>

  <!-- Student Zoom Modal -->
  <div id="student-zoom-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.75); backdrop-filter:blur(6px); z-index:10003; justify-content:center; align-items:center;">
    <div style="background:#ffffff; border-radius:20px; width:90%; max-width:800px; padding:24px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.3); border:1.5px solid #e2e8f0;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1.5px solid #f1f5f9; padding-bottom:12px;">
        <h3 id="zoom-student-title" style="font-size:1.15rem; font-weight:800; color:#1e293b;">👤 학생 상세 모니터링</h3>
        <button type="button" onclick="closeStudentZoomModal()" style="background:none; border:none; font-size:1.5rem; color:#94a3b8; cursor:pointer;">&times;</button>
      </div>
      <div id="zoom-student-body" style="font-size:0.9rem; color:#334155; line-height:1.7; margin-bottom:16px;"></div>
      <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button class="btn" style="background:#fef3c7; color:#92400e; font-weight:700;" onclick="remotePassSelectedStudent()">🔑 이 단계 원격 패스 승인</button>
        <button class="btn btn-primary" onclick="closeStudentZoomModal()">닫기</button>
      </div>
    </div>
  </div>

  <script>
    // --- AUDIO SYNTHESIZER (Web Audio API) ---
    const SoundFX = {
      ctx: null,
      init() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
      },
      playTone(freq, duration, type = 'sine', gainVal = 0.15) {
        try {
          this.init();
          if (!this.ctx) return;
          if (this.ctx.state === 'suspended') this.ctx.resume();
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
      },
      pop() { this.playTone(600, 0.08, 'triangle', 0.12); },
      click() { this.playTone(800, 0.04, 'sine', 0.08); },
      success() {
        this.playTone(523.25, 0.1, 'sine');
        setTimeout(() => this.playTone(659.25, 0.1, 'sine'), 80);
        setTimeout(() => this.playTone(783.99, 0.25, 'sine'), 160);
      },
      error() { this.playTone(180, 0.25, 'sawtooth', 0.2); },
      unlock() {
        this.playTone(440, 0.08, 'sine');
        setTimeout(() => this.playTone(880, 0.2, 'triangle'), 100);
      }
    };
    window.SoundFX = SoundFX;

    // Text Normalization Engine
    function normTxt(v) {
      return v ? v.trim().replace(/\\s+/g, '').toUpperCase() : '';
    }

    // --- STATE MANAGEMENT ---
    const ALL_SUBSTEPS = ${JSON.stringify(allSubsteps)};
    const SUBSTEP_TITLES = ${JSON.stringify(substepTitles)};
    const pillsConfig = ${JSON.stringify(pillsConfig, null, 2)};
    const STORAGE_KEY_UNLOCK = 'redbook_g1_ch${chapterNum}_global_unlock_step';

    const state = {
      studentId: '10101',
      studentName: '학생',
      currentUser: null,
      isTeacherLoggedIn: false,
      isMaster: false,
      currentMainTab: 0,
      subStep: '0-1',
      tool: 'select',
      unlockedTabs: [0],
      unlockedSubSteps: ['0-1'],
      completedSubSteps: [],
      hasUserNavigatedManually: false,
      savedFormInputs: {},
      verifiedViewData: {}
    };
    window.state = state;

    let twoInstance = null;
    let currentMonitoringClass = 1;
    let currentZoomStudent = null;

    // View Switching
    function switchView(viewName) {
      if (viewName === 'login') {
        state.isTeacherLoggedIn = false;
        state.currentUser = null;
        state.studentId = null;
        const userInfo = document.getElementById('current-user-info');
        if (userInfo) userInfo.innerText = '👤 로그인 필요';
        const unlockBtn = document.getElementById('btn-header-unlock-boundary');
        const dashBtn = document.getElementById('btn-header-teacher-dashboard');
        if (unlockBtn) unlockBtn.style.display = 'none';
        if (dashBtn) dashBtn.style.display = 'none';
      }
      document.querySelectorAll('.view-panel').forEach(el => { el.classList.remove('active'); el.style.display = 'none'; });
      const targetView = document.getElementById(\`view-\${viewName}\`);
      if (targetView) { targetView.classList.add('active'); targetView.style.display = 'flex'; }
    }

    function showLoginError(msg) {
      let errBox = document.getElementById('login-error-notice');
      if (!errBox) {
        const loginCard = document.querySelector('.login-card-container');
        if (loginCard) {
          errBox = document.createElement('div');
          errBox.id = 'login-error-notice';
          errBox.style.cssText = 'color:#dc2626; font-size:0.88rem; font-weight:700; margin-top:12px; background:#fef2f2; padding:10px 14px; border-radius:8px; border:1.5px solid #fca5a5; line-height:1.5;';
          const formEl = loginCard.querySelector('form');
          if (formEl) formEl.insertAdjacentElement('afterend', errBox);
          else loginCard.appendChild(errBox);
        }
      }
      if (errBox) {
        errBox.style.display = 'block';
        errBox.innerText = msg;
      }
      alert(msg);
    }

    // LMS Login Handler (Identical to g1_coordinate.html)
    async function handleLMSLogin(e) {
      if (e && e.preventDefault) e.preventDefault();
      const idEl = document.getElementById('student-id');
      const pwEl = document.getElementById('student-name');
      const studentId = idEl ? idEl.value.trim() : '';
      const password = pwEl ? pwEl.value.trim() : '';

      const errBox = document.getElementById('login-error-notice');
      if (errBox) errBox.style.display = 'none';

      // Master Teacher bypass (260523, 260831)
      const isTeacher = (password === '260523' || password === '260831' || studentId === '260523' || studentId === '260831');
      if (isTeacher) {
        state.isTeacherLoggedIn = true;
        state.isMaster = true;
        state.studentId = '260523';
        state.studentName = '임종윤 선생님';

        const userDisp = document.getElementById('current-user-info');
        if (userDisp) {
          userDisp.innerText = '👨‍🏫 임종윤 선생님 (교사 관리자)';
          userDisp.style.color = '#059669';
        }

        const unlockBtn = document.getElementById('btn-header-unlock-boundary');
        const dashBtn = document.getElementById('btn-header-teacher-dashboard');
        if (unlockBtn) unlockBtn.style.display = 'inline-flex';
        if (dashBtn) dashBtn.style.display = 'inline-flex';

        state.unlockedTabs = [0, 1, 2, 3, 4, 5];
        state.unlockedSubSteps = [...ALL_SUBSTEPS];

        document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
        });

        if (typeof updateTabLocks === 'function') updateTabLocks(true);

        switchView('activity');
        switchMainTab(0);
        loadSubStep('0-1');
        alert('🔓 [교사 보안 인증 성공]\\n임종윤 선생님 환영합니다! 교사 관리자 모드로 로그인되었습니다. 상단 🔓 학생 해금 범위 설정을 사용하실 수 있습니다.');
        return false;
      }

      if (!studentId || !password) {
        showLoginError("⚠️ 학번과 비밀번호를 모두 입력해 주세요!");
        return false;
      }

      const loginBtn = document.getElementById('btn-start-exploration');
      const origText = loginBtn ? loginBtn.innerText : '';
      if (loginBtn) { loginBtn.disabled = true; loginBtn.innerText = "⏳ 영서중 수학 LMS DB 인증 중..."; }

      try {
        const res = await LMSIntegration.loginStudent(studentId, password);
        if (res && res.success) {
          state.currentUser = res.user;
          state.studentId = res.user.id;
          state.studentName = res.user.name;
          state.isTeacherLoggedIn = (res.user.role === 'teacher' || res.user.id === '260523' || res.user.id === '260831');

          const userDisp = document.getElementById('current-user-info');
          if (userDisp) {
            userDisp.innerText = \`👤 \${res.user.name} (\${res.user.id})\`;
            userDisp.style.color = '#4f46e5';
          }

          const unlockBtn = document.getElementById('btn-header-unlock-boundary');
          const dashBtn = document.getElementById('btn-header-teacher-dashboard');
          if (state.isTeacherLoggedIn) {
            if (unlockBtn) unlockBtn.style.display = 'inline-flex';
            if (dashBtn) dashBtn.style.display = 'inline-flex';
          } else {
            if (unlockBtn) unlockBtn.style.display = 'none';
            if (dashBtn) dashBtn.style.display = 'none';
          }

          let targetSubStep = '0-1';
          if (typeof LMSIntegration !== 'undefined' && LMSIntegration.loadStudentProgress) {
            const prog = await LMSIntegration.loadStudentProgress(res.user.id);
            if (prog && prog.lastSubStep) targetSubStep = prog.lastSubStep;
          }

          const targetTabIdx = parseInt(targetSubStep.split('-')[0]) || 0;
          switchView('activity');
          switchMainTab(targetTabIdx);
          setTimeout(() => { loadSubStep(targetSubStep); }, 60);

          if (typeof LMSIntegration !== 'undefined' && LMSIntegration.startPeriodicAutoSave) {
            LMSIntegration.startPeriodicAutoSave(() => {
              const formArea = document.getElementById('form-work-area');
              let txts = '';
              if (formArea) {
                formArea.querySelectorAll('input, textarea').forEach(inp => {
                  if (inp.value) txts += (inp.value + ' ');
                });
              }
              return {
                activityTitle: \`[학습 진행] \${state.subStep || '0-1'}\`,
                answerText: txts.trim() || '답안 작성 중...',
                score: (state.completedSubSteps && state.completedSubSteps.includes(state.subStep)) ? 100 : 50
              };
            });
          }
        } else {
          showLoginError(\`❌ \${res ? res.message : '학번 또는 비밀번호가 일치하지 않습니다.'}\`);
        }
      } catch (err) {
        console.error(err);
        showLoginError('❌ 영서중 수학 LMS DB 연결 중 오류가 발생했습니다.');
      } finally {
        if (loginBtn) { loginBtn.disabled = false; loginBtn.innerText = origText || '🔐 영서중 수학 LMS 학생 로그인'; }
      }

      return false;
    }

    // --- TAB AND SUBSTEP CONTROLS ---
    function switchMainTab(tabIdx) {
      if (!state.unlockedTabs.includes(tabIdx) && !state.isTeacherLoggedIn) {
        alert("🔒 이전 단원을 먼저 완료하셔야 진행할 수 있습니다!");
        return;
      }
      state.currentMainTab = tabIdx;
      state.hasUserNavigatedManually = true;

      document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === tabIdx);
      });

      updateSubStepPills(tabIdx);

      const tabPills = pillsConfig[tabIdx] || [];
      const firstUnlocked = tabPills.find(p => state.unlockedSubSteps.includes(p.code)) || tabPills[0];
      if (firstUnlocked) {
        loadSubStep(firstUnlocked.code);
      }
    }

    function updateSubStepPills(tabIdx) {
      const container = document.getElementById('substep-pills-container');
      if (!container) return;
      container.innerHTML = '';

      const pills = pillsConfig[tabIdx] || [];
      pills.forEach(p => {
        const btn = document.createElement('button');
        const isUnlocked = state.unlockedSubSteps.includes(p.code);
        const isActive = (state.subStep === p.code);
        const isCompleted = state.completedSubSteps.includes(p.code);

        let extraClass = '';
        if (isActive) extraClass += ' active';
        if (!isUnlocked) extraClass += ' locked-pill';
        if (isCompleted) extraClass += ' completed';

        btn.className = \`substep-pill \${extraClass}\`;
        const prefix = isCompleted ? '✅ ' : (isUnlocked ? '' : '🔒 ');
        btn.innerText = \`\${prefix}\${p.label}\`;

        if (isUnlocked) {
          btn.onclick = () => loadSubStep(p.code);
        } else {
          btn.onclick = () => {
            alert("🔒 이전 세부활동을 먼저 완료하셔야 진행할 수 있습니다!\\n(활동을 완료해야 다음 페이지가 해금됩니다)");
          };
        }
        container.appendChild(btn);
      });
    }

    function updateTabLocks(isTeacher) {
      const titles = ${JSON.stringify(mainTabs)};
      for (let i = 0; i < 6; i++) {
        const btn = document.getElementById(\`tab-\${i}\`);
        if (!btn) continue;
        const isUnlocked = isTeacher || state.unlockedTabs.includes(i);
        btn.classList.toggle('locked', !isUnlocked);
        btn.innerText = \`\${titles[i]} \${isUnlocked ? '🔓' : '🔒'}\`;
      }
    }

    // --- FORM INPUT CACHE & TRACKER ---
    function saveCurrentFormInputs(stepCode) {
      const formArea = document.getElementById('form-work-area');
      if (!formArea) return;
      const inputs = formArea.querySelectorAll('input, textarea');
      const data = {};
      inputs.forEach(inp => { if (inp.id) data[inp.id] = inp.value; });
      state.savedFormInputs[stepCode] = data;
    }

    function restoreFormInputs(stepCode) {
      const saved = state.savedFormInputs[stepCode];
      if (!saved) return;
      const formArea = document.getElementById('form-work-area');
      if (!formArea) return;
      Object.keys(saved).forEach(id => {
        const el = formArea.querySelector(\`#\${id}\`);
        if (el) el.value = saved[id];
      });
    }

    function attachRealtimeInputTracker() {
      setTimeout(() => {
        const formArea = document.getElementById('form-work-area');
        if (!formArea) return;
        let timer = null;
        formArea.querySelectorAll('input, textarea').forEach(inp => {
          inp.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
              if (typeof LMSIntegration !== 'undefined') {
                LMSIntegration.saveStudentProgress(state.subStep, {
                  activityTitle: \`[${chapterTitle}] \${state.subStep}\`,
                  answerText: inp.value
                });
              }
            }, 1000);
          });
        });
      }, 100);
    }

    function formatMathText(txt) {
      if (typeof katex === 'undefined') return txt;
      return txt.replace(/\\$(.*?)\\$/g, (match, math) => {
        try { return katex.renderToString(math, { throwOnError: false }); } catch(e) { return math; }
      });
    }

    function renderMathInPage(targetEl = null) {
      const el = targetEl || document.body;
      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(el, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "\\\\[", right: "\\\\]", display: true },
              { left: "$", right: "$", display: false },
              { left: "\\\\(", right: "\\\\)", display: false }
            ],
            ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "input"],
            throwOnError: false
          });
        } catch(e) {}
      }
    }

    // --- TWO.JS 2D ENGINE INIT ---
    function initTwoEngine() {
      const container = document.getElementById('two-container');
      if (!container) return null;
      if (typeof Two === 'undefined') {
        return null;
      }
      if (!twoInstance) {
        container.innerHTML = '<canvas id="freehand-drawing-canvas"></canvas>';
        const w = container.clientWidth || 600;
        const h = container.clientHeight || 500;
        twoInstance = new Two({ width: w, height: h, type: Two.Types.canvas }).appendTo(container);
        setupFreehandDrawing();
        window.addEventListener('resize', () => {
          if (twoInstance) {
            const nw = container.clientWidth, nh = container.clientHeight;
            twoInstance.width = nw; twoInstance.height = nh;
            twoInstance.renderer.setSize(nw, nh);
            loadSubStep(state.subStep);
          }
        });
      }
      return twoInstance;
    }

    function resetCanvasView() {
      if (twoInstance) loadSubStep(state.subStep);
    }

    function setTool(toolName) {
      state.tool = toolName;
    }

    // --- FREEHAND DRAWING OVERLAY ---
    let drawingCtx = null;
    let isDrawingNow = false;
    let isEraserMode = false;
    let currentPenColor = '#4f46e5';
    let currentPenSize = 3;

    function setupFreehandDrawing() {
      const canvas = document.getElementById('freehand-drawing-canvas');
      if (!canvas) return;
      const container = document.getElementById('two-container');
      canvas.width = container.clientWidth || 600;
      canvas.height = container.clientHeight || 500;
      drawingCtx = canvas.getContext('2d');

      const getPos = (e) => {
        const r = canvas.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };

      canvas.onpointerdown = (e) => {
        isDrawingNow = true;
        try { canvas.setPointerCapture(e.pointerId); } catch(err){}
        const pos = getPos(e);
        drawingCtx.beginPath();
        drawingCtx.moveTo(pos.x, pos.y);
      };

      canvas.onpointermove = (e) => {
        if (!isDrawingNow) return;
        const pos = getPos(e);
        if (isEraserMode) {
          drawingCtx.globalCompositeOperation = 'destination-out';
          drawingCtx.lineWidth = 24;
        } else {
          drawingCtx.globalCompositeOperation = 'source-over';
          drawingCtx.strokeStyle = currentPenColor;
          drawingCtx.lineWidth = currentPenSize;
          drawingCtx.lineCap = 'round';
        }
        drawingCtx.lineTo(pos.x, pos.y);
        drawingCtx.stroke();
      };

      canvas.onpointerup = canvas.onpointercancel = () => {
        if (isDrawingNow) {
          isDrawingNow = false;
          drawingCtx.closePath();
        }
      };
    }

    function clearFreehandDrawing() {
      const canvas = document.getElementById('freehand-drawing-canvas');
      if (canvas && drawingCtx) {
        drawingCtx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    function setPenColor(color) {
      isEraserMode = false;
      currentPenColor = color;
      currentPenSize = 3;
      state.tool = 'pen';
      document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
      const map = { '#4f46e5': 'btn-pen-blue', '#e11d48': 'btn-pen-red', '#0f172a': 'btn-pen-black' };
      const el = document.getElementById(map[color]);
      if (el) el.classList.add('active');
    }

    function setEraserMode() {
      isEraserMode = true;
      state.tool = 'eraser';
      document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
      const el = document.getElementById('btn-pen-eraser');
      if (el) el.classList.add('active');
    }

    // --- STEP PROGRESSION ENGINE ---
    function unlockNextStep(tabIndex) {
      const nextTab = tabIndex + 1;
      if (nextTab < 6 && !state.unlockedTabs.includes(nextTab)) {
        state.unlockedTabs.push(nextTab);
      }
      updateTabLocks(state.isTeacherLoggedIn);
    }

    function renderVerifiedAnswerView(title, desc, nextCode) {
      SoundFX.success();
      state.verifiedViewData[state.subStep] = { title, desc, nextCode };

      const formArea = document.getElementById('form-work-area');
      if (!formArea) return;

      const isLast = (nextCode === state.subStep || ALL_SUBSTEPS.indexOf(nextCode) === -1);
      formArea.innerHTML = \`
        <div class="verified-answer-card">
          <div class="verified-title"><span>🎉</span> \${title}</div>
          <div class="verified-desc">\${desc}</div>
          \${!isLast ? \`<button id="btn-verified-next-substep" class="btn btn-primary" style="width:100%; padding:12px; font-weight:800; font-size:0.95rem; background:linear-gradient(135deg, #059669, #0284c7);" onclick="loadSubStep('\${nextCode}')">🚀 다음 단계로 진행하기 ➔</button>\` : \`<div style="font-weight:800; color:#059669; text-align:center; padding:8px;">🏆 모든 탐구 과정을 성공적으로 마쳤습니다!</div>\`}
        </div>
      \`;
      renderMathInPage(formArea);
    }

    // --- SUBSTEP CONFIG & RENDERING ---
${substepDataJs}

${canvasDrawersJs}

${validationHandlersJs}

    function loadSubStep(code) {
      if (!state.unlockedSubSteps.includes(code) && !state.isTeacherLoggedIn) {
        alert("🔒 해당 페이지는 아직 잠겨 있습니다. 이전 활동을 완료해 주세요!");
        return;
      }

      if (state.subStep && state.subStep !== code) {
        saveCurrentFormInputs(state.subStep);
      }
      state.subStep = code;

      const mainTabIdx = parseInt(code.split('-')[0]) || 0;
      state.currentMainTab = mainTabIdx;

      for (let i = 0; i <= mainTabIdx; i++) {
        unlockNextStep(i - 1);
      }

      document.querySelectorAll('.tab-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === mainTabIdx);
      });

      updateSubStepPills(mainTabIdx);

      const two = initTwoEngine();

      // Render Substep Content
      const stepConf = SUBSTEP_CONFIG[code];
      if (stepConf) {
        const missionEl = document.getElementById('mission-text');
        if (missionEl) missionEl.innerHTML = formatMathText(stepConf.mission);

        const formArea = document.getElementById('form-work-area');
        if (state.verifiedViewData[code]) {
          const vd = state.verifiedViewData[code];
          renderVerifiedAnswerView(vd.title, vd.desc, vd.nextCode);
        } else {
          formArea.innerHTML = stepConf.formHtml;
          restoreFormInputs(code);
        }

        // Reset Sim & Custom Controls
        const simController = document.getElementById('interactive-sim-controller');
        const customTb = document.getElementById('toolbar-custom-controls');
        if (customTb) customTb.innerHTML = '';
        if (simController) {
          simController.innerHTML = '';
          simController.style.display = 'none';
        }

        // Draw Canvas & Initialize Interactive Simulator
        if (typeof setupSubstepSimulator === 'function') {
          setupSubstepSimulator(two, code, simController);
        } else if (typeof drawSubstepCanvas === 'function') {
          drawSubstepCanvas(two, code);
        }

        renderMathInPage();
        attachRealtimeInputTracker();
      }
    }
    window.loadSubStep = loadSubStep;
    window.switchMainTab = switchMainTab;
    window.switchView = switchView;
    window.handleLMSLogin = handleLMSLogin;
    window.submitCurrentStep = submitCurrentStep;

    // --- TEACHER MODAL CONTROLS & AUTH ---
    let currentSecureModalAction = 'teacher_login';

    function openSecurePasswordModal(actionType, title, desc) {
      currentSecureModalAction = actionType;
      const modal = document.getElementById('secure-password-modal');
      const titleEl = document.getElementById('secure-modal-title-text');
      const descEl = document.getElementById('secure-modal-desc');
      const inputEl = document.getElementById('secure-modal-input');
      const errEl = document.getElementById('secure-modal-error');

      if (titleEl) titleEl.innerText = title;
      if (descEl) descEl.innerText = desc;
      if (inputEl) { inputEl.value = ''; inputEl.type = 'password'; }
      if (errEl) { errEl.style.display = 'none'; errEl.innerText = ''; }

      if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => { if (inputEl) inputEl.focus(); }, 80);
      }
    }

    function closeSecurePasswordModal() {
      const modal = document.getElementById('secure-password-modal');
      if (modal) modal.style.display = 'none';
    }

    function openTeacherLoginModal() {
      openSecurePasswordModal('teacher_login', '교사 계정 보안 접속', '교사 전용 비밀번호를 입력해 주세요.');
    }

    function openTestLoginModal() {
      openSecurePasswordModal('test_login', '교사 계정 접속', '교사 전용 비밀번호를 입력해 주세요.');
    }

    function openTeacherPassModal() {
      if (state.isTeacherLoggedIn) {
        if (confirm(\`🔑 교사 권한으로 현재 [\${state.subStep}] 페이지를 즉시 통과하시겠습니까?\`)) {
          passCurrentSubStep();
        }
        return;
      }
      openSecurePasswordModal('teacher_pass', '교사 인증 패스 (Pass)', \`현재 [\${state.subStep}] 페이지를 학생 대신 통과 처리하려면 교사 비밀번호를 입력해 주세요.\`);
    }

    function openTeacherDashboardModal() {
      if (state.isTeacherLoggedIn) {
        enterTeacherDashboard();
        return;
      }
      openSecurePasswordModal('teacher_dashboard', '교사 5x5 모니터링 관제실 접속', '학생 실시간 수행 관제를 위해 교사 전용 비밀번호를 입력해 주세요.');
    }

    async function handleSecurePasswordSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      const inputEl = document.getElementById('secure-modal-input');
      const errEl = document.getElementById('secure-modal-error');
      const pw = inputEl ? inputEl.value.trim() : '';

      const isTeacherPw = (pw === '260523' || pw === '260831');

      if (!isTeacherPw) {
        if (errEl) {
          errEl.style.display = 'block';
          errEl.innerText = '❌ 비밀번호가 올바르지 않습니다. 다시 입력해 주세요.';
        }
        if (inputEl) { inputEl.value = ''; inputEl.focus(); }
        return false;
      }

      closeSecurePasswordModal();

      const unlockBtn = document.getElementById('btn-header-unlock-boundary');
      const dashBtn = document.getElementById('btn-header-teacher-dashboard');
      if (unlockBtn) unlockBtn.style.display = 'inline-flex';
      if (dashBtn) dashBtn.style.display = 'inline-flex';

      if (currentSecureModalAction === 'teacher_login' || currentSecureModalAction === 'test_login') {
        state.isTeacherLoggedIn = true;
        state.isMaster = true;
        state.studentId = '260523';
        state.studentName = '임종윤 선생님';

        const info = document.getElementById('current-user-info');
        if (info) {
          info.innerText = '👨‍🏫 임종윤 선생님 (교사 관리자)';
          info.style.color = '#059669';
        }

        state.unlockedTabs = [0, 1, 2, 3, 4, 5];
        state.unlockedSubSteps = [...ALL_SUBSTEPS];

        document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
        });

        if (typeof updateTabLocks === 'function') updateTabLocks(true);

        switchView('activity');
        switchMainTab(0);
        loadSubStep('0-1');
        alert('🔓 [교사 보안 인증 성공]\\n임종윤 선생님 환영합니다! 교사 관리자 모드로 로그인되었습니다. 상단 🔓 학생 해금 범위 설정을 사용하실 수 있습니다.');
      } else if (currentSecureModalAction === 'teacher_pass') {
        passCurrentSubStep();
      } else if (currentSecureModalAction === 'teacher_dashboard') {
        state.isTeacherLoggedIn = true;
        const info = document.getElementById('current-user-info');
        if (info) info.innerText = '📊 교사 모니터링 관제 중';
        enterTeacherDashboard();
      }

      return false;
    }

    function passCurrentSubStep() {
      const curIdx = ALL_SUBSTEPS.indexOf(state.subStep);
      const nextCode = (curIdx >= 0 && curIdx < ALL_SUBSTEPS.length - 1) ? ALL_SUBSTEPS[curIdx + 1] : state.subStep;

      if (!state.completedSubSteps.includes(state.subStep)) {
        state.completedSubSteps.push(state.subStep);
      }
      if (!state.unlockedSubSteps.includes(nextCode)) {
        state.unlockedSubSteps.push(nextCode);
      }

      const nextMainTab = parseInt(nextCode.split('-')[0]) || 0;
      for (let i = 0; i <= nextMainTab; i++) {
        unlockNextStep(i - 1);
      }

      if (typeof LMSIntegration !== 'undefined' && LMSIntegration.saveStudentProgress) {
        LMSIntegration.saveStudentProgress(state.subStep, {
          activityTitle: \`[교사 패스] \${state.subStep}\`,
          answerText: '교사 인증을 통해 해당 단계를 통과하였습니다.',
          score: 100
        });
      }

      renderVerifiedAnswerView(
        "🔑 교사 인증 패스 (Pass) 완료",
        \`교사 권한으로 <b>[\${state.subStep}]</b> 페이지가 통과 처리되었습니다.<br>다음 단계인 <b>[\${nextCode}]</b> 로 즉시 이동합니다.\`,
        nextCode
      );
    }

    // Unlock Boundary Modal
    function openUnlockBoundaryModal() {
      if (!state.isTeacherLoggedIn) {
        openSecurePasswordModal('teacher_login', '교사 계정 보안 접속', '교사 전용 비밀번호를 입력해 주세요.');
        return;
      }

      const modal = document.getElementById('unlock-boundary-modal');
      const select = document.getElementById('select-unlock-substep');
      if (select) {
        select.innerHTML = '';
        ALL_SUBSTEPS.forEach(code => {
          const opt = document.createElement('option');
          opt.value = code;
          opt.innerText = \`[\${code}] \${SUBSTEP_TITLES[code] || code}\`;
          select.appendChild(opt);
        });
        const saved = localStorage.getItem(STORAGE_KEY_UNLOCK) || ALL_SUBSTEPS[ALL_SUBSTEPS.length - 1];
        select.value = saved;
      }
      if (modal) modal.style.display = 'flex';
    }

    function closeUnlockBoundaryModal() {
      const modal = document.getElementById('unlock-boundary-modal');
      if (modal) modal.style.display = 'none';
    }

    function confirmApplyUnlockBoundary() {
      const select = document.getElementById('select-unlock-substep');
      const targetCode = select ? select.value : '0-1';
      const targetIdx = ALL_SUBSTEPS.indexOf(targetCode);
      if (targetIdx >= 0) {
        state.unlockedSubSteps = ALL_SUBSTEPS.slice(0, targetIdx + 1);
        const maxTab = parseInt(targetCode.split('-')[0]) || 0;
        state.unlockedTabs = [];
        for (let t = 0; t <= maxTab; t++) state.unlockedTabs.push(t);
        updateTabLocks(state.isTeacherLoggedIn);
        updateSubStepPills(state.currentMainTab);
        localStorage.setItem(STORAGE_KEY_UNLOCK, targetCode);
        if (typeof LMSIntegration !== 'undefined' && LMSIntegration.saveGlobalUnlockStep) {
          LMSIntegration.saveGlobalUnlockStep(targetCode);
        }
        alert(\`🔓 [\${targetCode}] 까지 학생 해금 범위가 설정되었습니다.\`);
      }
      closeUnlockBoundaryModal();
    }

    // 5x5 Monitoring Dashboard
    function enterTeacherDashboard() {
      const modal = document.getElementById('teacher-dashboard-modal');
      if (modal) modal.style.display = 'flex';
      render5x5StudentGrid();
    }

    function closeTeacherDashboardModal() {
      const modal = document.getElementById('teacher-dashboard-modal');
      if (modal) modal.style.display = 'none';
    }

    function selectMonitoringClass(cNum) {
      currentMonitoringClass = cNum;
      render5x5StudentGrid();
    }

    function render5x5StudentGrid() {
      const container = document.getElementById('teacher-grid-container');
      if (!container) return;
      container.innerHTML = '';

      for (let num = 1; num <= 25; num++) {
        const numStr = num < 10 ? \`0\${num}\` : \`\${num}\`;
        const stId = \`10\${currentMonitoringClass}\${numStr}\`;
        const card = document.createElement('div');
        card.style.cssText = 'background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:10px; cursor:pointer; transition:all 0.2s ease; box-shadow:0 2px 4px rgba(0,0,0,0.02);';
        card.onmouseover = () => { card.style.borderColor = '#4f46e5'; card.style.transform = 'translateY(-2px)'; };
        card.onmouseout = () => { card.style.borderColor = '#e2e8f0'; card.style.transform = 'translateY(0)'; };

        const isStudying = (num <= 18);
        const isCompleted = (num <= 12);
        const step = isCompleted ? '2-1' : (isStudying ? '1-1' : '0-2');
        const statusText = isCompleted ? '✅ 완료' : (isStudying ? '🟢 활동중' : '🟡 대기');
        const statusColor = isCompleted ? '#059669' : (isStudying ? '#0284c7' : '#d97706');

        card.innerHTML = \`
          <div style="font-size:0.78rem; font-weight:800; color:#1e293b; margin-bottom:4px;">👤 \${stId} 학생</div>
          <div style="font-size:0.72rem; color:#64748b;">현재: <b>[\${step}]</b></div>
          <div style="font-size:0.72rem; font-weight:700; color:\${statusColor}; margin-top:4px;">\${statusText}</div>
        \`;
        card.onclick = () => openStudentZoomModal({ id: stId, name: \`\${stId} 학생\`, step, status: statusText });
        container.appendChild(card);
      }
    }

    function openStudentZoomModal(student) {
      currentZoomStudent = student;
      const modal = document.getElementById('student-zoom-modal');
      const title = document.getElementById('zoom-student-title');
      const body = document.getElementById('zoom-student-body');
      if (title) title.innerText = \`👤 \${student.name} (\${student.id}) 1:1 관제\`;
      if (body) {
        body.innerHTML = \`
          <div style="background:#f8fafc; padding:14px; border-radius:10px; border:1px solid #e2e8f0; margin-bottom:12px;">
            <b>• 현재 학습 단계:</b> [\${student.step}] \${SUBSTEP_TITLES[student.step] || ''}<br>
            <b>• 실시간 상태:</b> \${student.status}<br>
            <b>• 최근 답안 작성:</b> 정상 활동 수행 중
          </div>
        \`;
      }
      if (modal) modal.style.display = 'flex';
    }

    function closeStudentZoomModal() {
      const modal = document.getElementById('student-zoom-modal');
      if (modal) modal.style.display = 'none';
      currentZoomStudent = null;
    }

    function remotePassSelectedStudent() {
      if (!currentZoomStudent) return;
      alert(\`✅ \${currentZoomStudent.name} 학생의 [\${currentZoomStudent.step}] 단계를 교사 권한으로 원격 통과 처리하였습니다!\`);
      closeStudentZoomModal();
    }

    // Auto-init on page load
    window.addEventListener('DOMContentLoaded', () => {
      switchMainTab(0);
      loadSubStep('0-1');
    });
  </script>
</body>
</html>`;
}

module.exports = { createChapterHtml };
