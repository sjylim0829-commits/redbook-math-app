import json
import re

with open('/home/ubuntu/workspace/Redbook/g1_ch1_factors.html', 'r', encoding='utf-8') as f:
    template = f.read()

code = template.replace(
    '<title>중1 수학 1단원: 소인수분해 대화형 탐구관</title>',
    '<title>중1 수학 7단원: 입체도형 대화형 탐구관</title>'
)
code = code.replace(
    '<h1>중1-1 Ⅰ. 소인수분해</h1>',
    '<h1>중1-2 Ⅶ. 입체도형</h1>'
)
code = code.replace(
    '<span class="badge">2022 개정 교육과정</span>',
    '<span class="badge">2022 개정 교육과정 · 다면체, 회전체 및 겉넓이와 부피</span>'
)

old_tabs = '''      <button class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어보기</button>
      <button class="tab-btn" onclick="switchMainTab(1)">1.1 소수와 합성수</button>
      <button class="tab-btn" onclick="switchMainTab(2)">1.2 소인수분해</button>
      <button class="tab-btn" onclick="switchMainTab(3)">1.3 최대공약수</button>
      <button class="tab-btn" onclick="switchMainTab(4)">1.4 최소공배수</button>
      <button class="tab-btn" onclick="switchMainTab(5)">1.5 스스로 마무리하기</button>'''

new_tabs = '''      <button class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어보기</button>
      <button class="tab-btn" onclick="switchMainTab(1)">7.1 다면체와 정다면체</button>
      <button class="tab-btn" onclick="switchMainTab(2)">7.2 회전체와 그 단면</button>
      <button class="tab-btn" onclick="switchMainTab(3)">7.3 기둥의 겉넓이와 부피</button>
      <button class="tab-btn" onclick="switchMainTab(4)">7.4 뿔의 겉넓이와 부피</button>
      <button class="tab-btn" onclick="switchMainTab(5)">7.5 구의 겉넓이와 부피</button>
      <button class="tab-btn" onclick="switchMainTab(6)">7.6 스스로 마무리하기</button>'''

code = code.replace(old_tabs, new_tabs)

js_content = r'''
    let state = {
      mainTab: 0,
      subStep: '0-1',
      studentAnswers: {},
      isMaster: false,
      tool: 'select'
    };

    const chapterData = {
      0: {
        title: "0. 되짚어보기 (초등 입체도형 연계)",
        substeps: [
          {
            id: "0-1",
            title: "초등 복습: 직육면체의 부피와 겉넓이",
            concept: "가로 $a$, 세로 $b$, 높이 $c$인 직육면체의 부피는 $V = a \\times b \\times c$이고, 겉넓이는 여섯 면의 넓이의 합입니다.",
            inquiry: "가로 $4\\,\\text{cm}$, 세로 $3\\,\\text{cm}$, 높이 $5\\,\\text{cm}$인 직육면체의 부피와 겉넓이를 구하세요.",
            blanks: [
              { id: "b0_1", answer: "60", label: "직육면체의 부피 (cm³)", hint: "4 × 3 × 5 = 60" },
              { id: "b0_2", answer: "94", label: "직육면체의 겉넓이 (cm²)", hint: "2 × (12 + 15 + 20) = 2 × 47 = 94" }
            ],
            canvasType: "cuboid_review"
          }
        ]
      },
      1: {
        title: "7.1 다면체와 정다면체",
        substeps: [
          {
            id: "7-1",
            title: "오직 5가지만 존재하는 정다면체",
            concept: "모든 면이 서로 합동인 정다각형이고 각 꼭짓점에 모이는 면의 개수가 같은 다면체를 <strong>정다면체</strong>라 합니다. 정다면체는 <strong>정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체</strong>의 오직 5가지만 존재합니다.",
            inquiry: "정다면체 중 면의 모양이 정삼각형인 것은 모두 몇 가지인가요? 또 각 꼭짓점에 모인 면의 개수가 3개인 정육면체의 면의 총 개수는?",
            blanks: [
              { id: "b1_1", answer: "3|3개|3가지", label: "면이 정삼각형인 정다면체 수", hint: "정사면체, 정팔면체, 정이십면체 총 3가지" },
              { id: "b1_2", answer: "6|6개", label: "정육면체의 면의 개수", hint: "정육면체는 6개의 면" }
            ],
            canvasType: "polyhedra_canvas"
          }
        ]
      },
      2: {
        title: "7.2 회전체와 그 단면",
        substeps: [
          {
            id: "7-1",
            title: "회전체의 뜻과 회전축에 따른 단면",
            concept: "평면도형을 한 직선을 축으로 하여 1회전 시켜 생기는 입체도형을 <strong>회전체</strong>라고 합니다.<br>회전체를 회전축에 수직인 평면으로 자르면 그 단면은 항상 <strong>원</strong>이 되고, 회전축을 포함하는 평면으로 자르면 축에 대하여 <strong>선대칭도형</strong>이 됩니다.",
            inquiry: "직각삼각형을 직각을 낀 한 변을 축으로 하여 1회전 시키면 어떤 입체도형이 생기나요? 또 이를 회전축을 포함하는 평면으로 자른 단면의 모양은?",
            blanks: [
              { id: "b2_1", answer: "원뿔|원뿔형", label: "생기는 회전체의 이름", hint: "원뿔" },
              { id: "b2_2", answer: "이등변삼각형|삼각형", label: "회전축을 포함하는 평면으로 자른 단면", hint: "좌우 대칭인 이등변삼각형" }
            ],
            canvasType: "revolution_solids"
          }
        ]
      },
      3: {
        title: "7.3 기둥의 겉넓이와 부피",
        substeps: [
          {
            id: "3-1",
            title: "각기둥과 원기둥의 겉넓이와 부피",
            concept: "기둥의 겉넓이 = $(\\text{밑넓이}) \\times 2 + (\\text{옆넓이})$<br>기둥의 부피 = $(\\text{밑넓이}) \\times (\\text{높이})$",
            inquiry: "밑면의 반지름이 $3\\,\\text{cm}$이고 높이가 $5\\,\\text{cm}$인 원기둥의 겉넓이와 부피를 $\\pi$를 사용하여 나타내세요.",
            blanks: [
              { id: "b3_1", answer: "48\\pi|48pi", label: "원기둥 겉넓이 (cm²)", hint: "밑넓이 2개(18π) + 옆넓이(2π×3×5 = 30π) = 48π" },
              { id: "b3_2", answer: "45\\pi|45pi", label: "원기둥 부피 (cm³)", hint: "π × 3² × 5 = 45π" }
            ],
            canvasType: "cylinder_calc"
          }
        ]
      },
      4: {
        title: "7.4 뿔의 겉넓이와 부피",
        substeps: [
          {
            id: "4-1",
            title: "뿔의 부피는 기둥 부피의 1/3",
            concept: "밑면이 합동이고 높이가 같은 각기둥(원기둥)과 각뿔(원뿔)에서, 뿔의 부피는 기둥의 부피의 $\\frac{1}{3}$입니다.<br>뿔의 부피 $V = \\frac{1}{3} \\times (\\text{밑넓이}) \\times (\\text{높이})$",
            inquiry: "밑면의 반지름이 $6\\,\\text{cm}$이고 높이가 $8\\,\\text{cm}$인 원뿔의 부피를 구하세요.",
            blanks: [
              { id: "b4_1", answer: "96\\pi|96pi", label: "원뿔의 부피 (cm³)", hint: "(1/3) × π × 6² × 8 = (1/3) × 288π = 96π" },
              { id: "b4_2", answer: "1/3|3분의1|0.333", label: "원뿔의 부피는 원기둥 부피의 몇 배인가?", hint: "1/3" }
            ],
            canvasType: "cone_volume"
          }
        ]
      },
      5: {
        title: "7.5 구의 겉넓이와 부피",
        substeps: [
          {
            id: "5-1",
            title: "구의 겉넓이(4πr²)와 부피((4/3)πr³)",
            concept: "반지름의 길이가 $r$인 구의 겉넓이는 $S = 4\\pi r^2$이고, 부피는 $V = \\frac{4}{3}\\pi r^3$입니다.",
            inquiry: "반지름 $r = 3\\,\\text{cm}$인 구의 겉넓이와 부피를 각각 $\\pi$를 써서 구하세요.",
            blanks: [
              { id: "b5_1", answer: "36\\pi|36pi", label: "구의 겉넓이 (cm²)", hint: "4π × 3² = 36π" },
              { id: "b5_2", answer: "36\\pi|36pi", label: "구의 부피 (cm³)", hint: "(4/3)π × 3³ = (4/3) × 27π = 36π" }
            ],
            canvasType: "sphere_calc"
          }
        ]
      },
      6: {
        title: "7.6 스스로 마무리하기 (단원 종합 평가)",
        substeps: [
          {
            id: "6-1",
            title: "입체도형 종합 성취도 평가",
            concept: "7단원 다면체, 회전체, 기둥/뿔/구의 겉넓이와 부피 공식 이해도를 종합 평가합니다.",
            inquiry: "다음 4문항을 풀고 답을 입력하세요.<br>1. 정이십면체의 면의 개수는?<br>2. 원뿔을 밑면에 평행하게 자를 때 생기는 두 입체도형 중 아랫부분의 이름은?<br>3. 밑넓이가 $20$, 높이가 $9$인 사각뿔의 부피는?<br>4. 반지름이 $2$인 구의 겉넓이는 몇 $\\pi$인가요? (계수만)",
            blanks: [
              { id: "b6_1", answer: "20|20개", label: "1번 정이십면체의 면의 개수", hint: "20" },
              { id: "b6_2", answer: "원뿔대", label: "2번 아랫부분 입체도형의 이름", hint: "원뿔대" },
              { id: "b6_3", answer: "60", label: "3번 사각뿔의 부피", hint: "(1/3) × 20 × 9 = 60" },
              { id: "b6_4", answer: "16|16\\pi", label: "4번 구의 겉넓이", hint: "4π × 2² = 16π" }
            ],
            canvasType: "solid_eval"
          }
        ]
      }
    };

    let twoInstance = null;

    function switchMainTab(tabIdx) {
      state.mainTab = tabIdx;
      document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === tabIdx);
      });

      const subNav = document.getElementById('subTabNav');
      subNav.innerHTML = '';
      const chapter = chapterData[tabIdx];
      if (!chapter) return;

      chapter.substeps.forEach((step, idx) => {
        const btn = document.createElement('button');
        btn.className = `sub-btn ${idx === 0 ? 'active' : ''}`;
        btn.textContent = step.title;
        btn.onclick = () => loadSubStep(step.id);
        subNav.appendChild(btn);
      });

      loadSubStep(chapter.substeps[0].id);
    }

    function loadSubStep(stepId) {
      state.subStep = stepId;
      document.querySelectorAll('.sub-btn').forEach(btn => {
        const text = btn.textContent;
        const curStep = getCurrentStepObj();
        if (curStep && text === curStep.title) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      const curStep = getCurrentStepObj();
      if (!curStep) return;

      document.getElementById('stepTitle').textContent = `[${curStep.id}] ${curStep.title}`;
      document.getElementById('conceptBox').innerHTML = curStep.concept;
      document.getElementById('inquiryQuestion').innerHTML = curStep.inquiry;

      const blankContainer = document.getElementById('blankItems');
      blankContainer.innerHTML = '';

      curStep.blanks.forEach(b => {
        const div = document.createElement('div');
        div.style.marginBottom = '12px';
        div.innerHTML = `
          <label style="display:block; font-size:13px; font-weight:700; color:#374151; margin-bottom:4px;">${b.label}</label>
          <div style="display:flex; gap:8px;">
            <input type="text" id="${b.id}" class="blank-input" placeholder="답안 입력..." value="${state.studentAnswers[b.id] || ''}" onchange="saveAnswer('${b.id}', this.value)">
            <span id="mark_${b.id}" style="font-size:18px; font-weight:bold; display:flex; align-items:center;"></span>
          </div>
          <div id="hint_${b.id}" style="display:none; font-size:12px; color:#d97706; margin-top:3px;">힌트: ${b.hint}</div>
        `;
        blankContainer.appendChild(div);
      });

      renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ]
      });

      renderCanvas(curStep.canvasType);
    }

    function getCurrentStepObj() {
      const chapter = chapterData[state.mainTab];
      if (!chapter) return null;
      return chapter.substeps.find(s => s.id === state.subStep);
    }

    function saveAnswer(id, val) { state.studentAnswers[id] = val; }
    function normTxt(t) { return (t || '').toString().toLowerCase().replace(/\s+/g, '').replace(/,/g, ''); }

    function checkAnswer() {
      const curStep = getCurrentStepObj();
      if (!curStep) return;

      let allCorrect = true;
      let total = curStep.blanks.length;
      let score = 0;

      curStep.blanks.forEach(b => {
        const input = document.getElementById(b.id);
        const mark = document.getElementById(`mark_${b.id}`);
        const hint = document.getElementById(`hint_${b.id}`);
        const userVal = normTxt(input ? input.value : '');
        const validOptions = b.answer.split('|').map(v => normTxt(v));

        if (validOptions.includes(userVal)) {
          if (mark) { mark.textContent = '⭕ 정답!'; mark.style.color = '#059669'; }
          if (hint) hint.style.display = 'none';
          score++;
        } else {
          if (mark) { mark.textContent = '❌ 다시 생각해보세요'; mark.style.color = '#dc2626'; }
          if (hint) hint.style.display = 'block';
          allCorrect = false;
        }
      });

      const feedback = document.getElementById('feedbackText');
      if (allCorrect) {
        feedback.innerHTML = `<span style="color:#059669; font-weight:800;">🎉 완벽합니다! 입체도형의 기하학적 원리를 정복했습니다.</span>`;
        if (typeof LMSIntegration !== 'undefined') {
          LMSIntegration.saveStudentProgress({
            studentId: window.currentStudentId || "student_demo",
            stepId: curStep.id,
            score: 100,
            completed: true
          });
        }
      } else {
        feedback.innerHTML = `<span style="color:#dc2626; font-weight:700;">아직 해결되지 않은 항목이 있습니다. (${score}/${total})</span>`;
      }
    }

    function showAnswer() {
      const curStep = getCurrentStepObj();
      if (!curStep) return;
      curStep.blanks.forEach(b => {
        const input = document.getElementById(b.id);
        if (input) {
          const mainAns = b.answer.split('|')[0];
          input.value = mainAns;
          state.studentAnswers[b.id] = mainAns;
        }
        const mark = document.getElementById(`mark_${b.id}`);
        if (mark) { mark.textContent = '💡 해설 정답'; mark.style.color = '#2563eb'; }
      });
    }

    function resetStep() {
      const curStep = getCurrentStepObj();
      if (!curStep) return;
      curStep.blanks.forEach(b => {
        const input = document.getElementById(b.id);
        if (input) input.value = '';
        delete state.studentAnswers[b.id];
        const mark = document.getElementById(`mark_${b.id}`);
        if (mark) mark.textContent = '';
        const hint = document.getElementById(`hint_${b.id}`);
        if (hint) hint.style.display = 'none';
      });
      document.getElementById('feedbackText').innerHTML = '';
      loadSubStep(state.subStep);
    }

    function renderCanvas(type) {
      const container = document.getElementById('canvasArea');
      container.innerHTML = '';
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 500;

      const two = new Two({ width: w, height: h, type: Two.Types.canvas }).appendTo(container);
      twoInstance = two;

      // Draw grid
      for (let x = 0; x <= w; x += 40) {
        const line = two.makeLine(x, 0, x, h);
        line.stroke = '#f8fafc';
      }
      for (let y = 0; y <= h; y += 40) {
        const line = two.makeLine(0, y, w, y);
        line.stroke = '#f8fafc';
      }

      if (type === 'cylinder_calc') {
        // Draw 3D Cylinder
        const cx = w / 2, cy = h / 2, rx = 70, ry = 22, height = 120;

        // Top ellipse
        const topEl = two.makeEllipse(cx, cy - height / 2, rx, ry);
        topEl.fill = '#bae6fd'; topEl.stroke = '#0284c7'; topEl.linewidth = 2;

        // Sides
        two.makeLine(cx - rx, cy - height / 2, cx - rx, cy + height / 2).stroke = '#0284c7';
        two.makeLine(cx + rx, cy - height / 2, cx + rx, cy + height / 2).stroke = '#0284c7';

        // Bottom ellipse front half
        const botEl = two.makeEllipse(cx, cy + height / 2, rx, ry);
        botEl.fill = '#e0f2fe'; botEl.stroke = '#0284c7'; botEl.linewidth = 2;

        two.makeText("r = 3 cm", cx, cy - height / 2).fill = '#0369a1';
        two.makeText("h = 5 cm", cx + rx + 30, cy).fill = '#0369a1';

      } else if (type === 'sphere_calc') {
        // Draw 3D Sphere with equator
        const cx = w / 2, cy = h / 2, R = 90;
        const sphere = two.makeCircle(cx, cy, R);
        sphere.fill = '#ede9fe'; sphere.stroke = '#7c3aed'; sphere.linewidth = 3;

        // Equator ellipse
        const eq = two.makeEllipse(cx, cy, R, 25);
        eq.fill = 'transparent'; eq.stroke = '#8b5cf6'; eq.linewidth = 2; eq.dashes = [5, 5];

        two.makeLine(cx, cy, cx + R, cy).stroke = '#dc2626';
        two.makeText("r = 3 cm", cx + 45, cy - 12).fill = '#dc2626';

        two.makeText("V = (4/3)πr³,  S = 4πr²", cx, h - 40).fill = '#5b21b6';

      } else {
        const title = two.makeText("입체도형 3차원 투시 캔버스", w / 2, 100);
        title.fill = '#1e293b'; title.weight = 800; title.size = 18;
      }

      two.update();
    }

    function toggleTeacherPortal() {
      if (state.isMaster) {
        const p = document.getElementById('teacherPortal');
        p.style.display = p.style.display === 'block' ? 'none' : 'block';
        return;
      }
      const pw = prompt("교사 마스터 비밀번호를 입력하십시오:");
      if (pw === "260523" || pw === "260831") {
        state.isMaster = true;
        document.getElementById('teacherPortal').style.display = 'block';
        buildStudentGrid();
        alert("교사 관리자 모드로 인증되었습니다.");
      } else {
        alert("비밀번호가 올바르지 않습니다.");
      }
    }

    function buildStudentGrid() {
      const container = document.getElementById('studentGrid');
      if (!container) return;
      container.innerHTML = '';
      for (let i = 1; i <= 25; i++) {
        const id = `101${String(i).padStart(2, '0')}`;
        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = '10px';
        card.innerHTML = `<div style="font-weight:800;">👤 ${id} 학생</div><div>단계: ${state.subStep}</div><div style="color:#059669; font-weight:700;">🟢 학습 중</div>`;
        container.appendChild(card);
      }
    }
    function setTool(t) { state.tool = t; }
    function resetCanvasView() { if (twoInstance) loadSubStep(state.subStep); }

    window.addEventListener('DOMContentLoaded', () => {
      switchMainTab(0);
      loadSubStep('0-1');
    });
'''

code = re.sub(r'<script>.*?</script>', lambda m: f'<script>{js_content}\n  </script>', code, flags=re.DOTALL)

with open('/home/ubuntu/workspace/Redbook/g1_ch7_solid_figures.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("g1_ch7_solid_figures.html complete! File size:", len(code))
