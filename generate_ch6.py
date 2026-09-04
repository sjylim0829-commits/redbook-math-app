import json
import re

with open('/home/ubuntu/workspace/Redbook/g1_ch1_factors.html', 'r', encoding='utf-8') as f:
    template = f.read()

code = template.replace(
    '<title>중1 수학 1단원: 소인수분해 대화형 탐구관</title>',
    '<title>중1 수학 6단원: 평면도형 대화형 탐구관</title>'
)
code = code.replace(
    '<h1>중1-1 Ⅰ. 소인수분해</h1>',
    '<h1>중1-2 Ⅵ. 평면도형</h1>'
)
code = code.replace(
    '<span class="badge">2022 개정 교육과정</span>',
    '<span class="badge">2022 개정 교육과정 · 다각형 및 부채꼴 탐구</span>'
)

old_tabs = '''      <button class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어보기</button>
      <button class="tab-btn" onclick="switchMainTab(1)">1.1 소수와 합성수</button>
      <button class="tab-btn" onclick="switchMainTab(2)">1.2 소인수분해</button>
      <button class="tab-btn" onclick="switchMainTab(3)">1.3 최대공약수</button>
      <button class="tab-btn" onclick="switchMainTab(4)">1.4 최소공배수</button>
      <button class="tab-btn" onclick="switchMainTab(5)">1.5 스스로 마무리하기</button>'''

new_tabs = '''      <button class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어보기</button>
      <button class="tab-btn" onclick="switchMainTab(1)">6.1 다각형의 내각과 외각</button>
      <button class="tab-btn" onclick="switchMainTab(2)">6.2 다각형의 내각의 합</button>
      <button class="tab-btn" onclick="switchMainTab(3)">6.3 다각형의 외각의 합</button>
      <button class="tab-btn" onclick="switchMainTab(4)">6.4 다각형의 대각선</button>
      <button class="tab-btn" onclick="switchMainTab(5)">6.5 원과 부채꼴의 성질</button>
      <button class="tab-btn" onclick="switchMainTab(6)">6.6 부채꼴의 호와 넓이</button>
      <button class="tab-btn" onclick="switchMainTab(7)">6.7 스스로 마무리하기</button>'''

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
        title: "0. 되짚어보기 (초등 평면도형 연계)",
        substeps: [
          {
            id: "0-1",
            title: "초등 복습: 원주율과 원의 둘레, 넓이",
            concept: "원의 지름에 대한 둘레의 비율을 원주율($\\pi$)이라 합니다. 초등학교에서 $3.14$로 계산하던 것을 중학교에서는 기호 $\\pi$로 나타냅니다.",
            inquiry: "반지름이 $5\\,\\text{cm}$인 원의 둘레(원주)와 넓이를 $\\pi$를 사용하여 나타내어 보세요.",
            blanks: [
              { id: "b0_1", answer: "10\\pi|10pi", label: "원주 (cm)", hint: "2 × π × 5 = 10π" },
              { id: "b0_2", answer: "25\\pi|25pi", label: "넓이 (cm²)", hint: "π × 5² = 25π" }
            ],
            canvasType: "circle_review"
          }
        ]
      },
      1: {
        title: "6.1 다각형의 내각과 외각",
        substeps: [
          {
            id: "1-1",
            title: "삼각형의 외각과 이웃하지 않는 두 내각의 관계",
            concept: "삼각형의 한 외각의 크기는 그와 <strong>이웃하지 않는 두 내각의 크기의 합</strong>과 같습니다.",
            inquiry: "삼각형 $\\mathrm{ABC}$에서 $\\angle A = 50^\\circ, \\angle B = 60^\\circ$일 때, 꼭짓점 $\\mathrm{C}$에서의 외각의 크기는 몇 도인가요?",
            blanks: [
              { id: "b1_1", answer: "110|110도|110^\\circ", label: "꼭짓점 C의 외각 크기(°)", hint: "50 + 60 = 110" },
              { id: "b1_2", answer: "180|180도", label: "삼각형의 내각의 총합(°)", hint: "180" }
            ],
            canvasType: "tri_exterior"
          }
        ]
      },
      2: {
        title: "6.2 다각형의 내각의 합",
        substeps: [
          {
            id: "2-1",
            title: "n각형의 내각의 크기의 합",
            concept: "$n$각형의 한 꼭짓점에서 대각선을 그으면 $(n-2)$개의 삼각형으로 나누어집니다. 따라서 $n$각형의 내각의 크기의 합은 $180^\\circ \\times (n-2)$입니다.",
            inquiry: "오각형($n=5$)의 내각의 크기의 합과, 정오각형의 한 내각의 크기를 구하세요.",
            blanks: [
              { id: "b2_1", answer: "540|540도", label: "오각형 내각의 합(°)", hint: "180 × (5-2) = 180 × 3 = 540" },
              { id: "b2_2", answer: "108|108도", label: "정오각형의 한 내각 크기(°)", hint: "540 / 5 = 108" }
            ],
            canvasType: "polygon_interior"
          }
        ]
      },
      3: {
        title: "6.3 다각형의 외각의 합",
        substeps: [
          {
            id: "3-1",
            title: "모든 다각형의 외각의 크기의 합",
            concept: "$n$각형에서 각 꼭짓점의 내각과 외각의 합은 $180^\\circ$이므로 총합은 $180^\\circ \\times n$입니다. 여기서 내각의 합 $180^\\circ \\times (n-2)$를 빼면, <strong>어떤 $n$각형이든 외각의 크기의 합은 항상 $360^\\circ$</strong>입니다.",
            inquiry: "정육각형의 외각의 크기의 합과, 정육각형의 한 외각의 크기는 몇 도인가요?",
            blanks: [
              { id: "b3_1", answer: "360|360도", label: "외각의 총합(°)", hint: "모든 다각형의 외각 합은 항상 360도" },
              { id: "b3_2", answer: "60|60도", label: "정육각형의 한 외각 크기(°)", hint: "360 / 6 = 60" }
            ],
            canvasType: "polygon_exterior"
          }
        ]
      },
      4: {
        title: "6.4 다각형의 대각선",
        substeps: [
          {
            id: "4-1",
            title: "다각형의 대각선의 총 개수 공식",
            concept: "$n$각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 자기 자신과 이웃한 두 꼭짓점을 제외하므로 $(n-3)$개입니다. 따라서 $n$각형의 대각선의 총 개수는 $\\frac{n(n-3)}{2}$개입니다.",
            inquiry: "팔각형($n=8$)의 한 꼭짓점에서 그을 수 있는 대각선의 개수와, 대각선의 총 개수를 구하세요.",
            blanks: [
              { id: "b4_1", answer: "5|5개", label: "한 꼭짓점 대각선 수", hint: "8 - 3 = 5" },
              { id: "b4_2", answer: "20|20개", label: "대각선의 총 개수", hint: "8 × (8-3) / 2 = 8 × 5 / 2 = 20" }
            ],
            canvasType: "diagonals_canvas"
          }
        ]
      },
      5: {
        title: "6.5 원과 부채꼴의 성질",
        substeps: [
          {
            id: "5-1",
            title: "중심각의 크기와 호의 길이 및 현의 성질",
            concept: "한 원에서 <strong>부채꼴의 호의 길이와 넓이는 중심각의 크기에 정비례</strong>합니다. 하지만 <strong>현의 길이는 중심각의 크기에 정비례하지 않습니다</strong>.",
            inquiry: "중심각이 $30^\\circ$인 부채꼴의 호의 길이가 $4\\,\\text{cm}$일 때, 같은 원에서 중심각이 $90^\\circ$인 부채꼴의 호의 길이는 몇 $\\text{cm}$인가요?",
            blanks: [
              { id: "b5_1", answer: "12|12cm", label: "중심각 90도 부채꼴 호의 길이", hint: "중심각이 3배(30도 -> 90도)이므로 호의 길이도 3배 (4 × 3 = 12)" },
              { id: "b5_2", answer: "정비례하지않는다|정비례하지않음|x|아니다", label: "현의 길이는 중심각에 정비례하는가?", hint: "정비례하지 않는다" }
            ],
            canvasType: "sector_props"
          }
        ]
      },
      6: {
        title: "6.6 부채꼴의 호의 길이와 넓이",
        substeps: [
          {
            id: "6-1",
            title: "부채꼴 공식: l = 2πr × (x/360), S = 1/2 rl",
            concept: "반지름 $r$, 중심각 $x^\\circ$인 부채꼴의 호의 길이는 $l = 2\\pi r \\times \\frac{x}{360}$, 넓이는 $S = \\pi r^2 \\times \\frac{x}{360} = \\frac{1}{2}rl$입니다.",
            inquiry: "반지름 $r = 6\\,\\text{cm}$, 중심각 $x = 60^\\circ$인 부채꼴의 호의 길이 $l$과 넓이 $S$를 $\\pi$를 써서 나타내세요.",
            blanks: [
              { id: "b6_1", answer: "2\\pi|2pi", label: "호의 길이 l (cm)", hint: "2π × 6 × (60/360) = 12π × (1/6) = 2π" },
              { id: "b6_2", answer: "6\\pi|6pi", label: "부채꼴의 넓이 S (cm²)", hint: "1/2 × 6 × 2π = 6π" }
            ],
            canvasType: "sector_calc"
          }
        ]
      },
      7: {
        title: "6.7 스스로 마무리하기 (단원 종합 평가)",
        substeps: [
          {
            id: "7-1",
            title: "평면도형 종합 성취도 평가",
            concept: "6단원 다각형의 내각·외각·대각선 및 부채꼴의 호의 길이와 넓이를 종합 점검합니다.",
            inquiry: "다음 4문항을 풀고 답을 입력하세요.<br>1. 칠각형의 대각선의 총 개수는?<br>2. 정십각형의 한 외각의 크기는 몇 도인가요?<br>3. 정구각형의 한 내각의 크기는 몇 도인가요?<br>4. 반지름 $4$, 중심각 $90^\\circ$인 부채꼴의 호의 길이는?",
            blanks: [
              { id: "b7_1", answer: "14|14개", label: "1번 칠각형 대각선 총 개수", hint: "7 × (7-3) / 2 = 14" },
              { id: "b7_2", answer: "36|36도", label: "2번 정십각형 한 외각 크기(°)", hint: "360 / 10 = 36" },
              { id: "b7_3", answer: "140|140도", label: "3번 정구각형 한 내각 크기(°)", hint: "180 × 7 / 9 = 140" },
              { id: "b7_4", answer: "2\\pi|2pi", label: "4번 부채꼴 호의 길이", hint: "2π × 4 × (90/360) = 2π" }
            ],
            canvasType: "polygon_eval"
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
        feedback.innerHTML = `<span style="color:#059669; font-weight:800;">🎉 완벽합니다! 평면도형의 성질을 마스터하였습니다.</span>`;
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

      if (type === 'tri_exterior') {
        const cx = w / 2, cy = h / 2;
        // Triangle ABC with extended side BC
        const A = { x: cx - 50, y: cy - 90 };
        const B = { x: cx - 180, y: cy + 70 };
        const C = { x: cx + 60, y: cy + 70 };
        const D = { x: cx + 180, y: cy + 70 }; // Extension point

        const tri = two.makePolygon([new Two.Anchor(A.x, A.y), new Two.Anchor(B.x, B.y), new Two.Anchor(C.x, C.y)], false);
        tri.fill = '#eff6ff'; tri.stroke = '#2563eb'; tri.linewidth = 3;

        const extLine = two.makeLine(C.x, C.y, D.x, D.y);
        extLine.stroke = '#dc2626'; extLine.linewidth = 3; extLine.dashes = [6, 3];

        two.makeText("A (50°)", A.x, A.y - 15).fill = '#1e3a8a';
        two.makeText("B (60°)", B.x - 20, B.y + 15).fill = '#1e3a8a';
        two.makeText("C", C.x - 10, C.y + 20).fill = '#1e3a8a';
        two.makeText("외각 = 110°", C.x + 50, C.y - 15).fill = '#dc2626';

      } else if (type === 'polygon_interior') {
        // Regular Pentagon with diagonals from one vertex
        const cx = w / 2, cy = h / 2, R = 110;
        const pts = [];
        for (let i = 0; i < 5; i++) {
          const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          pts.push({ x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) });
        }
        const anchors = pts.map(p => new Two.Anchor(p.x, p.y));
        const poly = two.makePolygon(anchors, false);
        poly.fill = '#f0fdf4'; poly.stroke = '#16a34a'; poly.linewidth = 3;

        // Diagonals from vertex 0 to 2 and 3
        two.makeLine(pts[0].x, pts[0].y, pts[2].x, pts[2].y).stroke = '#d97706';
        two.makeLine(pts[0].x, pts[0].y, pts[3].x, pts[3].y).stroke = '#d97706';

        two.makeText("삼각형 3개로 분할 ➔ 180° × 3 = 540°", cx, h - 35).fill = '#166534';

      } else if (type === 'sector_calc') {
        // Sector visual
        const cx = w / 2, cy = h / 2 + 20, R = 120;
        const angle = Math.PI / 3; // 60 deg

        const sector = two.makeCurve([
          new Two.Anchor(cx, cy),
          new Two.Anchor(cx + R, cy),
          new Two.Anchor(cx + R * Math.cos(angle), cy - R * Math.sin(angle))
        ], true);
        sector.fill = '#fef3c7'; sector.stroke = '#d97706'; sector.linewidth = 3;

        two.makeText("r = 6 cm", cx + 50, cy + 15).fill = '#92400e';
        two.makeText("중심각 60°", cx + 30, cy - 25).fill = '#b45309';
        two.makeText("l = 2π cm", cx + 110, cy - 60).fill = '#b45309';
      } else {
        const title = two.makeText("평면도형 인터랙티브 탐구 캔버스", w / 2, 100);
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

with open('/home/ubuntu/workspace/Redbook/g1_ch6_plane_figures.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("g1_ch6_plane_figures.html complete! File size:", len(code))
