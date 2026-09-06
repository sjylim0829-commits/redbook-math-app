const fs = require('fs');
const path = require('path');
const { createChapterHtml } = require('./master_template.js');

const ch7Config = {
  chapterNum: 7,
  chapterTitle: '7. 입체도형',
  chapterBadge: '중1 수학 7단원',
  mainTabs: [
    '0. 되짚어 보기',
    '7.1 다면체와 정다면체',
    '7.2 회전체와 단면',
    '7.3 기둥의 겉넓이와 부피',
    '7.4 뿔의 겉넓이와 부피',
    '7.5 구의 겉넓이·부피 & 아르키메데스'
  ],
  pillsConfig: {
    0: [
      { code: '0-1', label: '1. 직육면체와 각기둥 (초등 5~6)' },
      { code: '0-2', label: '2. 원기둥과 원뿔 (초등 6)' },
      { code: '0-3', label: '3. 직육면체 겉넓이와 부피 (초등 6)' }
    ],
    1: [
      { code: '1-1', label: '1. 다면체 전개도 접기 & 입체 조립기' },
      { code: '1-2', label: '2. 각기둥, 각뿔, 각뿔대 공식' },
      { code: '1-3', label: '3. 5가지 정다면체 3D 갤러리' },
      { code: '1-4', label: '4. 오일러 다면체 정리 실험실' }
    ],
    2: [
      { code: '2-1', label: '1. 회전체 360° 고속 회전 생성기' },
      { code: '2-2', label: '2. 회전체의 구성 요소와 모선' },
      { code: '2-3', label: '3. 회전체 단면 슬라이서' },
      { code: '2-4', label: '4. 원기둥과 원뿔의 전개도' }
    ],
    3: [
      { code: '3-1', label: '1. 기둥 전개도 펼치기 & 겉넓이 계산' },
      { code: '3-2', label: '2. 원기둥 겉넓이 공식 계산' },
      { code: '3-3', label: '3. 기둥의 부피 (V = Sh)' }
    ],
    4: [
      { code: '4-1', label: '1. 뿔의 부피 물 채우기 실험실' },
      { code: '4-2', label: '2. 뿔의 겉넓이 공식 계산' },
      { code: '4-3', label: '3. 각뿔과 원뿔의 부피 계산' }
    ],
    5: [
      { code: '5-1', label: '1. 구의 겉넓이 끈 감기 실험실' },
      { code: '5-2', label: '2. 구의 부피 공식 유도 및 계산' },
      { code: '5-3', label: '3. 아르키메데스의 묘비: 3:2:1 비율' }
    ]
  },
  substepDataJs: `
    const SUBSTEP_CONFIG = {
      '0-1': {
        mission: "<b>[되짚어 보기 1] 직육면체와 각기둥 (초등 5~6학년)</b><br>교과서 210~211쪽: 직육면체(사각기둥)의 면의 수와 꼭짓점의 수를 각각 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              직육면체의 구성 요소의 개수를 구하세요.<br>
              • 면의 개수: ( <input type="text" id="p01-f" class="proof-input-text" style="width:80px;" placeholder="면의 수 (숫자)"> )개<br>
              • 꼭짓점의 개수: ( <input type="text" id="p01-v" class="proof-input-text" style="width:80px;" placeholder="꼭짓점 수 (숫자)"> )개
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check01Submit()">✅ 제출 및 채점</button>
            <div id="p01-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-2': {
        mission: "<b>[되짚어 보기 2] 원기둥과 원뿔 (초등 6학년)</b><br>교과서 210~211쪽: 원기둥의 밑면의 개수와 원뿔의 꼭짓점의 개수를 각각 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              원기둥과 원뿔의 특징을 입력하세요.<br>
              • 원기둥의 밑면의 개수: ( <input type="text" id="p02-cyl" class="proof-input-text" style="width:80px;" placeholder="개수 (숫자)"> )개<br>
              • 원뿔의 꼭짓점의 개수: ( <input type="text" id="p02-cone" class="proof-input-text" style="width:80px;" placeholder="개수 (숫자)"> )개
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check02Submit()">✅ 제출 및 채점</button>
            <div id="p02-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-3': {
        mission: "<b>[되짚어 보기 3] 직육면체 겉넓이와 부피 (초등 6학년)</b><br>교과서 211쪽: 가로 4 cm, 세로 3 cm, 높이 5 cm인 직육면체의 겉넓이와 부피를 각각 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              직육면체의 겉넓이와 부피를 계산하세요.<br>
              • 겉넓이: 2 × (4×3 + 3×5 + 4×5) = ( <input type="text" id="p03-area" class="proof-input-text" style="width:90px;" placeholder="겉넓이 (숫자)"> ) cm²<br>
              • 부피: 4 × 3 × 5 = ( <input type="text" id="p03-vol" class="proof-input-text" style="width:90px;" placeholder="부피 (숫자)"> ) cm³
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check03Submit()">🏆 되짚어 보기 최종 제출</button>
            <div id="p03-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-1': {
        mission: "<b>[7.1 개념열기] 다면체 전개도 접기 & 입체 조립기</b><br>교과서 212~214쪽: 좌측 시뮬레이터에서 3단계를 차례로 실행해 보세요. 다각형인 면으로만 둘러싸인 입체도형의 명칭과 사각뿔의 면 수에 따른 이름을 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>다면체:</b> 다각형인 면으로만 둘러싸인 입체도형을 <b>다면체</b>라 하며, 둘러싸인 면의 수에 따라 사면체, 오면체, 육면체 등으로 부릅니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              용어와 면의 수에 따른 이름을 완성하세요.<br>
              • 다각형인 면으로만 둘러싸인 입체도형: ( <input type="text" id="p11-poly" class="proof-input-text" style="width:100px;" placeholder="용어 (예: 다면체)"> )<br>
              • 사각뿔은 면이 5개이므로 ( <input type="text" id="p11-f" class="proof-input-text" style="width:90px;" placeholder="다면체 이름 (예: 오면체)"> )입니다.
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check11Submit()">✅ 제출 및 채점</button>
            <div id="p11-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-2': {
        mission: "<b>[7.1 개념학습] 각기둥, 각뿔, 각뿔대 공식</b><br>교과서 214쪽: 칠각기둥의 꼭짓점의 개수와 오각뿔의 모서리의 개수를 각각 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              공식을 적용하여 개수를 구하세요.<br>
              • 칠각기둥($n=7$)의 꼭짓점의 수 ($2n$): ( <input type="text" id="p12-prism" class="proof-input-text" style="width:80px;" placeholder="꼭짓점 수 (숫자)"> )개<br>
              • 오각뿔($n=5$)의 모서리의 수 ($2n$): ( <input type="text" id="p12-pyramid" class="proof-input-text" style="width:80px;" placeholder="모서리 수 (숫자)"> )개
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check12Submit()">✅ 제출 및 채점</button>
            <div id="p12-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-3': {
        mission: "<b>[7.1 탐구활동] 5가지 정다면체 3D 갤러리</b><br>교과서 215~217쪽: 좌측 갤러리에서 정다면체들을 관찰하세요. 정다면체는 총 몇 가지뿐이며, 정팔면체의 면의 모양은 무엇인가요?",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              정다면체의 성질을 입력하세요.<br>
              • 정다면체의 총 종류: ( <input type="text" id="p13-count" class="proof-input-text" style="width:80px;" placeholder="종류의 수 (숫자)"> )가지<br>
              • 정팔면체의 면의 모양: ( <input type="text" id="p13-shape" class="proof-input-text" style="width:100px;" placeholder="도형의 모양 (예: 정삼각형)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check13Submit()">✅ 제출 및 채점</button>
            <div id="p13-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-4': {
        mission: "<b>[7.1 공식유도] 오일러 다면체 정리 실험실</b><br>교과서 217쪽: 좌측 시뮬레이터에서 다면체를 전환해 보세요. 모든 다면체에서 꼭짓점의 수($v$), 모서리의 수($e$), 면의 수($f$) 사이의 값 $v - e + f$는 항상 얼마인가요?",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              오일러 다면체 정리 공식:<br>
              • 꼭짓점($v$) - 모서리($e$) + 면($f$) = ( <input type="text" id="p14-euler" class="proof-input-text" style="width:80px;" placeholder="수식의 값 (숫자)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #0284c7, #4f46e5);" onclick="check14Submit()">🏆 7.1 소단원 최종 제출</button>
            <div id="p14-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-1': {
        mission: "<b>[7.2 개념열기] 회전체 360° 고속 회전 생성기</b><br>교과서 218~220쪽: 평면도형을 한 직선을 축으로 1회전 시켜 생기는 입체도형의 명칭과 직사각형을 1회전 시켜 생기는 회전체의 이름을 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              회전체의 정의와 입체도형 이름을 완성하세요.<br>
              • 평면도형을 1회전 시켜 얻는 입체도형: ( <input type="text" id="p21-rev" class="proof-input-text" style="width:90px;" placeholder="용어 (예: 회전체)"> )<br>
              • 직사각형을 한 변을 축으로 회전시킨 입체: ( <input type="text" id="p21-shape" class="proof-input-text" style="width:90px;" placeholder="입체도형 이름 (예: 원기둥)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check21Submit()">✅ 제출 및 채점</button>
            <div id="p21-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-2': {
        mission: "<b>[7.2 개념학습] 회전체의 구성 요소와 모선</b><br>교과서 220쪽: 회전시킬 때 축이 되는 직선과, 회전하여 옆면을 만드는 선분의 명칭을 각각 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              용어를 입력하세요.<br>
              • 축이 되는 직선: ( <input type="text" id="p22-axis" class="proof-input-text" style="width:90px;" placeholder="용어 (예: 회전축)"> )<br>
              • 회전하여 옆면을 만드는 선분: ( <input type="text" id="p22-gen" class="proof-input-text" style="width:90px;" placeholder="용어 (예: 모선)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check22Submit()">✅ 제출 및 채점</button>
            <div id="p22-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-3': {
        mission: "<b>[7.2 단면탐색] 회전체 단면 슬라이서</b><br>교과서 221~222쪽: 좌측 슬라이서에서 단면을 확인하세요. 회전축을 포함하는 평면으로 자른 단면의 대칭 관계와, 회전축에 수직인 평면으로 자른 단면의 모양을 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              단면의 성질을 완성하세요.<br>
              • 회전축을 포함하는 평면으로 자른 단면: 회전축에 대하여 ( <input type="text" id="p23-axis" class="proof-input-text" style="width:90px;" placeholder="대칭 관계 (예: 선대칭)"> )도형<br>
              • 회전축에 수직인 평면으로 자른 단면: 항상 ( <input type="text" id="p23-perp" class="proof-input-text" style="width:80px;" placeholder="도형 이름 (예: 원)"> ) 모양
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check23Submit()">✅ 제출 및 채점</button>
            <div id="p23-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-4': {
        mission: "<b>[7.2 전개도] 원기둥과 원뿔의 전개도</b><br>교과서 222쪽: 원기둥의 옆면의 모양과 원뿔의 옆면의 모양을 각각 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              전개도 옆면의 모양을 입력하세요.<br>
              • 원기둥의 옆면의 모양: ( <input type="text" id="p24-cyl" class="proof-input-text" style="width:100px;" placeholder="도형 이름 (예: 직사각형)"> )<br>
              • 원뿔의 옆면의 모양: ( <input type="text" id="p24-cone" class="proof-input-text" style="width:100px;" placeholder="도형 이름 (예: 부채꼴)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check24Submit()">🏆 7.2 소단원 최종 제출</button>
            <div id="p24-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-1': {
        mission: "<b>[7.3 공식유도] 기둥 전개도 펼치기 & 겉넓이 계산</b><br>교과서 223~225쪽: 기둥의 겉넓이 공식을 완성하세요. 기둥의 겉넓이는 (밑넓이 × [   ]) + 옆넓이 입니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>기둥의 겉넓이:</b> 기둥은 밑면이 2개이므로 겉넓이 = (밑넓이 × 2) + 옆넓이 입니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              기둥의 겉넓이 공식에서 밑넓이에 곱하는 숫자를 입력하세요.<br>
              • 겉넓이 = (밑넓이 × <input type="text" id="p31-base" class="proof-input-text" style="width:60px;" placeholder="곱하는 수 (숫자)"> ) + 옆넓이
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check31Submit()">✅ 제출 및 채점</button>
            <div id="p31-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-2': {
        mission: "<b>[7.3 공식적용] 원기둥 겉넓이 공식 계산</b><br>교과서 225쪽: 밑면 반지름 $r = 3\\text{ cm}$, 높이 $h = 5\\text{ cm}$인 원기둥의 겉넓이를 구하세요. (원주율 $\\\\pi$ 기호 포함)",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              원기둥의 겉넓이를 계산하세요.<br>
              • 밑넓이 × 2 = $2 \\\\times \\\\pi \\\\times 3^2 = 18\\\\pi$<br>
              • 옆넓이 = $2\\\\pi \\\\times 3 \\\\times 5 = 30\\\\pi$<br>
              • 원기둥의 겉넓이 = ( <input type="text" id="p32-s" class="proof-input-text" style="width:90px;" placeholder="겉넓이 (pi 포함)"> ) cm²
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check32Submit()">✅ 제출 및 채점</button>
            <div id="p32-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-3': {
        mission: "<b>[7.3 부피공식] 기둥의 부피 (V = Sh)</b><br>교과서 226~227쪽: 밑면 반지름 $r = 3\\text{ cm}$, 높이 $h = 5\\text{ cm}$인 원기둥의 부피를 구하세요. (원주율 $\\\\pi$ 기호 포함)",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              기둥의 부피 = 밑넓이($S$) × 높이($h$)<br>
              • 원기둥의 부피 = ( <input type="text" id="p33-v" class="proof-input-text" style="width:90px;" placeholder="부피 (pi 포함)"> ) cm³
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #0284c7, #4f46e5);" onclick="check33Submit()">🏆 7.3 소단원 최종 제출</button>
            <div id="p33-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-1': {
        mission: "<b>[7.4 공식유도] 뿔의 부피 물 채우기 실험실</b><br>교과서 228~230쪽: 좌측 실험실에서 뿔에 물을 채워 기둥에 붓는 과정을 확인하세요. 밑면과 높이가 같은 뿔의 부피는 기둥의 부피의 몇 분의 몇인가요?",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              기둥 부피에 대한 뿔의 부피의 비율을 입력하세요.<br>
              • 뿔의 부피 = 기둥 부피의 ( <input type="text" id="p41-ratio" class="proof-input-text" style="width:80px;" placeholder="분수 (예: 1/2)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check41Submit()">✅ 제출 및 채점</button>
            <div id="p41-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-2': {
        mission: "<b>[7.4 공식적용] 뿔의 겉넓이 공식 계산</b><br>교과서 231쪽: 밑면 반지름 $r = 4\\text{ cm}$, 모선의 길이 $l = 10\\text{ cm}$인 원뿔의 겉넓이를 구하세요. (원주율 $\\\\pi$ 기호 포함)",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              원뿔의 겉넓이 = 밑넓이($\\\\pi r^2$) + 옆넓이($\\\\pi r l$)<br>
              • 밑넓이 = $\\\\pi \\\\times 4^2 = 16\\\\pi$<br>
              • 옆넓이 = $\\\\pi \\\\times 4 \\\\times 10 = 40\\\\pi$<br>
              • 원뿔의 겉넓이 = ( <input type="text" id="p42-s" class="proof-input-text" style="width:90px;" placeholder="겉넓이 (pi 포함)"> ) cm²
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check42Submit()">✅ 제출 및 채점</button>
            <div id="p42-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-3': {
        mission: "<b>[7.4 공식적용] 각뿔의 부피 계산</b><br>교과서 232쪽: 밑면이 한 변의 길이가 $6\\text{ cm}$인 정사각형이고 높이가 $8\\text{ cm}$인 사각뿔의 부피를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              뿔의 부피 $V = \\\\frac{1}{3} \\\\times S \\\\times h$<br>
              • 밑넓이 $S = 6 \\\\times 6 = 36\\text{ cm}^2$<br>
              • 사각뿔의 부피 = ( <input type="text" id="p43-v" class="proof-input-text" style="width:90px;" placeholder="부피 (숫자)"> ) cm³
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check43Submit()">🏆 7.4 소단원 최종 제출</button>
            <div id="p43-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-1': {
        mission: "<b>[7.5 공식유도] 구의 겉넓이 끈 감기 실험실</b><br>교과서 233~235쪽: 좌측 실험실에서 끈 감기 과정을 관찰하세요. 반지름이 $r$인 구의 겉넓이는 반지름이 $r$인 평면 원의 넓이($\\\\pi r^2$)의 몇 배인가요?",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>구의 겉넓이:</b> 반지름이 $r$인 구의 겉넓이는 반지름이 $r$인 원의 넓이($\\\\pi r^2$)의 4배이므로 $S = 4\\\\pi r^2$ 입니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              반지름이 $r$인 원의 넓이의 몇 배인지 입력하세요.<br>
              • 구의 겉넓이 = ( <input type="text" id="p51-ratio" class="proof-input-text" style="width:80px;" placeholder="배수 (숫자)"> ) 배 ($S = 4\\\\pi r^2$)
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check51Submit()">✅ 제출 및 채점</button>
            <div id="p51-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-2': {
        mission: "<b>[7.5 공식유도] 구의 부피 공식 계산</b><br>교과서 236~237쪽: 반지름 $r = 3\\text{ cm}$인 구의 부피를 구하세요. (공식 $V = \\\\frac{4}{3}\\\\pi r^3$, 원주율 $\\\\pi$ 기호 포함)",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              구의 부피 $V = \\\\frac{4}{3}\\\\pi \\\\times 3^3 = \\\\frac{4}{3}\\\\pi \\\\times 27$<br>
              • 구의 부피 = ( <input type="text" id="p52-v" class="proof-input-text" style="width:90px;" placeholder="부피 (pi 포함)"> ) cm³
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check52Submit()">✅ 제출 및 채점</button>
            <div id="p52-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-3': {
        mission: "<b>[7.5 창의융합] 아르키메데스의 묘비: 3:2:1 황금비율</b><br>교과서 241쪽: 밑면의 지름과 높이가 같은 원기둥, 구, 원뿔의 부피의 비를 가장 간단한 자연수의 비로 나타내세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              (원기둥의 부피) : (구의 부피) : (원뿔의 부피)를 입력하세요.<br>
              • 부피의 비: ( <input type="text" id="p53-ratio" class="proof-input-text" style="width:100px;" placeholder="비율 (예: 3:2:1)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #ec4899, #4f46e5);" onclick="check53Submit()">🏆 7단원 입체도형 완주 및 최종 제출</button>
            <div id="p53-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      }
    };
  `,
  canvasDrawersJs: fs.readFileSync(path.join(__dirname, 'ch7_canvas_drawers.js'), 'utf8'),
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
      const f = normTxt(document.getElementById('p01-f')?.value);
      const v = normTxt(document.getElementById('p01-v')?.value);
      const err = document.getElementById('p01-err');
      if (f === '6' && v === '8') {
        err.style.display = 'none';
        handlePassAndNext('0-1', '0-2', '직육면체의 기초 완료!', '직육면체는 면 6개, 꼭짓점 8개, 모서리 12개입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 직육면체는 면 6개, 꼭짓점 8개입니다.';
      }
    }

    function check02Submit() {
      const cyl = normTxt(document.getElementById('p02-cyl')?.value);
      const cone = normTxt(document.getElementById('p02-cone')?.value);
      const err = document.getElementById('p02-err');
      if (cyl === '2' && cone === '1') {
        err.style.display = 'none';
        handlePassAndNext('0-2', '0-3', '원기둥과 원뿔의 기초 완료!', '원기둥은 밑면 2개, 원뿔은 꼭짓점 1개와 밑면 1개입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 원기둥의 밑면은 2개, 원뿔의 꼭짓점은 1개입니다.';
      }
    }

    function check03Submit() {
      const area = normTxt(document.getElementById('p03-area')?.value);
      const vol = normTxt(document.getElementById('p03-vol')?.value);
      const err = document.getElementById('p03-err');
      if (area === '94' && vol === '60') {
        err.style.display = 'none';
        handlePassAndNext('0-3', '1-1', '겉넓이와 부피 기초 완료!', '겉넓이는 94 cm², 부피는 60 cm³입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 겉넓이는 94, 부피는 60입니다.';
      }
    }

    function check11Submit() {
      const poly = normTxt(document.getElementById('p11-poly')?.value);
      const f = normTxt(document.getElementById('p11-f')?.value);
      const err = document.getElementById('p11-err');
      const isPoly = poly.includes('다면체');
      const isF = (f === '5' || f.includes('오면체') || f === '5면체');
      if (isPoly && isF) {
        err.style.display = 'none';
        handlePassAndNext('1-1', '1-2', '다면체의 정의와 분류 완료!', '다각형인 면으로 둘러싸인 도형은 다면체, 사각뿔은 오면체입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 도형은 "다면체", 사각뿔은 "오면체"입니다.';
      }
    }

    function check12Submit() {
      const prism = normTxt(document.getElementById('p12-prism')?.value);
      const pyramid = normTxt(document.getElementById('p12-pyramid')?.value);
      const err = document.getElementById('p12-err');
      if (prism === '14' && pyramid === '10') {
        err.style.display = 'none';
        handlePassAndNext('1-2', '1-3', '각기둥과 각뿔 공식 완료!', '칠각기둥 꼭짓점은 2×7=14개, 오각뿔 모서리는 2×5=10개입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 칠각기둥 꼭짓점은 14개, 오각뿔 모서리는 10개입니다.';
      }
    }

    function check13Submit() {
      const count = normTxt(document.getElementById('p13-count')?.value);
      const shape = normTxt(document.getElementById('p13-shape')?.value);
      const err = document.getElementById('p13-err');
      const isCount = (count === '5' || count.includes('5'));
      const isShape = (shape.includes('정삼각형') || shape === '삼각형');
      if (isCount && isShape) {
        err.style.display = 'none';
        handlePassAndNext('1-3', '1-4', '5가지 정다면체 완전 정복!', '정다면체는 5가지뿐이며, 정팔면체의 면은 정삼각형입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 정다면체는 "5"가지이며, 정팔면체의 면은 "정삼각형"입니다.';
      }
    }

    function check14Submit() {
      const euler = normTxt(document.getElementById('p14-euler')?.value);
      const err = document.getElementById('p14-err');
      if (euler === '2') {
        err.style.display = 'none';
        handlePassAndNext('1-4', '2-1', '오일러 다면체 정리 완료!', '모든 다면체에서 v - e + f = 2 가 항상 성립합니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. v - e + f = 2 입니다.';
      }
    }

    function check21Submit() {
      const rev = normTxt(document.getElementById('p21-rev')?.value);
      const shape = normTxt(document.getElementById('p21-shape')?.value);
      const err = document.getElementById('p21-err');
      const isRev = rev.includes('회전체');
      const isShape = shape.includes('원기둥');
      if (isRev && isShape) {
        err.style.display = 'none';
        handlePassAndNext('2-1', '2-2', '회전체의 뜻과 원기둥 완료!', '1회전 시켜 생기는 입체는 회전체, 직사각형 회전은 원기둥입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 첫 번째는 "회전체", 두 번째는 "원기둥"입니다.';
      }
    }

    function check22Submit() {
      const axis = normTxt(document.getElementById('p22-axis')?.value);
      const gen = normTxt(document.getElementById('p22-gen')?.value);
      const err = document.getElementById('p22-err');
      const isAxis = axis.includes('회전축');
      const isGen = gen.includes('모선');
      if (isAxis && isGen) {
        err.style.display = 'none';
        handlePassAndNext('2-2', '2-3', '회전체 구성 요소 완료!', '축이 되는 직선은 회전축, 옆면을 만드는 선분은 모선입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 첫 번째는 "회전축", 두 번째는 "모선"입니다.';
      }
    }

    function check23Submit() {
      const axis = normTxt(document.getElementById('p23-axis')?.value);
      const perp = normTxt(document.getElementById('p23-perp')?.value);
      const err = document.getElementById('p23-err');
      const isAxis = axis.includes('선대칭');
      const isPerp = perp.includes('원');
      if (isAxis && isPerp) {
        err.style.display = 'none';
        handlePassAndNext('2-3', '2-4', '회전체 단면의 성질 완료!', '회전축 포함 단면은 선대칭, 회전축 수직 단면은 항상 원입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 첫 번째는 "선대칭", 두 번째는 "원"입니다.';
      }
    }

    function check24Submit() {
      const cyl = normTxt(document.getElementById('p24-cyl')?.value);
      const cone = normTxt(document.getElementById('p24-cone')?.value);
      const err = document.getElementById('p24-err');
      const isCyl = cyl.includes('직사각형') || cyl.includes('사각형');
      const isCone = cone.includes('부채꼴');
      if (isCyl && isCone) {
        err.style.display = 'none';
        handlePassAndNext('2-4', '3-1', '회전체의 전개도 완료!', '원기둥 옆면은 직사각형, 원뿔 옆면은 부채꼴입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 원기둥 옆면은 "직사각형", 원뿔 옆면은 "부채꼴"입니다.';
      }
    }

    function check31Submit() {
      const base = normTxt(document.getElementById('p31-base')?.value);
      const err = document.getElementById('p31-err');
      if (base === '2') {
        err.style.display = 'none';
        handlePassAndNext('3-1', '3-2', '기둥 겉넓이 공식 유도 완료!', '기둥은 밑면이 2개이므로 밑넓이 × 2 + 옆넓이입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 밑넓이에 곱하는 수는 밑면이 2개이므로 "2"입니다.';
      }
    }

    function check32Submit() {
      const s = normTxt(document.getElementById('p32-s')?.value);
      const err = document.getElementById('p32-err');
      const isS = (s === '48π' || s === '48pi');
      if (isS) {
        err.style.display = 'none';
        handlePassAndNext('3-2', '3-3', '원기둥 겉넓이 계산 완료!', '18π + 30π = 48π cm²입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 겉넓이는 48π (또는 48pi) 입니다.';
      }
    }

    function check33Submit() {
      const v = normTxt(document.getElementById('p33-v')?.value);
      const err = document.getElementById('p33-err');
      const isV = (v === '45π' || v === '45pi');
      if (isV) {
        err.style.display = 'none';
        handlePassAndNext('3-3', '4-1', '원기둥의 부피 완료!', 'V = Sh = 9π × 5 = 45π cm³입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 부피는 45π (또는 45pi) 입니다.';
      }
    }

    function check41Submit() {
      const ratio = normTxt(document.getElementById('p41-ratio')?.value);
      const err = document.getElementById('p41-err');
      const isRatio = (ratio === '1/3' || ratio.includes('1/3') || ratio.includes('3분의1'));
      if (isRatio) {
        err.style.display = 'none';
        handlePassAndNext('4-1', '4-2', '뿔의 부피 공식 유도 완료!', '밑면과 높이가 같은 뿔의 부피는 기둥 부피의 1/3입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 기둥 부피의 "1/3" 입니다.';
      }
    }

    function check42Submit() {
      const s = normTxt(document.getElementById('p42-s')?.value);
      const err = document.getElementById('p42-err');
      const isS = (s === '56π' || s === '56pi');
      if (isS) {
        err.style.display = 'none';
        handlePassAndNext('4-2', '4-3', '원뿔의 겉넓이 완료!', '16π + 40π = 56π cm²입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 겉넓이는 56π (또는 56pi) 입니다.';
      }
    }

    function check43Submit() {
      const v = normTxt(document.getElementById('p43-v')?.value);
      const err = document.getElementById('p43-err');
      if (v === '96') {
        err.style.display = 'none';
        handlePassAndNext('4-3', '5-1', '사각뿔 부피 완료!', '1/3 × 36 × 8 = 96 cm³입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 부피는 96 입니다.';
      }
    }

    function check51Submit() {
      const ratio = normTxt(document.getElementById('p51-ratio')?.value);
      const err = document.getElementById('p51-err');
      if (ratio === '4') {
        err.style.display = 'none';
        handlePassAndNext('5-1', '5-2', '구의 겉넓이 공식 유도 완료!', '구의 겉넓이는 평면 원 넓이의 4배(S = 4πr²)입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 평면 원의 "4"배 입니다.';
      }
    }

    function check52Submit() {
      const v = normTxt(document.getElementById('p52-v')?.value);
      const err = document.getElementById('p52-err');
      const isV = (v === '36π' || v === '36pi');
      if (isV) {
        err.style.display = 'none';
        handlePassAndNext('5-2', '5-3', '구의 부피 계산 완료!', '4/3 × π × 27 = 36π cm³입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 부피는 36π (또는 36pi) 입니다.';
      }
    }

    function check53Submit() {
      const ratio = normTxt(document.getElementById('p53-ratio')?.value);
      const err = document.getElementById('p53-err');
      const isRatio = (ratio === '3:2:1' || ratio === '3,2,1' || ratio.includes('3:2:1'));
      if (isRatio) {
        err.style.display = 'none';
        handlePassAndNext('5-3', 'complete', '🎉 7단원 입체도형 완주 축하합니다!', '원기둥(3) : 구(2) : 원뿔(1) = 3:2:1의 아름다운 황금비율을 마스터했습니다!');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 원기둥 : 구 : 원뿔 = "3:2:1" 입니다.';
      }
    }
  `
};

// Generate HTML and write to g1_ch7_solid_figures.html
const htmlContent = createChapterHtml(ch7Config);
const targetPath = path.join(__dirname, 'g1_ch7_solid_figures.html');
fs.writeFileSync(targetPath, htmlContent, 'utf8');
console.log('Successfully built g1_ch7_solid_figures.html, size:', htmlContent.length);
