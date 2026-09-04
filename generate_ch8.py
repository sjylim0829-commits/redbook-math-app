import json
import re

with open('/home/ubuntu/workspace/Redbook/g1_ch1_factors.html', 'r', encoding='utf-8') as f:
    template = f.read()

code = template.replace(
    '<title>중1 수학 1단원: 소인수분해 대화형 탐구관</title>',
    '<title>중1 수학 8단원: 자료의 정리와 해석 대화형 탐구관</title>'
)
code = code.replace(
    '<h1>중1-1 Ⅰ. 소인수분해</h1>',
    '<h1>중1-2 Ⅷ. 자료의 정리와 해석</h1>'
)
code = code.replace(
    '<span class="badge">2022 개정 교육과정</span>',
    '<span class="badge">2022 개정 교육과정 · 통계적 탐구 및 데이터 분석</span>'
)

old_tabs = '''      <button class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어보기</button>
      <button class="tab-btn" onclick="switchMainTab(1)">1.1 소수와 합성수</button>
      <button class="tab-btn" onclick="switchMainTab(2)">1.2 소인수분해</button>
      <button class="tab-btn" onclick="switchMainTab(3)">1.3 최대공약수</button>
      <button class="tab-btn" onclick="switchMainTab(4)">1.4 최소공배수</button>
      <button class="tab-btn" onclick="switchMainTab(5)">1.5 스스로 마무리하기</button>'''

new_tabs = '''      <button class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어보기</button>
      <button class="tab-btn" onclick="switchMainTab(1)">8.1 대푯값 (평균·중앙값·최빈값)</button>
      <button class="tab-btn" onclick="switchMainTab(2)">8.2 줄기와 잎 그림</button>
      <button class="tab-btn" onclick="switchMainTab(3)">8.3 도수분포표</button>
      <button class="tab-btn" onclick="switchMainTab(4)">8.4 히스토그램과 도수분포다각형</button>
      <button class="tab-btn" onclick="switchMainTab(5)">8.5 상대도수와 그래프</button>
      <button class="tab-btn" onclick="switchMainTab(6)">8.6 실생활 자료 해석</button>
      <button class="tab-btn" onclick="switchMainTab(7)">8.7 스스로 마무리하기</button>'''

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
        title: "0. 되짚어보기 (초등 통계 연계)",
        substeps: [
          {
            id: "0-1",
            title: "초등 복습: 평균 구하기",
            concept: "자료의 값의 총합을 자료의 수로 나눈 값을 <strong>평균</strong>이라고 합니다.",
            inquiry: "5명의 수학 점수가 각각 $80, 85, 90, 75, 95$점일 때, 점수의 평균을 구하세요.",
            blanks: [
              { id: "b0_1", answer: "425", label: "점수의 총합", hint: "80 + 85 + 90 + 75 + 95 = 425" },
              { id: "b0_2", answer: "85|85점", label: "평균 점수", hint: "425 / 5 = 85" }
            ],
            canvasType: "mean_review"
          }
        ]
      },
      1: {
        title: "8.1 대푯값 (평균, 중앙값, 최빈값)",
        substeps: [
          {
            id: "1-1",
            title: "자료의 중심 경향을 나타내는 세 가지 대푯값",
            concept: "1. <strong>평균</strong>: 자료의 총합을 개수로 나눈 값<br>2. <strong>중앙값</strong>: 크기순으로 나열할 때 한가운데 있는 값<br>3. <strong>최빈값</strong>: 자료에서 가장 많이 나타난 값",
            inquiry: "자료: $2, 3, 3, 5, 7, 8, 14$ 에서 평균, 중앙값, 최빈값을 각각 구하세요.",
            blanks: [
              { id: "b1_1", answer: "6", label: "평균", hint: "(2+3+3+5+7+8+14) / 7 = 42 / 7 = 6" },
              { id: "b1_2", answer: "5", label: "중앙값", hint: "7개 중 4번째 값 = 5" },
              { id: "b1_3", answer: "3", label: "최빈값", hint: "3이 2번으로 가장 많이 나옴" }
            ],
            canvasType: "averages_canvas"
          }
        ]
      },
      2: {
        title: "8.2 줄기와 잎 그림",
        substeps: [
          {
            id: "2-1",
            title: "줄기와 잎 그림의 작성 및 해석",
            concept: "자료를 십의 자리 수인 <strong>줄기</strong>와 일의 자리 수인 <strong>잎</strong>으로 나누어 나타낸 그림입니다. 자료의 손실 없이 분포 상태를 한눈에 볼 수 있습니다.",
            inquiry: "줄기 '2'에 잎이 '1, 4, 4, 8'이 적혀 있습니다. 이 줄기에 해당하는 자료의 개수와 가장 큰 값은 얼마인가요?",
            blanks: [
              { id: "b2_1", answer: "4|4개", label: "자료의 개수", hint: "잎이 4개이므로 4개" },
              { id: "b2_2", answer: "28", label: "가장 큰 값", hint: "줄기 2, 잎 8 -> 28" }
            ],
            canvasType: "stem_leaf_canvas"
          }
        ]
      },
      3: {
        title: "8.3 도수분포표",
        substeps: [
          {
            id: "3-1",
            title: "계급, 계급의 크기, 계급값, 도수",
            concept: "구간을 <strong>계급</strong>, 구간의 너비를 <strong>계급의 크기</strong>, 계급의 중앙값을 <strong>계급값</strong>, 각 계급에 속하는 자료의 수를 <strong>도수</strong>라고 합니다.",
            inquiry: "계급이 '$60\\,\\text{점 이상 } 70\\,\\text{점 미만}$'일 때 계급의 크기와 계급값을 구하세요.",
            blanks: [
              { id: "b3_1", answer: "10|10점", label: "계급의 크기", hint: "70 - 60 = 10" },
              { id: "b3_2", answer: "65|65점", label: "계급값", hint: "(60 + 70) / 2 = 65" }
            ],
            canvasType: "freq_table"
          }
        ]
      },
      4: {
        title: "8.4 히스토그램과 도수분포다각형",
        substeps: [
          {
            id: "4-1",
            title: "히스토그램의 넓이와 도수분포다각형",
            concept: "히스토그램의 모든 직사각형 넓이의 합은 <strong>$(\\text{계급의 크기}) \\times (\\text{도수의 총합})$</strong>과 같습니다. 도수분포다각형과 가로축으로 둘러싸인 부분의 넓이도 이와 같습니다.",
            inquiry: "계급의 크기가 $5$이고 전체 학생 수가 $30$명일 때, 히스토그램의 모든 직사각형의 넓이의 총합은 얼마인가요?",
            blanks: [
              { id: "b4_1", answer: "150", label: "직사각형 넓이의 합", hint: "5 × 30 = 150" },
              { id: "b4_2", answer: "같다|일치한다|동일하다", label: "도수분포다각형의 넓이와 히스토그램의 넓이는 서로 어떠한가?", hint: "서로 같다" }
            ],
            canvasType: "histogram_canvas"
          }
        ]
      },
      5: {
        title: "8.5 상대도수와 그 그래프",
        substeps: [
          {
            id: "5-1",
            title: "상대도수 = (계급의 도수) ÷ (도수의 총합)",
            concept: "전체 도수에 대한 각 계급의 도수의 비율을 <strong>상대도수</strong>라 합니다. <strong>상대도수의 총합은 항상 $1$</strong>이며, 도수가 다른 두 집단의 분포를 비교할 때 매우 유용합니다.",
            inquiry: "어느 반 전체 학생 수 $40$명 중 어떤 계급의 도수가 $8$명일 때, 이 계급의 상대도수를 구하세요. 또 상대도수의 총합은 항상 얼마인가요?",
            blanks: [
              { id: "b5_1", answer: "0.2|2/10|1/5", label: "해당 계급의 상대도수", hint: "8 / 40 = 0.2" },
              { id: "b5_2", answer: "1|1.0", label: "상대도수의 총합", hint: "상대도수의 총합은 항상 1입니다." }
            ],
            canvasType: "rel_freq_canvas"
          }
        ]
      },
      6: {
        title: "8.6 실생활 자료 해석",
        substeps: [
          {
            id: "6-1",
            title: "공학 도구 및 실생활 데이터 분석",
            concept: "공학적 도구(소프트웨어, 공학용 계산기 등)를 활용하여 대용량 데이터를 처리하고, 극단값의 유무에 따라 평균과 중앙값 중 더 적절한 대푯값을 선택합니다.",
            inquiry: "자료에 극단적으로 매우 크거나 작은 값(이상치)이 포함되어 있을 때, 평균보다 자료의 중심 경향을 더 잘 나타내는 대푯값은 무엇인가요?",
            blanks: [
              { id: "b6_1", answer: "중앙값|median", label: "적절한 대푯값", hint: "극단값의 영향을 받지 않는 중앙값" },
              { id: "b6_2", answer: "영향을받는다|왜곡된다|커진다|작아진다", label: "극단값이 있을 때 평균은 어떻게 되는가?", hint: "영향을 받는다 (왜곡된다)" }
            ],
            canvasType: "data_analysis"
          }
        ]
      },
      7: {
        title: "8.7 스스로 마무리하기 (단원 종합 평가)",
        substeps: [
          {
            id: "7-1",
            title: "자료의 정리와 해석 종합 성취도 평가",
            concept: "8단원 대푯값, 도수분포표, 히스토그램 및 상대도수의 핵심 개념을 종합 평가합니다.",
            inquiry: "다음 4문항을 풀고 답을 입력하세요.<br>1. 자료 $1, 2, 4, 7, 10$의 중앙값은?<br>2. 도수의 총합이 $50$이고 상대도수가 $0.16$인 계급의 도수는 몇 명인가요?<br>3. 모든 상대도수의 합은 항상 얼마인가요?<br>4. 계급의 크기가 $10$이고 도수 총합이 $25$일 때 히스토그램의 넓이의 합은?",
            blanks: [
              { id: "b7_1", answer: "4", label: "1번 중앙값", hint: "가운데 위치한 값 = 4" },
              { id: "b7_2", answer: "8|8명", label: "2번 계급의 도수", hint: "50 × 0.16 = 8" },
              { id: "b7_3", answer: "1", label: "3번 상대도수의 총합", hint: "1" },
              { id: "b7_4", answer: "250", label: "4번 히스토그램 넓이의 합", hint: "10 × 25 = 250" }
            ],
            canvasType: "stat_eval"
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
        feedback.innerHTML = `<span style="color:#059669; font-weight:800;">🎉 완벽합니다! 통계 분석 능력이 뛰어납니다.</span>`;
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

      if (type === 'histogram_canvas') {
        // Draw Histogram and frequency polygon
        const ox = 80, oy = h - 80;
        // Axes
        const xAxis = two.makeLine(ox, oy, w - 40, oy); xAxis.stroke = '#334155'; xAxis.linewidth = 2;
        const yAxis = two.makeLine(ox, oy, ox, 60); yAxis.stroke = '#334155'; yAxis.linewidth = 2;

        const freqs = [3, 7, 12, 6, 2];
        const barW = 70;
        const midPoints = [];

        freqs.forEach((f, i) => {
          const barH = f * 20;
          const rect = two.makeRectangle(ox + i * barW + barW / 2, oy - barH / 2, barW, barH);
          rect.fill = '#bfdbfe'; rect.stroke = '#2563eb'; rect.linewidth = 2;
          midPoints.push({ x: ox + i * barW + barW / 2, y: oy - barH });

          const lbl = two.makeText(`${f}`, ox + i * barW + barW / 2, oy - barH - 12);
          lbl.fill = '#1d4ed8'; lbl.weight = 800;

          const tick = two.makeText(`${50 + i * 10}`, ox + i * barW, oy + 20);
          tick.size = 11;
        });
        two.makeText(`${50 + freqs.length * 10}`, ox + freqs.length * barW, oy + 20).size = 11;

        // Draw Frequency Polygon connecting midpoints
        if (midPoints.length > 0) {
          const polyPts = [
            new Two.Anchor(ox - barW / 2, oy),
            ...midPoints.map(p => new Two.Anchor(p.x, p.y)),
            new Two.Anchor(ox + freqs.length * barW + barW / 2, oy)
          ];
          const polyLine = two.makeCurve(polyPts, false);
          polyLine.stroke = '#dc2626'; polyLine.linewidth = 3; polyLine.fill = 'transparent';
        }

        two.makeText("히스토그램 & 도수분포다각형", w / 2, 40).weight = 800;

      } else if (type === 'stem_leaf_canvas') {
        // Draw Stem-and-leaf plot
        const cx = w / 2, cy = h / 2 - 20;
        const line = two.makeLine(cx - 30, cy - 120, cx - 30, cy + 120);
        line.stroke = '#1e293b'; line.linewidth = 3;

        two.makeText("줄기", cx - 70, cy - 140).weight = 800;
        two.makeText("잎", cx + 70, cy - 140).weight = 800;

        const data = [
          { stem: "1", leaves: "2  5  7  9" },
          { stem: "2", leaves: "1  4  4  8" },
          { stem: "3", leaves: "0  2  5  6  8" },
          { stem: "4", leaves: "1  3" }
        ];

        data.forEach((row, idx) => {
          const ry = cy - 80 + idx * 55;
          const s = two.makeText(row.stem, cx - 70, ry); s.weight = 800; s.size = 16;
          const l = two.makeText(row.leaves, cx + 70, ry); l.fill = '#2563eb'; l.size = 16;
        });

        two.makeText("(1|2 는 12점)", cx, cy + 150).fill = '#64748b';

      } else {
        const title = two.makeText("자료 정리 및 통계 시각화 캔버스", w / 2, 100);
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

with open('/home/ubuntu/workspace/Redbook/g1_ch8_statistics.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("g1_ch8_statistics.html complete! File size:", len(code))
