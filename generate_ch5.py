import json
import re

with open('/home/ubuntu/workspace/Redbook/g1_ch1_factors.html', 'r', encoding='utf-8') as f:
    template = f.read()

code = template.replace(
    '<title>중1 수학 1단원: 소인수분해 대화형 탐구관</title>',
    '<title>중1 수학 5단원: 도형의 기초 대화형 탐구관</title>'
)
code = code.replace(
    '<h1>중1-1 Ⅰ. 소인수분해</h1>',
    '<h1>중1-2 Ⅴ. 도형의 기초</h1>'
)
code = code.replace(
    '<span class="badge">2022 개정 교육과정</span>',
    '<span class="badge">2022 개정 교육과정 · 기하 탐구 및 작도</span>'
)

old_tabs = '''      <button class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어보기</button>
      <button class="tab-btn" onclick="switchMainTab(1)">1.1 소수와 합성수</button>
      <button class="tab-btn" onclick="switchMainTab(2)">1.2 소인수분해</button>
      <button class="tab-btn" onclick="switchMainTab(3)">1.3 최대공약수</button>
      <button class="tab-btn" onclick="switchMainTab(4)">1.4 최소공배수</button>
      <button class="tab-btn" onclick="switchMainTab(5)">1.5 스스로 마무리하기</button>'''

new_tabs = '''      <button class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어보기</button>
      <button class="tab-btn" onclick="switchMainTab(1)">5.1 점, 선, 면</button>
      <button class="tab-btn" onclick="switchMainTab(2)">5.2 각과 맞꼭지각</button>
      <button class="tab-btn" onclick="switchMainTab(3)">5.3 위치 관계와 꼬인 위치</button>
      <button class="tab-btn" onclick="switchMainTab(4)">5.4 평행선의 성질</button>
      <button class="tab-btn" onclick="switchMainTab(5)">5.5 간단한 작도</button>
      <button class="tab-btn" onclick="switchMainTab(6)">5.6 삼각형의 작도</button>
      <button class="tab-btn" onclick="switchMainTab(7)">5.7 삼각형의 합동</button>
      <button class="tab-btn" onclick="switchMainTab(8)">5.8 스스로 마무리하기</button>'''

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
        title: "0. 되짚어보기 (초등 기하 연계)",
        substeps: [
          {
            id: "0-1",
            title: "초등 복습: 각도와 직각, 예각, 둔각",
            concept: "각의 크기에 따라 $90^\\circ$를 직각, $0^\\circ$보다 크고 $90^\\circ$보다 작은 각을 예각, $90^\\circ$보다 크고 $180^\\circ$보다 작은 각을 둔각이라고 합니다.",
            inquiry: "다음 각의 크기를 보고 예각, 직각, 둔각 중 알맞은 것을 고르세요.<br>⑴ $45^\\circ$<br>⑵ $130^\\circ$",
            blanks: [
              { id: "b0_1", answer: "예각", label: "⑴ 45도", hint: "90도보다 작으므로 예각" },
              { id: "b0_2", answer: "둔각", label: "⑵ 130도", hint: "90도와 180도 사이이므로 둔각" }
            ],
            canvasType: "angle_types"
          }
        ]
      },
      1: {
        title: "5.1 점, 선, 면",
        substeps: [
          {
            id: "1-1",
            title: "도형의 기본 요소와 직선의 결정",
            concept: "도형의 기본 요소는 <strong>점, 선, 면</strong>입니다. 선과 선 또는 선과 면이 만나서 생기는 점을 <strong>교점</strong>, 면과 면이 만나서 생기는 선을 <strong>교선</strong>이라고 합니다.<br>서로 다른 두 점은 <strong>오직 하나의 직선</strong>을 결정합니다.",
            inquiry: "서로 다른 두 점 $\\mathrm{A, B}$를 지나는 직선을 기호로 어떻게 나타내나요? 또 선분 $\\mathrm{AB}$의 중점 $\\mathrm{M}$에 대해 $\\mathrm{\\overline{AM}}$의 길이는 $\\mathrm{\\overline{AB}}$의 몇 배인가요?",
            blanks: [
              { id: "b1_1", answer: "직선AB|AB|직선ab", label: "서로 다른 두 점을 지나는 직선 기호", hint: "직선 AB" },
              { id: "b1_2", answer: "1/2|0.5|절반", label: "선분 AM은 선분 AB의 몇 배인가?", hint: "중점이므로 1/2배" }
            ],
            canvasType: "lines_midpoint"
          }
        ]
      },
      2: {
        title: "5.2 각과 맞꼭지각",
        substeps: [
          {
            id: "2-1",
            title: "맞꼭지각의 성질",
            concept: "두 직선이 한 점에서 만날 때 마주 보는 두 각을 <strong>맞꼭지각</strong>이라 하고, <strong>맞꼭지각의 크기는 서로 같습니다</strong>.",
            inquiry: "오른쪽 캔버스에서 교차하는 두 직선에 의해 생긴 맞꼭지각 $\\angle a$가 $70^\\circ$일 때, 마주보는 $\\angle c$의 크기와 이웃하는 $\\angle b$의 크기를 구하세요.",
            blanks: [
              { id: "b2_1", answer: "70|70도|70^\\circ", label: "맞꼭지각 ∠c의 크기(°)", hint: "맞꼭지각의 크기는 같습니다 (70)" },
              { id: "b2_2", answer: "110|110도|110^\\circ", label: "이웃각 ∠b의 크기(°)", hint: "평각은 180도이므로 180 - 70 = 110" }
            ],
            canvasType: "vertical_angles"
          }
        ]
      },
      3: {
        title: "5.3 위치 관계와 꼬인 위치",
        substeps: [
          {
            id: "3-1",
            title: "평면과 공간에서의 위치 관계, 꼬인 위치",
            concept: "공간에서 두 직선이 <strong>만나지도 않고 평행하지도 않은</strong> 위치 관계를 <strong>꼬인 위치</strong>에 있다고 합니다.",
            inquiry: "직육면체에서 모서리 $\\mathrm{AB}$와 평행한 모서리의 개수와, 모서리 $\\mathrm{AB}$와 꼬인 위치에 있는 모서리의 개수를 구하세요.",
            blanks: [
              { id: "b3_1", answer: "3|3개", label: "모서리 AB와 평행한 모서리 수", hint: "DC, EF, HG 등 3개" },
              { id: "b3_2", answer: "4|4개", label: "모서리 AB와 꼬인 위치인 모서리 수", hint: "CG, DH, FG, EH 총 4개" }
            ],
            canvasType: "skew_lines_cube"
          }
        ]
      },
      4: {
        title: "5.4 평행선의 성질",
        substeps: [
          {
            id: "4-1",
            title: "동위각과 엇각",
            concept: "두 직선이 다른 한 직선과 만날 때, <strong>두 직선이 평행하면 동위각의 크기가 서로 같고 엇각의 크기가 서로 같습니다</strong>. 반대로 동위각이나 엇각의 크기가 같으면 두 직선은 평행합니다.",
            inquiry: "평행한 두 직선 $l, m$에 다른 직선 $n$이 만납니다. $\\angle x$의 동위각이 $65^\\circ$일 때, $\\angle x$의 크기와 그 엇각의 크기는 각각 몇 도인가요?",
            blanks: [
              { id: "b4_1", answer: "65|65도", label: "동위각 ∠x의 크기(°)", hint: "평행선에서 동위각의 크기는 같습니다 (65)" },
              { id: "b4_2", answer: "65|65도", label: "엇각의 크기(°)", hint: "평행선에서 엇각의 크기도 같습니다 (65)" }
            ],
            canvasType: "parallel_lines"
          }
        ]
      },
      5: {
        title: "5.5 간단한 작도",
        substeps: [
          {
            id: "5-1",
            title: "눈금 없는 자와 컴퍼스만 사용한 작도",
            concept: "<strong>눈금 없는 자</strong>는 두 점을 연결하는 선이나 직선을 그을 때 사용하고, <strong>컴퍼스</strong>는 원을 그리거나 선분의 길이를 다른 선분으로 옮길 때 사용합니다.",
            inquiry: "선분의 길이를 옮길 때 사용하는 작도 도구는 무엇인가요? 또 크기가 같은 각의 작도에서 컴퍼스를 사용하는 주된 목적은 무엇인가요?",
            blanks: [
              { id: "b5_1", answer: "컴퍼스|compass", label: "선분의 길이를 옮기는 도구", hint: "컴퍼스" },
              { id: "b5_2", answer: "길이|거리|호", label: "컴퍼스로 재어 옮기는 것", hint: "길이 또는 원의 반지름(호)" }
            ],
            canvasType: "compass_ruler"
          }
        ]
      },
      6: {
        title: "5.6 삼각형의 작도와 성립 조건",
        substeps: [
          {
            id: "6-1",
            title: "삼각형의 세 변의 길이 관계",
            concept: "삼각형의 가장 긴 변의 길이는 <strong>나머지 두 변의 길이의 합보다 반드시 작아야</strong> 합니다 ($a < b + c$).",
            inquiry: "세 변의 길이가 다음과 같을 때 삼각형을 만들 수 있는 것을 고르세요.<br>㉠ $3\\,\\text{cm}, 4\\,\\text{cm}, 8\\,\\text{cm}$<br>㉡ $4\\,\\text{cm}, 5\\,\\text{cm}, 7\\,\\text{cm}$",
            blanks: [
              { id: "b6_1", answer: "㉡|ㄴ|B", label: "삼각형이 만들어지는 것", hint: "7 < 4 + 5 = 9 이므로 성립" },
              { id: "b6_2", answer: "작아야|작다|<", label: "가장 긴 변은 나머지 두 변의 합보다 어떠해야 하는가?", hint: "작아야 한다" }
            ],
            canvasType: "triangle_condition"
          }
        ]
      },
      7: {
        title: "5.7 삼각형의 합동",
        substeps: [
          {
            id: "7-1",
            title: "삼각형의 합동 조건 (SSS, SAS, ASA)",
            concept: "모양과 크기가 같아서 완전히 포개어지는 두 도형을 <strong>합동</strong>($\\equiv$)이라 합니다.<br>1. <strong>SSS 합동</strong>: 세 쌍의 대응변의 길이가 각각 같을 때<br>2. <strong>SAS 합동</strong>: 두 쌍의 대응변의 길이와 그 <strong>끼인각</strong>의 크기가 같을 때<br>3. <strong>ASA 합동</strong>: 한 쌍의 대응변의 길이와 그 <strong>양 끝각</strong>의 크기가 같을 때",
            inquiry: "두 변의 길이가 각각 $5, 7$이고 그 끼인각이 $50^\\circ$로 서로 같은 두 삼각형은 어떤 합동 조건에 의해 합동인가요?",
            blanks: [
              { id: "b7_1", answer: "SAS|SAS합동|sas", label: "두 변과 끼인각이 같을 때의 합동조건", hint: "SAS 합동" },
              { id: "b7_2", answer: "포개어진다|일치한다|같다", label: "합동인 두 도형을 겹치면 완전히 어떻게 되는가?", hint: "포개어진다" }
            ],
            canvasType: "triangle_congruence"
          }
        ]
      },
      8: {
        title: "5.8 스스로 마무리하기 (단원 종합 평가)",
        substeps: [
          {
            id: "8-1",
            title: "도형의 기초 종합 성취도 평가",
            concept: "5단원 도형의 기초에서 배운 점선면, 맞꼭지각, 평행선 성질, 꼬인 위치, 삼각형 작도 및 합동 조건을 총정리합니다.",
            inquiry: "다음 4문항을 풀고 답을 입력하세요.<br>1. 한 점에서 만나는 두 직선에서 생기는 맞꼭지각은 모두 몇 쌍인가요?<br>2. 평행선에서 엇각의 크기가 $55^\\circ$이면 동위각의 크기는 몇 도인가요?<br>3. 세 변의 길이가 각각 같은 두 삼각형의 합동 조건은?<br>4. 공간에서 만나지도 않고 평행하지도 않은 두 직선의 위치 관계는?",
            blanks: [
              { id: "b8_1", answer: "2|2쌍", label: "1번 맞꼭지각 쌍의 수", hint: "서로 마주보는 2쌍" },
              { id: "b8_2", answer: "55|55도", label: "2번 동위각 크기(°)", hint: "동위각과 엇각의 크기는 모두 같습니다 (55)" },
              { id: "b8_3", answer: "SSS|SSS합동|sss", label: "3번 세 변이 같을 때 합동조건", hint: "SSS 합동" },
              { id: "b8_4", answer: "꼬인위치|꼬인 위치", label: "4번 두 직선의 위치 관계", hint: "꼬인 위치" }
            ],
            canvasType: "geom_eval"
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
        feedback.innerHTML = `<span style="color:#059669; font-weight:800;">🎉 완벽합니다! 도형의 성질을 올바르게 파악하였습니다.</span>`;
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

      if (type === 'vertical_angles') {
        // Draw intersecting lines
        const cx = w / 2, cy = h / 2;
        const line1 = two.makeLine(cx - 200, cy - 100, cx + 200, cy + 100);
        line1.stroke = '#2563eb'; line1.linewidth = 3;
        const line2 = two.makeLine(cx - 200, cy + 120, cx + 200, cy - 120);
        line2.stroke = '#059669'; line2.linewidth = 3;

        const p = two.makeCircle(cx, cy, 5); p.fill = '#1e293b';

        const tA = two.makeText("∠a = 70°", cx - 90, cy);
        tA.fill = '#dc2626'; tA.weight = 800; tA.size = 15;
        const tC = two.makeText("∠c = ?", cx + 90, cy);
        tC.fill = '#2563eb'; tC.weight = 800; tC.size = 15;
        const tB = two.makeText("∠b = ?", cx, cy - 80);
        tB.fill = '#059669'; tB.weight = 800; tB.size = 15;

        const info = two.makeText("맞꼭지각은 항상 크기가 같고, 평각은 180°입니다.", cx, h - 40);
        info.fill = '#475569'; info.weight = 700;

      } else if (type === 'skew_lines_cube') {
        // Draw 3D Cube showing skew lines
        const ox = w / 2 - 60, oy = h / 2 - 30;
        const size = 120;

        // Front Face
        const f1 = two.makeRectangle(ox, oy, size, size);
        f1.stroke = '#94a3b8'; f1.fill = 'transparent'; f1.linewidth = 2;

        // Back Face
        const b1 = two.makeRectangle(ox + 60, oy - 40, size, size);
        b1.stroke = '#cbd5e1'; b1.fill = 'transparent'; b1.linewidth = 2;

        // Connecting Edges
        two.makeLine(ox - size/2, oy - size/2, ox + 60 - size/2, oy - 40 - size/2).stroke = '#cbd5e1';
        two.makeLine(ox + size/2, oy - size/2, ox + 60 + size/2, oy - 40 - size/2).stroke = '#cbd5e1';
        two.makeLine(ox - size/2, oy + size/2, ox + 60 - size/2, oy - 40 + size/2).stroke = '#cbd5e1';
        two.makeLine(ox + size/2, oy + size/2, ox + 60 + size/2, oy - 40 + size/2).stroke = '#cbd5e1';

        // Highlight Reference Edge AB (top-front) in Red
        const edgeAB = two.makeLine(ox - size/2, oy - size/2, ox + size/2, oy - size/2);
        edgeAB.stroke = '#dc2626'; edgeAB.linewidth = 5;

        // Highlight Skew Edge (e.g. back-right vertical) in Blue
        const edgeSkew = two.makeLine(ox + 60 + size/2, oy - 40 - size/2, ox + 60 + size/2, oy - 40 + size/2);
        edgeSkew.stroke = '#2563eb'; edgeSkew.linewidth = 5;

        const lA = two.makeText("A", ox - size/2 - 10, oy - size/2); lA.weight = 800;
        const lB = two.makeText("B", ox + size/2 + 10, oy - size/2); lB.weight = 800;

        const info = two.makeText("빨간 모서리 AB와 파란 모서리는 만나지도 않고 평행하지도 않은 '꼬인 위치'입니다.", w / 2, h - 35);
        info.fill = '#1e3a8a'; info.weight = 800; info.size = 13;

      } else if (type === 'parallel_lines') {
        // Draw parallel lines with transversal
        const y1 = 140, y2 = 260;
        const lineL = two.makeLine(80, y1, w - 80, y1);
        lineL.stroke = '#2563eb'; lineL.linewidth = 3;
        const lineM = two.makeLine(80, y2, w - 80, y2);
        lineM.stroke = '#2563eb'; lineM.linewidth = 3;

        const lineN = two.makeLine(160, 60, w - 160, 340);
        lineN.stroke = '#dc2626'; lineN.linewidth = 3;

        two.makeText("직선 l // m", 60, y1 - 10).fill = '#2563eb';
        two.makeText("동위각 = 65°", 260, y1 - 20).fill = '#059669';
        two.makeText("엇각 ∠x = ?", 330, y2 + 20).fill = '#dc2626';

      } else if (type === 'triangle_congruence') {
        // Draw two congruent triangles
        const tri1 = two.makePolygon(160, 200, 70, 3);
        tri1.fill = '#dbeafe'; tri1.stroke = '#2563eb'; tri1.linewidth = 3;

        const tri2 = two.makePolygon(w - 160, 200, 70, 3);
        tri2.fill = '#dcfce7'; tri2.stroke = '#059669'; tri2.linewidth = 3;

        two.makeText("△ABC", 160, 290).weight = 800;
        two.makeText("△DEF (합동 △ABC ≡ △DEF)", w - 160, 290).weight = 800;
        const sym = two.makeText("≡", w / 2, 200);
        sym.size = 36; sym.fill = '#e11d48'; sym.weight = 900;

      } else {
        const title = two.makeText("기하 및 작도 시뮬레이션 캔버스", w / 2, 100);
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

with open('/home/ubuntu/workspace/Redbook/g1_ch5_geometry_base.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("g1_ch5_geometry_base.html complete! File size:", len(code))
