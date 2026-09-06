const fs = require('fs');
const path = require('path');
const { createChapterHtml } = require('./master_template.js');

const ch6Config = {
  chapterNum: 6,
  chapterTitle: '6. 평면도형',
  chapterBadge: '중1 수학 6단원',
  mainTabs: [
    '0. 되짚어 보기',
    '6.1 다각형의 각',
    '6.2 내각의 합과 외각의 합',
    '6.3 다각형의 대각선',
    '6.4 원과 부채꼴',
    '6.5 부채꼴의 호·넓이 & 테셀레이션'
  ],
  pillsConfig: {
    0: [
      { code: '0-1', label: '1. 원주율(π) 굴리기 시뮬레이터' },
      { code: '0-2', label: '2. 다각형 둘레와 넓이 (초등 5)' },
      { code: '0-3', label: '3. 정다각형의 성질 (초등 4)' }
    ],
    1: [
      { code: '1-1', label: '1. 삼각형 외각 찢어 붙이기 인터랙터' },
      { code: '1-2', label: '2. 삼각형 한 외각의 공식 계산' },
      { code: '1-3', label: '3. 부메랑 사각형 외각 변형기' },
      { code: '1-4', label: '4. 오각별 꼭짓점 각의 합 증명' }
    ],
    2: [
      { code: '2-1', label: '1. 한 꼭짓점 대각선 삼각형 분할기' },
      { code: '2-2', label: '2. 다각형 내각의 크기의 합 계산' },
      { code: '2-3', label: '3. 다각형 축소 외각 360° 합체기' },
      { code: '2-4', label: '4. 정다각형 한 내각과 한 외각 크기' }
    ],
    3: [
      { code: '3-1', label: '1. n각형 대각선 연결망 탐색기' },
      { code: '3-2', label: '2. 다각형 대각선의 총 개수 계산' },
      { code: '3-3', label: '3. 대각선 개수로 n각형 알아맞히기' }
    ],
    4: [
      { code: '4-1', label: '1. 부채꼴 vs 활꼴 인터랙티브 해부도' },
      { code: '4-2', label: '2. 호·현·중심각 기호와 정의' },
      { code: '4-3', label: '3. 중심각 vs 호·넓이·현 정비례 검증기' }
    ],
    5: [
      { code: '5-1', label: '1. 부채꼴 부채 펼치기 & 직사각형 변환' },
      { code: '5-2', label: '2. 부채꼴 호의 길이와 넓이 계산' },
      { code: '5-3', label: '3. 정다각형 테셀레이션 평면 채우기' }
    ]
  },
  substepDataJs: `
    const SUBSTEP_CONFIG = {
      '0-1': {
        mission: "<b>[되짚어 보기 1] 원주율(π)의 뜻과 원의 둘레</b><br>교과서 178쪽: 좌측의 원 굴리기 시뮬레이터를 관찰하며, 원의 지름에 대한 원의 둘레(원주)의 비율을 나타내는 값과 기호를 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              원의 둘레(원주)와 지름 사이의 관계를 입력하세요.<br>
              • 원의 지름에 대한 둘레의 비율을 나타내는 그리스 문자 기호는? ( <input type="text" id="p01-pi" class="proof-input-text" style="width:100px;" placeholder="기호 (예: π 또는 원주율)"> )<br>
              • 지름이 10 cm인 원의 둘레(원주율을 3.14로 계산)는? ( <input type="text" id="p01-val" class="proof-input-text" style="width:90px;" placeholder="둘레 길이 (숫자)"> ) cm
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check01Submit()">✅ 제출 및 채점</button>
            <div id="p01-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-2': {
        mission: "<b>[되짚어 보기 2] 다각형의 둘레와 넓이 (초등 5학년)</b><br>교과서 178쪽: 가로 6 cm, 세로 4 cm인 직사각형의 둘레와, 밑변 8 cm, 높이 5 cm인 삼각형의 넓이를 각각 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              다각형의 둘레와 넓이를 계산하세요.<br>
              • 가로 6 cm, 세로 4 cm인 직사각형의 둘레: ( <input type="text" id="p02-peri" class="proof-input-text" style="width:80px;" placeholder="둘레 (숫자)"> ) cm<br>
              • 밑변 8 cm, 높이 5 cm인 삼각형의 넓이: ( <input type="text" id="p02-area" class="proof-input-text" style="width:80px;" placeholder="넓이 (숫자)"> ) cm²
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check02Submit()">✅ 제출 및 채점</button>
            <div id="p02-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-3': {
        mission: "<b>[되짚어 보기 3] 정다각형의 정의와 성질 (초등 4학년)</b><br>교과서 178쪽: 어떤 다각형이 정다각형이 되기 위해 만족해야 하는 두 가지 핵심 조건을 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              정다각형의 정의:<br>
              • 조건 1: 모든 ( <input type="text" id="p03-q1" class="proof-input-text" style="width:80px;" placeholder="조건 1 (예: 변)"> )의 길이가 같다.<br>
              • 조건 2: 모든 ( <input type="text" id="p03-q2" class="proof-input-text" style="width:80px;" placeholder="조건 2 (예: 각)"> )의 크기가 같다.
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check03Submit()">🏆 되짚어 보기 최종 제출</button>
            <div id="p03-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-1': {
        mission: "<b>[6.1 개념열기] 삼각형 외각 찢어 붙이기 실험실</b><br>교과서 182~184쪽: 좌측 시뮬레이터에서 3단계를 차례로 실행해 보세요. 삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 어떤 관계인가요?",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>삼각형 외각의 성질:</b> 삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              좌측 3단계 결합 결과를 보고 완성하세요.<br>
              • 한 외각의 크기는 이웃하지 않는 두 내각의 크기의 ( <input type="text" id="p11-rel" class="proof-input-text" style="width:90px;" placeholder="관계 (예: 합 / 차)"> )과 같다.
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check11Submit()">✅ 제출 및 채점</button>
            <div id="p11-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-2': {
        mission: "<b>[6.1 개념학습] 삼각형 한 외각의 성질 계산</b><br>교과서 184쪽: 삼각형 ABC에서 $\\\\angle A = 65^\\\\circ$, $\\\\angle B = 55^\\\\circ$일 때, 꼭짓점 C에서의 외각 $\\\\angle x$의 크기를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              외각 공식을 적용하여 계산하세요.<br>
              • $\\\\angle x = 65^\\\\circ + 55^\\\\circ$ = ( <input type="text" id="p12-x" class="proof-input-text" style="width:80px;" placeholder="각도 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check12Submit()">✅ 제출 및 채점</button>
            <div id="p12-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-3': {
        mission: "<b>[6.1 탐구활동] 부메랑(오목사각형) 외각 변형기</b><br>교과서 185쪽: 좌측 시뮬레이터의 세 뾰족한 각이 각각 $35^\\\\circ, 45^\\\\circ, 30^\\\\circ$일 때, 보조선을 이용하여 오목한 바깥 각 $\\\\angle x$의 크기를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              부메랑 사각형에서 안쪽 세 각의 합은 오목한 바깥 각과 같습니다.<br>
              • $\\\\angle x = 35^\\\\circ + 45^\\\\circ + 30^\\\\circ$ = ( <input type="text" id="p13-x" class="proof-input-text" style="width:80px;" placeholder="각도 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check13Submit()">✅ 제출 및 채점</button>
            <div id="p13-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-4': {
        mission: "<b>[6.1 발전문제] 별 모양(오각별) 꼭짓점 각의 합</b><br>교과서 185쪽: 오각별의 다섯 꼭짓점의 각 $\\\\angle A + \\\\angle B + \\\\angle C + \\\\angle D + \\\\angle E$의 합을 외각 성질을 이용하여 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              삼각형의 외각 성질을 2번 연속 적용하여 한 삼각형으로 모으면:<br>
              • 다섯 꼭짓점의 각의 합 $\\\\angle A + \\\\angle B + \\\\angle C + \\\\angle D + \\\\angle E$ = ( <input type="text" id="p14-sum" class="proof-input-text" style="width:80px;" placeholder="각도의 합 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #0284c7, #4f46e5);" onclick="check14Submit()">🏆 6.1 소단원 최종 제출</button>
            <div id="p14-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-1': {
        mission: "<b>[6.2 개념열기] 한 꼭짓점 대각선 삼각형 분할기</b><br>교과서 186~188쪽: 좌측의 시뮬레이터에서 다각형을 변경해 보세요. $n$각형의 한 꼭짓점에서 대각선을 그을 때 생기는 삼각형의 개수를 $n$에 대한 식으로 나타내세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              $n$각형을 한 꼭짓점에서 대각선을 그어 분할할 때:<br>
              • 생기는 삼각형의 개수 = ( <input type="text" id="p21-exp" class="proof-input-text" style="width:90px;" placeholder="식 입력 (예: n-1)"> )개
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check21Submit()">✅ 제출 및 채점</button>
            <div id="p21-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-2': {
        mission: "<b>[6.2 공식유도] 다각형 내각의 크기의 합 계산</b><br>교과서 188~189쪽: 칠각형($n=7$)의 내각의 크기의 합을 공식 $180^\\\\circ \\\\times (n - 2)$를 이용하여 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              내각의 크기의 합 = $180^\\\\circ \\\\times (n - 2)$<br>
              • 칠각형($n=7$)의 내각의 크기의 합: ( <input type="text" id="p22-sum" class="proof-input-text" style="width:90px;" placeholder="내각의 합 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check22Submit()">✅ 제출 및 채점</button>
            <div id="p22-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-3': {
        mission: "<b>[6.2 시각화] 다각형 축소 외각 360° 합체기</b><br>교과서 190~191쪽: 좌측 축소 합체기에서 3단계를 실행해 보세요. 다각형의 변의 수와 관계없이 모든 다각형의 외각의 크기의 합은 항상 얼마인가요?",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              다각형의 크기를 줄여 한 점으로 모으면 모든 외각이 빈틈없이 원을 이룹니다.<br>
              • 모든 다각형의 외각의 크기의 합 = ( <input type="text" id="p23-sum" class="proof-input-text" style="width:80px;" placeholder="외각의 합 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check23Submit()">✅ 제출 및 채점</button>
            <div id="p23-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-4': {
        mission: "<b>[6.2 공식적용] 정다각형의 한 내각과 한 외각</b><br>교과서 192~193쪽: 정팔각형($n=8$)에 대하여 한 외각의 크기와 한 내각의 크기를 각각 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              정팔각형($n=8$)의 각의 크기를 계산하세요.<br>
              • 한 외각의 크기: $360^\\\\circ \\\\div 8$ = ( <input type="text" id="p24-ext" class="proof-input-text" style="width:80px;" placeholder="외각 (숫자)"> )$^\\\\circ$<br>
              • 한 내각의 크기: $180^\\\\circ - (\\\\text{외각})$ = ( <input type="text" id="p24-int" class="proof-input-text" style="width:80px;" placeholder="내각 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check24Submit()">🏆 6.2 소단원 최종 제출</button>
            <div id="p24-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-1': {
        mission: "<b>[6.3 개념열기] n각형 대각선 인터랙티브 연결망</b><br>교과서 194~195쪽: 좌측 연결망에서 꼭짓점을 확인하세요. $n$각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수를 $n$에 대한 식으로 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>대각선의 개수:</b> 한 꼭짓점에서는 자기 자신과 양옆의 이웃한 2개의 꼭짓점을 제외한 나머지 꼭짓점에 대각선을 그을 수 있습니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              $n$각형의 한 꼭짓점에서 그을 수 있는 대각선의 수:<br>
              • ( <input type="text" id="p31-diag" class="proof-input-text" style="width:90px;" placeholder="식 입력 (예: n-1)"> )개
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check31Submit()">✅ 제출 및 채점</button>
            <div id="p31-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-2': {
        mission: "<b>[6.3 공식유도] 다각형 대각선의 총 개수 계산</b><br>교과서 195쪽: 십각형($n=10$)의 대각선의 총 개수를 공식 $\\\\frac{n(n-3)}{2}$를 이용하여 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              대각선의 총 개수 공식 = $\\\\frac{n(n-3)}{2}$<br>
              • 십각형($n=10$)의 대각선 총 개수: ( <input type="text" id="p32-total" class="proof-input-text" style="width:80px;" placeholder="대각선 총수 (숫자)"> )개
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check32Submit()">✅ 제출 및 채점</button>
            <div id="p32-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-3': {
        mission: "<b>[6.3 역추적] 대각선의 개수로 다각형 알아맞히기</b><br>교과서 195쪽: 대각선의 총 개수가 20개인 다각형은 몇 각형인가요?",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              $\\\\frac{n(n-3)}{2} = 20 \\\\implies n(n-3) = 40$<br>
              • 구하는 다각형의 이름: ( <input type="text" id="p33-poly" class="proof-input-text" style="width:120px;" placeholder="다각형 이름 (예: 오각형)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #0284c7, #4f46e5);" onclick="check33Submit()">🏆 6.3 소단원 최종 제출</button>
            <div id="p33-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-1': {
        mission: "<b>[6.4 개념열기] 부채꼴 vs 활꼴 인터랙티브 해부도</b><br>교과서 196~198쪽: 좌측 해부도를 관찰하고 빈칸에 알맞은 명칭(부채꼴 또는 활꼴)을 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              도형의 명칭을 입력하세요.<br>
              • 두 반지름과 호로 둘러싸인 도형: ( <input type="text" id="p41-part1" class="proof-input-text" style="width:100px;" placeholder="부채꼴 / 활꼴"> )<br>
              • 현과 호로 둘러싸인 도형: ( <input type="text" id="p41-part2" class="proof-input-text" style="width:100px;" placeholder="부채꼴 / 활꼴"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check41Submit()">✅ 제출 및 채점</button>
            <div id="p41-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-2': {
        mission: "<b>[6.4 기호표기] 호와 현의 개념 및 기호</b><br>교과서 197쪽: 원 위의 두 점 A, B를 잇는 두 도형의 이름을 올바르게 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              용어를 완성하세요.<br>
              • 원 위의 두 점 A, B를 양 끝점으로 하는 원의 일부분: ( <input type="text" id="p42-arc" class="proof-input-text" style="width:80px;" placeholder="용어 입력 (예: 호)"> ) AB<br>
              • 원 위의 두 점 A, B를 이은 선분: ( <input type="text" id="p42-chord" class="proof-input-text" style="width:80px;" placeholder="용어 입력 (예: 현)"> ) AB
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check42Submit()">✅ 제출 및 채점</button>
            <div id="p42-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-3': {
        mission: "<b>[6.4 정비례검증] 중심각 vs 호·넓이·현 정비례 검증기</b><br>교과서 198~201쪽: 좌측 검증기에서 중심각의 배수를 변경해 보며 다음 설명의 참(O), 거짓(X)을 판별하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              참인 것은 'O', 거짓인 것은 'X'를 입력하세요.<br>
              • 부채꼴의 호의 길이와 넓이는 중심각의 크기에 정비례한다: ( <input type="text" id="p43-q1" class="proof-input-text" style="width:60px;" placeholder="O 또는 X"> )<br>
              • 현의 길이는 중심각의 크기에 정비례한다: ( <input type="text" id="p43-q2" class="proof-input-text" style="width:60px;" placeholder="O 또는 X"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check43Submit()">🏆 6.4 소단원 최종 제출</button>
            <div id="p43-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-1': {
        mission: "<b>[6.5 공식유도] 부채꼴 직사각형 변환기</b><br>교과서 202~205쪽: 좌측 변환기에서 부채꼴을 직사각형으로 변환하는 과정을 관찰하세요. 반지름이 $r$이고 호의 길이가 $l$인 부채꼴의 넓이 공식은 $S = \\\\frac{1}{2} \\\\times ( \\\\quad ) \\\\times l$ 입니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>부채꼴의 넓이 공식:</b> 직사각형의 가로는 $\\\\frac{1}{2}l$, 세로는 반지름 $r$이므로 $S = \\\\frac{1}{2}rl$ 입니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              빈칸에 들어갈 반지름 기호를 입력하세요.<br>
              • $S = \\\\frac{1}{2} \\\\times$ ( <input type="text" id="p51-r" class="proof-input-text" style="width:60px;" placeholder="반지름 기호 (예: r)"> ) $\\\\times l$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check51Submit()">✅ 제출 및 채점</button>
            <div id="p51-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-2': {
        mission: "<b>[6.5 공식적용] 부채꼴 호의 길이와 넓이 계산</b><br>교과서 204~205쪽: 반지름이 $6\\\\text{ cm}$이고 중심각의 크기가 $60^\\\\circ$인 부채꼴의 호의 길이 $l$과 넓이 $S$를 구하세요. (원주율 $\\\\pi$ 기호 포함)",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              부채꼴의 호의 길이와 넓이를 계산하세요.<br>
              • 호의 길이 $l = 2\\\\pi \\\\times 6 \\\\times \\\\frac{60}{360}$ = ( <input type="text" id="p52-l" class="proof-input-text" style="width:90px;" placeholder="호의 길이 (예: 4π)"> ) cm<br>
              • 넓이 $S = \\\\pi \\\\times 6^2 \\\\times \\\\frac{60}{360}$ = ( <input type="text" id="p52-s" class="proof-input-text" style="width:90px;" placeholder="넓이 (예: 8π)"> ) cm²
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check52Submit()">✅ 제출 및 채점</button>
            <div id="p52-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-3': {
        mission: "<b>[6.5 창의융합] 정다각형 테셀레이션 평면 채우기 실험실</b><br>교과서 208~209쪽: 좌측 시뮬레이터에서 정삼각형, 정사각형, 정오각형, 정육각형을 시험해 보세요.<br>① 평면을 빈틈없이 채우려면 한 점에 모이는 정다각형의 내각의 합이 몇 도여야 하나요? (     )$^\\\\circ$<br>② 정오각형(한 내각 $108^\\\\circ$)만으로 평면 테셀레이션이 가능한가요? ( 가능 / 불가 )",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              테셀레이션의 원리와 조건을 완성하세요.<br>
              • 한 점에 모이는 내각의 합: ( <input type="text" id="p53-sum" class="proof-input-text" style="width:80px;" placeholder="각도의 합 (숫자)"> )$^\\\\circ$<br>
              • 정오각형만으로 평면 테셀레이션 가능 여부: ( <input type="text" id="p53-poss" class="proof-input-text" style="width:90px;" placeholder="가능 / 불가"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #ec4899, #4f46e5);" onclick="check53Submit()">🏆 6단원 평면도형 완주 및 최종 제출</button>
            <div id="p53-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      }
    };
  `,
  canvasDrawersJs: fs.readFileSync(path.join(__dirname, 'ch6_canvas_drawers.js'), 'utf8'),
  validationHandlersJs: `
    function normTxt(v) {
      if (!v) return '';
      return String(v).replace(/\\s+/g, '').toLowerCase();
    }

    function handlePassAndNext(currCode, nextCode, title, desc) {
      if (typeof renderVerifiedAnswerView === 'function') {
        renderVerifiedAnswerView(title, desc, nextCode);
      }
      if (typeof SoundFX !== 'undefined' && SoundFX.success) {
        SoundFX.success();
      }
    }

    function check01Submit() {
      const pi = normTxt(document.getElementById('p01-pi')?.value);
      const val = normTxt(document.getElementById('p01-val')?.value);
      const err = document.getElementById('p01-err');
      const isPi = (pi.includes('π') || pi.includes('pi') || pi.includes('원주율'));
      const isVal = (val === '31.4');
      if (isPi && isVal) {
        err.style.display = 'none';
        handlePassAndNext('0-1', '0-2', '원주율의 기초 완료!', '지름에 대한 둘레의 비율은 원주율(π)이며 둘레는 31.4 cm입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 원주율 기호(π 또는 pi)와 둘레 31.4를 정확히 입력하세요.';
      }
    }

    function check02Submit() {
      const peri = normTxt(document.getElementById('p02-peri')?.value);
      const area = normTxt(document.getElementById('p02-area')?.value);
      const err = document.getElementById('p02-err');
      if (peri === '20' && area === '20') {
        err.style.display = 'none';
        handlePassAndNext('0-2', '0-3', '다각형 둘레와 넓이 완료!', '직사각형 둘레 = 20 cm, 삼각형 넓이 = 20 cm²입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 직사각형 둘레는 (6+4)×2 = 20, 삼각형 넓이는 8×5÷2 = 20입니다.';
      }
    }

    function check03Submit() {
      const q1 = normTxt(document.getElementById('p03-q1')?.value);
      const q2 = normTxt(document.getElementById('p03-q2')?.value);
      const err = document.getElementById('p03-err');
      if (q1.includes('변') && (q2.includes('각') || q2.includes('내각'))) {
        err.style.display = 'none';
        handlePassAndNext('0-3', '1-1', '정다각형의 성질 완료!', '모든 변의 길이가 같고 모든 내각의 크기가 같아야 정다각형입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 조건 1은 "변", 조건 2는 "각"입니다.';
      }
    }

    function check11Submit() {
      const rel = normTxt(document.getElementById('p11-rel')?.value);
      const err = document.getElementById('p11-err');
      if (rel.includes('합') || rel.includes('더') || rel.includes('+')) {
        err.style.display = 'none';
        handlePassAndNext('1-1', '1-2', '삼각형 외각의 성질 발견!', '삼각형의 한 외각의 크기는 이웃하지 않는 두 내각의 크기의 합과 같습니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 두 내각의 크기의 "합"과 같습니다.';
      }
    }

    function check12Submit() {
      const x = normTxt(document.getElementById('p12-x')?.value);
      const err = document.getElementById('p12-err');
      if (x === '120') {
        err.style.display = 'none';
        handlePassAndNext('1-2', '1-3', '삼각형 외각 계산 완료!', '∠x = 65° + 55° = 120°입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. ∠x = 65° + 55° = 120° 입니다.';
      }
    }

    function check13Submit() {
      const x = normTxt(document.getElementById('p13-x')?.value);
      const err = document.getElementById('p13-err');
      if (x === '110') {
        err.style.display = 'none';
        handlePassAndNext('1-3', '1-4', '부메랑 사각형 외각 완료!', '부메랑 안쪽 세 뾰족한 각의 합 35° + 45° + 30° = 110°입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 보조선에 의해 ∠x = 35° + 45° + 30° = 110° 입니다.';
      }
    }

    function check14Submit() {
      const sum = normTxt(document.getElementById('p14-sum')?.value);
      const err = document.getElementById('p14-err');
      if (sum === '180') {
        err.style.display = 'none';
        handlePassAndNext('1-4', '2-1', '오각별 꼭짓점 각의 합 완료!', '외각 성질을 2회 적용하여 한 삼각형으로 모으면 180°가 됩니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 오각별 꼭짓점 5개 각의 합은 180° 입니다.';
      }
    }

    function check21Submit() {
      const exp = normTxt(document.getElementById('p21-exp')?.value);
      const err = document.getElementById('p21-err');
      if (exp.includes('n-2') || exp.includes('n-2개')) {
        err.style.display = 'none';
        handlePassAndNext('2-1', '2-2', '대각선 삼각형 분할 공식 완료!', '한 꼭짓점에서 대각선을 그으면 (n-2)개의 삼각형으로 쪼개집니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 삼각형의 개수는 "n-2"개 입니다.';
      }
    }

    function check22Submit() {
      const sum = normTxt(document.getElementById('p22-sum')?.value);
      const err = document.getElementById('p22-err');
      if (sum === '900') {
        err.style.display = 'none';
        handlePassAndNext('2-2', '2-3', '칠각형 내각의 합 완료!', '180° × (7 - 2) = 180° × 5 = 900°입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 180° × (7 - 2) = 900° 입니다.';
      }
    }

    function check23Submit() {
      const sum = normTxt(document.getElementById('p23-sum')?.value);
      const err = document.getElementById('p23-err');
      if (sum === '360') {
        err.style.display = 'none';
        handlePassAndNext('2-3', '2-4', '다각형 외각의 합 완전 정복!', '모든 다각형의 외각의 크기의 합은 항상 360°입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 모든 다각형의 외각의 총합은 항상 360° 입니다.';
      }
    }

    function check24Submit() {
      const ext = normTxt(document.getElementById('p24-ext')?.value);
      const intAng = normTxt(document.getElementById('p24-int')?.value);
      const err = document.getElementById('p24-err');
      if (ext === '45' && intAng === '135') {
        err.style.display = 'none';
        handlePassAndNext('2-4', '3-1', '정팔각형 내각과 외각 완료!', '한 외각은 360° ÷ 8 = 45°, 한 내각은 180° - 45° = 135°입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 한 외각은 45°, 한 내각은 135° 입니다.';
      }
    }

    function check31Submit() {
      const diag = normTxt(document.getElementById('p31-diag')?.value);
      const err = document.getElementById('p31-err');
      if (diag.includes('n-3')) {
        err.style.display = 'none';
        handlePassAndNext('3-1', '3-2', '한 꼭짓점 대각선 수 완료!', '자기 자신과 이웃 2개를 제외하므로 (n-3)개입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 한 꼭짓점에서 그을 수 있는 대각선의 수는 "n-3"개 입니다.';
      }
    }

    function check32Submit() {
      const total = normTxt(document.getElementById('p32-total')?.value);
      const err = document.getElementById('p32-err');
      if (total === '35') {
        err.style.display = 'none';
        handlePassAndNext('3-2', '3-3', '십각형 대각선 총수 완료!', '10 × (10 - 3) ÷ 2 = 10 × 7 ÷ 2 = 35개입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 10 × 7 ÷ 2 = 35개 입니다.';
      }
    }

    function check33Submit() {
      const poly = normTxt(document.getElementById('p33-poly')?.value);
      const err = document.getElementById('p33-err');
      if (poly.includes('8') || poly.includes('팔각')) {
        err.style.display = 'none';
        handlePassAndNext('3-3', '4-1', '대각선 역추적 완료!', 'n(n-3) = 40 = 8 × 5 이므로 n = 8 (팔각형)입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. n(n-3)=40을 만족하는 다각형은 "팔각형"입니다.';
      }
    }

    function check41Submit() {
      const p1 = normTxt(document.getElementById('p41-part1')?.value);
      const p2 = normTxt(document.getElementById('p41-part2')?.value);
      const err = document.getElementById('p41-err');
      if (p1.includes('부채') && p2.includes('활')) {
        err.style.display = 'none';
        handlePassAndNext('4-1', '4-2', '부채꼴과 활꼴 해부 완료!', '두 반지름과 호는 부채꼴, 현과 호는 활꼴입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 첫 번째는 "부채꼴", 두 번째는 "활꼴"입니다.';
      }
    }

    function check42Submit() {
      const arc = normTxt(document.getElementById('p42-arc')?.value);
      const chord = normTxt(document.getElementById('p42-chord')?.value);
      const err = document.getElementById('p42-err');
      if (arc === '호' && chord === '현') {
        err.style.display = 'none';
        handlePassAndNext('4-2', '4-3', '호와 현의 명칭 완료!', '원의 일부분은 "호", 두 점을 잇는 선분은 "현"입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 첫 번째는 "호", 두 번째는 "현"입니다.';
      }
    }

    function check43Submit() {
      const q1 = normTxt(document.getElementById('p43-q1')?.value);
      const q2 = normTxt(document.getElementById('p43-q2')?.value);
      const err = document.getElementById('p43-err');
      const isQ1 = (q1 === 'o' || q1 === '참' || q1 === '예');
      const isQ2 = (q2 === 'x' || q2 === '거짓' || q2 === '아니오');
      if (isQ1 && isQ2) {
        err.style.display = 'none';
        handlePassAndNext('4-3', '5-1', '중심각 정비례 법칙 정복!', '호와 넓이는 중심각에 정비례하지만, 현의 길이는 정비례하지 않습니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. ① 호/넓이는 정비례(O), ② 현은 정비례하지 않음(X)입니다.';
      }
    }

    function check51Submit() {
      const r = normTxt(document.getElementById('p51-r')?.value);
      const err = document.getElementById('p51-err');
      if (r === 'r' || r.includes('반지름')) {
        err.style.display = 'none';
        handlePassAndNext('5-1', '5-2', '부채꼴 넓이 공식 유도 완료!', 'S = 1/2 · r · l 공식이 직사각형 변환으로 성립합니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 빈칸에 들어갈 반지름 기호는 "r"입니다.';
      }
    }

    function check52Submit() {
      const l = normTxt(document.getElementById('p52-l')?.value);
      const s = normTxt(document.getElementById('p52-s')?.value);
      const err = document.getElementById('p52-err');
      const isL = (l === '2π' || l === '2pi');
      const isS = (s === '6π' || s === '6pi');
      if (isL && isS) {
        err.style.display = 'none';
        handlePassAndNext('5-2', '5-3', '호의 길이와 넓이 계산 완료!', '호의 길이 = 2π cm, 넓이 = 6π cm²입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 호의 길이는 2π, 넓이는 6π 입니다. (π 또는 pi 포함)';
      }
    }

    function check53Submit() {
      const sum = normTxt(document.getElementById('p53-sum')?.value);
      const poss = normTxt(document.getElementById('p53-poss')?.value);
      const err = document.getElementById('p53-err');
      const isSum = (sum === '360');
      const isPoss = (poss.includes('불가') || poss === '아니오' || poss === 'x');
      if (isSum && isPoss) {
        err.style.display = 'none';
        handlePassAndNext('5-3', 'complete', '🎉 6단원 평면도형 완주 축하합니다!', '내각의 합 360° 조건과 정다각형 테셀레이션의 원리를 완벽하게 마스터했습니다!');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 한 점의 내각의 합은 360°이어야 하며, 정오각형(108°)은 테셀레이션이 불가능(불가)합니다.';
      }
    }
  `
};

// Generate HTML and write to g1_ch6_plane_figures.html
const htmlContent = createChapterHtml(ch6Config);
const targetPath = path.join(__dirname, 'g1_ch6_plane_figures.html');
fs.writeFileSync(targetPath, htmlContent, 'utf8');
console.log('Successfully built g1_ch6_plane_figures.html, size:', htmlContent.length);
