const fs = require('fs');
const { execSync } = require('child_process');
const { createChapterHtml } = require('./master_template.js');

const ch2Config = {
  chapterNum: 2,
  chapterTitle: '2. 정수와 유리수',
  chapterBadge: '중1 수학 2단원',
  mainTabs: [
    '0. 되짚어 보기',
    '2.1 정수와 유리수',
    '2.2 수의 대소 관계',
    '2.3 덧셈과 뺄셈',
    '2.4 곱셈과 나눗셈',
    '2.5 마무리 & 프로젝트'
  ],
  pillsConfig: {
    0: [
      { code: '0-1', label: '1. 분수/소수 계산 (초등)' },
      { code: '0-2', label: '2. 수직선 눈금 읽기 (초등)' },
      { code: '0-3', label: '3. 수의 크기 비교 (초등)' }
    ],
    1: [
      { code: '1-1', label: '1. 양수와 음수 (로봇 이동)' },
      { code: '1-2', label: '2. 정수의 분류와 0' },
      { code: '1-3', label: '3. 유리수의 뜻과 수직선' },
      { code: '1-4', label: '4. 절댓값과 원점 거리' }
    ],
    2: [
      { code: '2-1', label: '1. 수직선과 대소 관계' },
      { code: '2-2', label: '2. 부등호의 표현' },
      { code: '2-3', label: '3. 대소 관계 형성평가' }
    ],
    3: [
      { code: '3-1', label: '1. 정수의 덧셈 (칩 상쇄)' },
      { code: '3-2', label: '2. 수직선 화살표 덧셈' },
      { code: '3-3', label: '3. 정수의 뺄셈 (0의 쌍)' },
      { code: '3-4', label: '4. 덧셈/뺄셈 혼합 계산' }
    ],
    4: [
      { code: '4-1', label: '1. 정수의 곱셈 (속도와 시간)' },
      { code: '4-2', label: '2. 곱셈의 연산법칙/분배법칙' },
      { code: '4-3', label: '3. 나눗셈과 역수' }
    ],
    5: [
      { code: '5-1', label: '1. 2단원 스스로 마무리' },
      { code: '5-2', label: '2. 창의융합: 세계 도시 기온차' }
    ]
  },
  substepDataJs: `
    const SUBSTEP_CONFIG = {
      '0-1': {
        mission: "<b>[되짚어 보기 1] 분수와 소수의 계산 (초등 5~6학년)</b><br>교과서 28쪽: 좌측 수직선에서 분수와 소수의 위치를 관찰하고 계산식을 완성해 보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① $\\\\frac{1}{3} + \\\\frac{1}{2} =$ ( <input type="text" id="p01-q1" class="proof-input-text" style="width:80px;" placeholder="기약분수"> )<br>
              ② $0.4 \\\\times 0.5 =$ ( <input type="text" id="p01-q2" class="proof-input-text" style="width:80px;" placeholder="소수"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check01Submit()">✅ 제출 및 채점</button>
            <div id="p01-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-2': {
        mission: "<b>[되짚어 보기 2] 수직선의 눈금 읽기 (초등)</b><br>교과서 28쪽: 좌측 수직선 위의 점 A, B를 마우스나 터치로 움직여보며 눈금을 읽어보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              수직선에서 0을 기준으로 오른쪽으로 3칸 떨어진 점 A와, 1과 2의 한가운데 점 B에 대하여:<br>
              • 점 A의 값: ( <input type="text" id="p02-a" class="proof-input-text" style="width:60px;"> )<br>
              • 점 B의 값 (소수 또는 분수): ( <input type="text" id="p02-b" class="proof-input-text" style="width:70px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check02Submit()">✅ 제출 및 채점</button>
            <div id="p02-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-3': {
        mission: "<b>[되짚어 보기 3] 수의 크기 비교 (초등)</b><br>교과서 28쪽: 좌측 수직선 비교 저울을 조작해 보고 알맞은 부등호를 써넣으세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              다음 빈칸에 알맞은 부등호(&gt;, &lt;)를 써넣으시오.<br>
              ① $\\\\frac{3}{4}$ ( <input type="text" id="p03-q1" class="proof-input-text" style="width:50px;"> ) $\\\\frac{2}{3}$<br>
              ② $1.25$ ( <input type="text" id="p03-q2" class="proof-input-text" style="width:50px;"> ) $1.3$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check03Submit()">🏆 되짚어 보기 최종 제출</button>
            <div id="p03-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-1': {
        mission: "<b>[2.1 생각열기] 로봇 위치 이동 시뮬레이터와 양수·음수</b><br>교과서 50쪽: 좌측의 [로봇 조작판]을 직접 눌러 로봇을 동쪽(+)과 서쪽(-)으로 움직여보며 부호의 의미를 탐구해 보세요!",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>교과서 50쪽 생각열기:</b> 0을 기준으로 서로 반대되는 성질을 가진 수량을 나타낼 때 양의 부호(+)와 음의 부호(-)를 사용합니다.
            </div>
            <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px 12px; margin-bottom:12px; font-size:0.88rem; color:#1e40af;">
              🕹️ <b>좌측 로봇 조작 미션:</b><br>
              로봇을 동쪽(+)으로 3m 이동한 뒤, 서쪽(-)으로 5m 이동시켜 보세요!
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① 로봇을 동쪽으로 3m 후 서쪽으로 5m 이동했을 때 최종 위치: ( <input type="text" id="p11-robot-pos" class="proof-input-text" style="width:70px;" placeholder="부호와 수 (예: +3, -3)"> ) m<br>
              ② 영상 5℃를 +5℃로 나타낼 때, 영하 7℃는: ( <input type="text" id="p11-temp2" class="proof-input-text" style="width:70px;" placeholder="부호와 수"> ) ℃<br>
              ③ 1000원 이익을 +1000원으로 나타낼 때, 500원 손해는: ( <input type="text" id="p11-money" class="proof-input-text" style="width:80px;" placeholder="부호와 수"> ) 원
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check11Submit()">🚀 제출 및 개념 학습 진행</button>
            <div id="p11-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-2': {
        mission: "<b>[2.1 개념학습] 정수의 분류와 0의 성질</b><br>교과서 51쪽: 정수는 양의 정수(자연수), 0, 음의 정수로 구성됩니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              📖 <b>정수의 3단 분류:</b><br>
              • 양의 정수(자연수): $+1, +2, +3, \\\\dots$<br>
              • 0: 양수도 아니고 음수도 아님<br>
              • 음의 정수: $-1, -2, -3, \\\\dots$
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              다음 수 중 정수를 모두 찾아 쓰시오: $-3, \\\\frac{1}{2}, 0, +5, -1.4$<br>
              • 정수: ( <input type="text" id="p12-ints" class="proof-input-text" style="width:150px;" placeholder="쉼표로 구분"> )<br>
              • 0은 양수인가요, 음수인가요, 둘 다 아닌가요? ( <input type="text" id="p12-zero" class="proof-input-text" style="width:150px;" placeholder="양수 / 음수 / 둘 다 아님"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check12Submit()">✅ 제출 및 채점</button>
            <div id="p12-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-3': {
        mission: "<b>[2.1 개념학습] 유리수의 뜻과 수직선 점 대응</b><br>교과서 52~53쪽: 좌측 수직선에서 점 A, B, C를 목표 위치로 드래그하여 배치해 보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① 모든 정수는 분모가 1인 분수로 나타낼 수 있으므로 유리수이다. (O / X): ( <input type="text" id="p13-q1" class="proof-input-text" style="width:50px;"> )<br>
              ② 수직선에서 0의 왼쪽으로 2.5칸 떨어진 점에 대응하는 수: ( <input type="text" id="p13-q2" class="proof-input-text" style="width:90px;" placeholder="소수 또는 분수 입력"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check13Submit()">✅ 제출 및 채점</button>
            <div id="p13-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-4': {
        mission: "<b>[2.1 개념학습] 절댓값과 원점 거리 측정기</b><br>교과서 54~55쪽: 좌측 수직선에서 점 P를 움직여보며 원점으로부터의 거리(절댓값)를 관찰하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              📖 <b>절댓값:</b> 수직선 위에서 원점과 어떤 수를 나타내는 점 사이의 <b>거리</b> (기호 $|a|$)<br>
              거리는 항상 0 이상이므로 $|+3|=3$, $|-3|=3$, $|0|=0$입니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① $|-5| =$ ( <input type="text" id="p14-q1" class="proof-input-text" style="width:60px;"> )<br>
              ② $|+2.7| =$ ( <input type="text" id="p14-q2" class="proof-input-text" style="width:60px;"> )<br>
              ③ 절댓값이 4인 수를 모두 쓰시오: ( <input type="text" id="p14-q3" class="proof-input-text" style="width:110px;" placeholder="수를 쉼표로 나열"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check14Submit()">✅ 제출 및 2소단원 해금</button>
            <div id="p14-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-1': {
        mission: "<b>[2.2 개념학습] 수직선과 대소 관계 비교기</b><br>교과서 56~57쪽: 좌측 수직선 비교 저울에서 점 A와 B를 움직여 대소 관계를 확인하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              📖 수직선에서 <b>오른쪽에 있는 수가 왼쪽에 있는 수보다 항상 큽니다.</b><br>
              • (음수) &lt; 0 &lt; (양수)<br>
              • 두 음수끼리는 <b>절댓값이 큰 수가 더 작습니다!</b>
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              다음 빈칸에 알맞은 부등호(&gt;, &lt;)를 써넣으시오.<br>
              ① $+3$ ( <input type="text" id="p21-q1" class="proof-input-text" style="width:50px;"> ) $-4$<br>
              ② $-5$ ( <input type="text" id="p21-q2" class="proof-input-text" style="width:50px;"> ) $-2$<br>
              ③ $-1.5$ ( <input type="text" id="p21-q3" class="proof-input-text" style="width:50px;"> ) $0$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check21Submit()">✅ 제출 및 채점</button>
            <div id="p21-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-2': {
        mission: "<b>[2.2 개념학습] 부등호의 표현 (이상, 이하, 초과, 미만)</b><br>교과서 58쪽: 부등호의 4가지 표현법을 정확히 익혀봅시다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① '$x$는 $-2$ 이상이다': $x$ ( <input type="text" id="p22-q1" class="proof-input-text" style="width:60px;" placeholder="부등호 기호 (예: >, <, >=, <=)"> ) $-2$<br>
              ② '$x$는 3보다 크지 않다(작거나 같다)': $x$ ( <input type="text" id="p22-q2" class="proof-input-text" style="width:60px;" placeholder="부등호 기호 (예: >, <, >=, <=)"> ) $3$<br>
              ③ '$x$는 $-1$ 초과이고 5 이하이다': ( <input type="text" id="p22-q3" class="proof-input-text" style="width:160px;" placeholder="부등식 입력 (예: a < x <= b)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check22Submit()">✅ 제출 및 채점</button>
            <div id="p22-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-3': {
        mission: "<b>[2.2 형성평가] 대소 관계 종합 점검</b><br>교과서 59쪽: 수직선 비교 저울을 활용하여 가장 큰 수와 가장 작은 수를 판별하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              다음 네 수 중에서 가장 큰 수와 가장 작은 수를 각각 구하시오.<br>
              수의 목록: $-3, +1.5, -4.5, 0$<br>
              • 가장 큰 수: ( <input type="text" id="p23-max" class="proof-input-text" style="width:70px;"> )<br>
              • 가장 작은 수: ( <input type="text" id="p23-min" class="proof-input-text" style="width:70px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check23Submit()">✅ 제출 및 3소단원 해금</button>
            <div id="p23-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-1': {
        mission: "<b>[2.3 탐구활동] 양과 음의 칩 상쇄 실험실 (교과서 60~62쪽)</b><br>좌측의 칩 상쇄 실험실에서 파란 칩(+1)과 빨간 칩(-1)을 추가하고 [쌍 상쇄하기]를 눌러 덧셈 결과를 관찰하세요!",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>바둑돌/칩 상쇄 원리:</b> (+1)과 (-1)이 만나면 0이 되어 사라집니다.<br>
              • 부호가 같을 때: 절댓값의 합에 공통 부호<br>
              • 부호가 다를 때: 절댓값의 차에 절댓값이 큰 수의 부호
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① $(+6) + (+4) =$ ( <input type="text" id="p31-q1" class="proof-input-text" style="width:70px;"> )<br>
              ② $(-5) + (-8) =$ ( <input type="text" id="p31-q2" class="proof-input-text" style="width:70px;"> )<br>
              ③ $(+9) + (-3) =$ ( <input type="text" id="p31-q3" class="proof-input-text" style="width:70px;"> )<br>
              ④ $(-10) + (+4) =$ ( <input type="text" id="p31-q4" class="proof-input-text" style="width:70px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check31Submit()">✅ 제출 및 채점</button>
            <div id="p31-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-2': {
        mission: "<b>[2.3 개념학습] 수직선 2단계 화살표 덧셈과 덧셈의 연산법칙</b><br>교과서 61~63쪽: 좌측의 화살표 덧셈 시뮬레이터로 순서대로 화살표를 발사해 보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① $a + b = b + a$ 는 덧셈의 ( <input type="text" id="p32-law1" class="proof-input-text" style="width:110px;" placeholder="연산법칙 명칭"> )<br>
              ② $(a + b) + c = a + (b + c)$ 는 덧셈의 ( <input type="text" id="p32-law2" class="proof-input-text" style="width:110px;" placeholder="연산법칙 명칭"> )<br>
              ③ $(-7) + (+15) + (-3)$ 계산 결과: ( <input type="text" id="p32-val" class="proof-input-text" style="width:70px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check32Submit()">✅ 제출 및 채점</button>
            <div id="p32-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-3': {
        mission: "<b>[2.3 개념학습] 정수의 뺄셈: 0의 쌍 투입 원리</b><br>교과서 64~65쪽: 빼는 수의 부호를 바꾸어 덧셈으로 고쳐서 계산합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              📖 <b>뺄셈 공식:</b> $a - (+b) = a + (-b)$, $a - (-b) = a + (+b)$
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① $(+5) - (+8) =$ ( <input type="text" id="p33-q1" class="proof-input-text" style="width:70px;"> )<br>
              ② $(+3) - (-4) =$ ( <input type="text" id="p33-q2" class="proof-input-text" style="width:70px;"> )<br>
              ③ $(-6) - (-2) =$ ( <input type="text" id="p33-q3" class="proof-input-text" style="width:70px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check33Submit()">✅ 제출 및 채점</button>
            <div id="p33-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-4': {
        mission: "<b>[2.3 형성평가] 덧셈과 뺄셈의 혼합 계산</b><br>교과서 67쪽: 뺄셈을 덧셈으로 고친 후 양수는 양수끼리, 음수는 음수끼리 모아 계산합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① $3 - (-7) + (-5) =$ ( <input type="text" id="p34-q1" class="proof-input-text" style="width:70px;"> )<br>
              ② $-8 + 5 - 2 =$ ( <input type="text" id="p34-q2" class="proof-input-text" style="width:70px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check34Submit()">✅ 제출 및 4소단원 해금</button>
            <div id="p34-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-1': {
        mission: "<b>[2.4 생각열기] 속도와 시간 수직선 시뮬레이터 (음수×음수=양수)</b><br>교과서 68~70쪽: 좌측 조작판에서 속도(동/서)와 시간(후/전)을 조합하여 곱셈 부호 규칙을 발견하세요!",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>속도×시간 증명:</b> 서쪽(-3m/s)으로 달리는 사람은 2초 전(-2초)에 동쪽 6m 지점(+6)에 있었습니다!<br>
              따라서 <b>$(-3) \\\\times (-2) = +6$</b> (음수 × 음수 = 양수) 입니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① $(+4) \\\\times (+3) =$ ( <input type="text" id="p41-q1" class="proof-input-text" style="width:70px;"> )<br>
              ② $(+5) \\\\times (-6) =$ ( <input type="text" id="p41-q2" class="proof-input-text" style="width:70px;"> )<br>
              ③ $(-7) \\\\times (-8) =$ ( <input type="text" id="p41-q3" class="proof-input-text" style="width:70px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check41Submit()">✅ 제출 및 채점</button>
            <div id="p41-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-2': {
        mission: "<b>[2.4 개념학습] 곱셈의 연산법칙과 분배법칙</b><br>교과서 72~73쪽: $a \\\\times (b + c) = a \\\\times b + a \\\\times c$ 의 분배법칙 직사각형 면적을 확인해 봅시다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① $48 \\\\times \\\\left(\\\\frac{1}{6} - \\\\frac{1}{8}\\\\right) = 48 \\\\times \\\\frac{1}{6} - 48 \\\\times \\\\frac{1}{8} =$ ( <input type="text" id="p42-q1" class="proof-input-text" style="width:70px;"> )<br>
              ② $(-2)^3 =$ ( <input type="text" id="p42-q2" class="proof-input-text" style="width:70px;"> )<br>
              ③ $-2^4 =$ ( <input type="text" id="p42-q3" class="proof-input-text" style="width:70px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check42Submit()">✅ 제출 및 채점</button>
            <div id="p42-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-3': {
        mission: "<b>[2.4 개념학습] 유리수의 나눗셈과 역수 휠</b><br>교과서 74~75쪽: 두 수의 곱이 1이 될 때 한 수를 다른 수의 역수라 하며, 나눗셈은 역수의 곱셈으로 바꿉니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① $-\\\\frac{3}{5}$의 역수는: ( <input type="text" id="p43-recip" class="proof-input-text" style="width:80px;" placeholder="분수 입력 (예: a/b)"> )<br>
              ② $(-12) \\\\div \\\\left(-\\\\frac{4}{3}\\\\right) = (-12) \\\\times \\\\left(-\\\\frac{3}{4}\\\\right) =$ ( <input type="text" id="p43-ans" class="proof-input-text" style="width:70px;"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check43Submit()">✅ 제출 및 5소단원 해금</button>
            <div id="p43-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-1': {
        mission: "<b>[대단원 마무리] 2단원 정수와 유리수 스스로 마무리하기</b><br>교과서 78~80쪽: 핵심 개념을 종합 정리하고 문제를 풀어봅시다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① 절댓값이 같고 부호가 반대인 두 수의 거리가 10일 때, 두 수 중 양수는? ( <input type="text" id="p51-q1" class="proof-input-text" style="width:70px;"> )<br>
              ② $a &lt; 0, b &gt; 0$ 일 때, $a \\\\times b$ 의 부호는 (양수 / 음수): ( <input type="text" id="p51-q2" class="proof-input-text" style="width:80px;" placeholder="양수 또는 음수"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check51Submit()">🏆 대단원 평가 완료</button>
            <div id="p51-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-2': {
        mission: "<b>[창의융합 프로젝트] 세계 주요 도시의 기온차 수직선 탐구</b><br>교과서 76~77쪽: 서울 영상 5℃와 모스크바 영하 12℃의 기온차를 좌측 수직선 온도계로 시뮬레이션해 보세요!",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              서울(+5℃)과 모스크바(-12℃)의 기온차는 큰 기온에서 작은 기온을 뺀 값입니다.<br>
              식: $(+5) - (-12) = 5 + 12 =$ ( <input type="text" id="p52-tempdiff" class="proof-input-text" style="width:70px;"> ) ℃
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check52Submit()">🎓 2단원 전체 마스터 인증</button>
            <div id="p52-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      }
    };
  `,
  canvasDrawersJs: `
    // State store for Interactive Simulators in Chapter 2
    const simState = {
      robotPos: 0,
      robotHistory: [0],
      p12Points: { A: 3, B: 1.5, C: -2 },
      p13Points: { A: -3.5, B: 2, C: -1.5 },
      p14Pos: -5,
      p21A: +3,
      p21B: -4,
      chipBlue: 3,
      chipRed: 5,
      chipCancelled: false,
      arrowStep: 0,
      velocity: -3,
      timeOffset: -2,
      thermCityA: 5,
      thermCityB: -12
    };
    window.simState = simState;

    function setupSubstepSimulator(two, code, simController) {
      if (!two) return;
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2;

      // Enable simController display
      if (simController) {
        simController.style.display = 'block';
      }

      if (code === '1-1') {
        // [교과서 50쪽 생각열기: 로봇 위치 이동 시뮬레이터]
        simController.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:0.95rem; font-weight:800; color:#1e3a8a;">🤖 로봇 주행 시뮬레이터 (교과서 50쪽)</span>
            <span id="robot-pos-badge" style="background:#0284c7; color:#fff; font-size:0.85rem; font-weight:800; padding:3px 10px; border-radius:12px;">현재 위치: x = \${simState.robotPos}m</span>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="moveRobot(1)">▶ 동쪽 +1m 전진</button>
            <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="moveRobot(-1)">◀ 서쪽 -1m 후진</button>
            <button class="tool-btn" style="background:#dbeafe; color:#1e40af; font-weight:700;" onclick="moveRobot(5)">▶▶ 동쪽 +5m 이동</button>
            <button class="tool-btn" style="background:#dbeafe; color:#1e40af; font-weight:700;" onclick="moveRobot(-5)">◀◀ 서쪽 -5m 이동</button>
            <button class="tool-btn" style="background:#fee2e2; color:#dc2626; font-weight:700;" onclick="resetRobot()">🔄 원점(0m) 리셋</button>
            <button class="tool-btn" style="background:#fef08a; color:#854d0e; font-weight:700;" onclick="runRobotMission()">💡 교과서 미션 재현 (+3 후 -5)</button>
          </div>
        \`;
        renderRobotCanvas(two, simState.robotPos, simState.robotHistory);
      }
      else if (code === '0-2' || code === '1-2' || code === '1-3') {
        // [수직선 점 마그네틱 배치 탐구기]
        simController.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:0.95rem; font-weight:800; color:#065f46;">📍 수직선 점 드래그 & 스냅 탐구기 (교과서 52쪽)</span>
            <span style="font-size:0.8rem; color:#64748b;">수직선 위의 점 A, B, C를 버튼으로 목표 위치에 꽂아보세요!</span>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="tool-btn" style="background:#ecfdf5; color:#047857; font-weight:700;" onclick="setPointP12('A', 3)">📍 점 A = +3</button>
            <button class="tool-btn" style="background:#ecfdf5; color:#047857; font-weight:700;" onclick="setPointP12('B', 1.5)">📍 점 B = +1.5 (3/2)</button>
            <button class="tool-btn" style="background:#fef2f2; color:#b91c1c; font-weight:700;" onclick="setPointP12('C', -2.5)">📍 점 C = -2.5 (-5/2)</button>
            <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="setPointP12('C', -3.5)">📍 점 C = -3.5</button>
          </div>
        \`;
        renderPointsCanvas(two, simState.p12Points);
      }
      else if (code === '1-4') {
        // [원점 거리 절댓값 측정 줄자]
        simController.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:0.95rem; font-weight:800; color:#831843;">📏 원점 거리(절댓값) 측정 줄자 (교과서 54쪽)</span>
            <span id="abs-readout" style="background:#ec4899; color:#fff; font-size:0.85rem; font-weight:800; padding:3px 10px; border-radius:12px;">|\${simState.p14Pos}| = \${Math.abs(simState.p14Pos)}</span>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="tool-btn" style="background:#fdf2f8; color:#be185d; font-weight:700;" onclick="setAbsPos(-5)">P = -5 (거리 5)</button>
            <button class="tool-btn" style="background:#fdf2f8; color:#be185d; font-weight:700;" onclick="setAbsPos(+4)">P = +4 (거리 4)</button>
            <button class="tool-btn" style="background:#fdf2f8; color:#be185d; font-weight:700;" onclick="setAbsPos(-3)">P = -3 (거리 3)</button>
            <button class="tool-btn" style="background:#fdf2f8; color:#be185d; font-weight:700;" onclick="setAbsPos(+2.7)">P = +2.7 (거리 2.7)</button>
            <button class="tool-btn" style="background:#f1f5f9; color:#334155; font-weight:700;" onclick="setAbsPos(0)">P = 0 (원점, 거리 0)</button>
          </div>
        \`;
        renderAbsCanvas(two, simState.p14Pos);
      }
      else if (code === '2-1' || code === '2-3') {
        // [수직선 대소 비교 저울]
        simController.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:0.95rem; font-weight:800; color:#0f766e;">⚖️ 수직선 대소 판정 저울 (교과서 56쪽)</span>
            <span id="compare-readout" style="background:#0d9488; color:#fff; font-size:0.85rem; font-weight:800; padding:3px 10px; border-radius:12px;">\${simState.p21A} \${simState.p21A > simState.p21B ? '>' : '<'} \${simState.p21B}</span>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="tool-btn" style="background:#f0fdfa; color:#0f766e; font-weight:700;" onclick="setCompare(+3, -4)">비교: +3 과 -4</button>
            <button class="tool-btn" style="background:#f0fdfa; color:#0f766e; font-weight:700;" onclick="setCompare(-5, -2)">비교: -5 와 -2 (두 음수)</button>
            <button class="tool-btn" style="background:#f0fdfa; color:#0f766e; font-weight:700;" onclick="setCompare(-1.5, 0)">비교: -1.5 와 0</button>
          </div>
        \`;
        renderCompareCanvas(two, simState.p21A, simState.p21B);
      }
      else if (code === '3-1') {
        // [양(+)과 음(-)의 칩 상쇄 실험실]
        simController.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:0.95rem; font-weight:800; color:#1e40af;">🧪 양(+)·음(-) 칩 상쇄 실험실 (교과서 60쪽)</span>
            <span id="chip-counter" style="background:#1e40af; color:#fff; font-size:0.85rem; font-weight:800; padding:3px 10px; border-radius:12px;">🔵 \${simState.chipBlue}개 | 🔴 \${simState.chipRed}개</span>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="tool-btn" style="background:#eff6ff; color:#1d4ed8; font-weight:700;" onclick="addChip('blue')">🔵 +1 칩 추가</button>
            <button class="tool-btn" style="background:#fef2f2; color:#b91c1c; font-weight:700;" onclick="addChip('red')">🔴 -1 칩 추가</button>
            <button class="tool-btn" style="background:#fef08a; color:#854d0e; font-weight:800;" onclick="cancelChipPairs()">⚡ (+1)+(-1)=0 쌍 상쇄하기!</button>
            <button class="tool-btn" style="background:#f1f5f9; color:#475569; font-weight:700;" onclick="resetChips(3, 5)">🔄 예제 (+3)+(-5) 설정</button>
            <button class="tool-btn" style="background:#f1f5f9; color:#475569; font-weight:700;" onclick="resetChips(6, 2)">🔄 예제 (+6)+(-2) 설정</button>
          </div>
        \`;
        renderChipCanvas(two, simState.chipBlue, simState.chipRed, simState.chipCancelled);
      }
      else if (code === '3-2') {
        // [수직선 2단계 화살표 덧셈 시뮬레이터]
        simController.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:0.95rem; font-weight:800; color:#6d28d9;">🏹 수직선 화살표 덧셈 시뮬레이터 (교과서 61쪽)</span>
            <span style="font-size:0.85rem; font-weight:800; color:#6d28d9;">(+3) + (-5) = -2</span>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="tool-btn" style="background:#f5f3ff; color:#6d28d9; font-weight:700;" onclick="stepArrow(1)">1단계: 0에서 +3 발사 ➔</button>
            <button class="tool-btn" style="background:#f5f3ff; color:#6d28d9; font-weight:700;" onclick="stepArrow(2)">2단계: 그 위치에서 -5 발사 ◀</button>
            <button class="tool-btn" style="background:#ecfdf5; color:#047857; font-weight:800;" onclick="stepArrow(3)">🎯 최종 도착점(-2) 확인!</button>
            <button class="tool-btn" style="background:#f1f5f9; color:#475569;" onclick="stepArrow(0)">🔄 리셋</button>
          </div>
        \`;
        renderArrowCanvas(two, simState.arrowStep);
      }
      else if (code === '4-1') {
        // [속도와 시간 수직선 점프: 음수×음수=양수]
        simController.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:0.95rem; font-weight:800; color:#b45309;">🏃 속도와 시간 곱셈 시뮬레이터 (교과서 68쪽)</span>
            <span id="mult-readout" style="background:#d97706; color:#fff; font-size:0.85rem; font-weight:800; padding:3px 10px; border-radius:12px;">(-3) × (-2) = +6</span>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="tool-btn" style="background:#fef3c7; color:#92400e; font-weight:700;" onclick="setMultSim(-3, -2)">서쪽(-3m/s) 2초 전(-2) ➔ +6 (음수×음수=양수)</button>
            <button class="tool-btn" style="background:#fef3c7; color:#92400e; font-weight:700;" onclick="setMultSim(+3, +2)">동쪽(+3m/s) 2초 후(+2) ➔ +6</button>
            <button class="tool-btn" style="background:#fef3c7; color:#92400e; font-weight:700;" onclick="setMultSim(+3, -2)">동쪽(+3m/s) 2초 전(-2) ➔ -6</button>
            <button class="tool-btn" style="background:#fef3c7; color:#92400e; font-weight:700;" onclick="setMultSim(-3, +2)">서쪽(-3m/s) 2초 후(+2) ➔ -6</button>
          </div>
        \`;
        renderMultCanvas(two, simState.velocity, simState.timeOffset);
      }
      else if (code === '5-2') {
        // [세계 도시 기온차 수직선 온도계]
        simController.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:0.95rem; font-weight:800; color:#0284c7;">🌡️ 세계 도시 기온차 수직선 온도계 (교과서 76쪽)</span>
            <span style="background:#0284c7; color:#fff; font-size:0.85rem; font-weight:800; padding:3px 10px; border-radius:12px;">기온차: (+5) - (-12) = 17℃</span>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="tool-btn" style="background:#e0f2fe; color:#0369a1; font-weight:700;" onclick="setThermCities(5, -12)">서울(+5℃) vs 모스크바(-12℃) [차이 17℃]</button>
            <button class="tool-btn" style="background:#e0f2fe; color:#0369a1; font-weight:700;" onclick="setThermCities(8, -45)">도쿄(+8℃) vs 오이먀콘(-45℃) [차이 53℃]</button>
            <button class="tool-btn" style="background:#e0f2fe; color:#0369a1; font-weight:700;" onclick="setThermCities(15, -3)">로마(+15℃) vs 런던(-3℃) [차이 18℃]</button>
          </div>
        \`;
        renderThermometerCanvas(two, simState.thermCityA, simState.thermCityB);
      }
      else {
        // General clean number line visual for other substeps
        renderGeneralNumberLine(two, code);
      }
    }

    // --- TWO.JS DETAILED SIMULATOR DRAWERS ---

    function renderRobotCanvas(two, pos, history) {
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2 + 30;
      const step = 38;

      // Draw road / number line
      const road = two.makeLine(30, cy, w - 30, cy);
      road.stroke = '#334155'; road.linewidth = 3;

      for (let i = -6; i <= 6; i++) {
        const x = cx + i * step;
        const tick = two.makeLine(x, cy - 8, x, cy + 8);
        tick.stroke = (i === 0) ? '#0284c7' : '#94a3b8';
        tick.linewidth = (i === 0) ? 3 : 1.5;

        const lbl = two.makeText((i > 0 ? '+' : '') + i + 'm', x, cy + 24);
        lbl.size = (i === 0) ? 14 : 11;
        lbl.weight = (i === 0) ? 800 : 600;
        lbl.fill = (i === 0) ? '#0284c7' : '#64748b';
      }

      // Draw robot at current position
      const rx = cx + Math.max(-6, Math.min(6, pos)) * step;
      const ry = cy - 45;

      // Robot body
      const body = two.makeRoundedRectangle(rx, ry, 36, 42, 6);
      body.fill = '#38bdf8'; body.stroke = '#0284c7'; body.linewidth = 2.5;

      // Robot eyes
      const eye1 = two.makeCircle(rx - 8, ry - 8, 4); eye1.fill = '#0f172a';
      const eye2 = two.makeCircle(rx + 8, ry - 8, 4); eye2.fill = '#0f172a';

      // Robot mouth
      const mouth = two.makeLine(rx - 8, ry + 8, rx + 8, ry + 8);
      mouth.stroke = '#0369a1'; mouth.linewidth = 2;

      // Robot antenna
      const antLine = two.makeLine(rx, ry - 21, rx, ry - 32);
      antLine.stroke = '#0284c7'; antLine.linewidth = 2;
      const antBall = two.makeCircle(rx, ry - 34, 4); antBall.fill = '#f59e0b';

      // Robot wheels
      const w1 = two.makeCircle(rx - 12, cy - 5, 7); w1.fill = '#334155';
      const w2 = two.makeCircle(rx + 12, cy - 5, 7); w2.fill = '#334155';

      // Trajectory arc
      if (history.length > 1) {
        const prevPos = history[history.length - 2];
        const px = cx + prevPos * step;
        const midX = (px + rx) / 2;
        const arcY = cy - 80;
        const path = two.makeCurve(px, cy - 10, midX, arcY, rx, cy - 10, true);
        path.stroke = (pos > prevPos) ? '#0284c7' : '#e11d48';
        path.linewidth = 2.5;
        path.dashes = [5, 4];
        path.fill = 'transparent';

        const diff = pos - prevPos;
        const diffText = two.makeText((diff > 0 ? '+' : '') + diff + 'm 이동', midX, arcY - 14);
        diffText.size = 13; diffText.weight = 800; diffText.fill = (diff > 0) ? '#0284c7' : '#e11d48';
      }

      // Title & compass
      const compass = two.makeText('◀ 서쪽(-)           0 (출발 원점)           동쪽(+) ▶', cx, cy - 110);
      compass.size = 14; compass.weight = 800; compass.fill = '#1e3a8a';

      two.update();
    }

    function renderPointsCanvas(two, pts) {
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2 + 10;
      const step = 42;

      // Horizontal axis
      const line = two.makeLine(30, cy, w - 30, cy);
      line.stroke = '#1e293b'; line.linewidth = 2.5;

      for (let i = -5; i <= 5; i++) {
        const x = cx + i * step;
        const tick = two.makeLine(x, cy - 7, x, cy + 7);
        tick.stroke = (i === 0) ? '#4f46e5' : '#cbd5e1';
        tick.linewidth = (i === 0) ? 2.5 : 1.5;

        const lbl = two.makeText(String(i), x, cy + 22);
        lbl.size = (i === 0) ? 15 : 12;
        lbl.weight = (i === 0) ? 800 : 600;
        lbl.fill = (i === 0) ? '#4f46e5' : '#475569';
      }

      // Render points A, B, C
      const colors = { A: '#2563eb', B: '#059669', C: '#dc2626' };
      Object.keys(pts).forEach(key => {
        const val = pts[key];
        const px = cx + val * step;
        const py = cy;

        // Aura
        const aura = two.makeCircle(px, py, 14);
        aura.fill = colors[key]; aura.opacity = 0.2;

        // Dot
        const dot = two.makeCircle(px, py, 7);
        dot.fill = colors[key]; dot.stroke = '#ffffff'; dot.linewidth = 2;

        // Flag / Label
        const flagPole = two.makeLine(px, py - 7, px, py - 35);
        flagPole.stroke = colors[key]; flagPole.linewidth = 2;

        const flag = two.makeRoundedRectangle(px, py - 45, 54, 20, 4);
        flag.fill = colors[key];

        const text = two.makeText(key + '(' + val + ')', px, py - 45);
        text.fill = '#ffffff'; text.size = 11; text.weight = 800;
      });

      two.update();
    }

    function renderAbsCanvas(two, pos) {
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2 + 20;
      const step = 42;

      // Axis
      const line = two.makeLine(30, cy, w - 30, cy);
      line.stroke = '#1e293b'; line.linewidth = 2.5;

      for (let i = -5; i <= 5; i++) {
        const x = cx + i * step;
        const tick = two.makeLine(x, cy - 7, x, cy + 7);
        tick.stroke = (i === 0) ? '#ec4899' : '#cbd5e1';
        tick.linewidth = (i === 0) ? 2.5 : 1.5;

        const lbl = two.makeText(String(i), x, cy + 22);
        lbl.size = (i === 0) ? 15 : 12;
        lbl.weight = (i === 0) ? 800 : 600;
        lbl.fill = (i === 0) ? '#ec4899' : '#475569';
      }

      const px = cx + pos * step;

      // Measuring band from 0 to px
      const band = two.makeLine(cx, cy - 15, px, cy - 15);
      band.stroke = '#ec4899'; band.linewidth = 5;

      const dist = Math.abs(pos);
      const midX = (cx + px) / 2;

      const distLabel = two.makeText('원점으로부터의 거리 = ' + dist + '  (|' + pos + '| = ' + dist + ')', cx, cy - 65);
      distLabel.size = 15; distLabel.weight = 800; distLabel.fill = '#be185d';

      // Pin at P
      const dotP = two.makeCircle(px, cy, 8);
      dotP.fill = '#db2777'; dotP.stroke = '#fff'; dotP.linewidth = 2;

      const pTxt = two.makeText('점 P (' + pos + ')', px, cy - 35);
      pTxt.size = 13; pTxt.weight = 800; pTxt.fill = '#9d174d';

      two.update();
    }

    function renderCompareCanvas(two, a, b) {
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2 + 20;
      const step = 42;

      const line = two.makeLine(30, cy, w - 30, cy);
      line.stroke = '#1e293b'; line.linewidth = 2.5;

      for (let i = -5; i <= 5; i++) {
        const x = cx + i * step;
        const tick = two.makeLine(x, cy - 7, x, cy + 7);
        tick.stroke = (i === 0) ? '#0f766e' : '#cbd5e1';
        tick.linewidth = (i === 0) ? 2.5 : 1.5;

        const lbl = two.makeText(String(i), x, cy + 22);
        lbl.size = (i === 0) ? 15 : 12;
        lbl.weight = (i === 0) ? 800 : 600;
        lbl.fill = (i === 0) ? '#0f766e' : '#475569';
      }

      const ax = cx + a * step;
      const bx = cx + b * step;

      // Point A
      const dotA = two.makeCircle(ax, cy, 8);
      dotA.fill = '#0284c7'; dotA.stroke = '#fff'; dotA.linewidth = 2;
      const txtA = two.makeText('A (' + a + ')', ax, cy - 25);
      txtA.size = 13; txtA.weight = 800; txtA.fill = '#0284c7';

      // Point B
      const dotB = two.makeCircle(bx, cy, 8);
      dotB.fill = '#ea580c'; dotB.stroke = '#fff'; dotB.linewidth = 2;
      const txtB = two.makeText('B (' + b + ')', bx, cy - 25);
      txtB.size = 13; txtB.weight = 800; txtB.fill = '#ea580c';

      // Comparison message
      const isRight = (a < b);
      const rightPoint = isRight ? 'B' : 'A';
      const rightVal = isRight ? b : a;
      const leftPoint = isRight ? 'A' : 'B';
      const leftVal = isRight ? a : b;

      const comp = two.makeText('수직선에서 오른쪽에 위치한 ' + rightPoint + '(' + rightVal + ')가 ' + leftPoint + '(' + leftVal + ')보다 큽니다!', cx, cy - 65);
      comp.size = 14; comp.weight = 800; comp.fill = '#0f766e';

      two.update();
    }

    function renderChipCanvas(two, blues, reds, cancelled) {
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2 - 20;

      // Draw Chip Lab Tray
      const tray = two.makeRoundedRectangle(cx, cy, Math.min(w - 40, 440), 180, 12);
      tray.fill = '#f8fafc'; tray.stroke = '#cbd5e1'; tray.linewidth = 2;

      const pairs = Math.min(blues, reds);
      const uncancelledBlues = cancelled ? (blues - pairs) : blues;
      const uncancelledReds = cancelled ? (reds - pairs) : reds;

      // Draw Blue Chips (+1)
      const startX = cx - 180;
      for (let i = 0; i < blues; i++) {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const x = startX + col * 42;
        const y = cy - 40 + row * 45;

        const isPair = cancelled && (i < pairs);
        const circle = two.makeCircle(x, y, 17);
        circle.fill = isPair ? '#93c5fd' : '#3b82f6';
        circle.stroke = isPair ? '#bfdbfe' : '#1d4ed8';
        circle.linewidth = 2;
        circle.opacity = isPair ? 0.3 : 1.0;

        const txt = two.makeText('+1', x, y);
        txt.size = 12; txt.weight = 800; txt.fill = '#ffffff';
        txt.opacity = isPair ? 0.3 : 1.0;
      }

      // Draw Red Chips (-1)
      const startXRed = cx + 20;
      for (let j = 0; j < reds; j++) {
        const col = j % 6;
        const row = Math.floor(j / 6);
        const x = startXRed + col * 42;
        const y = cy - 40 + row * 45;

        const isPair = cancelled && (j < pairs);
        const circle = two.makeCircle(x, y, 17);
        circle.fill = isPair ? '#fca5a5' : '#ef4444';
        circle.stroke = isPair ? '#fecaca' : '#b91c1c';
        circle.linewidth = 2;
        circle.opacity = isPair ? 0.3 : 1.0;

        const txt = two.makeText('-1', x, y);
        txt.size = 12; txt.weight = 800; txt.fill = '#ffffff';
        txt.opacity = isPair ? 0.3 : 1.0;
      }

      // Bottom Result Equation
      const finalVal = blues - reds;
      let eqStr = '(+' + blues + ') + (-' + reds + ') = ';
      if (cancelled) {
        eqStr += (pairs > 0 ? pairs + '쌍(0) 상쇄 후 ' : '') + '남은 칩: ' + (finalVal >= 0 ? '+' : '') + finalVal;
      } else {
        eqStr += '총 ' + (blues + reds) + '개의 칩 ([쌍 상쇄하기]를 눌러보세요!)';
      }

      const eq = two.makeText(eqStr, cx, cy + 115);
      eq.size = 14; eq.weight = 800; eq.fill = (finalVal >= 0) ? '#1e40af' : '#b91c1c';

      two.update();
    }

    function renderArrowCanvas(two, stepIdx) {
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2 + 30;
      const step = 42;

      // Axis
      const line = two.makeLine(30, cy, w - 30, cy);
      line.stroke = '#1e293b'; line.linewidth = 2.5;

      for (let i = -5; i <= 5; i++) {
        const x = cx + i * step;
        const tick = two.makeLine(x, cy - 7, x, cy + 7);
        tick.stroke = (i === 0) ? '#6d28d9' : '#cbd5e1';
        tick.linewidth = (i === 0) ? 2.5 : 1.5;

        const lbl = two.makeText(String(i), x, cy + 22);
        lbl.size = (i === 0) ? 15 : 12;
        lbl.weight = (i === 0) ? 800 : 600;
        lbl.fill = (i === 0) ? '#6d28d9' : '#475569';
      }

      // 1st arrow: 0 -> +3 (Blue)
      if (stepIdx >= 1) {
        const x1 = cx, x2 = cx + 3 * step;
        const y = cy - 40;
        const arr1 = two.makeLine(x1, y, x2, y);
        arr1.stroke = '#2563eb'; arr1.linewidth = 3.5;
        const head1 = two.makePolygon(x2, y, 6, 3);
        head1.rotation = Math.PI / 2; head1.fill = '#2563eb';

        const txt1 = two.makeText('+3 (오른쪽으로 3칸)', (x1 + x2) / 2, y - 14);
        txt1.size = 12; txt1.weight = 800; txt1.fill = '#2563eb';
      }

      // 2nd arrow: +3 -> -2 (Red)
      if (stepIdx >= 2) {
        const x1 = cx + 3 * step, x2 = cx - 2 * step;
        const y = cy - 80;
        const arr2 = two.makeLine(x1, y, x2, y);
        arr2.stroke = '#dc2626'; arr2.linewidth = 3.5;
        const head2 = two.makePolygon(x2, y, 6, 3);
        head2.rotation = -Math.PI / 2; head2.fill = '#dc2626';

        const txt2 = two.makeText('-5 (왼쪽으로 5칸)', (x1 + x2) / 2, y - 14);
        txt2.size = 12; txt2.weight = 800; txt2.fill = '#dc2626';
      }

      // Result flag at -2
      if (stepIdx >= 3) {
        const rx = cx - 2 * step;
        const resLine = two.makeLine(rx, cy - 80, rx, cy);
        resLine.stroke = '#059669'; resLine.linewidth = 2; resLine.dashes = [4, 4];

        const flag = two.makeRoundedRectangle(rx, cy - 105, 110, 24, 6);
        flag.fill = '#059669';
        const flagTxt = two.makeText('최종 도착점: -2', rx, cy - 105);
        flagTxt.fill = '#fff'; flagTxt.size = 12; flagTxt.weight = 800;
      }

      two.update();
    }

    function renderMultCanvas(two, v, t) {
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2 + 20;
      const step = 38;

      const line = two.makeLine(30, cy, w - 30, cy);
      line.stroke = '#1e293b'; line.linewidth = 2.5;

      for (let i = -7; i <= 7; i++) {
        const x = cx + i * step;
        const tick = two.makeLine(x, cy - 6, x, cy + 6);
        tick.stroke = (i === 0) ? '#b45309' : '#cbd5e1';
        tick.linewidth = (i === 0) ? 2.5 : 1.5;

        const lbl = two.makeText(String(i), x, cy + 20);
        lbl.size = (i === 0) ? 14 : 11;
        lbl.weight = (i === 0) ? 800 : 600;
        lbl.fill = (i === 0) ? '#b45309' : '#64748b';
      }

      const resPos = v * t;
      const px = cx + resPos * step;

      // Draw Runner at resPos
      const runner = two.makeCircle(px, cy - 30, 14);
      runner.fill = (resPos >= 0) ? '#0284c7' : '#e11d48';
      runner.stroke = '#fff'; runner.linewidth = 2;

      const rTxt = two.makeText((resPos >= 0 ? '+' : '') + resPos + 'm', px, cy - 52);
      rTxt.size = 13; rTxt.weight = 800; rTxt.fill = (resPos >= 0) ? '#0284c7' : '#e11d48';

      // Story explanation
      const vDir = (v > 0) ? '동쪽으로 매초 ' + v + 'm 속도(+)' : '서쪽으로 매초 ' + Math.abs(v) + 'm 속도(-)';
      const tDir = (t > 0) ? t + '초 후(+)' : Math.abs(t) + '초 전(-)';
      const desc = two.makeText(vDir + '로 달리는 대상의 ' + tDir + ' 위치는: ' + (resPos >= 0 ? '+' : '') + resPos + 'm 지점!', cx, cy - 90);
      desc.size = 14; desc.weight = 800; desc.fill = '#1e3a8a';

      two.update();
    }

    function renderThermometerCanvas(two, cityA, cityB) {
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2 + 10;

      // Thermometer A (서울)
      const ax = cx - 90;
      const thA = two.makeRoundedRectangle(ax, cy, 28, 200, 14);
      thA.fill = '#f1f5f9'; thA.stroke = '#0284c7'; thA.linewidth = 2.5;

      const mercuryAHeight = Math.max(10, Math.min(180, (cityA + 50) * 1.8));
      const mercA = two.makeRoundedRectangle(ax, cy + 90 - mercuryAHeight/2, 22, mercuryAHeight, 10);
      mercA.fill = '#38bdf8';

      const lblA = two.makeText('도시 A: ' + (cityA > 0 ? '+' : '') + cityA + '℃', ax, cy + 125);
      lblA.size = 13; lblA.weight = 800; lblA.fill = '#0369a1';

      // Thermometer B (모스크바 등)
      const bx = cx + 90;
      const thB = two.makeRoundedRectangle(bx, cy, 28, 200, 14);
      thB.fill = '#f1f5f9'; thB.stroke = '#e11d48'; thB.linewidth = 2.5;

      const mercuryBHeight = Math.max(10, Math.min(180, (cityB + 50) * 1.8));
      const mercB = two.makeRoundedRectangle(bx, cy + 90 - mercuryBHeight/2, 22, mercuryBHeight, 10);
      mercB.fill = (cityB >= 0) ? '#38bdf8' : '#f87171';

      const lblB = two.makeText('도시 B: ' + (cityB > 0 ? '+' : '') + cityB + '℃', bx, cy + 125);
      lblB.size = 13; lblB.weight = 800; lblB.fill = '#991b1b';

      // Difference Bracket
      const diff = Math.abs(cityA - cityB);
      const topY = cy + 90 - Math.max(mercuryAHeight, mercuryBHeight);
      const botY = cy + 90 - Math.min(mercuryAHeight, mercuryBHeight);

      const bracket = two.makeLine(cx, topY, cx, botY);
      bracket.stroke = '#7c3aed'; bracket.linewidth = 3;

      const diffBadge = two.makeRoundedRectangle(cx, (topY + botY)/2, 90, 24, 6);
      diffBadge.fill = '#7c3aed';
      const diffTxt = two.makeText('기온차: ' + diff + '℃', cx, (topY + botY)/2);
      diffTxt.fill = '#fff'; diffTxt.size = 12; diffTxt.weight = 800;

      two.update();
    }

    function renderGeneralNumberLine(two, code) {
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2;

      const line = two.makeLine(40, cy, w - 40, cy);
      line.stroke = '#1e293b'; line.linewidth = 2.5;

      const step = 45;
      for (let i = -4; i <= 4; i++) {
        const x = cx + i * step;
        const tick = two.makeLine(x, cy - 7, x, cy + 7);
        tick.stroke = (i === 0) ? '#4f46e5' : '#cbd5e1';
        tick.linewidth = (i === 0) ? 2.5 : 1.5;

        const lbl = two.makeText(String(i), x, cy + 22);
        lbl.size = (i === 0) ? 15 : 12;
        lbl.weight = (i === 0) ? 800 : 600;
        lbl.fill = (i === 0) ? '#4f46e5' : '#475569';
      }

      const title = two.makeText(SUBSTEP_TITLES[code] || '정수와 유리수 탐구', cx, 40);
      title.size = 16; title.weight = 800; title.fill = '#4f46e5';

      two.update();
    }

    // --- INTERACTIVE SIMULATOR ACTION CONTROLLER FUNCTIONS ---

    function moveRobot(delta) {
      SoundFX.click();
      simState.robotPos = Math.max(-6, Math.min(6, simState.robotPos + delta));
      simState.robotHistory.push(simState.robotPos);
      const badge = document.getElementById('robot-pos-badge');
      if (badge) badge.innerText = '현재 위치: x = ' + (simState.robotPos > 0 ? '+' : '') + simState.robotPos + 'm';
      const two = twoInstance;
      if (two) renderRobotCanvas(two, simState.robotPos, simState.robotHistory);
    }

    function resetRobot() {
      SoundFX.click();
      simState.robotPos = 0;
      simState.robotHistory = [0];
      const badge = document.getElementById('robot-pos-badge');
      if (badge) badge.innerText = '현재 위치: x = 0m';
      const two = twoInstance;
      if (two) renderRobotCanvas(two, 0, [0]);
    }

    function runRobotMission() {
      SoundFX.click();
      simState.robotHistory = [0];
      simState.robotPos = 0;
      const two = twoInstance;
      const badge = document.getElementById('robot-pos-badge');

      // 1st step: move to +3
      setTimeout(() => {
        simState.robotPos = 3;
        simState.robotHistory.push(3);
        if (badge) badge.innerText = '1단계: 동쪽 +3m 도달!';
        if (two) renderRobotCanvas(two, 3, simState.robotHistory);
        SoundFX.click();

        // 2nd step: move -5m -> arrives at -2
        setTimeout(() => {
          simState.robotPos = -2;
          simState.robotHistory.push(-2);
          if (badge) badge.innerText = '2단계: 서쪽 5m 이동 ➔ 최종 위치: x = -2m!';
          if (two) renderRobotCanvas(two, -2, simState.robotHistory);
          SoundFX.success();
        }, 900);
      }, 300);
    }

    function setPointP12(pt, val) {
      SoundFX.click();
      simState.p12Points[pt] = val;
      const two = twoInstance;
      if (two) renderPointsCanvas(two, simState.p12Points);
    }

    function setAbsPos(val) {
      SoundFX.click();
      simState.p14Pos = val;
      const readout = document.getElementById('abs-readout');
      if (readout) readout.innerText = '|' + val + '| = ' + Math.abs(val);
      const two = twoInstance;
      if (two) renderAbsCanvas(two, val);
    }

    function setCompare(a, b) {
      SoundFX.click();
      simState.p21A = a;
      simState.p21B = b;
      const readout = document.getElementById('compare-readout');
      if (readout) readout.innerText = a + (a > b ? ' > ' : ' < ') + b;
      const two = twoInstance;
      if (two) renderCompareCanvas(two, a, b);
    }

    function addChip(type) {
      SoundFX.click();
      simState.chipCancelled = false;
      if (type === 'blue') simState.chipBlue = Math.min(12, simState.chipBlue + 1);
      if (type === 'red') simState.chipRed = Math.min(12, simState.chipRed + 1);
      const cnt = document.getElementById('chip-counter');
      if (cnt) cnt.innerText = '🔵 ' + simState.chipBlue + '개 | 🔴 ' + simState.chipRed + '개';
      const two = twoInstance;
      if (two) renderChipCanvas(two, simState.chipBlue, simState.chipRed, false);
    }

    function cancelChipPairs() {
      SoundFX.success();
      simState.chipCancelled = true;
      const two = twoInstance;
      if (two) renderChipCanvas(two, simState.chipBlue, simState.chipRed, true);
    }

    function resetChips(b, r) {
      SoundFX.click();
      simState.chipBlue = b;
      simState.chipRed = r;
      simState.chipCancelled = false;
      const cnt = document.getElementById('chip-counter');
      if (cnt) cnt.innerText = '🔵 ' + b + '개 | 🔴 ' + r + '개';
      const two = twoInstance;
      if (two) renderChipCanvas(two, b, r, false);
    }

    function stepArrow(step) {
      SoundFX.click();
      simState.arrowStep = step;
      const two = twoInstance;
      if (two) renderArrowCanvas(two, step);
    }

    function setMultSim(v, t) {
      SoundFX.click();
      simState.velocity = v;
      simState.timeOffset = t;
      const readout = document.getElementById('mult-readout');
      if (readout) readout.innerText = '(' + v + ') × (' + t + ') = ' + (v * t > 0 ? '+' : '') + (v * t);
      const two = twoInstance;
      if (two) renderMultCanvas(two, v, t);
    }

    function setThermCities(a, b) {
      SoundFX.click();
      simState.thermCityA = a;
      simState.thermCityB = b;
      const two = twoInstance;
      if (two) renderThermometerCanvas(two, a, b);
    }
  `,
  validationHandlersJs: `
    function showInlineErr(id, msg) {
      SoundFX.error();
      const el = document.getElementById(id);
      if (el) { el.style.display = 'block'; el.innerText = msg; }
    }

    function check01Submit() {
      const q1 = normTxt(document.getElementById('p01-q1').value);
      const q2 = normTxt(document.getElementById('p01-q2').value);
      if ((q1 === '5/6' || q1 === '5OVER6') && (q2 === '0.2' || q2 === '.2')) {
        renderVerifiedAnswerView("분수와 소수 계산 완료!", "• 1/3 + 1/2 = 5/6<br>• 0.4 × 0.5 = 0.2", "0-2");
      } else {
        showInlineErr('p01-err', '❌ 1/3+1/2=5/6과 0.4×0.5=0.2를 확인하세요!');
      }
    }

    function check02Submit() {
      const a = normTxt(document.getElementById('p02-a').value);
      const b = normTxt(document.getElementById('p02-b').value);
      if ((a === '3' || a === '+3') && (b === '1.5' || b === '3/2')) {
        renderVerifiedAnswerView("수직선 눈금 읽기 완료!", "• 점 A = 3, 점 B = 1.5 (3/2)", "0-3");
      } else {
        showInlineErr('p02-err', '❌ 점 A(3)와 점 B(1.5 또는 3/2)를 확인하세요!');
      }
    }

    function check03Submit() {
      const q1 = normTxt(document.getElementById('p03-q1').value);
      const q2 = normTxt(document.getElementById('p03-q2').value);
      if (q1 === '>' && q2 === '<') {
        renderVerifiedAnswerView("🏆 되짚어 보기 마스터! 2단원 해금!", "• 3/4 > 2/3<br>• 1.25 < 1.3", "1-1");
      } else {
        showInlineErr('p03-err', '❌ 부등호 방향(>, <)을 확인하세요!');
      }
    }

    function check11Submit() {
      const pos = normTxt(document.getElementById('p11-robot-pos').value);
      const t2 = normTxt(document.getElementById('p11-temp2').value);
      const m = normTxt(document.getElementById('p11-money').value);

      const okPos = (pos === '-2' || pos === '-2M');
      const okT2 = (t2 === '-7' || t2 === '-7℃');
      const okM = (m === '-500' || m.includes('-500'));

      if (okPos && okT2 && okM) {
        renderVerifiedAnswerView("로봇 이동 & 양수·음수 탐구 완수!", "• 로봇 최종 위치: -2m<br>• 영하 7℃ = -7℃<br>• 500원 손해 = -500원", "1-2");
      } else {
        showInlineErr('p11-err', '❌ 로봇 최종 위치(-2) 및 부호(-7, -500)를 정확히 입력하세요!');
      }
    }

    function check12Submit() {
      const ints = normTxt(document.getElementById('p12-ints').value);
      const zero = normTxt(document.getElementById('p12-zero').value);
      const okInts = ints.includes('-3') && ints.includes('0') && ints.includes('5');
      const okZero = zero.includes('아니') || zero.includes('둘다') || zero.includes('X');

      if (okInts && okZero) {
        renderVerifiedAnswerView("정수의 분류 마스터!", "• 정수: -3, 0, +5<br>• 0은 양수도 아니고 음수도 아닙니다.", "1-3");
      } else {
        showInlineErr('p12-err', '❌ 정수 목록(-3, 0, 5)과 0의 성질(둘 다 아니다)을 확인하세요!');
      }
    }

    function check13Submit() {
      const q1 = normTxt(document.getElementById('p13-q1').value);
      const q2 = normTxt(document.getElementById('p13-q2').value);
      if (q1 === 'O' && (q2 === '-2.5' || q2 === '-5/2')) {
        renderVerifiedAnswerView("유리수와 수직선 점 대응 완료!", "• 모든 정수는 유리수입니다 (O)<br>• 0의 왼쪽 2.5칸 = -2.5 (-5/2)", "1-4");
      } else {
        showInlineErr('p13-err', '❌ O와 수직선 대응 수(-2.5 또는 -5/2)를 확인하세요!');
      }
    }

    function check14Submit() {
      const q1 = normTxt(document.getElementById('p14-q1').value);
      const q2 = normTxt(document.getElementById('p14-q2').value);
      const q3 = normTxt(document.getElementById('p14-q3').value);

      const ok1 = (q1 === '5');
      const ok2 = (q2 === '2.7');
      const ok3 = (q3.includes('4') && q3.includes('-4')) || (q3.includes('+4') && q3.includes('-4')) || q3.includes('±4');

      if (ok1 && ok2 && ok3) {
        renderVerifiedAnswerView("절댓값의 성질 마스터!", "• |-5| = 5, |+2.7| = 2.7<br>• 절댓값이 4인 수는 +4와 -4 두 개입니다.", "2-1");
      } else {
        showInlineErr('p14-err', '❌ |-5|=5, |+2.7|=2.7, 절댓값 4인 수(+4, -4)를 확인하세요!');
      }
    }

    function check21Submit() {
      const q1 = normTxt(document.getElementById('p21-q1').value);
      const q2 = normTxt(document.getElementById('p21-q2').value);
      const q3 = normTxt(document.getElementById('p21-q3').value);

      if (q1 === '>' && q2 === '<' && q3 === '<') {
        renderVerifiedAnswerView("수직선과 대소 관계 통과!", "• +3 > -4<br>• -5 < -2 (두 음수는 절댓값 큰 수가 작음)<br>• -1.5 < 0", "2-2");
      } else {
        showInlineErr('p21-err', '❌ 부등호 방향(>, <, <)을 확인하세요!');
      }
    }

    function check22Submit() {
      const q1 = normTxt(document.getElementById('p22-q1').value);
      const q2 = normTxt(document.getElementById('p22-q2').value);
      const q3 = normTxt(document.getElementById('p22-q3').value);

      const ok1 = (q1.includes('>=') || q1.includes('≥') || q1 === '이상');
      const ok2 = (q2.includes('<=') || q2.includes('≤') || q2 === '이하');
      const ok3 = q3.includes('-1<X<=5') || q3.includes('-1<X≤5') || q3.includes('-1<X,X<=5');

      if (ok1 && ok2 && ok3) {
        renderVerifiedAnswerView("부등호 표현법 마스터!", "• x >= -2<br>• x <= 3<br>• -1 < x <= 5", "2-3");
      } else {
        showInlineErr('p22-err', '❌ 부등호 기호(>=, <=, -1 < x <= 5)를 정확히 확인하세요!');
      }
    }

    function check23Submit() {
      const maxV = normTxt(document.getElementById('p23-max').value);
      const minV = normTxt(document.getElementById('p23-min').value);

      if ((maxV === '1.5' || maxV === '+1.5') && (minV === '-4.5')) {
        renderVerifiedAnswerView("대소 관계 종합 형성평가 통과!", "• 가장 큰 수: +1.5<br>• 가장 작은 수: -4.5 (절댓값이 가장 큰 음수)", "3-1");
      } else {
        showInlineErr('p23-err', '❌ 가장 큰 수(+1.5)와 가장 작은 수(-4.5)를 확인하세요!');
      }
    }

    function check31Submit() {
      const q1 = normTxt(document.getElementById('p31-q1').value);
      const q2 = normTxt(document.getElementById('p31-q2').value);
      const q3 = normTxt(document.getElementById('p31-q3').value);
      const q4 = normTxt(document.getElementById('p31-q4').value);

      if ((q1 === '10' || q1 === '+10') && (q2 === '-13') && (q3 === '6' || q3 === '+6') && (q4 === '-6')) {
        renderVerifiedAnswerView("칩 상쇄 덧셈 계산 완벽 마스터!", "• (+6) + (+4) = +10<br>• (-5) + (-8) = -13<br>• (+9) + (-3) = +6<br>• (-10) + (+4) = -6", "3-2");
      } else {
        showInlineErr('p31-err', '❌ 계산 결과(+10, -13, +6, -6)를 확인하세요!');
      }
    }

    function check32Submit() {
      const l1 = normTxt(document.getElementById('p32-law1').value);
      const l2 = normTxt(document.getElementById('p32-law2').value);
      const val = normTxt(document.getElementById('p32-val').value);

      if (l1.includes('교환') && l2.includes('결합') && (val === '5' || val === '+5')) {
        renderVerifiedAnswerView("덧셈의 연산법칙 마스터!", "• a+b = b+a (교환법칙)<br>• (a+b)+c = a+(b+c) (결합법칙)<br>• (-7) + (+15) + (-3) = +5", "3-3");
      } else {
        showInlineErr('p32-err', '❌ 교환법칙, 결합법칙, 계산 결과(+5)를 확인하세요!');
      }
    }

    function check33Submit() {
      const q1 = normTxt(document.getElementById('p33-q1').value);
      const q2 = normTxt(document.getElementById('p33-q2').value);
      const q3 = normTxt(document.getElementById('p33-q3').value);

      if (q1 === '-3' && (q2 === '7' || q2 === '+7') && q3 === '-4') {
        renderVerifiedAnswerView("정수의 뺄셈 공식 통과!", "• (+5) - (+8) = -3<br>• (+3) - (-4) = +7<br>• (-6) - (-2) = -4", "3-4");
      } else {
        showInlineErr('p33-err', '❌ 뺄셈 결과(-3, +7, -4)를 확인하세요!');
      }
    }

    function check34Submit() {
      const q1 = normTxt(document.getElementById('p34-q1').value);
      const q2 = normTxt(document.getElementById('p34-q2').value);

      if ((q1 === '5' || q1 === '+5') && q2 === '-5') {
        renderVerifiedAnswerView("혼합 계산 완벽 통과!", "• 3 - (-7) + (-5) = 3 + 7 - 5 = +5<br>• -8 + 5 - 2 = -10 + 5 = -5", "4-1");
      } else {
        showInlineErr('p34-err', '❌ 혼합 계산 결과(+5, -5)를 확인하세요!');
      }
    }

    function check41Submit() {
      const q1 = normTxt(document.getElementById('p41-q1').value);
      const q2 = normTxt(document.getElementById('p41-q2').value);
      const q3 = normTxt(document.getElementById('p41-q3').value);

      if ((q1 === '12' || q1 === '+12') && q2 === '-30' && (q3 === '56' || q3 === '+56')) {
        renderVerifiedAnswerView("정수의 곱셈 부호 규칙 마스터!", "• (+4) × (+3) = +12<br>• (+5) × (-6) = -30<br>• (-7) × (-8) = +56 (음수 × 음수 = 양수)", "4-2");
      } else {
        showInlineErr('p41-err', '❌ 곱셈 결과(+12, -30, +56)를 확인하세요!');
      }
    }

    function check42Submit() {
      const q1 = normTxt(document.getElementById('p42-q1').value);
      const q2 = normTxt(document.getElementById('p42-q2').value);
      const q3 = normTxt(document.getElementById('p42-q3').value);

      if ((q1 === '2' || q1 === '+2') && q2 === '-8' && q3 === '-16') {
        renderVerifiedAnswerView("분배법칙과 거듭제곱 마스터!", "• 48×(1/6) - 48×(1/8) = 8 - 6 = 2<br>• (-2)³ = -8<br>• -2⁴ = -16", "4-3");
      } else {
        showInlineErr('p42-err', '❌ 분배법칙 결과(2) 및 거듭제곱(-8, -16)을 확인하세요!');
      }
    }

    function check43Submit() {
      const r = normTxt(document.getElementById('p43-recip').value);
      const ans = normTxt(document.getElementById('p43-ans').value);

      if ((r === '-5/3' || r === '-5OVER3') && (ans === '9' || ans === '+9')) {
        renderVerifiedAnswerView("역수와 나눗셈 마스터!", "• -3/5 의 역수는 -5/3<br>• (-12) ÷ (-4/3) = (-12) × (-3/4) = +9", "5-1");
      } else {
        showInlineErr('p43-err', '❌ 역수(-5/3)와 계산 결과(+9)를 확인하세요!');
      }
    }

    function check51Submit() {
      const q1 = normTxt(document.getElementById('p51-q1').value);
      const q2 = normTxt(document.getElementById('p51-q2').value);

      if ((q1 === '5' || q1 === '+5') && (q2.includes('음') || q2 === '-')) {
        renderVerifiedAnswerView("대단원 스스로 마무리 완수!", "• 원점에서 거리가 5인 양수는 +5<br>• 음수 × 양수 = 음수", "5-2");
      } else {
        showInlineErr('p51-err', '❌ 양수(5)와 부호(음수)를 확인하세요!');
      }
    }

    function check52Submit() {
      const d = normTxt(document.getElementById('p52-tempdiff').value);
      if (d === '17') {
        renderVerifiedAnswerView("🏆 2단원 정수와 유리수 전체 마스터 달성!", "축하합니다! 서울(+5℃)과 모스크바(-12℃)의 기온차는 17℃입니다.", "5-2");
      } else {
        showInlineErr('p52-err', '❌ 기온차(+5 - (-12) = 17)를 입력하세요!');
      }
    }

    window.moveRobot = moveRobot;
    window.resetRobot = resetRobot;
    window.runRobotMission = runRobotMission;
    window.setPointP12 = setPointP12;
    window.setAbsPos = setAbsPos;
    window.setCompare = setCompare;
    window.addChip = addChip;
    window.cancelChipPairs = cancelChipPairs;
    window.resetChips = resetChips;
    window.stepArrow = stepArrow;
    window.setMultSim = setMultSim;
    window.setThermCities = setThermCities;
    window.check01Submit = check01Submit;
    window.check02Submit = check02Submit;
    window.check03Submit = check03Submit;
    window.check11Submit = check11Submit;
    window.check12Submit = check12Submit;
    window.check13Submit = check13Submit;
    window.check14Submit = check14Submit;
    window.check21Submit = check21Submit;
    window.check22Submit = check22Submit;
    window.check23Submit = check23Submit;
    window.check31Submit = check31Submit;
    window.check32Submit = check32Submit;
    window.check33Submit = check33Submit;
    window.check34Submit = check34Submit;
    window.check41Submit = check41Submit;
    window.check42Submit = check42Submit;
    window.check43Submit = check43Submit;
    window.check51Submit = check51Submit;
    window.check52Submit = check52Submit;
  `
};

const html = createChapterHtml(ch2Config);
fs.writeFileSync('g1_ch2_integers.html', html, 'utf8');

const scriptMatch = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i);
fs.writeFileSync('temp_check.js', scriptMatch[1], 'utf8');
execSync('node --check temp_check.js');
fs.unlinkSync('temp_check.js');
console.log('✅ g1_ch2_integers.html: successfully rebuilt with updated master_template!');
