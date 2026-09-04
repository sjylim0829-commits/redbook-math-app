import json
import re

# Read template from g1_ch1_factors.html
with open('/home/ubuntu/workspace/Redbook/g1_ch1_factors.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Replace Header and Title
code = template.replace(
    '<title>중1 수학 1단원: 소인수분해 대화형 탐구관</title>',
    '<title>중1 수학 3단원: 문자와 식 대화형 탐구관</title>'
)
code = code.replace(
    '<h1>중1-1 Ⅰ. 소인수분해</h1>',
    '<h1>중1-1 Ⅲ. 문자와 식</h1>'
)
code = code.replace(
    '<span class="badge">2022 개정 교육과정</span>',
    '<span class="badge">2022 개정 교육과정 · 대수적 사고 탐구</span>'
)

# Replace Subchapter Navigation Tabs
old_tabs = '''      <button class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어보기</button>
      <button class="tab-btn" onclick="switchMainTab(1)">1.1 소수와 합성수</button>
      <button class="tab-btn" onclick="switchMainTab(2)">1.2 소인수분해</button>
      <button class="tab-btn" onclick="switchMainTab(3)">1.3 최대공약수</button>
      <button class="tab-btn" onclick="switchMainTab(4)">1.4 최소공배수</button>
      <button class="tab-btn" onclick="switchMainTab(5)">1.5 스스로 마무리하기</button>'''

new_tabs = '''      <button class="tab-btn active" onclick="switchMainTab(0)">0. 되짚어보기</button>
      <button class="tab-btn" onclick="switchMainTab(1)">3.1 문자의 사용과 식의 값</button>
      <button class="tab-btn" onclick="switchMainTab(2)">3.2 일차식과 수의 곱셈·나눗셈</button>
      <button class="tab-btn" onclick="switchMainTab(3)">3.3 일차식의 덧셈과 뺄셈</button>
      <button class="tab-btn" onclick="switchMainTab(4)">3.4 등식과 방정식</button>
      <button class="tab-btn" onclick="switchMainTab(5)">3.5 일차방정식의 풀이</button>
      <button class="tab-btn" onclick="switchMainTab(6)">3.6 스스로 마무리하기</button>'''

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
        title: "0. 되짚어보기 (초등 연계 기초)",
        substeps: [
          {
            id: "0-1",
            title: "초등 복습: □를 사용한 식과 계산",
            concept: "모르는 수를 $\\square$로 나타내어 덧셈과 뺄셈, 곱셈과 나눗셈 식을 세우고 구하는 방법을 복습합니다.",
            inquiry: "한 자루에 $800$원인 색연필 $\\square$자루의 가격과 지우개 $500$원의 합을 식으로 나타내어 봅시다.",
            blanks: [
              { id: "b0_1", answer: "800*\\square+500|800\\times\\square+500|800\\square+500", label: "색연필 □자루와 지우개의 총 가격 식", hint: "800 × □ + 500" },
              { id: "b0_2", answer: "2900|2,900", label: "□ = 3일 때 총 가격(원)", hint: "800 × 3 + 500 = 2400 + 500" }
            ],
            canvasType: "review_box"
          }
        ]
      },
      1: {
        title: "3.1 문자의 사용과 식의 값",
        substeps: [
          {
            id: "1-1",
            title: "문자의 사용과 곱셈 기호의 생략",
            concept: "수와 문자의 곱에서는 곱셈 기호 $\\times$를 생략하고 <strong>수를 문자 앞에</strong> 씁니다. $1$이나 $-1$과의 곱에서는 $1$을 생략합니다.",
            inquiry: "다음 곱셈식을 기호 $\\times$를 생략하여 간단히 나타내어 보세요.<br>⑴ $a \\times 4$<br>⑵ $x \\times (-1)$<br>⑶ $y \\times x \\times 5$",
            blanks: [
              { id: "b1_1", answer: "4a", label: "⑴ a × 4", hint: "숫자를 문자 앞에 씁니다." },
              { id: "b1_2", answer: "-x", label: "⑵ x × (-1)", hint: "1은 생략하고 부호만 씁니다." },
              { id: "b1_3", answer: "5xy", label: "⑶ y × x × 5", hint: "숫자 먼저, 알파벳 순서대로 씁니다." }
            ],
            canvasType: "mult_simplify"
          },
          {
            id: "1-2",
            title: "나눗셈 기호의 생략과 분수 꼴",
            concept: "나눗셈 기호 $\\div$를 생략할 때에는 역수의 곱셈으로 바꾸거나 <strong>분수 꼴</strong>로 나타냅니다. 즉 $a \\div b = \\frac{a}{b}$",
            inquiry: "다음 나눗셈식을 기호 $\\div$를 생략하여 분수 꼴로 나타내어 보세요.<br>⑴ $x \\div 3$<br>⑵ $(a+b) \\div 5$",
            blanks: [
              { id: "b1_4", answer: "x/3|\\frac{x}{3}", label: "⑴ x ÷ 3", hint: "x/3 또는 \\frac{x}{3}" },
              { id: "b1_5", answer: "(a+b)/5|\\frac{a+b}{5}", label: "⑵ (a+b) ÷ 5", hint: "(a+b)/5" }
            ],
            canvasType: "div_simplify"
          },
          {
            id: "1-3",
            title: "식의 값 구하기 (대입)",
            concept: "문자를 포함한 식에서 <strong>문자 대신 수를 넣는 것</strong>을 대입이라 하고, 대입하여 계산한 결과를 그 식의 값이라고 합니다.",
            inquiry: "$x = -3$, $y = 4$일 때 다음 식의 값을 계산해 보세요.<br>⑴ $2x + 5$<br>⑵ $x^2 - 2y$",
            blanks: [
              { id: "b1_6", answer: "-1", label: "⑴ 2x + 5 의 값", hint: "2 × (-3) + 5 = -6 + 5" },
              { id: "b1_7", answer: "1", label: "⑵ x² - 2y 의 값", hint: "(-3)² - 2×4 = 9 - 8" }
            ],
            canvasType: "substitute_eval"
          }
        ]
      },
      2: {
        title: "3.2 일차식과 수의 곱셈·나눗셈",
        substeps: [
          {
            id: "2-1",
            title: "다항식과 일차식의 뜻",
            concept: "수 또는 문자의 곱으로만 이루어진 식을 <strong>항</strong>이라 하고, 특정한 문자를 포함하지 않는 항을 <strong>상수항</strong>이라 합니다. 항에서 문자에 곱해진 수를 그 문자의 <strong>계수</strong>라고 합니다.<br>차수가 $1$인 다항식을 <strong>일차식</strong>이라고 합니다.",
            inquiry: "다항식 $-3x + 7$에서 물음에 답해 보세요.<br>⑴ 상수항은?<br>⑵ $x$의 계수는?<br>⑶ 이 식은 일차식인가요? (일차식/아님)",
            blanks: [
              { id: "b2_1", answer: "7|+7", label: "⑴ 상수항", hint: "7" },
              { id: "b2_2", answer: "-3", label: "⑵ x의 계수", hint: "-3" },
              { id: "b2_3", answer: "일차식|맞다|o", label: "⑶ 일차식 여부", hint: "일차식" }
            ],
            canvasType: "poly_structure"
          },
          {
            id: "2-2",
            title: "일차식과 수의 곱셈과 나눗셈 (대수 타일 모델)",
            concept: "단항식과 수의 곱셈은 수끼리 곱하여 문자 앞에 쓰고, 일차식과 수의 곱셈은 <strong>분배법칙</strong>을 이용하여 각 항에 수를 곱합니다.",
            inquiry: "대수 타일 시각 모델을 보며 식을 전개해 보세요.<br>⑴ $2(3x - 4)$<br>⑵ $(8x - 12) \\div 4$",
            blanks: [
              { id: "b2_4", answer: "6x-8", label: "⑴ 2(3x - 4)", hint: "2×3x - 2×4" },
              { id: "b2_5", answer: "2x-3", label: "⑵ (8x - 12) ÷ 4", hint: "8x/4 - 12/4" }
            ],
            canvasType: "algebra_tiles"
          }
        ]
      },
      3: {
        title: "3.3 일차식의 덧셈과 뺄셈",
        substeps: [
          {
            id: "3-1",
            title: "동류항의 뜻과 모으기",
            concept: "문자와 차수가 각각 같은 항을 <strong>동류항</strong>이라고 합니다. 동류항의 덧셈과 뺄셈은 분배법칙을 이용하여 계수의 합 또는 차에 문자를 곱합니다.",
            inquiry: "다음 식의 동류항을 모아 간단히 하세요.<br>⑴ $4x + 3x$<br>⑵ $7a - 2 - 3a + 5$",
            blanks: [
              { id: "b3_1", answer: "7x", label: "⑴ 4x + 3x", hint: "(4+3)x" },
              { id: "b3_2", answer: "4a+3|3+4a", label: "⑵ 7a - 2 - 3a + 5", hint: "(7-3)a + (-2+5)" }
            ],
            canvasType: "like_terms"
          },
          {
            id: "3-2",
            title: "괄호가 있는 일차식의 계산",
            concept: "괄호가 있으면 분배법칙을 이용하여 괄호를 푼 후, 동류항끼리 모아서 간단히 계산합니다. 괄호 앞의 부호가 $-$이면 괄호 안의 모든 항의 부호가 바뀝니다.",
            inquiry: "다음 식을 계산해 보세요.<br>⑴ $(3x + 2) + (2x - 5)$<br>⑵ $(5x - 3) - (2x - 7)$",
            blanks: [
              { id: "b3_3", answer: "5x-3", label: "⑴ (3x + 2) + (2x - 5)", hint: "3x + 2x + 2 - 5" },
              { id: "b3_4", answer: "3x+4", label: "⑵ (5x - 3) - (2x - 7)", hint: "5x - 3 - 2x + 7 = 3x + 4" }
            ],
            canvasType: "brackets_calc"
          }
        ]
      },
      4: {
        title: "3.4 등식과 방정식",
        substeps: [
          {
            id: "4-1",
            title: "방정식과 항등식",
            concept: "등호 $=$를 사용하여 두 수나 식이 같음을 나타낸 식을 <strong>등식</strong>이라 합니다. 미지수의 값에 따라 참이 되기도 하고 거짓이 되기도 하는 등식을 <strong>방정식</strong>, 미지수에 어떤 수를 대입해도 항상 참이 되는 등식을 <strong>항등식</strong>이라 합니다.",
            inquiry: "다음 보기 중 <strong>항등식</strong>인 것을 고르고, 방정식 $2x - 1 = 5$의 해(근)를 구하세요.<br>보기: ㉠ $2x = 4$, ㉡ $2(x+1) = 2x+2$, ㉢ $x+3=7$",
            blanks: [
              { id: "b4_1", answer: "㉡|ㄴ|B", label: "항등식인 것의 기호", hint: "전개했을 때 좌변과 우변이 완벽히 일치하는 식" },
              { id: "b4_2", answer: "3|x=3", label: "방정식 2x - 1 = 5 의 해", hint: "2x = 6 이므로 x = 3" }
            ],
            canvasType: "equation_types"
          },
          {
            id: "4-2",
            title: "등식의 성질과 양팔 저울 탐구",
            concept: "등식의 양변에 같은 수를 더하거나, 빼거나, 곱하거나, $0$이 아닌 같은 수로 나누어도 등식은 항상 성립합니다.<br>양팔 저울의 수평을 맞추는 시뮬레이션으로 확인해 봅시다.",
            inquiry: "등식 $x + 3 = 8$에서 양변에 얼마를 빼면 $x$의 값을 바로 구할 수 있을까요?",
            blanks: [
              { id: "b4_3", answer: "3", label: "양변에서 빼야 하는 수", hint: "좌변의 +3을 상쇄하기 위해 3을 뺍니다." },
              { id: "b4_4", answer: "5|x=5", label: "방정식의 해 x", hint: "8 - 3 = 5" }
            ],
            canvasType: "balance_scale"
          }
        ]
      },
      5: {
        title: "3.5 일차방정식의 풀이",
        substeps: [
          {
            id: "5-1",
            title: "이항(移項)의 원리",
            concept: "등식의 한 변에 있는 항의 부호를 바꾸어 다른 변으로 옮기는 것을 <strong>이항</strong>이라고 합니다. 이것은 등식의 양변에 같은 수를 더하거나 빼는 성질을 이용한 것입니다.",
            inquiry: "일차방정식 $3x + 5 = 17$에서 $+5$를 우변으로 이항한 식과 최종 해를 구하세요.",
            blanks: [
              { id: "b5_1", answer: "3x=17-5|3x=12", label: "이항한 식", hint: "3x = 17 - 5" },
              { id: "b5_2", answer: "4|x=4", label: "일차방정식의 해 x", hint: "3x = 12 이므로 x = 4" }
            ],
            canvasType: "transposition_sim"
          },
          {
            id: "5-2",
            title: "괄호 및 계수가 소수·분수인 일차방정식",
            concept: "괄호가 있으면 분배법칙으로 괄호를 풀고, 계수가 소수나 분수이면 양변에 $10, 100$ 또는 분모의 최소공배수를 곱하여 계수를 정수로 고쳐서 풉니다.",
            inquiry: "방정식 $\\frac{x-1}{2} = \\frac{x+2}{3}$의 양변에 분모의 최소공배수인 얼마를 곱해야 할까요? 그리고 해 $x$를 구하세요.",
            blanks: [
              { id: "b5_3", answer: "6", label: "양변에 곱할 최소공배수", hint: "2와 3의 최소공배수는 6" },
              { id: "b5_4", answer: "7|x=7", label: "방정식의 해 x", hint: "3(x-1) = 2(x+2) -> 3x-3 = 2x+4 -> x = 7" }
            ],
            canvasType: "complex_equation"
          },
          {
            id: "5-3",
            title: "일차방정식의 활용 (실생활 탐구)",
            concept: "문제의 뜻을 파악하여 구하려는 값을 $x$로 놓고 방정식을 세운 뒤, 해를 구하고 문제의 조건에 맞는지 확인합니다.",
            inquiry: "연속하는 세 자연수의 합이 $42$입니다. 가운데 수를 $x$라 할 때, 세 수는 $(x-1), x, (x+1)$입니다. 가운데 수 $x$와 가장 큰 자연수를 구하세요.",
            blanks: [
              { id: "b5_5", answer: "14", label: "가운데 수 x", hint: "3x = 42 -> x = 14" },
              { id: "b5_6", answer: "15", label: "가장 큰 수", hint: "x + 1 = 15" }
            ],
            canvasType: "word_problem"
          }
        ]
      },
      6: {
        title: "3.6 스스로 마무리하기 (단원 종합 평가)",
        substeps: [
          {
            id: "6-1",
            title: "단원 종합 성취도 평가",
            concept: "3단원 문자와 식의 핵심 성취기준(문자식의 표현, 일차식 계산, 등식의 성질, 일차방정식 풀이 및 활용)을 종합 점검합니다.",
            inquiry: "다음 4문항을 풀고 답을 입력하여 실력을 점검해 보세요.<br>1. 한 개에 $500$원인 사과 $x$개와 $1000$원인 배 $y$개의 총 가격 식은?<br>2. $x = -2$일 때 $3x^2 - 4x + 1$의 값은?<br>3. 식 $(7x - 4) - (3x + 2)$를 간단히 하면?<br>4. 방정식 $4x - 5 = 2x + 7$의 해는?",
            blanks: [
              { id: "b6_1", answer: "500x+1000y", label: "1번 총 가격 식", hint: "500x + 1000y" },
              { id: "b6_2", answer: "21", label: "2번 식의 값", hint: "3(4) - 4(-2) + 1 = 12 + 8 + 1 = 21" },
              { id: "b6_3", answer: "4x-6", label: "3번 간단히 한 식", hint: "7x - 3x - 4 - 2 = 4x - 6" },
              { id: "b6_4", answer: "6|x=6", label: "4번 방정식의 해", hint: "2x = 12 -> x = 6" }
            ],
            canvasType: "final_eval"
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

    function saveAnswer(id, val) {
      state.studentAnswers[id] = val;
    }

    function normTxt(t) {
      return (t || '').toString().toLowerCase().replace(/\s+/g, '').replace(/,/g, '');
    }

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
        feedback.innerHTML = `<span style="color:#059669; font-weight:800;">🎉 완벽합니다! 모든 빈칸을 정확하게 해결하였습니다.</span>`;
        if (typeof LMSIntegration !== 'undefined') {
          LMSIntegration.saveStudentProgress({
            studentId: window.currentStudentId || "student_demo",
            stepId: curStep.id,
            score: 100,
            completed: true
          });
        }
      } else {
        feedback.innerHTML = `<span style="color:#dc2626; font-weight:700;">아직 해결되지 않은 빈칸이 있습니다. (${score}/${total}) 힌트를 참고하세요!</span>`;
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

      // Draw background grid
      const gridGroup = two.makeGroup();
      for (let x = 0; x <= w; x += 40) {
        const line = two.makeLine(x, 0, x, h);
        line.stroke = '#f1f5f9';
        gridGroup.add(line);
      }
      for (let y = 0; y <= h; y += 40) {
        const line = two.makeLine(0, y, w, y);
        line.stroke = '#f1f5f9';
        gridGroup.add(line);
      }

      if (type === 'balance_scale') {
        // Draw interactive balance scale for 3.4
        const baseY = h - 100;
        const fulcrum = two.makePolygon(w / 2, baseY, 30, 3);
        fulcrum.fill = '#475569';

        const beam = two.makeLine(w / 2 - 180, baseY - 30, w / 2 + 180, baseY - 30);
        beam.stroke = '#1e293b';
        beam.linewidth = 6;

        // Left Pan
        const leftPan = two.makeCurve(w / 2 - 200, baseY + 40, w / 2 - 180, baseY + 50, w / 2 - 160, baseY + 40, false);
        leftPan.stroke = '#0284c7';
        leftPan.linewidth = 4;
        const leftString1 = two.makeLine(w / 2 - 180, baseY - 30, w / 2 - 200, baseY + 40);
        const leftString2 = two.makeLine(w / 2 - 180, baseY - 30, w / 2 - 160, baseY + 40);
        leftString1.stroke = '#94a3b8'; leftString2.stroke = '#94a3b8';

        // Right Pan
        const rightPan = two.makeCurve(w / 2 + 160, baseY + 40, w / 2 + 180, baseY + 50, w / 2 + 200, baseY + 40, false);
        rightPan.stroke = '#0284c7';
        rightPan.linewidth = 4;
        const rightString1 = two.makeLine(w / 2 + 180, baseY - 30, w / 2 + 160, baseY + 40);
        const rightString2 = two.makeLine(w / 2 + 180, baseY - 30, w / 2 + 200, baseY + 40);
        rightString1.stroke = '#94a3b8'; rightString2.stroke = '#94a3b8';

        // Left blocks: [x] and 3 ones
        const xBox = two.makeRoundedRectangle(w / 2 - 190, baseY + 20, 32, 32, 4);
        xBox.fill = '#3b82f6';
        const xText = two.makeText('x', w / 2 - 190, baseY + 20);
        xText.fill = '#ffffff'; xText.weight = 800;

        for (let i = 0; i < 3; i++) {
          const oneBox = two.makeCircle(w / 2 - 165 + i * 12, baseY + 25, 6);
          oneBox.fill = '#f59e0b';
        }

        // Right blocks: 8 ones
        for (let i = 0; i < 8; i++) {
          const bx = w / 2 + 160 + (i % 4) * 14;
          const by = baseY + 15 + Math.floor(i / 4) * 16;
          const oneBox = two.makeCircle(bx, by, 6);
          oneBox.fill = '#f59e0b';
        }

        const title = two.makeText("등식의 성질: x + 3 = 8 (양변에서 3을 빼면 평형 유지)", w / 2, 60);
        title.fill = '#0f172a';
        title.weight = 800;
        title.size = 15;

      } else if (type === 'algebra_tiles') {
        // Draw Algebra Tiles visualization for 2(3x - 4) = 6x - 8
        const title = two.makeText("대수 타일(Algebra Tiles) 곱셈 모델: 2(3x - 4)", w / 2, 50);
        title.fill = '#0f172a';
        title.weight = 800;
        title.size = 15;

        // Group 1: 3x tiles + 4 negative unit tiles
        for (let row = 0; row < 2; row++) {
          const rowY = 120 + row * 90;
          const label = two.makeText(`행 ${row + 1}:`, 80, rowY + 15);
          label.fill = '#64748b'; label.weight = 700;

          // 3 green x-tiles (30 x 60)
          for (let col = 0; col < 3; col++) {
            const xTile = two.makeRoundedRectangle(150 + col * 55, rowY + 15, 45, 65, 4);
            xTile.fill = '#10b981';
            const t = two.makeText('+x', 150 + col * 55, rowY + 15);
            t.fill = '#ffffff'; t.weight = 700;
          }
          // 4 red -1 unit tiles
          for (let col = 0; col < 4; col++) {
            const uTile = two.makeRoundedRectangle(340 + col * 40, rowY + 15, 30, 30, 4);
            uTile.fill = '#ef4444';
            const t = two.makeText('-1', 340 + col * 40, rowY + 15);
            t.fill = '#ffffff'; t.weight = 700;
          }
        }

        const resBox = two.makeRoundedRectangle(w / 2, 330, w - 80, 60, 8);
        resBox.fill = '#f8fafc';
        resBox.stroke = '#3b82f6';
        resBox.linewidth = 2;
        const resText = two.makeText("전체 타일의 합: x 타일 6개 (+6x) 와 -1 타일 8개 (-8) ➔ 6x - 8", w / 2, 330);
        resText.fill = '#1e3a8a'; resText.weight = 800; resText.size = 14;

      } else {
        // Generic equation visualization
        const title = two.makeText("대화형 탐구 및 수식 시각화 칠판", w / 2, 80);
        title.fill = '#1e293b'; title.weight = 800; title.size = 18;

        const banner = two.makeRoundedRectangle(w / 2, 200, 440, 100, 12);
        banner.fill = '#eff6ff';
        banner.stroke = '#3b82f6';

        const bannerText = two.makeText("좌측 탐구 질문의 빈칸을 채우고 '정답 확인'을 누르세요.", w / 2, 200);
        bannerText.fill = '#1d4ed8'; bannerText.weight = 700; bannerText.size = 14;
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

with open('/home/ubuntu/workspace/Redbook/g1_ch3_equations.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("g1_ch3_equations.html complete! File size:", len(code))
