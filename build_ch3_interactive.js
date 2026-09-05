const fs = require('fs');
const { createChapterHtml } = require('./master_template.js');

const ch3Config = {
  chapterNum: 3,
  chapterTitle: '3. 문자와 식',
  chapterBadge: '중1 수학 3단원',
  mainTabs: [
    '0. 되짚어 보기',
    '3.1 문자의 사용과 식의 값',
    '3.2 일차식의 계산',
    '3.3 등식과 방정식',
    '3.4 일차방정식의 풀이',
    '3.5 마무리 & 프로젝트'
  ],
  pillsConfig: {
    0: [
      { code: '0-1', label: '1. □를 사용한 식 (초등)' },
      { code: '0-2', label: '2. 비와 비율 (초등)' },
      { code: '0-3', label: '3. 거꾸로 계산하기 (초등)' }
    ],
    1: [
      { code: '1-1', label: '1. 아이스크림 영수증 (생각열기)' },
      { code: '1-2', label: '2. 곱셈·나눗셈 기호의 생략' },
      { code: '1-3', label: '3. 식의 값과 대입 게이지' },
      { code: '1-4', label: '4. 실생활 식의 값 계산' }
    ],
    2: [
      { code: '2-1', label: '1. 다항식 구조 카드 분해기' },
      { code: '2-2', label: '2. 직사각형 모델과 분배법칙' },
      { code: '2-3', label: '3. 동류항 대수 막대 타일 모으기' },
      { code: '2-4', label: '4. 일차식의 덧셈과 뺄셈' }
    ],
    3: [
      { code: '3-1', label: '1. 방정식 vs 항등식 판별 저울' },
      { code: '3-2', label: '2. 방정식의 해(근) 찾기' },
      { code: '3-3', label: '3. 등식의 성질 양팔 저울 실험실' },
      { code: '3-4', label: '4. 등식의 성질 활용 퀴즈' }
    ],
    4: [
      { code: '4-1', label: '1. 이항(移項) 애니메이션' },
      { code: '4-2', label: '2. 일차방정식의 풀이 (괄호·계수)' },
      { code: '4-3', label: '3. 농구 경기 득점 활용 문제' }
    ],
    5: [
      { code: '5-1', label: '1. 3단원 문자와 식 스스로 마무리' },
      { code: '5-2', label: '2. 창의융합: 생각한 수 맞추기 수학 마술사' }
    ]
  },
  substepDataJs: `
    const SUBSTEP_CONFIG = {
      '0-1': {
        mission: "<b>[되짚어 보기 1] □를 사용한 식 (초등 5~6학년)</b><br>교과서 68쪽: 좌측의 수평 저울에서 왼쪽 접시($3 \\\\times \\\\square + 5$)와 오른쪽 접시($20$)가 수평을 이루도록 $\\\\square$의 값을 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              $3 \\\\times \\\\square + 5 = 20$ 일 때,<br>
              • $3 \\\\times \\\\square =$ ( <input type="text" id="p01-mid" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )<br>
              • $\\\\square =$ ( <input type="text" id="p01-box" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check01Submit()">✅ 제출 및 채점</button>
            <div id="p01-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-2': {
        mission: "<b>[되짚어 보기 2] 비와 비율 (초등 6학년)</b><br>교과서 68쪽: 전체 회원 수가 50명인 어느 동아리에서 남학생이 20명일 때, 남학생 수의 비율을 기약분수 또는 소수로 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              전체 50명 중 20명의 비율:<br>
              • 남학생의 비율: ( <input type="text" id="p02-ratio" class="proof-input-text" style="width:100px;" placeholder="기약분수 또는 소수"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check02Submit()">✅ 제출 및 채점</button>
            <div id="p02-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-3': {
        mission: "<b>[되짚어 보기 3] 거꾸로 계산하기 (초등)</b><br>교과서 68쪽: 어떤 수에 4를 더한 후 3을 곱했더니 27이 되었습니다. 어떤 수를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              어떤 수를 $\\\\square$라 할 때, $(\\\\square + 4) \\\\times 3 = 27$<br>
              • 어떤 수 $\\\\square$: ( <input type="text" id="p03-num" class="proof-input-text" style="width:80px;" placeholder="숫자 입력"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check03Submit()">🏆 되짚어 보기 최종 제출</button>
            <div id="p03-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-1': {
        mission: "<b>[3.1 생각열기] 아이스크림 구매 영수증 시뮬레이터</b><br>교과서 70~72쪽: 좌측 조작판에서 아이스크림 개수 $x$를 조절해 보며 문자를 사용한 식을 완성하세요!",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>문자의 사용:</b> 수량 관계를 문자로 나타내면 수량 사이의 관계를 일반적이고 간결하게 표현할 수 있습니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① 1개에 3500원인 아이스크림을 $x$개 살 때 지불할 금액:<br>
              &nbsp;&nbsp;&nbsp;( <input type="text" id="p11-ice" class="proof-input-text" style="width:120px;" placeholder="식 입력 (예: 1000x)"> ) 원<br><br>
              ② 1줄에 3500원인 김밥 $a$줄과 1인분에 5000원인 떡볶이 $b$인분을 주문할 때 지불할 금액:<br>
              &nbsp;&nbsp;&nbsp;( <input type="text" id="p11-order" class="proof-input-text" style="width:160px;" placeholder="식 입력 (예: ax+by)"> ) 원
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check11Submit()">✅ 제출 및 채점</button>
            <div id="p11-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-2': {
        mission: "<b>[3.1 개념학습] 곱셈·나눗셈 기호의 생략</b><br>교과서 71~73쪽: 곱셈 기호 $\\\\times$는 생략하고 수-문자 순서로 쓰며, 나눗셈 기호 $\\\\div$는 분수 꼴로 나타냅니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              📖 <b>기호 생략 규칙:</b><br>
              • (수) × (문자) $\\\\rightarrow$ 수를 문자 앞에 씀 ($a \\\\times 2 = 2a$)<br>
              • 1 또는 -1과의 곱 $\\\\rightarrow$ 1 생략 ($-1 \\\\times x = -x$)<br>
              • 나눗셈 $\\\\rightarrow$ 분수 꼴 ($a \\\\div b = \\\\frac{a}{b}$)
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              기호를 생략하여 간단히 나타내시오.<br>
              ① $a \\\\times (-3) \\\\times b =$ ( <input type="text" id="p12-q1" class="proof-input-text" style="width:100px;" placeholder="기호 생략 식"> )<br>
              ② $x \\\\div 5 =$ ( <input type="text" id="p12-q2" class="proof-input-text" style="width:80px;" placeholder="분수 꼴 (예: a/b)"> )<br>
              ③ $2 \\\\times (x + y) \\\\div 3 =$ ( <input type="text" id="p12-q3" class="proof-input-text" style="width:140px;" placeholder="분수 꼴"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check12Submit()">✅ 제출 및 채점</button>
            <div id="p12-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-3': {
        mission: "<b>[3.1 개념학습] 식의 값과 대입 게이지</b><br>교과서 74쪽: 문자에 어떤 수를 바꾸어 넣는 것을 <b>대입</b>이라 하고, 대입하여 계산한 결과를 <b>식의 값</b>이라 합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              전체 400쪽인 책을 하루에 10쪽씩 $x$일 읽었을 때 남은 쪽수:<br>
              ① 남은 쪽수를 나타내는 식: ( <input type="text" id="p13-expr" class="proof-input-text" style="width:120px;" placeholder="문자 식 입력"> ) 쪽<br>
              ② 5일 동안 읽었을 때($x = 5$) 남은 쪽수(식의 값): ( <input type="text" id="p13-val" class="proof-input-text" style="width:80px;" placeholder="계산값 입력"> ) 쪽
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check13Submit()">✅ 제출 및 채점</button>
            <div id="p13-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-4': {
        mission: "<b>[3.1 형성평가] 실생활 식의 값 계산 퀴즈</b><br>교과서 75쪽: 음수를 대입할 때는 반드시 괄호를 치고 계산에 유의합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① $a = -2$ 일 때, $3a^2 - 4a + 1$ 의 값: ( <input type="text" id="p14-q1" class="proof-input-text" style="width:80px;" placeholder="숫자 입력"> )<br>
              ② 지면 기온이 21℃이고 높이 $h$ km인 지점의 기온 공식이 $21 - 6h$ 일 때, 높이 3km인 산 정상의 기온: ( <input type="text" id="p14-q2" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> ) ℃
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check14Submit()">✅ 제출 및 2소단원 해금</button>
            <div id="p14-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-1': {
        mission: "<b>[3.2 개념학습] 다항식 구조 분해기 (항, 계수, 차수)</b><br>교과서 76~77쪽: 다항식 $-3x^2 + 5x - 7$의 구성 요소를 좌측 카드 분해기에서 확인하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              📖 <b>다항식 용어:</b><br>
              • <b>항</b>: 수 또는 문자의 곱으로만 이루어진 식<br>
              • <b>상수항</b>: 수만으로 이루어진 항<br>
              • <b>계수</b>: 문자를 포함한 항에서 문자 앞에 곱해진 수<br>
              • <b>차수</b>: 항에서 문자가 곱해진 개수
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              다항식 $-3x^2 + 5x - 7$ 에 대하여:<br>
              • $x$의 계수: ( <input type="text" id="p21-coef" class="proof-input-text" style="width:60px;" placeholder="숫자 입력"> )<br>
              • 상수항: ( <input type="text" id="p21-const" class="proof-input-text" style="width:60px;" placeholder="부호와 숫자"> )<br>
              • 다항식의 차수: ( <input type="text" id="p21-deg" class="proof-input-text" style="width:60px;" placeholder="차수 (숫자)"> )<br>
              • $2x - 4$ 는 일차식인가요? (예 / 아니오): ( <input type="text" id="p21-islinear" class="proof-input-text" style="width:80px;" placeholder="예 또는 아니오"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check21Submit()">✅ 제출 및 채점</button>
            <div id="p21-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-2': {
        mission: "<b>[3.2 개념학습] 직사각형 모델과 분배법칙</b><br>교과서 78~79쪽: 좌측 직사각형 면적 모델을 관찰하고 단항식과 수의 곱셈, 분배법칙을 계산하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① $2x \\\\times 3 =$ ( <input type="text" id="p22-q1" class="proof-input-text" style="width:90px;" placeholder="일차식 입력"> )<br>
              ② $-4(2x - 3) =$ ( <input type="text" id="p22-q2" class="proof-input-text" style="width:120px;" placeholder="일차식 입력"> )<br>
              ③ $(6x - 9) \\\\div 3 =$ ( <input type="text" id="p22-q3" class="proof-input-text" style="width:100px;" placeholder="일차식 입력"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check22Submit()">✅ 제출 및 채점</button>
            <div id="p22-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-3': {
        mission: "<b>[3.2 개념학습] 동류항 대수 막대 타일 모으기</b><br>교과서 80쪽: 문자와 차수가 같은 항을 <b>동류항</b>이라 합니다. 좌측 타일 모으기를 실행해 보세요!",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>동류항:</b> 문자와 차수가 각각 같은 항끼리는 분배법칙을 이용해 묶어서 계수끼리 더하거나 뺍니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① 다음 중 $2x$ 와 동류항인 것은? ($3x, 2y, x^2$ 중): ( <input type="text" id="p23-like" class="proof-input-text" style="width:70px;" placeholder="동류항 입력"> )<br>
              ② $(4x + 3) + (2x - 5)$ 계산 결과: ( <input type="text" id="p23-sum" class="proof-input-text" style="width:110px;" placeholder="일차식 입력"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check23Submit()">✅ 제출 및 채점</button>
            <div id="p23-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-4': {
        mission: "<b>[3.2 형성평가] 일차식의 덧셈과 뺄셈</b><br>교과서 81~83쪽: 괄호 앞에 음의 부호가 있을 때는 부호를 반대로 바꾸어 괄호를 풀고 계산합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① $(5x - 2) - (2x - 6) =$ ( <input type="text" id="p24-q1" class="proof-input-text" style="width:110px;" placeholder="일차식 입력"> )<br>
              ② $\\\\frac{x+1}{2} - \\\\frac{x-2}{3} = \\\\frac{3(x+1) - 2(x-2)}{6} =$ ( <input type="text" id="p24-q2" class="proof-input-text" style="width:120px;" placeholder="분수 꼴 (예: (ax+b)/c)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check24Submit()">✅ 제출 및 3소단원 해금</button>
            <div id="p24-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-1': {
        mission: "<b>[3.3 생각열기] 방정식 vs 항등식 판별 저울</b><br>교과서 84쪽: 좌측 저울에서 $x$의 값을 슬라이더로 바꿔보며 방정식과 항등식의 차이를 발견하세요!",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              📖 <b>방정식 vs 항등식:</b><br>
              • <b>방정식</b>: 미지수의 값에 따라 참이 되기도 하고 거짓이 되기도 하는 등식<br>
              • <b>항등식</b>: 미지수에 어떤 수를 대입해도 항상 참이 되는 등식
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              다음 등식이 방정식인지 항등식인지 구별하여 쓰시오.<br>
              ① $2x = 6$ : ( <input type="text" id="p31-eq1" class="proof-input-text" style="width:100px;" placeholder="방정식 / 항등식"> )<br>
              ② $2x + 3x = 5x$ : ( <input type="text" id="p31-eq2" class="proof-input-text" style="width:100px;" placeholder="방정식 / 항등식"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check31Submit()">✅ 제출 및 채점</button>
            <div id="p31-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-2': {
        mission: "<b>[3.3 개념학습] 방정식의 해(근) 찾기</b><br>교과서 85~86쪽: 방정식을 참이 되게 하는 미지수의 값을 그 방정식의 <b>해</b> 또는 <b>근</b>이라 합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① 세 변의 길이가 $x, 3, 5$인 삼각형의 둘레의 길이가 11일 때의 등식:<br>
              &nbsp;&nbsp;&nbsp;( <input type="text" id="p32-eqn" class="proof-input-text" style="width:140px;" placeholder="등식 입력 (예: x+a=b)"> )<br>
              ② 위 삼각형 방정식의 해 $x$: ( <input type="text" id="p32-ans1" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )<br>
              ③ 방정식 $4 - 2x = 0$ 의 해 $x$: ( <input type="text" id="p32-ans2" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check32Submit()">✅ 제출 및 채점</button>
            <div id="p32-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-3': {
        mission: "<b>[3.3 개념학습] 등식의 성질 양팔 저울 실험실</b><br>교과서 88~89쪽: 좌측의 양팔 저울 버튼을 눌러 양변에 같은 수를 더하거나 빼거나 곱하거나 나누어 보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              ⚖️ <b>등식의 성질 4가지:</b> $a=b$ 이면<br>
              1) $a+c = b+c$ (같은 수를 더해도 성립)<br>
              2) $a-c = b-c$ (같은 수를 빼도 성립)<br>
              3) $ac = bc$ (같은 수를 곱해도 성립)<br>
              4) $\\\\frac{a}{c} = \\\\frac{b}{c}$ ($c \\\\neq 0$인 같은 수로 나누어도 성립)
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① $x - 3 = 5$ 에서 좌변에 $x$만 남기려면 양변에 얼마를 더해야 할까요? ( <input type="text" id="p33-add" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )<br>
              ② $2x = 10$ 에서 좌변에 $x$만 남기려면 양변을 얼마로 나누어야 할까요? ( <input type="text" id="p33-div" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check33Submit()">✅ 제출 및 채점</button>
            <div id="p33-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-4': {
        mission: "<b>[3.3 형성평가] 등식의 성질 OX 판별 퀴즈</b><br>교과서 90쪽: 등식의 성질이 올바르게 적용되었는지 OX로 판별하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              다음 설명이 옳으면 O, 옳지 않으면 X를 쓰시오.<br>
              ① $a=b$ 이면 $a - 3 = b - 3$ 이다: ( <input type="text" id="p34-q1" class="proof-input-text" style="width:50px;" placeholder="O 또는 X"> )<br>
              ② $ac = bc$ 이면 항상 $a = b$ 이다 ($c=0$일 때 주의): ( <input type="text" id="p34-q2" class="proof-input-text" style="width:50px;" placeholder="O 또는 X"> )<br>
              ③ $\\\\frac{a}{2} = \\\\frac{b}{3}$ 이면 양변에 6을 곱하여 $3a = 2b$ 이다: ( <input type="text" id="p34-q3" class="proof-input-text" style="width:50px;" placeholder="O 또는 X"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check34Submit()">✅ 제출 및 4소단원 해금</button>
            <div id="p34-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-1': {
        mission: "<b>[3.4 생각열기] 이항(移項) 애니메이션 시뮬레이터</b><br>교과서 92쪽: 등식의 성질을 이용하여 한 변에 있는 항의 부호를 바꾸어 다른 변으로 옮기는 것을 <b>이항</b>이라 합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              🚀 <b>이항 원리:</b> $5x - 2 = 2x + 3$<br>
              우변의 $+2x$가 좌변으로 넘어가면 $-2x$, 좌변의 $-2$가 우변으로 넘어가면 $+2$가 됩니다!
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① 방정식 $5x - 2 = 2x + 3$ 에서 $x$항은 좌변, 상수항은 우변으로 이항하여 $ax = b$ 꼴로 정리하시오:<br>
              &nbsp;&nbsp;&nbsp;( <input type="text" id="p41-eq" class="proof-input-text" style="width:100px;" placeholder="정리된 등식 (예: ax=b)"> )<br>
              ② 항을 다른 변으로 옮길 때 그 항의 부호는 어떻게 되나요? ( <input type="text" id="p41-prop" class="proof-input-text" style="width:140px;" placeholder="성질/설명 입력"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check41Submit()">✅ 제출 및 채점</button>
            <div id="p41-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-2': {
        mission: "<b>[3.4 개념학습] 일차방정식의 풀이 (괄호와 분수)</b><br>교과서 94~95쪽: 괄호가 있으면 분배법칙으로 풀고, 분수나 소수 계수는 정수로 고쳐서 풉니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              다음 일차방정식을 푸시오.<br>
              ① $3(x - 2) = x + 4$ 의 해 $x$: ( <input type="text" id="p42-q1" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )<br>
              ② $0.2x - 0.5 = 0.1x + 0.3$ 의 해 $x$: ( <input type="text" id="p42-q2" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check42Submit()">✅ 제출 및 채점</button>
            <div id="p42-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-3': {
        mission: "<b>[3.4 활용문제] 농구 경기 득점 문제 (교과서 96쪽)</b><br>시우는 농구 경기에서 3점 슛을 2점 슛의 2배보다 1개 더 많이 넣어 총 27점을 득점하였습니다. 2점 슛의 개수를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              2점 슛의 개수를 $x$개라 할 때:<br>
              ① 3점 슛의 개수를 $x$로 나타낸 식: ( <input type="text" id="p43-expr" class="proof-input-text" style="width:100px;" placeholder="일차식 입력"> ) 개<br>
              ② 총 득점 27점에 관한 일차방정식: ( <input type="text" id="p43-eqn" class="proof-input-text" style="width:160px;" placeholder="방정식 입력"> )<br>
              ③ 시우가 넣은 2점 슛의 개수 $x$: ( <input type="text" id="p43-cnt" class="proof-input-text" style="width:70px;" placeholder="개수 입력"> ) 개
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check43Submit()">✅ 제출 및 5소단원 해금</button>
            <div id="p43-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-1': {
        mission: "<b>[대단원 마무리] 3단원 문자와 식 스스로 마무리</b><br>교과서 98~101쪽: 핵심 개념인 문자의 사용, 일차식, 등식의 성질, 일차방정식을 종합 점검합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① 다항식 $\\\\frac{3x - 5}{2}$ 에서 $x$의 계수: ( <input type="text" id="p51-q1" class="proof-input-text" style="width:80px;" placeholder="분수 또는 소수"> )<br>
              ② 일차방정식 $2(x - 3) = -x + 6$ 의 해 $x$: ( <input type="text" id="p51-q2" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check51Submit()">🏆 대단원 평가 완료</button>
            <div id="p51-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-2': {
        mission: "<b>[창의융합 프로젝트] 생각한 수 맞추기 수학 마술사</b><br>교과서 102~103쪽: 어떤 수를 생각하더라도 항상 같은 결과가 나오는 대수 마술의 원리를 좌측 시뮬레이터로 증명해 보세요!",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              🎩 <b>수학 마술 규칙:</b><br>
              1) 수 $x$를 생각 $\\\\rightarrow$ 2) 4를 더함 ($x+4$) $\\\\rightarrow$ 3) 2를 곱함 ($2x+8$) $\\\\rightarrow$<br>
              4) 6을 뺌 ($2x+2$) $\\\\rightarrow$ 5) 2로 나눔 ($x+1$) $\\\\rightarrow$ 6) 처음 수 $x$를 뺌
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① 어떤 수를 생각하더라도 최종 결과는 항상 얼마가 나오나요? ( <input type="text" id="p52-res" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )<br>
              ② 처음 생각한 수 $x$와 무관하게 항상 일정한 값이 나오는 이유는 무엇인가요? ( <input type="text" id="p52-reason" class="proof-input-text" style="width:200px;" placeholder="이유/원리 설명"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check52Submit()">🎓 3단원 전체 마스터 인증</button>
            <div id="p52-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      }
    };
  `,
  canvasDrawersJs: `
    let currentTwoInstance = null;

    function drawSubstepCanvas(code, container) {
      if (!container) return;
      container.innerHTML = '';

      if (code === '0-1') {
        simBoxScale(container);
      } else if (code === '1-1') {
        simIcecreamReceipt(container);
      } else if (code === '1-3') {
        simBookGauge(container);
      } else if (code === '2-1') {
        simPolyStructure(container);
      } else if (code === '2-2') {
        simRectAreaDist(container);
      } else if (code === '2-3') {
        simLikeTermTiles(container);
      } else if (code === '3-1') {
        simEquationVsIdentity(container);
      } else if (code === '3-3') {
        simPropertiesOfEquality(container);
      } else if (code === '4-1') {
        simTransposition(container);
      } else if (code === '5-2') {
        simMathMagic(container);
      } else {
        renderDefaultConceptCanvas(code, container);
      }
    }

    // 0-1 초등 미지수 수평 저울
    function simBoxScale(container) {
      container.innerHTML = \`
        <div style="padding:16px; text-align:center;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">⚖️ [되짚어 보기] □를 사용한 수평 저울</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:14px;">왼쪽 접시: 3 × □ + 5 &nbsp;|&nbsp; 오른쪽 접시: 20</p>
          <div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:16px;">
            <span>□의 값 조절:</span>
            <input type="range" id="box-slider" min="1" max="10" value="3" style="width:160px;" oninput="updateBoxScale(this.value)">
            <span id="box-val-disp" style="font-weight:800; color:#4f46e5; width:30px;">3</span>
          </div>
          <div id="two-box-scale" style="width:100%; height:260px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;"></div>
          <div id="box-scale-status" style="margin-top:12px; font-weight:800; font-size:0.95rem; color:#dc2626;">기울어짐 (좌변 14 &lt; 우변 20)</div>
        </div>
      \`;

      const twoDiv = document.getElementById('two-box-scale');
      if (typeof Two === 'undefined') return;
      const two = new Two({ width: twoDiv.clientWidth || 500, height: 260 }).appendTo(twoDiv);
      currentTwoInstance = two;

      window.updateBoxScale = function(val) {
        const v = parseInt(val);
        document.getElementById('box-val-disp').innerText = v;
        const leftWeight = 3 * v + 5;
        const rightWeight = 20;
        const statusEl = document.getElementById('box-scale-status');

        two.clear();
        // Stand
        two.makePolygon(two.width / 2, 230, 40, 3);
        const diff = leftWeight - rightWeight;
        const angle = Math.max(-0.25, Math.min(0.25, diff * 0.03));

        // Beam
        const beamGroup = two.makeGroup();
        const beam = two.makeLine(-140, 0, 140, 0);
        beam.linewidth = 6;
        beam.stroke = '#475569';
        beamGroup.add(beam);

        // Pans
        const leftPan = two.makeLine(-140, 0, -140, 60);
        const leftPlate = two.makeLine(-170, 60, -110, 60);
        leftPlate.linewidth = 4; leftPlate.stroke = '#2563eb';
        beamGroup.add(leftPan, leftPlate);

        const rightPan = two.makeLine(140, 0, 140, 60);
        const rightPlate = two.makeLine(110, 60, 170, 60);
        rightPlate.linewidth = 4; rightPlate.stroke = '#059669';
        beamGroup.add(rightPan, rightPlate);

        beamGroup.translation.set(two.width / 2, 140);
        beamGroup.rotation = angle;

        two.update();

        if (leftWeight === rightWeight) {
          statusEl.innerText = "✨ 완벽한 수평 달성! (3 × 5 + 5 = 20)";
          statusEl.style.color = "#059669";
        } else if (leftWeight < rightWeight) {
          statusEl.innerText = \`기울어짐 (좌변 \${leftWeight} < 우변 20)\`;
          statusEl.style.color = "#dc2626";
        } else {
          statusEl.innerText = \`기울어짐 (좌변 \${leftWeight} > 우변 20)\`;
          statusEl.style.color = "#dc2626";
        }
      };

      window.updateBoxScale(3);
    }

    // 1-1 아이스크림 구매 영수증 시뮬레이터
    function simIcecreamReceipt(container) {
      container.innerHTML = \`
        <div style="padding:16px;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">🍦 [생각열기] 아이스크림 구매 영수증 계산기</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:14px;">1개 3500원인 아이스크림의 수량 $x$를 조절하여 영수증에 인쇄되는 식과 총액을 확인하세요.</p>
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <span>구매 개수 $x$:</span>
            <input type="range" id="ice-slider" min="1" max="10" value="4" style="width:160px;" oninput="updateReceipt(this.value)">
            <span id="ice-cnt-disp" style="font-weight:800; color:#4f46e5; width:30px;">4개</span>
          </div>
          <div style="background:#ffffff; border:2px dashed #94a3b8; border-radius:12px; padding:18px; max-width:360px; margin:0 auto; box-shadow:0 4px 12px rgba(0,0,0,0.04); font-family:monospace;">
            <div style="text-align:center; font-weight:800; font-size:1.1rem; border-bottom:1px solid #cbd5e1; padding-bottom:8px;">[ 영수증 / RECEIPT ]</div>
            <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:0.9rem;">
              <span>품목: 바닐라 아이스크림</span>
              <span>단가: 3,500원</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:0.9rem;">
              <span>수량 ($x$):</span>
              <span id="rcpt-qty" style="font-weight:700; color:#4f46e5;">4</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:0.95rem; border-top:1px dashed #cbd5e1; padding-top:8px;">
              <span>수량 관계식:</span>
              <span id="rcpt-expr" style="font-weight:800; color:#0284c7;">3500 × x = 3500x</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:1.05rem; font-weight:900; color:#1e293b; background:#f1f5f9; padding:6px 10px; border-radius:6px;">
              <span>합계 금액:</span>
              <span id="rcpt-total" style="color:#059669;">14,000 원</span>
            </div>
          </div>
        </div>
      \`;

      window.updateReceipt = function(val) {
        const v = parseInt(val);
        document.getElementById('ice-cnt-disp').innerText = v + '개';
        document.getElementById('rcpt-qty').innerText = v;
        document.getElementById('rcpt-expr').innerText = \`3500 × \${v} = 3500x\`;
        document.getElementById('rcpt-total').innerText = (v * 3500).toLocaleString() + ' 원';
      };
    }

    // 1-3 400쪽 독서 진행 게이지
    function simBookGauge(container) {
      container.innerHTML = \`
        <div style="padding:16px;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">📖 [교과서 74쪽] 400쪽 독서 진행 게이지와 대입</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:14px;">하루에 10쪽씩 $x$일 읽었을 때 남은 쪽수: $400 - 10x$ (쪽)</p>
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <span>독서 일수 $x$:</span>
            <input type="range" id="book-slider" min="0" max="40" value="5" style="width:180px;" oninput="updateBookGauge(this.value)">
            <span id="book-day-disp" style="font-weight:800; color:#4f46e5; width:40px;">5일</span>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:18px;">
            <div style="display:flex; justify-content:space-between; font-weight:800; margin-bottom:8px;">
              <span style="color:#2563eb;">읽은 쪽수: <span id="pages-read">50</span>쪽 ($10x$)</span>
              <span style="color:#ea580c;">남은 쪽수: <span id="pages-left">350</span>쪽 ($400 - 10x$)</span>
            </div>
            <div style="width:100%; height:28px; background:#fed7aa; border-radius:14px; overflow:hidden; display:flex;">
              <div id="read-bar" style="width:12.5%; height:100%; background:#3b82f6; transition:width 0.2s ease;"></div>
              <div id="left-bar" style="width:87.5%; height:100%; background:#f97316; transition:width 0.2s ease;"></div>
            </div>
            <div id="book-math-box" style="margin-top:14px; text-align:center; font-weight:700; color:#1e293b; background:#ffffff; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
              대입 계산: $400 - 10 \\\\times 5 = 400 - 50 = 350$ (쪽)
            </div>
          </div>
        </div>
      \`;

      window.updateBookGauge = function(val) {
        const d = parseInt(val);
        document.getElementById('book-day-disp').innerText = d + '일';
        const read = d * 10;
        const left = 400 - read;
        document.getElementById('pages-read').innerText = read;
        document.getElementById('pages-left').innerText = left;
        const pct = (read / 400) * 100;
        document.getElementById('read-bar').style.width = pct + '%';
        document.getElementById('left-bar').style.width = (100 - pct) + '%';
        document.getElementById('book-math-box').innerText = \`대입 계산: 400 - 10 × \${d} = 400 - \${read} = \${left} (쪽)\`;
      };
    }

    // 2-1 다항식 구조 카드 분해기
    function simPolyStructure(container) {
      container.innerHTML = \`
        <div style="padding:16px;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">🧩 [교과서 76~77쪽] 다항식 구조 카드 분해기</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:14px;">다항식 $-3x^2 + 5x - 7$을 각 항 카드로 분해하여 계수와 차수를 관찰하세요.</p>
          <div style="display:flex; justify-content:center; gap:16px; margin-bottom:18px;">
            <div id="card-term1" style="background:#eff6ff; border:2px solid #3b82f6; border-radius:10px; padding:14px 20px; text-align:center; min-width:110px;">
              <div style="font-size:1.2rem; font-weight:800; color:#1d4ed8;">$-3x^2$</div>
              <div style="font-size:0.8rem; color:#475569; margin-top:4px;">차수: 2차<br>계수: -3</div>
            </div>
            <div id="card-term2" style="background:#f0fdf4; border:2px solid #22c55e; border-radius:10px; padding:14px 20px; text-align:center; min-width:110px;">
              <div style="font-size:1.2rem; font-weight:800; color:#15803d;">$+5x$</div>
              <div style="font-size:0.8rem; color:#475569; margin-top:4px;">차수: 1차<br>계수: 5</div>
            </div>
            <div id="card-term3" style="background:#fef2f2; border:2px solid #ef4444; border-radius:10px; padding:14px 20px; text-align:center; min-width:110px;">
              <div style="font-size:1.2rem; font-weight:800; color:#b91c1c;">$-7$</div>
              <div style="font-size:0.8rem; color:#475569; margin-top:4px;">상수항<br>수만으로 됨</div>
            </div>
          </div>
          <div style="display:flex; justify-content:center; gap:8px;">
            <button class="btn btn-outline" style="padding:6px 12px; font-size:0.82rem;" onclick="highlightPoly('coef')">🔍 계수 강조</button>
            <button class="btn btn-outline" style="padding:6px 12px; font-size:0.82rem;" onclick="highlightPoly('const')">🔍 상수항 강조</button>
            <button class="btn btn-outline" style="padding:6px 12px; font-size:0.82rem;" onclick="highlightPoly('deg')">🔍 다항식의 최고차수(2차)</button>
          </div>
          <div id="poly-inspect-res" style="margin-top:12px; text-align:center; font-weight:700; color:#4f46e5; min-height:24px;"></div>
        </div>
      \`;

      window.highlightPoly = function(type) {
        const res = document.getElementById('poly-inspect-res');
        if (type === 'coef') {
          res.innerText = "$x^2$의 계수는 -3, $x$의 계수는 5입니다.";
        } else if (type === 'const') {
          res.innerText = "상수항은 부호를 포함하여 -7입니다.";
        } else if (type === 'deg') {
          res.innerText = "차수가 가장 큰 항이 $-3x^2$(2차)이므로 이 식은 2차 다항식입니다.";
        }
      };
    }

    // 2-2 직사각형 면적 모델 분배법칙
    function simRectAreaDist(container) {
      container.innerHTML = \`
        <div style="padding:16px;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">📐 [교과서 78쪽] 직사각형 면적 모델과 분배법칙</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:14px;">세로가 3이고 가로가 $x + 2$인 직사각형의 전체 넓이는 각 조각 넓이의 합과 같습니다.</p>
          <div style="display:flex; justify-content:center; margin-bottom:14px;">
            <div style="display:flex; border:2px solid #334155; border-radius:8px; overflow:hidden; text-align:center; font-weight:800;">
              <div style="width:140px; height:100px; background:#dbeafe; display:flex; flex-direction:column; justify-content:center; border-right:2px dashed #3b82f6;">
                <span style="font-size:0.8rem; color:#1e40af;">가로: $x$, 세로: 3</span>
                <span style="font-size:1.1rem; color:#1d4ed8;">넓이 $3x$</span>
              </div>
              <div style="width:100px; height:100px; background:#dcfce7; display:flex; flex-direction:column; justify-content:center;">
                <span style="font-size:0.8rem; color:#166534;">가로: 2, 세로: 3</span>
                <span style="font-size:1.1rem; color:#15803d;">넓이 $6$</span>
              </div>
            </div>
          </div>
          <div style="text-align:center; background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-weight:700;">
            전체 직사각형 넓이: $3(x + 2) = 3 \\\\times x + 3 \\\\times 2 = 3x + 6$
          </div>
        </div>
      \`;
    }

    // 2-3 동류항 대수 막대 타일 모으기
    function simLikeTermTiles(container) {
      container.innerHTML = \`
        <div style="padding:16px;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">🟩 [교과서 80쪽] 동류항 대수 타일 모으기</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:12px;">식 $(4x + 3) + (2x - 5)$ 의 동류항들을 대수 타일로 묶어 정리하세요.</p>
          <div style="display:flex; justify-content:center; gap:8px; margin-bottom:12px;">
            <button class="btn btn-outline" style="padding:6px 12px; font-size:0.82rem;" onclick="setLikeTiles('split')">타일 나열하기</button>
            <button class="btn btn-primary" style="padding:6px 12px; font-size:0.82rem;" onclick="setLikeTiles('merge')">동류항끼리 모으기</button>
          </div>
          <div id="like-tiles-board" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; min-height:120px; display:flex; flex-wrap:wrap; gap:8px; align-items:center; justify-content:center;"></div>
          <div id="like-tiles-result" style="text-align:center; font-weight:800; margin-top:10px; color:#1e293b;"></div>
        </div>
      \`;

      window.setLikeTiles = function(mode) {
        const board = document.getElementById('like-tiles-board');
        const res = document.getElementById('like-tiles-result');
        board.innerHTML = '';

        if (mode === 'split') {
          board.innerHTML = \`
            <div style="display:flex; gap:4px; align-items:center;">
              <span style="background:#86efac; color:#166534; padding:6px 12px; border-radius:4px; font-weight:700;">4x</span>
              <span style="background:#fde047; color:#854d0e; padding:6px 10px; border-radius:4px; font-weight:700;">+3</span>
              <span style="margin:0 4px; font-weight:800;">+</span>
              <span style="background:#86efac; color:#166534; padding:6px 12px; border-radius:4px; font-weight:700;">2x</span>
              <span style="background:#fca5a5; color:#991b1b; padding:6px 10px; border-radius:4px; font-weight:700;">-5</span>
            </div>
          \`;
          res.innerText = "각 항이 흩어져 있는 상태: (4x + 3) + (2x - 5)";
        } else {
          board.innerHTML = \`
            <div style="display:flex; gap:8px; align-items:center;">
              <div style="border:2px solid #22c55e; border-radius:8px; padding:8px 12px; background:#f0fdf4;">
                <div style="font-size:0.75rem; color:#166534; font-weight:700;">x 동류항 묶음</div>
                <span style="font-size:1.1rem; font-weight:800; color:#15803d;">(4 + 2)x = 6x</span>
              </div>
              <div style="border:2px solid #ef4444; border-radius:8px; padding:8px 12px; background:#fef2f2;">
                <div style="font-size:0.75rem; color:#991b1b; font-weight:700;">상수항 묶음</div>
                <span style="font-size:1.1rem; font-weight:800; color:#b91c1c;">(+3 - 5) = -2</span>
              </div>
            </div>
          \`;
          res.innerText = "✨ 동류항 합산 결과: 6x - 2";
          res.style.color = "#059669";
        }
      };

      window.setLikeTiles('split');
    }

    // 3-1 방정식 vs 항등식 판별 저울
    function simEquationVsIdentity(container) {
      container.innerHTML = \`
        <div style="padding:16px; text-align:center;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">⚖️ [교과서 84쪽] 방정식 vs 항등식 판별 저울</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:14px;">$x$ 슬라이더를 움직여 두 저울의 반응을 비교해 보세요.</p>
          <div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:14px;">
            <span>$x$의 값:</span>
            <input type="range" id="eq-x-slider" min="0" max="6" value="2" style="width:160px;" oninput="updateEqScale(this.value)">
            <span id="eq-x-disp" style="font-weight:800; color:#4f46e5; width:30px;">2</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div style="background:#ffffff; border:2px solid #cbd5e1; border-radius:10px; padding:12px;">
              <div style="font-weight:800; color:#2563eb; margin-bottom:6px;">저울 A: $2x = 6$</div>
              <div id="scaleA-status" style="font-size:0.88rem; font-weight:700; color:#dc2626;">좌변 4 ≠ 우변 6 (기울어짐)</div>
              <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">오직 $x=3$일 때만 참 ➔ <b>방정식</b></div>
            </div>
            <div style="background:#ffffff; border:2px solid #cbd5e1; border-radius:10px; padding:12px;">
              <div style="font-weight:800; color:#059669; margin-bottom:6px;">저울 B: $2x + 3x = 5x$</div>
              <div id="scaleB-status" style="font-size:0.88rem; font-weight:700; color:#059669;">좌변 10 = 우변 10 (항상 평형!)</div>
              <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">모든 $x$에 대해 항상 참 ➔ <b>항등식</b></div>
            </div>
          </div>
        </div>
      \`;

      window.updateEqScale = function(val) {
        const x = parseInt(val);
        document.getElementById('eq-x-disp').innerText = x;
        const sA = document.getElementById('scaleA-status');
        const sB = document.getElementById('scaleB-status');

        if (2 * x === 6) {
          sA.innerText = \`좌변 6 = 우변 6 (평형! 참)\`;
          sA.style.color = '#059669';
        } else {
          sA.innerText = \`좌변 \${2*x} ≠ 우변 6 (기울어짐/거짓)\`;
          sA.style.color = '#dc2626';
        }

        sB.innerText = \`좌변 \${5*x} = 우변 \${5*x} (항상 평형!)\`;
      };
    }

    // 3-3 등식의 성질 양팔 저울 실험실
    function simPropertiesOfEquality(container) {
      container.innerHTML = \`
        <div style="padding:16px; text-align:center;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">⚖️ [교과서 88~89쪽] 등식의 성질 양팔 저울 실험실</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:12px;">방정식 $x - 3 = 5$ 에서 좌변에 $x$만 남기기 위한 연산을 실행하세요.</p>
          <div style="background:#eff6ff; border:2px solid #bfdbfe; border-radius:10px; padding:14px; margin-bottom:14px;">
            <div style="font-size:1.2rem; font-weight:900; color:#1e40af;" id="scale-prop-equation">$x - 3 = 5$</div>
            <div id="scale-prop-desc" style="font-size:0.85rem; color:#475569; margin-top:6px;">현재 상태: 저울 평형 유지 중</div>
          </div>
          <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-primary" style="padding:8px 14px; font-size:0.85rem;" onclick="applyProp('add3')">양변에 3 더하기 (+3)</button>
            <button class="btn btn-outline" style="padding:8px 14px; font-size:0.85rem;" onclick="applyProp('sub3')">양변에서 3 빼기 (-3)</button>
            <button class="btn btn-outline" style="padding:8px 14px; font-size:0.85rem;" onclick="applyProp('reset')">처음으로 초기화</button>
          </div>
        </div>
      \`;

      window.applyProp = function(act) {
        const eqEl = document.getElementById('scale-prop-equation');
        const descEl = document.getElementById('scale-prop-desc');
        if (act === 'add3') {
          eqEl.innerText = "$x = 8$";
          descEl.innerText = "✨ 양변에 같은 수 3을 더하여 좌변의 -3을 상쇄! 해는 x = 8 입니다.";
          descEl.style.color = "#059669";
        } else if (act === 'sub3') {
          eqEl.innerText = "$x - 6 = 2$";
          descEl.innerText = "양변에서 3을 빼도 평형은 유지되지만, 좌변이 복잡해집니다.";
          descEl.style.color = "#ea580c";
        } else {
          eqEl.innerText = "$x - 3 = 5$";
          descEl.innerText = "현재 상태: 저울 평형 유지 중";
          descEl.style.color = "#475569";
        }
      };
    }

    // 4-1 이항 애니메이션 시뮬레이터
    function simTransposition(container) {
      container.innerHTML = \`
        <div style="padding:16px; text-align:center;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">🚀 [교과서 92쪽] 이항(移項) 애니메이션 시뮬레이터</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:14px;">방정식 $5x - 2 = 2x + 3$ 에서 $x$항은 좌변으로, 상수항은 우변으로 넘겨보세요.</p>
          <div id="trans-board" style="background:#ffffff; border:2px solid #cbd5e1; border-radius:12px; padding:20px; min-height:80px; display:flex; justify-content:center; align-items:center; gap:8px; font-size:1.3rem; font-weight:900; margin-bottom:14px;">
            <span id="t-5x" style="color:#2563eb;">5x</span>
            <span id="t-m2" style="color:#ef4444;">- 2</span>
            <span>=</span>
            <span id="t-2x" style="color:#16a34a;">2x</span>
            <span id="t-p3" style="color:#d97706;">+ 3</span>
          </div>
          <button class="btn btn-primary" style="padding:10px 20px; font-weight:800;" onclick="runTranspositionAnim()">🚀 이항 실행 (부호 반전 넘기기)</button>
          <div id="trans-result-desc" style="margin-top:12px; font-weight:700; color:#475569;">버튼을 누르면 우변의 +2x와 좌변의 -2가 반대편으로 이동합니다.</div>
        </div>
      \`;

      window.runTranspositionAnim = function() {
        const board = document.getElementById('trans-board');
        const desc = document.getElementById('trans-result-desc');
        board.innerHTML = \`
          <span style="color:#2563eb;">5x</span>
          <span style="color:#16a34a; background:#dcfce7; padding:2px 6px; border-radius:4px;">- 2x</span>
          <span>=</span>
          <span style="color:#d97706;">3</span>
          <span style="color:#ef4444; background:#fee2e2; padding:2px 6px; border-radius:4px;">+ 2</span>
          <span>➔</span>
          <span style="color:#4f46e5; font-weight:900;">3x = 5</span>
        \`;
        desc.innerText = "✨ 이항 완료: 우변 2x ➔ 좌변 -2x, 좌변 -2 ➔ 우변 +2 (정리 결과: 3x = 5)";
        desc.style.color = "#059669";
      };
    }

    // 5-2 생각한 수 맞추기 수학 마술사
    function simMathMagic(container) {
      container.innerHTML = \`
        <div style="padding:16px; text-align:center;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">🎩 [교과서 102쪽] 생각한 수 맞추기 수학 마술사</h4>
          <p style="font-size:0.88rem; color:#64748b; margin-bottom:14px;">원하는 아무 자연수를 입력하고 [마술 쇼 시작]을 눌러보세요!</p>
          <div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-bottom:14px;">
            <span>생각한 수 ($x$):</span>
            <input type="number" id="magic-input-x" min="1" max="999" value="7" style="width:80px; padding:6px; font-weight:800; text-align:center; border:2px solid #cbd5e1; border-radius:6px;">
            <button class="btn btn-primary" style="padding:8px 16px; font-weight:800;" onclick="runMathMagicShow()">✨ 마술 실행</button>
          </div>
          <div id="magic-step-container" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-top:12px;"></div>
          <div id="magic-conclusion" style="margin-top:14px; font-size:1.1rem; font-weight:900; color:#4f46e5;"></div>
        </div>
      \`;

      window.runMathMagicShow = function() {
        const x = parseInt(document.getElementById('magic-input-x').value) || 7;
        const container = document.getElementById('magic-step-container');
        const conc = document.getElementById('magic-conclusion');

        const steps = [
          { name: "1단계: 수 생각하기", math: "x", num: x },
          { name: "2단계: 4 더하기", math: "x + 4", num: x + 4 },
          { name: "3단계: 2 곱하기", math: "2x + 8", num: (x + 4) * 2 },
          { name: "4단계: 6 빼기", math: "2x + 2", num: (x + 4) * 2 - 6 },
          { name: "5단계: 2로 나누기", math: "x + 1", num: ((x + 4) * 2 - 6) / 2 },
          { name: "6단계: 처음 수 x 빼기", math: "1", num: 1 }
        ];

        container.innerHTML = steps.map((s, idx) => \`
          <div style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:8px; padding:10px; text-align:center;">
            <div style="font-size:0.75rem; color:#64748b; font-weight:700;">\${s.name}</div>
            <div style="font-size:0.85rem; color:#2563eb; font-weight:800; margin:4px 0;">대수식: \${s.math}</div>
            <div style="font-size:1.05rem; font-weight:900; color:#1e293b;">값: \${s.num}</div>
          </div>
        \`).join('');

        conc.innerText = \`🎉 당신이 처음 생각한 수가 \${x}이든 어떤 수이든, 최종 마술 결과는 항상 1입니다!\`;
      };

      window.runMathMagicShow();
    }

    function renderDefaultConceptCanvas(code, container) {
      container.innerHTML = \`
        <div style="padding:24px; text-align:center; color:#475569;">
          <h4 style="font-weight:800; color:#1e293b; margin-bottom:8px;">📐 3단원 문자와 식 탐구 실험실</h4>
          <p style="font-size:0.9rem;">우측의 질문을 읽고 탐구 활동을 진행해 보세요.</p>
        </div>
      \`;
    }
  `,
  validationHandlersJs: `
    function normTxt(v) {
      return v ? v.trim().replace(/\\s+/g, '').toUpperCase() : '';
    }

    function check01Submit() {
      const mid = normTxt(document.getElementById('p01-mid').value);
      const box = normTxt(document.getElementById('p01-box').value);
      const err = document.getElementById('p01-err');

      if (mid === '15' && box === '5') {
        err.style.display = 'none';
        renderVerifiedAnswerView('수평 저울 탐구 성공!', '3 × □ = 15 이므로 □ = 5 임을 바르게 구했습니다.', '0-2');
      } else {
        err.innerText = "오답입니다. 3 × □ + 5 = 20 에서 3 × □ = 15 이므로 □의 값을 다시 확인하세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check02Submit() {
      const ratio = normTxt(document.getElementById('p02-ratio').value);
      const err = document.getElementById('p02-err');

      if (ratio === '2/5' || ratio === '0.4' || ratio === '20/50') {
        err.style.display = 'none';
        renderVerifiedAnswerView('비와 비율 마스터!', '50명 중 20명의 비율은 2/5 (0.4) 입니다.', '0-3');
      } else {
        err.innerText = "오답입니다. 전체 회원 수에 대한 남학생 수의 비율(20/50)을 기약분수로 나타내 보세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check03Submit() {
      const num = normTxt(document.getElementById('p03-num').value);
      const err = document.getElementById('p03-err');

      if (num === '5') {
        err.style.display = 'none';
        renderVerifiedAnswerView('거꾸로 계산하기 마스터!', '어떤 수 □는 5 입니다. 3단원 본격 탐구를 시작합니다!', '1-1');
      } else {
        err.innerText = "오답입니다. 거꾸로 27 ÷ 3 = 9 에서 4를 빼보세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check11Submit() {
      const ice = normTxt(document.getElementById('p11-ice').value);
      const order = normTxt(document.getElementById('p11-order').value);
      const err = document.getElementById('p11-err');

      const isIceOk = (ice === '3500X' || ice === '3500*X' || ice === '3,500X');
      const isOrderOk = (order === '3500A+5000B' || order === '5000B+3500A' || order === '3500*A+5000*B');

      if (isIceOk && isOrderOk) {
        err.style.display = 'none';
        renderVerifiedAnswerView('문자의 사용 생각열기 성공!', '아이스크림 금액: 3500x원, 총 주문 금액: (3500a + 5000b)원', '1-2');
      } else {
        err.innerText = "오답입니다. 곱셈 기호를 생략하여 3500x, 3500a+5000b 형식으로 작성하세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check12Submit() {
      const q1 = normTxt(document.getElementById('p12-q1').value);
      const q2 = normTxt(document.getElementById('p12-q2').value);
      const q3 = normTxt(document.getElementById('p12-q3').value);
      const err = document.getElementById('p12-err');

      const ok1 = (q1 === '-3AB' || q1 === '-3BA');
      const ok2 = (q2 === 'X/5' || q2 === '1/5X');
      const ok3 = (q3 === '2(X+Y)/3' || q3 === '2/3(X+Y)' || q3 === '(2X+2Y)/3');

      if (ok1 && ok2 && ok3) {
        err.style.display = 'none';
        renderVerifiedAnswerView('기호 생략 규칙 마스터!', '-3ab, x/5, 2(x+y)/3', '1-3');
      } else {
        err.innerText = "오답입니다. 수는 문자 앞에, 나눗셈은 분모로 보내어 다시 표현해 보세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check13Submit() {
      const expr = normTxt(document.getElementById('p13-expr').value);
      const val = normTxt(document.getElementById('p13-val').value);
      const err = document.getElementById('p13-err');

      const okExpr = (expr === '400-10X' || expr === '-10X+400');
      const okVal = (val === '350');

      if (okExpr && okVal) {
        err.style.display = 'none';
        renderVerifiedAnswerView('식의 값과 대입 마스터!', '남은 쪽수 식: 400 - 10x, x=5일 때 남은 쪽수: 350쪽', '1-4');
      } else {
        err.innerText = "오답입니다. 전체 400쪽에서 읽은 쪽수(10x)를 빼는 식과 x=5 대입값을 확인하세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check14Submit() {
      const q1 = normTxt(document.getElementById('p14-q1').value);
      const q2 = normTxt(document.getElementById('p14-q2').value);
      const err = document.getElementById('p14-err');

      if (q1 === '21' && q2 === '3') {
        err.style.display = 'none';
        renderVerifiedAnswerView('실생활 식의 값 계산 완수!', '3a^2 - 4a + 1 = 21, 3km 정상 기온 = 3℃', '2-1');
      } else {
        err.innerText = "오답입니다. (-2)^2 = 4, -4*(-2) = +8 임을 유의하여 계산하세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check21Submit() {
      const coef = normTxt(document.getElementById('p21-coef').value);
      const cst = normTxt(document.getElementById('p21-const').value);
      const deg = normTxt(document.getElementById('p21-deg').value);
      const isLin = normTxt(document.getElementById('p21-islinear').value);
      const err = document.getElementById('p21-err');

      const okCoef = (coef === '5' || coef === '+5');
      const okCst = (cst === '-7');
      const okDeg = (deg === '2' || deg === '2차');
      const okLin = (isLin === '예' || isLin === 'O');

      if (okCoef && okCst && okDeg && okLin) {
        err.style.display = 'none';
        renderVerifiedAnswerView('다항식 구조 분해 마스터!', 'x 계수: 5, 상수항: -7, 차수: 2차, 2x-4는 일차식', '2-2');
      } else {
        err.innerText = "오답입니다. x의 계수는 5, 상수항은 -7, 최고차수는 2차이며, 2x-4는 일차식이 맞습니다.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check22Submit() {
      const q1 = normTxt(document.getElementById('p22-q1').value);
      const q2 = normTxt(document.getElementById('p22-q2').value);
      const q3 = normTxt(document.getElementById('p22-q3').value);
      const err = document.getElementById('p22-err');

      const ok1 = (q1 === '6X');
      const ok2 = (q2 === '-8X+12' || q2 === '12-8X');
      const ok3 = (q3 === '2X-3');

      if (ok1 && ok2 && ok3) {
        err.style.display = 'none';
        renderVerifiedAnswerView('직사각형 면적 모델과 분배법칙!', '6x, -8x + 12, 2x - 3', '2-3');
      } else {
        err.innerText = "오답입니다. 분배법칙 전개 시 부호(-4 × -3 = +12)에 유의하세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check23Submit() {
      const like = normTxt(document.getElementById('p23-like').value);
      const sum = normTxt(document.getElementById('p23-sum').value);
      const err = document.getElementById('p23-err');

      const okLike = (like === '3X');
      const okSum = (sum === '6X-2' || sum === '-2+6X');

      if (okLike && okSum) {
        err.style.display = 'none';
        renderVerifiedAnswerView('동류항 대수 타일 모으기 마스터!', '2x의 동류항: 3x, 동류항 합: 6x - 2', '2-4');
      } else {
        err.innerText = "오답입니다. 문자와 차수가 모두 같아야 동류항입니다. 동류항끼리 묶어 계산해 보세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check24Submit() {
      const q1 = normTxt(document.getElementById('p24-q1').value);
      const q2 = normTxt(document.getElementById('p24-q2').value);
      const err = document.getElementById('p24-err');

      const ok1 = (q1 === '3X+4' || q1 === '4+3X');
      const ok2 = (q2 === '(X+7)/6' || q2 === 'X/6+7/6' || q2 === '1/6X+7/6' || q2 === '(1X+7)/6');

      if (ok1 && ok2) {
        err.style.display = 'none';
        renderVerifiedAnswerView('일차식의 덧셈과 뺄셈 마스터!', '(5x-2)-(2x-6) = 3x+4, 통분 계산: (x+7)/6', '3-1');
      } else {
        err.innerText = "오답입니다. -(2x - 6) = -2x + 6 으로 부호가 바뀌는 점을 확인하세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check31Submit() {
      const eq1 = normTxt(document.getElementById('p31-eq1').value);
      const eq2 = normTxt(document.getElementById('p31-eq2').value);
      const err = document.getElementById('p31-err');

      const ok1 = (eq1 === '방정식');
      const ok2 = (eq2 === '항등식');

      if (ok1 && ok2) {
        err.style.display = 'none';
        renderVerifiedAnswerView('방정식 vs 항등식 판별 성공!', '2x=6은 방정식, 2x+3x=5x는 항등식', '3-2');
      } else {
        err.innerText = "오답입니다. x값에 따라 참/거짓이 달라지면 방정식, 항상 참이면 항등식입니다.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check32Submit() {
      const eqn = normTxt(document.getElementById('p32-eqn').value);
      const a1 = normTxt(document.getElementById('p32-ans1').value);
      const a2 = normTxt(document.getElementById('p32-ans2').value);
      const err = document.getElementById('p32-err');

      const okEqn = (eqn === 'X+8=11' || eqn === 'X+3+5=11' || eqn === '8+X=11');
      const okA1 = (a1 === '3');
      const okA2 = (a2 === '2');

      if (okEqn && okA1 && okA2) {
        err.style.display = 'none';
        renderVerifiedAnswerView('방정식의 해(근) 찾기 성공!', '삼각형 둘레 식: x+8=11 (해: 3), 4-2x=0 (해: 2)', '3-3');
      } else {
        err.innerText = "오답입니다. 둘레의 합 x + 3 + 5 = 11 을 세우고 참이 되는 x를 구해보세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check33Submit() {
      const add = normTxt(document.getElementById('p33-add').value);
      const div = normTxt(document.getElementById('p33-div').value);
      const err = document.getElementById('p33-err');

      if (add === '3' && div === '2') {
        err.style.display = 'none';
        renderVerifiedAnswerView('등식의 성질 양팔 저울 실험 마스터!', 'x-3=5에서 양변에 3 더하기, 2x=10에서 양변을 2로 나누기', '3-4');
      } else {
        err.innerText = "오답입니다. -3을 없애려면 양변에 +3, 2x에서 x만 남기려면 양변을 2로 나누어야 합니다.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check34Submit() {
      const q1 = normTxt(document.getElementById('p34-q1').value);
      const q2 = normTxt(document.getElementById('p34-q2').value);
      const q3 = normTxt(document.getElementById('p34-q3').value);
      const err = document.getElementById('p34-err');

      if (q1 === 'O' && q2 === 'X' && q3 === 'O') {
        err.style.display = 'none';
        renderVerifiedAnswerView('등식의 성질 OX 퀴즈 마스터!', '1: O, 2: X (c=0 주의), 3: O', '4-1');
      } else {
        err.innerText = "오답입니다. ac=bc에서 c=0인 반례(예: 3×0 = 5×0)를 생각해 보세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check41Submit() {
      const eq = normTxt(document.getElementById('p41-eq').value);
      const prop = normTxt(document.getElementById('p41-prop').value);
      const err = document.getElementById('p41-err');

      const okEq = (eq === '3X=5' || eq === '3*X=5');
      const okProp = (prop.includes('반대') || prop.includes('바뀐') || prop.includes('부호') || prop.includes('바꿈'));

      if (okEq && okProp) {
        err.style.display = 'none';
        renderVerifiedAnswerView('이항(移項) 애니메이션 마스터!', '이항 후 식: 3x = 5, 항을 옮기면 부호가 반대로 바뀐다', '4-2');
      } else {
        err.innerText = "오답입니다. 5x - 2x = 3 + 2 정리 결과(3x=5)와 '부호가 바뀐다'는 성질을 적어주세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check42Submit() {
      const q1 = normTxt(document.getElementById('p42-q1').value);
      const q2 = normTxt(document.getElementById('p42-q2').value);
      const err = document.getElementById('p42-err');

      if (q1 === '5' && q2 === '8') {
        err.style.display = 'none';
        renderVerifiedAnswerView('일차방정식의 풀이 마스터!', '3(x-2)=x+4의 해: 5, 0.2x-0.5=0.1x+0.3의 해: 8', '4-3');
      } else {
        err.innerText = "오답입니다. 1번은 2x=10, 2번은 양변에 10을 곱해 2x-5=x+3으로 풀어보세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check43Submit() {
      const expr = normTxt(document.getElementById('p43-expr').value);
      const eqn = normTxt(document.getElementById('p43-eqn').value);
      const cnt = normTxt(document.getElementById('p43-cnt').value);
      const err = document.getElementById('p43-err');

      const okExpr = (expr === '2X+1' || expr === '1+2X');
      const okEqn = (eqn === '2X+3(2X+1)=27' || eqn === '2X+6X+3=27' || eqn === '8X+3=27' || eqn === '2X+3*(2X+1)=27');
      const okCnt = (cnt === '3');

      if (okExpr && okEqn && okCnt) {
        err.style.display = 'none';
        renderVerifiedAnswerView('농구 득점 활용 문제 해결!', '3점 슛: 2x+1개, 방정식: 2x+3(2x+1)=27, 2점 슛: 3개', '5-1');
      } else {
        err.innerText = "오답입니다. 3점 슛은 (2x+1)개, 총 점수는 2x + 3(2x+1) = 27 입니다.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check51Submit() {
      const q1 = normTxt(document.getElementById('p51-q1').value);
      const q2 = normTxt(document.getElementById('p51-q2').value);
      const err = document.getElementById('p51-err');

      const ok1 = (q1 === '3/2' || q1 === '1.5');
      const ok2 = (q2 === '4');

      if (ok1 && ok2) {
        err.style.display = 'none';
        renderVerifiedAnswerView('3단원 스스로 마무리 완수!', 'x의 계수: 3/2, 일차방정식의 해: 4', '5-2');
      } else {
        err.innerText = "오답입니다. 1번은 (3/2)x - 5/2 이므로 계수는 3/2, 2번은 3x=12 이므로 x=4 입니다.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

    function check52Submit() {
      const res = normTxt(document.getElementById('p52-res').value);
      const reason = normTxt(document.getElementById('p52-reason').value);
      const err = document.getElementById('p52-err');

      const okRes = (res === '1');
      const okReason = (reason.includes('소거') || reason.includes('사라') || reason.includes('없어') || reason.includes('상쇄') || reason.includes('X가'));

      if (okRes && okReason) {
        err.style.display = 'none';
        renderVerifiedAnswerView('🏆 3단원 문자와 식 전체 마스터 달성!', '마술 결과: 항상 1, 미지수 x가 소거되기 때문', '5-2');
      } else {
        err.innerText = "오답입니다. 최종 결과는 1이며, '미지수 x가 소거되기 때문'이라는 원리를 적어주세요.";
        err.style.display = 'block';
        if (window.SoundFX && window.SoundFX.error) window.SoundFX.error();
      }
    }

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
    window.check24Submit = check24Submit;
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

const fullHtml = createChapterHtml(ch3Config);
fs.writeFileSync('g1_ch3_equations.html', fullHtml, 'utf8');
console.log('✅ g1_ch3_equations.html: successfully generated with 10 interactive simulators and master_template!');
