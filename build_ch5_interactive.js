const fs = require('fs');
const path = require('path');
const { createChapterHtml } = require('./master_template.js');

const ch5Config = {
  chapterNum: 5,
  chapterTitle: '5. 도형의 기초',
  chapterBadge: '중1 수학 5단원',
  mainTabs: [
    '0. 되짚어 보기',
    '5.1 점, 선, 면',
    '5.2 각과 위치 관계',
    '5.3 평행선의 성질',
    '5.4 작도와 합동',
    '5.5 마무리 & 프로젝트'
  ],
  pillsConfig: {
    0: [
      { code: '0-1', label: '1. 각도의 분류 (초등)' },
      { code: '0-2', label: '2. 삼각형 내각의 합 (초등)' },
      { code: '0-3', label: '3. 합동인 도형의 성질 (초등)' }
    ],
    1: [
      { code: '1-1', label: '1. 입체도형 교점 & 교선 3D 분해기' },
      { code: '1-2', label: '2. 직선·반직선·선분의 기호 표기' },
      { code: '1-3', label: '3. 선분 2등분·4등분 중점 슬라이더' },
      { code: '1-4', label: '4. 한 평면 위 세 점과 선분' }
    ],
    2: [
      { code: '2-1', label: '1. 가위 회전 맞꼭지각 대칭 실험실' },
      { code: '2-2', label: '2. 직교와 수직이등분선 & 수선의 발' },
      { code: '2-3', label: '3. 평면에서 두 직선의 위치 관계' },
      { code: '2-4', label: '4. 3D 직육면체 꼬인 위치 탐색기' }
    ],
    3: [
      { code: '3-1', label: '1. 평행선 동위각 슬라이딩 투영기' },
      { code: '3-2', label: '2. 평행선 엇각 크기 증명 및 계산' },
      { code: '3-3', label: '3. 꺾인 선 평행 보조선 인터랙터' },
      { code: '3-4', label: '4. 종이접기와 평행선 엇각 응용' }
    ],
    4: [
      { code: '4-1', label: '1. 눈금 없는 자 & 컴퍼스 복사기' },
      { code: '4-2', label: '2. 크기가 같은 각과 평행선 작도' },
      { code: '4-3', label: '3. 삼각형 결정조건과 변의 길이' },
      { code: '4-4', label: '4. SSS·SAS·ASA 삼각형 합동 매칭' }
    ],
    5: [
      { code: '5-1', label: '1. 5단원 도형의 기초 스스로 마무리' },
      { code: '5-2', label: '2. 창의융합: 나만의 기하 문양 작도실' }
    ]
  },
  substepDataJs: `
    const SUBSTEP_CONFIG = {
      '0-1': {
        mission: "<b>[되짚어 보기 1] 각도의 분류 (초등 4학년)</b><br>교과서 134쪽: 좌측의 회전 각도기를 조작해 보며 각도의 크기에 따른 명칭을 분류하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              각의 크기에 따른 분류를 입력하세요.<br>
              • $35^\\\\circ$는 어떤 각인가요? ( <input type="text" id="p01-q1" class="proof-input-text" style="width:100px;" placeholder="예각 / 둔각 / 직각"> )<br>
              • $145^\\\\circ$는 어떤 각인가요? ( <input type="text" id="p01-q2" class="proof-input-text" style="width:100px;" placeholder="예각 / 둔각 / 직각"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check01Submit()">✅ 제출 및 채점</button>
            <div id="p01-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-2': {
        mission: "<b>[되짚어 보기 2] 삼각형 세 내각의 크기의 합 (초등 4학년)</b><br>교과서 134쪽: 삼각형의 두 각의 크기가 각각 $55^\\\\circ, 65^\\\\circ$일 때, 나머지 한 각 $\\\\angle A$의 크기를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              삼각형의 세 내각의 크기의 합은 $180^\\\\circ$입니다.<br>
              • 나머지 한 각의 크기: ( <input type="text" id="p02-ans" class="proof-input-text" style="width:80px;" placeholder="각도 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check02Submit()">✅ 제출 및 채점</button>
            <div id="p02-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-3': {
        mission: "<b>[되짚어 보기 3] 합동인 도형의 성질 (초등 5학년)</b><br>교과서 134쪽: 서로 합동인 두 삼각형에서 대응변의 길이와 대응각의 크기의 관계를 서술하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              모양과 크기가 같아서 완전히 포개어지는 두 도형을 합동이라 합니다.<br>
              • 서로 합동인 두 도형에서 대응하는 변의 길이와 대응하는 각의 크기는 서로 ( <input type="text" id="p03-ans" class="proof-input-text" style="width:100px;" placeholder="관계 입력 (예: 같다)"> ).
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #059669, #0284c7);" onclick="check03Submit()">🏆 되짚어 보기 최종 제출</button>
            <div id="p03-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-1': {
        mission: "<b>[5.1 개념열기] 입체도형 교점 & 교선 3D 분해기</b><br>교과서 136~137쪽: 좌측의 3D 입체도형 분해기에서 오각기둥 모델의 교점과 교선의 개수를 각각 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>교점과 교선:</b> 선과 선 또는 선과 면이 만나 생기는 점을 <b>교점</b>(꼭짓점), 면과 면이 만나 생기는 선을 <b>교선</b>(모서리)이라 합니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              좌측의 오각기둥에 대하여:<br>
              • 교점(꼭짓점)의 개수: ( <input type="text" id="p11-v" class="proof-input-text" style="width:80px;" placeholder="개수 (숫자)"> )개<br>
              • 교선(모서리)의 개수: ( <input type="text" id="p11-e" class="proof-input-text" style="width:80px;" placeholder="개수 (숫자)"> )개
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check11Submit()">✅ 제출 및 채점</button>
            <div id="p11-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-2': {
        mission: "<b>[5.1 개념학습] 직선·반직선·선분의 기호 표기</b><br>교과서 138쪽: 다음 설명 중 참인 것은 'O', 거짓인 것은 'X'를 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① 반직선 AB와 반직선 BA는 서로 같은 도형이다: ( <input type="text" id="p12-q1" class="proof-input-text" style="width:60px;" placeholder="O 또는 X"> )<br>
              ② 직선 AB와 직선 BA는 서로 같은 도형이다: ( <input type="text" id="p12-q2" class="proof-input-text" style="width:60px;" placeholder="O 또는 X"> )<br>
              ③ 선분 AB와 선분 BA는 서로 같은 도형이다: ( <input type="text" id="p12-q3" class="proof-input-text" style="width:60px;" placeholder="O 또는 X"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check12Submit()">✅ 제출 및 채점</button>
            <div id="p12-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-3': {
        mission: "<b>[5.1 개념학습] 선분 2등분·4등분 중점 슬라이더</b><br>교과서 139~140쪽: 선분 $AB = 24\\\\text{ cm}$이고 점 $M$이 $AB$의 중점, 점 $N$이 $MB$의 중점일 때 길이를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              선분 $AB = 24\\\\text{ cm}$ 일 때,<br>
              • 선분 $AM$의 길이 = ( <input type="text" id="p13-am" class="proof-input-text" style="width:70px;" placeholder="길이 (숫자)"> ) cm<br>
              • 선분 $AN$의 길이 = ( <input type="text" id="p13-an" class="proof-input-text" style="width:70px;" placeholder="길이 (숫자)"> ) cm
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check13Submit()">✅ 제출 및 채점</button>
            <div id="p13-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-4': {
        mission: "<b>[5.1 스스로 확인하기] 한 평면 위 세 점과 선분, 반직선</b><br>교과서 140~141쪽: 한 직선 위에 있지 않은 세 점 $A, B, C$로 결정되는 서로 다른 직선과 반직선의 개수를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              세 점 $A, B, C$를 이을 때:<br>
              • 서로 다른 직선의 개수: ( <input type="text" id="p14-lines" class="proof-input-text" style="width:70px;" placeholder="개수 (숫자)"> )개<br>
              • 서로 다른 반직선의 개수: ( <input type="text" id="p14-rays" class="proof-input-text" style="width:70px;" placeholder="개수 (숫자)"> )개
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check14Submit()">✅ 제출 및 채점</button>
            <div id="p14-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-1': {
        mission: "<b>[5.2 개념열기] 가위 회전 맞꼭지각 대칭 실험실</b><br>교과서 144~145쪽: 두 직선이 만날 때 생기는 교각 중 한 각의 크기가 $65^\\\\circ$일 때, 맞꼭지각과 이웃한 각의 크기를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>맞꼭지각의 성질:</b> 맞꼭지각의 크기는 서로 같습니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              한 교각이 $65^\\\\circ$ 일 때,<br>
              • 마주 보는 맞꼭지각의 크기: ( <input type="text" id="p21-vert" class="proof-input-text" style="width:80px;" placeholder="각도 (숫자)"> )$^\\\\circ$<br>
              • 이웃한 각(평각의 보각)의 크기: ( <input type="text" id="p21-supp" class="proof-input-text" style="width:80px;" placeholder="각도 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check21Submit()">✅ 제출 및 채점</button>
            <div id="p21-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-2': {
        mission: "<b>[5.2 개념학습] 직교와 수직이등분선 & 수선의 발</b><br>교과서 144~146쪽: 수직 관계의 기호와 점과 직선 사이의 거리의 정의를 완성하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              • 두 직선 $AB$와 $CD$가 수직으로 만날 때 기호로 $AB$ ( <input type="text" id="p22-sym" class="proof-input-text" style="width:60px;" placeholder="기호 (예: ⊥)"> ) $CD$ 라 씁니다.<br>
              • 점 $P$에서 직선 $l$에 내린 수선과 직선 $l$의 교점을 ( <input type="text" id="p22-foot" class="proof-input-text" style="width:110px;" placeholder="명칭 입력"> )이라 합니다.
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check22Submit()">✅ 제출 및 채점</button>
            <div id="p22-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-3': {
        mission: "<b>[5.2 개념학습] 평면에서 두 직선의 위치 관계</b><br>교과서 148~149쪽: 한 평면 위에서 두 직선이 만나지 않을 때의 관계와 기호를 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              • 한 평면 위의 두 직선이 서로 만나지 않을 때, 두 직선은 서로 ( <input type="text" id="p23-rel" class="proof-input-text" style="width:90px;" placeholder="위치 관계 (예: 평행)"> )하다고 합니다.<br>
              • 두 직선 $l, m$이 평행함을 나타내는 기호: $l$ ( <input type="text" id="p23-sym" class="proof-input-text" style="width:60px;" placeholder="기호 (예: //)"> ) $m$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check23Submit()">✅ 제출 및 채점</button>
            <div id="p23-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-4': {
        mission: "<b>[5.2 개념열기] 3D 직육면체 꼬인 위치 탐색기</b><br>교과서 150~152쪽: 좌측 직육면체 $ABCD-EFGH$에서 모서리 $AB$와 꼬인 위치에 있는 모서리의 개수와 해당하는 모서리를 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>꼬인 위치:</b> 공간에서 두 직선이 <b>만나지도 않고 평행하지도 않은</b> 위치 관계를 말합니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              모서리 $AB$에 대하여:<br>
              • 꼬인 위치에 있는 모서리의 총 개수: ( <input type="text" id="p24-cnt" class="proof-input-text" style="width:60px;" placeholder="개수 (숫자)"> )개<br>
              • 꼬인 위치에 있는 모서리 중 하나: 모서리 ( <input type="text" id="p24-edge" class="proof-input-text" style="width:80px;" placeholder="모서리 기호 (예: CG)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check24Submit()">✅ 제출 및 채점</button>
            <div id="p24-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-1': {
        mission: "<b>[5.3 생각열기] 평행선 동위각 슬라이딩 투영기</b><br>교과서 154~156쪽: 평행선에서 동위각의 성질을 확인하고, $\\\\angle a = 60^\\\\circ$일 때 동위각 $\\\\angle b$의 크기를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>평행선과 동위각:</b> 서로 다른 두 직선이 한 직선과 만날 때, 두 직선이 평행하면 동위각의 크기는 서로 같습니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              $l // m$ 일 때,<br>
              • 동위각의 크기는 서로 ( <input type="text" id="p31-prop" class="proof-input-text" style="width:90px;" placeholder="성질 (예: 같다)"> ).<br>
              • $\\\\angle a = 60^\\\\circ$ 일 때 동위각 $\\\\angle b =$ ( <input type="text" id="p31-val" class="proof-input-text" style="width:70px;" placeholder="각도 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check31Submit()">✅ 제출 및 채점</button>
            <div id="p31-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-2': {
        mission: "<b>[5.3 개념학습] 평행선 엇각 크기 증명 및 계산</b><br>교과서 156~157쪽: $l // m$일 때 $\\\\angle a = 75^\\\\circ$이면 엇각 $\\\\angle x$의 크기를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              두 직선이 평행하면 엇각의 크기는 서로 같습니다.<br>
              • 엇각 $\\\\angle x =$ ( <input type="text" id="p32-val" class="proof-input-text" style="width:80px;" placeholder="각도 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check32Submit()">✅ 제출 및 채점</button>
            <div id="p32-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-3': {
        mission: "<b>[5.3 문제 3] 꺾인 선 평행 보조선 인터랙터</b><br>교과서 156~157쪽: 좌측의 [보조선 긋기] 버튼을 눌러 위 엇각($40^\\\\circ$)과 아래 엇각($30^\\\\circ$)의 합으로 $\\\\angle x$의 크기를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              꺾인 점을 지나고 두 직선에 평행한 보조선을 그을 때:<br>
              • $\\\\angle x = 40^\\\\circ + 30^\\\\circ =$ ( <input type="text" id="p33-x" class="proof-input-text" style="width:80px;" placeholder="각도 (숫자)"> )$^\\\\circ$
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check33Submit()">✅ 제출 및 채점</button>
            <div id="p33-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-4': {
        mission: "<b>[5.3 창의탐구] 종이접기와 평행선 엇각 응용</b><br>교과서 157쪽: 직사각형 모양의 종이테이프를 접었을 때 접힌 부분의 삼각형의 종류를 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              접은 각의 크기와 평행선의 엇각의 크기가 같으므로 두 밑각의 크기가 같습니다.<br>
              • 접힌 부분에 생기는 삼각형은 어떤 삼각형인가요? ( <input type="text" id="p34-tri" class="proof-input-text" style="width:120px;" placeholder="삼각형 종류 (예: 직각삼각형)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check34Submit()">✅ 제출 및 채점</button>
            <div id="p34-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-1': {
        mission: "<b>[5.4 생각열기] 눈금 없는 자 & 컴퍼스 복사기</b><br>교과서 160~162쪽: 작도에 사용하는 두 도구의 용도를 정확히 구별하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>작도 도구:</b> 눈금 없는 자와 컴퍼스만을 사용하여 도형을 그리는 것을 작도라고 합니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              • 원을 그리거나 선분의 길이를 재어 옮길 때 사용하는 도구: ( <input type="text" id="p41-compass" class="proof-input-text" style="width:100px;" placeholder="도구 명칭"> )<br>
              • 두 점을 잇는 선분을 긋거나 선을 연장할 때 사용하는 도구: ( <input type="text" id="p41-ruler" class="proof-input-text" style="width:120px;" placeholder="도구 명칭"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check41Submit()">✅ 제출 및 채점</button>
            <div id="p41-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-2': {
        mission: "<b>[5.4 개념학습] 크기가 같은 각과 평행선 작도</b><br>교과서 162~163쪽: 크기가 같은 각의 작도에서 평행선을 작도할 때 이용하는 각의 성질을 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              평행선 작도에서 두 직선이 한 직선과 만날 때 크기가 같음을 이용하는 각은?<br>
              • 이용하는 각의 명칭: ( <input type="text" id="p42-ang" class="proof-input-text" style="width:110px;" placeholder="각의 명칭 (예: 엇각)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check42Submit()">✅ 제출 및 채점</button>
            <div id="p42-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-3': {
        mission: "<b>[5.4 개념학습] 삼각형 결정조건과 변의 길이</b><br>교과서 164~168쪽: 주어진 세 선분의 길이로 삼각형을 만들 수 있는지 판별하세요. ('예' 또는 '아니오')",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>삼각형 변의 길이 조건:</b> 가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 작아야 합니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① 세 변의 길이가 $4\\\\text{ cm}, 5\\\\text{ cm}, 8\\\\text{ cm}$ 일 때 ($4+5 > 8$): ( <input type="text" id="p43-q1" class="proof-input-text" style="width:80px;" placeholder="예 / 아니오"> )<br>
              ② 세 변의 길이가 $3\\\\text{ cm}, 4\\\\text{ cm}, 8\\\\text{ cm}$ 일 때 ($3+4 < 8$): ( <input type="text" id="p43-q2" class="proof-input-text" style="width:80px;" placeholder="예 / 아니오"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check43Submit()">✅ 제출 및 채점</button>
            <div id="p43-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-4': {
        mission: "<b>[5.4 개념열기] SSS·SAS·ASA 삼각형 합동 매칭 결합기</b><br>교과서 170~173쪽: 삼각형의 3대 합동 조건의 명칭을 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.2;">
              ① 대응하는 세 변의 길이가 각각 같을 때: ( <input type="text" id="p44-c1" class="proof-input-text" style="width:70px;" placeholder="합동 조건 기호"> ) 합동<br>
              ② 대응하는 두 변의 길이와 그 끼인각의 크기가 각각 같을 때: ( <input type="text" id="p44-c2" class="proof-input-text" style="width:70px;" placeholder="합동 조건 기호"> ) 합동<br>
              ③ 대응하는 한 변의 길이와 그 양 끝 각의 크기가 각각 같을 때: ( <input type="text" id="p44-c3" class="proof-input-text" style="width:70px;" placeholder="합동 조건 기호"> ) 합동
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check44Submit()">✅ 제출 및 채점</button>
            <div id="p44-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-1': {
        mission: "<b>[5.5 마무리] 5단원 도형의 기초 스스로 마무리하기</b><br>교과서 174~175쪽: 5단원 핵심 문제 3문항의 정답을 도출하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              ① 맞꼭지각의 크기가 같으므로 $x + 40 = 2x - 10$ 일 때, $x =$ ( <input type="text" id="p51-x" class="proof-input-text" style="width:70px;" placeholder="숫자 입력"> )<br>
              ② 사각기둥에서 모서리 $AB$와 꼬인 위치에 있는 모서리의 개수 = ( <input type="text" id="p51-skew" class="proof-input-text" style="width:70px;" placeholder="개수 (숫자)"> )개<br>
              ③ 두 삼각형에서 두 변과 그 끼인각이 같을 때의 합동 조건: ( <input type="text" id="p51-cong" class="proof-input-text" style="width:80px;" placeholder="합동 조건"> ) 합동
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check51Submit()">✅ 제출 및 채점</button>
            <div id="p51-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-2': {
        mission: "<b>[5.5 창의융합] 나만의 기하학 문양 컴퍼스 작도실</b><br>교과서 176~177쪽: 좌측의 컴퍼스 작도실에서 6꽃잎 문양을 작도할 때 컴퍼스의 반지름 길이를 어떻게 해야 하는지 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div class="concept-box">
              💡 <b>기하학적 문양 작도:</b> 원의 중심과 원주 위의 점을 중심으로 동일한 반지름의 원을 연속해서 그리면 정육각형과 6꽃잎 로제트 문양이 나타납니다.
            </div>
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              원주 위의 점을 중심으로 꽃잎을 작도할 때:<br>
              • 컴퍼스의 반지름 길이를 ( <input type="text" id="p52-r" class="proof-input-text" style="width:90px;" placeholder="유지 / 변화"> )해야 균일한 꽃잎이 만들어집니다.
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; background:linear-gradient(135deg, #ec4899, #4f46e5);" onclick="check52Submit()">🏆 5단원 도형의 기초 완주 및 최종 제출</button>
            <div id="p52-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      }
    };
  `,
  canvasDrawersJs: fs.readFileSync(path.join(__dirname, 'ch5_canvas_drawers.js'), 'utf8'),
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
      const q1 = normTxt(document.getElementById('p01-q1')?.value);
      const q2 = normTxt(document.getElementById('p01-q2')?.value);
      const err = document.getElementById('p01-err');
      if (q1 === '예각' && q2 === '둔각') {
        err.style.display = 'none';
        handlePassAndNext('0-1', '0-2', '각도의 분류 완료!', '0도 초과 90도 미만은 예각, 90도 초과 180도 미만은 둔각입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 35°는 90°보다 작으므로 예각, 145°는 90°보다 크므로 둔각입니다.';
      }
    }

    function check02Submit() {
      const ans = normTxt(document.getElementById('p02-ans')?.value);
      const err = document.getElementById('p02-err');
      if (ans === '60' || ans === '60도') {
        err.style.display = 'none';
        handlePassAndNext('0-2', '0-3', '삼각형 내각의 합 확인 완료!', '삼각형의 세 내각의 합은 180도입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 180 - (55 + 65) = 60도입니다.';
      }
    }

    function check03Submit() {
      const ans = normTxt(document.getElementById('p03-ans')?.value);
      const err = document.getElementById('p03-err');
      if (ans.includes('같') || ans.includes('일치') || ans.includes('동일')) {
        err.style.display = 'none';
        handlePassAndNext('0-3', '1-1', '되짚어 보기 최종 완료!', '합동인 두 도형은 대응변의 길이와 대응각의 크기가 서로 같습니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 대응변의 길이와 대응각의 크기는 서로 "같다"를 입력하세요.';
      }
    }

    function check11Submit() {
      const v = normTxt(document.getElementById('p11-v')?.value);
      const e = normTxt(document.getElementById('p11-e')?.value);
      const err = document.getElementById('p11-err');
      if (v === '10' && e === '15') {
        err.style.display = 'none';
        handlePassAndNext('1-1', '1-2', '교점과 교선 탐구 완료!', '오각기둥의 꼭짓점(교점)은 10개, 모서리(교선)는 15개입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 오각기둥은 위아래 꼭짓점 5+5=10개, 모서리는 5+5+5=15개입니다.';
      }
    }

    function check12Submit() {
      const q1 = normTxt(document.getElementById('p12-q1')?.value);
      const q2 = normTxt(document.getElementById('p12-q2')?.value);
      const q3 = normTxt(document.getElementById('p12-q3')?.value);
      const err = document.getElementById('p12-err');
      if (q1 === 'x' && q2 === 'o' && q3 === 'o') {
        err.style.display = 'none';
        handlePassAndNext('1-2', '1-3', '기호 표기법 마스터!', '반직선은 시작점이 다르면 서로 다른 도형입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 반직선 AB와 BA는 시작점이 달라 서로 다른 도형(X)입니다.';
      }
    }

    function check13Submit() {
      const am = normTxt(document.getElementById('p13-am')?.value);
      const an = normTxt(document.getElementById('p13-an')?.value);
      const err = document.getElementById('p13-err');
      if (am === '12' && an === '18') {
        err.style.display = 'none';
        handlePassAndNext('1-3', '1-4', '선분의 중점 계산 완료!', 'AM = 12cm, MN = 6cm이므로 AN = 18cm입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. AB가 24cm이므로 AM=12cm, MB=12cm의 중점 N에 의해 MN=6cm, AN=18cm입니다.';
      }
    }

    function check14Submit() {
      const lines = normTxt(document.getElementById('p14-lines')?.value);
      const rays = normTxt(document.getElementById('p14-rays')?.value);
      const err = document.getElementById('p14-err');
      if (lines === '3' && rays === '6') {
        err.style.display = 'none';
        handlePassAndNext('1-4', '2-1', '점선면 소단원 마스터!', '서로 다른 직선은 3개, 반직선은 각 쌍마다 2개씩 총 6개입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 세 점 A, B, C로 만드는 직선은 3개, 반직선은 방향이 있어 6개입니다.';
      }
    }

    function check21Submit() {
      const vert = normTxt(document.getElementById('p21-vert')?.value);
      const supp = normTxt(document.getElementById('p21-supp')?.value);
      const err = document.getElementById('p21-err');
      if (vert === '65' && supp === '115') {
        err.style.display = 'none';
        handlePassAndNext('2-1', '2-2', '맞꼭지각 탐구 완료!', '맞꼭지각은 65도로 같고, 이웃각은 180 - 65 = 115도입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 맞꼭지각의 크기는 65도로 같고, 평각에서 65도를 뺀 각은 115도입니다.';
      }
    }

    function check22Submit() {
      const sym = normTxt(document.getElementById('p22-sym')?.value);
      const foot = normTxt(document.getElementById('p22-foot')?.value);
      const err = document.getElementById('p22-err');
      const isSymValid = (sym === '⊥' || sym === '수직' || sym === '직교');
      const isFootValid = (foot.includes('수선의발') || foot.includes('수선의 발'));
      if (isSymValid && isFootValid) {
        err.style.display = 'none';
        handlePassAndNext('2-2', '2-3', '직교와 수선의 발 확인 완료!', '수직 기호는 ⊥이며, 수선과 만나는 점을 수선의 발이라 합니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 기호 ⊥ (또는 수직)와 명칭 "수선의 발"을 정확히 입력하세요.';
      }
    }

    function check23Submit() {
      const rel = normTxt(document.getElementById('p23-rel')?.value);
      const sym = normTxt(document.getElementById('p23-sym')?.value);
      const err = document.getElementById('p23-err');
      const isRelValid = (rel.includes('평행'));
      const isSymValid = (sym === '//' || sym === '∥' || sym === '평행');
      if (isRelValid && isSymValid) {
        err.style.display = 'none';
        handlePassAndNext('2-3', '2-4', '평면 위치관계 완료!', '한 평면에서 만나지 않는 두 직선은 평행(l // m)합니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 위치 관계 "평행"과 기호 "//"를 입력하세요.';
      }
    }

    function check24Submit() {
      const cnt = normTxt(document.getElementById('p24-cnt')?.value);
      const edge = normTxt(document.getElementById('p24-edge')?.value).toUpperCase();
      const err = document.getElementById('p24-err');
      const validEdges = ['CG', 'DH', 'FG', 'HE', 'GC', 'HD', 'GF', 'EH'];
      if (cnt === '4' && validEdges.includes(edge)) {
        err.style.display = 'none';
        handlePassAndNext('2-4', '3-1', '꼬인 위치 완벽 정복!', '모서리 AB와 만나지도 않고 평행하지도 않은 꼬인 위치 모서리는 4개(CG, DH, FG, HE)입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 모서리 AB와 꼬인 위치인 모서리는 4개이며, 예: CG, DH, FG, HE 중 하나를 입력하세요.';
      }
    }

    function check31Submit() {
      const prop = normTxt(document.getElementById('p31-prop')?.value);
      const val = normTxt(document.getElementById('p31-val')?.value);
      const err = document.getElementById('p31-err');
      if (prop.includes('같') && val === '60') {
        err.style.display = 'none';
        handlePassAndNext('3-1', '3-2', '평행선과 동위각 탐구 완료!', '두 직선이 평행하면 동위각의 크기가 서로 같습니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 동위각의 크기는 서로 "같다", 각도는 60도입니다.';
      }
    }

    function check32Submit() {
      const val = normTxt(document.getElementById('p32-val')?.value);
      const err = document.getElementById('p32-err');
      if (val === '75') {
        err.style.display = 'none';
        handlePassAndNext('3-2', '3-3', '평행선과 엇각 계산 완료!', '두 직선이 평행하면 엇각의 크기가 서로 같습니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 평행선에서 엇각의 크기는 75도로 같습니다.';
      }
    }

    function check33Submit() {
      const x = normTxt(document.getElementById('p33-x')?.value);
      const err = document.getElementById('p33-err');
      if (x === '70') {
        err.style.display = 'none';
        handlePassAndNext('3-3', '3-4', '꺾인 선 평행 보조선 비법 완성!', '꺾인 점에 평행 보조선을 그으면 40 + 30 = 70도가 됩니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 위쪽 엇각 40도와 아래쪽 엇각 30도의 합인 70도입니다.';
      }
    }

    function check34Submit() {
      const tri = normTxt(document.getElementById('p34-tri')?.value);
      const err = document.getElementById('p34-err');
      if (tri.includes('이등변')) {
        err.style.display = 'none';
        handlePassAndNext('3-4', '4-1', '평행선의 성질 단원 마스터!', '접은 각과 엇각이 같아 두 밑각이 같은 이등변삼각형이 됩니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 두 밑각의 크기가 같으므로 "이등변삼각형"입니다.';
      }
    }

    function check41Submit() {
      const compass = normTxt(document.getElementById('p41-compass')?.value);
      const ruler = normTxt(document.getElementById('p41-ruler')?.value);
      const err = document.getElementById('p41-err');
      const isCompass = compass.includes('컴퍼스');
      const isRuler = ruler.includes('자');
      if (isCompass && isRuler) {
        err.style.display = 'none';
        handlePassAndNext('4-1', '4-2', '작도 도구의 기초 완료!', '컴퍼스는 길이를 옮길 때, 눈금 없는 자는 선분을 그을 때 사용합니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 길이를 재어 옮기는 도구는 "컴퍼스", 선분을 긋는 도구는 "눈금 없는 자"(또는 자)입니다.';
      }
    }

    function check42Submit() {
      const ang = normTxt(document.getElementById('p42-ang')?.value);
      const err = document.getElementById('p42-err');
      if (ang.includes('동위각') || ang.includes('엇각')) {
        err.style.display = 'none';
        handlePassAndNext('4-2', '4-3', '평행선 작도 원리 완료!', '동위각(또는 엇각)의 크기가 같으면 두 직선이 평행함을 이용합니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 평행선 작도에는 "동위각"의 크기가 같다는 성질을 이용합니다.';
      }
    }

    function check43Submit() {
      const q1 = normTxt(document.getElementById('p43-q1')?.value);
      const q2 = normTxt(document.getElementById('p43-q2')?.value);
      const err = document.getElementById('p43-err');
      const isQ1 = (q1 === '예' || q1 === 'o' || q1.includes('가능'));
      const isQ2 = (q2 === '아니오' || q2 === 'x' || q2.includes('불가'));
      if (isQ1 && isQ2) {
        err.style.display = 'none';
        handlePassAndNext('4-3', '4-4', '삼각형 결정 조건 판별 완료!', '가장 긴 변이 나머지 두 변의 합보다 작아야 삼각형이 됩니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 4+5>8 이므로 만들 수 있고(예), 3+4<8 이므로 만들 수 없습니다(아니오).';
      }
    }

    function check44Submit() {
      const c1 = normTxt(document.getElementById('p44-c1')?.value).toUpperCase();
      const c2 = normTxt(document.getElementById('p44-c2')?.value).toUpperCase();
      const c3 = normTxt(document.getElementById('p44-c3')?.value).toUpperCase();
      const err = document.getElementById('p44-err');
      if (c1.includes('SSS') && c2.includes('SAS') && c3.includes('ASA')) {
        err.style.display = 'none';
        handlePassAndNext('4-4', '5-1', '삼각형의 합동 조건 완전 정복!', '세 변은 SSS, 두 변과 끼인각은 SAS, 한 변과 양 끝각은 ASA 합동입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. ① SSS, ② SAS, ③ ASA 합동 조건을 정확히 입력하세요.';
      }
    }

    function check51Submit() {
      const x = normTxt(document.getElementById('p51-x')?.value);
      const skew = normTxt(document.getElementById('p51-skew')?.value);
      const cong = normTxt(document.getElementById('p51-cong')?.value).toUpperCase();
      const err = document.getElementById('p51-err');
      if (x === '50' && skew === '4' && cong.includes('SAS')) {
        err.style.display = 'none';
        handlePassAndNext('5-1', '5-2', '5단원 대단원 마무리 완료!', '맞꼭지각 방정식 해는 50, 꼬인 위치 모서리는 4개, 합동 조건은 SAS입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. ① 2x - x = 40 + 10 -> x = 50, ② 꼬인 위치 모서리 4개, ③ SAS 합동입니다.';
      }
    }

    function check52Submit() {
      const r = normTxt(document.getElementById('p52-r')?.value);
      const err = document.getElementById('p52-err');
      if (r.includes('유지') || r.includes('그대로') || r.includes('동일') || r.includes('같')) {
        err.style.display = 'none';
        handlePassAndNext('5-2', 'complete', '🎉 5단원 도형의 기초 완주 축하합니다!', '컴퍼스의 반지름을 그대로 유지하며 아름다운 기하학적 아라베스크 문양을 완성했습니다!');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 컴퍼스의 반지름 길이를 "유지"해야 균일한 6꽃잎 문양이 작도됩니다.';
      }
    }
  `
};

// Generate HTML and write to g1_ch5_geometry_base.html
const htmlContent = createChapterHtml(ch5Config);
const targetPath = path.join(__dirname, 'g1_ch5_geometry_base.html');
fs.writeFileSync(targetPath, htmlContent, 'utf8');
console.log('Successfully built g1_ch5_geometry_base.html, size:', htmlContent.length);
