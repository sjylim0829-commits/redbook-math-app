const fs = require('fs');
const path = require('path');
const { createChapterHtml } = require('./master_template.js');

const ch8Config = {
  chapterNum: 8,
  chapterTitle: '8. 자료의 정리와 해석',
  chapterBadge: '중1 수학 8단원',
  mainTabs: [
    '0. 되짚어 보기',
    '8.1 대푯값과 평균·중앙값·최빈값',
    '8.2 줄기와 잎 그림',
    '8.3 도수분포표',
    '8.4 히스토그램과 도수분포다각형',
    '8.5 상대도수와 그 그래프'
  ],
  pillsConfig: {
    0: [
      { code: '0-1', label: '1. 초등 막대그래프와 수의 범위' },
      { code: '0-2', label: '2. 초등 꺾은선그래프와 변화 경향' },
      { code: '0-3', label: '3. 초등 평균의 개념과 계산' }
    ],
    1: [
      { code: '1-1', label: '1. 대푯값 시소 저울 시뮬레이터' },
      { code: '1-2', label: '2. 이상치(Outlier) 왜곡 실험실' },
      { code: '1-3', label: '3. 중앙값과 최빈값 탐색기' }
    ],
    2: [
      { code: '2-1', label: '1. 줄기와 잎 그림 인터랙티브 생성기' },
      { code: '2-2', label: '2. 줄기와 잎 그림의 해석' },
      { code: '2-3', label: '3. 줄기와 잎 그림의 장단점 비교' }
    ],
    3: [
      { code: '3-1', label: '1. 도수분포표 계급 구간 슬라이더' },
      { code: '3-2', label: '2. 계급값과 도수의 분포' },
      { code: '3-3', label: '3. 도수분포표 미지수 A 역추적' }
    ],
    4: [
      { code: '4-1', label: '1. 히스토그램 막대 인터랙터' },
      { code: '4-2', label: '2. 히스토그램 직사각형 넓이 총합' },
      { code: '4-3', label: '3. 히스토그램 ↔ 도수분포다각형 모핑 변환' }
    ],
    5: [
      { code: '5-1', label: '1. 상대도수 자동 계산기' },
      { code: '5-2', label: '2. 두 집단 상대도수 중첩 비교' },
      { code: '5-3', label: '3. 상대도수 다각형 넓이 총합 증명' }
    ]
  },
  substepDataJs: `
    const SUBSTEP_CONFIG = {
      '0-1': {
        mission: "<b>[되짚어 보기 1] 초등 막대그래프와 수의 범위</b><br>교과서 244쪽: 좌측 막대그래프를 보고 가장 많은 학생이 좋아하는 과일과 수의 범위를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              그래프를 분석하여 답을 입력하세요.<br>
              • 가장 많은 학생이 좋아하는 과일: ( <input type="text" id="p01-fruit" class="proof-input-text" style="width:90px;" placeholder="과일 이름"> )<br>
              • 수 중에서 40 이상 55 미만인 수의 개수: ( <input type="text" id="p01-count" class="proof-input-text" style="width:70px;" placeholder="개수 (숫자)"> )개
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check01Submit()">✅ 제출 및 채점</button>
            <div id="p01-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-2': {
        mission: "<b>[되짚어 보기 2] 초등 꺾은선그래프와 변화 경향</b><br>교과서 244쪽: 연속적으로 변화하는 양을 점으로 찍고 선분으로 연결한 그래프의 명칭을 입력하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              연속적 변화를 나타내는 그래프:<br>
              • 그래프의 명칭: ( <input type="text" id="p02-graph" class="proof-input-text" style="width:140px;" placeholder="그래프 명칭"> )<br>
              • 기온이 가장 많이 오른 요일 간격: ( <input type="text" id="p02-rise" class="proof-input-text" style="width:140px;" placeholder="예: 목~금"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check02Submit()">✅ 제출 및 채점</button>
            <div id="p02-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '0-3': {
        mission: "<b>[되짚어 보기 3] 초등 평균의 개념과 계산</b><br>교과서 244~245쪽: 4일간 수면 시간(6, 7, 7, 8)의 평균을 계산하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              수면 시간 6, 7, 7, 8 시간의 평균:<br>
              • 변량의 총합 = 28시간, 변량의 개수 = 4일<br>
              • 평균: ( <input type="text" id="p03-mean" class="proof-input-text" style="width:80px;" placeholder="평균 시간 (숫자)"> )시간
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check03Submit()">✅ 제출 및 채점</button>
            <div id="p03-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-1': {
        mission: "<b>[8.1 개념열기] 대푯값 시소 저울 시뮬레이터 (10대 시뮬레이터 #1)</b><br>교과서 244~247쪽: 좌측 시소 저울에서 받침점을 이동시켜 수평을 이루는 평균값을 찾으세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              턱걸이 횟수: 2, 3, 5, 5, 25 (단위: 회)<br>
              • 자료를 수량으로 나타낸 것: ( <input type="text" id="p11-term" class="proof-input-text" style="width:80px;" placeholder="용어 (2글자)"> )<br>
              • 시소가 완벽히 수평을 이루는 평균값: ( <input type="text" id="p11-mean" class="proof-input-text" style="width:70px;" placeholder="평균 횟수 (숫자)"> )회
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check11Submit()">✅ 제출 및 채점</button>
            <div id="p11-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-2': {
        mission: "<b>[8.1 개념학습] 이상치(Outlier) 왜곡 실험실 (10대 시뮬레이터 #2)</b><br>교과서 248~249쪽: 매우 크거나 작은 이상치가 있을 때, 평균과 중앙값 중 어느 것이 더 적절한지 분석하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              자료: 2, 3, 5, 5, 25<br>
              • 극단적인 이상치 25로 인해 평균(8)은 5명 중 4명의 점수보다 큰가요?: ( <input type="text" id="p12-effect" class="proof-input-text" style="width:80px;" placeholder="크다 / 작다"> )<br>
              • 크기순 나열 시 가운데 위치하는 중앙값: ( <input type="text" id="p12-median" class="proof-input-text" style="width:80px;" placeholder="중앙값 (숫자)"> )회
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check12Submit()">✅ 제출 및 채점</button>
            <div id="p12-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '1-3': {
        mission: "<b>[8.1 심화학습] 중앙값과 최빈값 탐색기 (10대 시뮬레이터 #3)</b><br>교과서 250~251쪽: 짝수 개의 자료(4, 7, 9, 12, 14, 18)의 중앙값을 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              자료: 4, 7, 9, 12, 14, 18 (짝수 6개)<br>
              • 가운데 두 값: 9 와 12<br>
              • 중앙값 = (9 + 12) ÷ 2: ( <input type="text" id="p13-median" class="proof-input-text" style="width:90px;" placeholder="중앙값 (소수)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check13Submit()">✅ 제출 및 채점</button>
            <div id="p13-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-1': {
        mission: "<b>[8.2 개념열기] 줄기와 잎 그림 인터랙티브 생성기 (10대 시뮬레이터 #4)</b><br>교과서 252~255쪽: 원자료를 십의 자리(줄기)와 일의 자리(잎)로 정리하는 방법을 탐구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              줄기와 잎 그림 규칙을 확인하세요.<br>
              • 잎은 ( <input type="text" id="p21-order" class="proof-input-text" style="width:120px;" placeholder="예: 작은 수부터"> ) 크기순으로 나열함<br>
              • 중복되는 잎의 처리: 중복된 횟수만큼 ( <input type="text" id="p21-dup" class="proof-input-text" style="width:120px;" placeholder="예: 모두 적는다"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check21Submit()">✅ 제출 및 채점</button>
            <div id="p21-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-2': {
        mission: "<b>[8.2 개념학습] 줄기와 잎 그림의 해석</b><br>교과서 254~255쪽: 좌측 줄기와 잎 그림에서 최솟값과 30회 이상인 학생 수를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              좌측 그림을 해석하세요.<br>
              • 가장 작은 값 (최솟값): ( <input type="text" id="p22-min" class="proof-input-text" style="width:70px;" placeholder="최솟값 (숫자)"> )회<br>
              • 30회 이상인 학생 수: ( <input type="text" id="p22-count" class="proof-input-text" style="width:70px;" placeholder="학생 수 (숫자)"> )명
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check22Submit()">✅ 제출 및 채점</button>
            <div id="p22-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '2-3': {
        mission: "<b>[8.2 장단점분석] 줄기와 잎 그림의 장단점 비교</b><br>교과서 254~255쪽: 줄기와 잎 그림의 대표적인 장점을 선택하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              줄기와 잎 그림의 장점:<br>
              • 원자료의 수치를 그대로 알 수 ( <input type="text" id="p23-adv" class="proof-input-text" style="width:90px;" placeholder="있다 / 없다"> )<br>
              • 자료의 수가 매우 많을 때는 도수분포표가 더 ( <input type="text" id="p23-suit" class="proof-input-text" style="width:90px;" placeholder="적합 / 부적합"> )하다
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check23Submit()">✅ 제출 및 채점</button>
            <div id="p23-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-1': {
        mission: "<b>[8.3 개념열기] 도수분포표 계급 구간 슬라이더 (10대 시뮬레이터 #5)</b><br>교과서 256~259쪽: 계급의 크기와 계급의 개수의 관계를 탐구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              60점 이상 70점 미만의 계급:<br>
              • 계급의 크기(양 끝값의 차 70 - 60): ( <input type="text" id="p31-width" class="proof-input-text" style="width:80px;" placeholder="계급의 크기 (숫자)"> )점<br>
              • 각 계급에 속하는 자료의 수: ( <input type="text" id="p31-term" class="proof-input-text" style="width:80px;" placeholder="용어 (2글자)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check31Submit()">✅ 제출 및 채점</button>
            <div id="p31-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-2': {
        mission: "<b>[8.3 개념학습] 계급값과 도수의 분포</b><br>교과서 258~259쪽: 계급 60 이상 70 미만의 계급값을 계산하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              계급값 = (계급의 양 끝값의 합) ÷ 2<br>
              • 60 이상 ~ 70 미만의 계급값: ( <input type="text" id="p32-mark" class="proof-input-text" style="width:80px;" placeholder="계급값 (숫자)"> )점
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check32Submit()">✅ 제출 및 채점</button>
            <div id="p32-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '3-3': {
        mission: "<b>[8.3 심화학습] 도수분포표 미지수 A 역추적</b><br>교과서 258~259쪽: 전체 학생 수 30명일 때, 계급 70~80점의 도수 A를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              도수의 총합: 30명 (다른 계급: 4, 11, 5명)<br>
              • 미지수 A = 30 - (4 + 11 + 5): ( <input type="text" id="p33-a" class="proof-input-text" style="width:80px;" placeholder="미지수 A (숫자)"> )명
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check33Submit()">✅ 제출 및 채점</button>
            <div id="p33-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-1': {
        mission: "<b>[8.4 개념열기] 히스토그램 막대 인터랙터 (10대 시뮬레이터 #6)</b><br>교과서 260~263쪽: 가로축과 세로축의 구성을 파악하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              히스토그램의 구성:<br>
              • 가로축에는 ( <input type="text" id="p41-xaxis" class="proof-input-text" style="width:90px;" placeholder="가로축 내용"> )의 양 끝값을 표시<br>
              • 세로축에는 ( <input type="text" id="p41-yaxis" class="proof-input-text" style="width:90px;" placeholder="세로축 내용"> )를 표시
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check41Submit()">✅ 제출 및 채점</button>
            <div id="p41-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-2': {
        mission: "<b>[8.4 공식적용] 히스토그램 직사각형 넓이 총합</b><br>교과서 262~263쪽: 계급의 크기가 10이고 도수의 총합이 25인 히스토그램 직사각형들의 넓이의 총합을 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              직사각형 넓이의 총합 = (계급의 크기) × (도수의 총합)<br>
              • 넓이의 총합 = 10 × 25: ( <input type="text" id="p42-area" class="proof-input-text" style="width:90px;" placeholder="넓이의 총합 (숫자)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check42Submit()">✅ 제출 및 채점</button>
            <div id="p42-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '4-3': {
        mission: "<b>[8.4 모핑변환] 히스토그램 ↔ 도수분포다각형 모핑 변환 (10대 시뮬레이터 #7)</b><br>교과서 264~267쪽: 도수분포다각형과 가로축으로 둘러싸인 넓이를 확인하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              히스토그램과 도수분포다각형의 넓이 관계:<br>
              • 잘려나간 부분과 채워진 삼각형은 서로 ( <input type="text" id="p43-congr" class="proof-input-text" style="width:90px;" placeholder="도형 관계"> )임<br>
              • 따라서 도수분포다각형이 둘러싼 넓이는 히스토그램 직사각형들의 넓이의 합과 ( <input type="text" id="p43-same" class="proof-input-text" style="width:80px;" placeholder="같다 / 다르다"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check43Submit()">✅ 제출 및 채점</button>
            <div id="p43-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-1': {
        mission: "<b>[8.5 개념열기] 상대도수 자동 계산기 (10대 시뮬레이터 #8)</b><br>교과서 268~271쪽: 도수의 총합이 25명일 때 도수 6명의 상대도수와 상대도수의 총합을 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              상대도수 = (계급의 도수) ÷ (도수의 총합)<br>
              • 도수 6명인 계급의 상대도수 (6 ÷ 25): ( <input type="text" id="p51-rel" class="proof-input-text" style="width:80px;" placeholder="상대도수 (소수)"> )<br>
              • 모든 계급의 상대도수의 총합: ( <input type="text" id="p51-sum" class="proof-input-text" style="width:60px;" placeholder="총합 (숫자)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check51Submit()">✅ 제출 및 채점</button>
            <div id="p51-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-2': {
        mission: "<b>[8.5 두집단비교] 두 집단 상대도수 중첩 비교 (10대 시뮬레이터 #9)</b><br>교과서 272~275쪽: 전체 인원이 다른 두 집단(A반 20명, B반 40명)을 비교하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              A반과 B반의 분포 비교:<br>
              • 도수의 총합이 다른 두 집단은 ( <input type="text" id="p52-term" class="proof-input-text" style="width:100px;" placeholder="통계 용어"> )로 비교해야 함<br>
              • 독서량이 더 많은 경향이 있는 반: ( <input type="text" id="p52-group" class="proof-input-text" style="width:70px;" placeholder="A반 / B반"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check52Submit()">✅ 제출 및 채점</button>
            <div id="p52-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      },
      '5-3': {
        mission: "<b>[8.5 넓이증명] 상대도수 다각형 넓이 총합 증명 (10대 시뮬레이터 #10)</b><br>교과서 274~275쪽: 계급의 크기가 2일 때 상대도수분포다각형과 가로축으로 둘러싸인 부분의 넓이를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="font-size:0.92rem; margin-bottom:14px; line-height:2.0;">
              둘러싸인 부분의 넓이 = (계급의 크기) × (상대도수의 총합)<br>
              • 상대도수의 총합 = 1 이므로:<br>
              • 둘러싸인 넓이 = 2 × 1: ( <input type="text" id="p53-area" class="proof-input-text" style="width:80px;" placeholder="넓이 (숫자)"> )
            </div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check53Submit()">✅ 제출 및 채점</button>
            <div id="p53-err" class="proof-error-notice" style="display:none;"></div>
          </div>
        \`
      }
    };
  `,
  canvasDrawersJs: fs.readFileSync(path.join(__dirname, 'ch8_canvas_drawers.js'), 'utf8'),
  validationHandlersJs: `
    function normTxt(t) {
      if (!t) return '';
      return t.toString().replace(/\\s+/g, '').toLowerCase();
    }

    function handlePassAndNext(currentCode, nextCode, title, desc) {
      if (!state.unlockedSubSteps.includes(nextCode) && nextCode !== 'complete') {
        state.unlockedSubSteps.push(nextCode);
      }
      state.verifiedViewData[currentCode] = { title, desc, nextCode };
      renderVerifiedAnswerView(title, desc, nextCode);
      if (typeof SoundFX !== 'undefined' && SoundFX.success) {
        SoundFX.success();
      }
    }

    function check01Submit() {
      const fruit = normTxt(document.getElementById('p01-fruit')?.value);
      const count = normTxt(document.getElementById('p01-count')?.value);
      const err = document.getElementById('p01-err');
      if (fruit.includes('귤') && count === '3') {
        err.style.display = 'none';
        handlePassAndNext('0-1', '0-2', '초등 복습 1 완료!', '가장 많은 과일은 귤(8명), 40 이상 55 미만인 수는 3개입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 과일은 "귤", 개수는 "3"개입니다.';
      }
    }

    function check02Submit() {
      const g = normTxt(document.getElementById('p02-graph')?.value);
      const r = normTxt(document.getElementById('p02-rise')?.value);
      const err = document.getElementById('p02-err');
      const isG = g.includes('꺾은선');
      const isR = (r.includes('목') && r.includes('금'));
      if (isG && isR) {
        err.style.display = 'none';
        handlePassAndNext('0-2', '0-3', '초등 복습 2 완료!', '꺾은선그래프는 연속적 변화를 나타내며, 목~금에 가장 많이 상승했습니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 그래프는 "꺾은선그래프", 요일은 "목~금"입니다.';
      }
    }

    function check03Submit() {
      const m = normTxt(document.getElementById('p03-mean')?.value);
      const err = document.getElementById('p03-err');
      if (m === '7') {
        err.style.display = 'none';
        handlePassAndNext('0-3', '1-1', '초등 복습 3 완료!', '평균 = 28 ÷ 4 = 7시간입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 평균은 "7"입니다.';
      }
    }

    function check11Submit() {
      const term = normTxt(document.getElementById('p11-term')?.value);
      const mean = normTxt(document.getElementById('p11-mean')?.value);
      const err = document.getElementById('p11-err');
      const isTerm = term.includes('변량');
      const isMean = (mean === '8');
      if (isTerm && isMean) {
        err.style.display = 'none';
        handlePassAndNext('1-1', '1-2', '대푯값과 평균 완료!', '수량으로 나타낸 자료는 변량, 시소 평형점은 평균(8)입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 용어는 "변량", 평균은 "8"입니다.';
      }
    }

    function check12Submit() {
      const effect = normTxt(document.getElementById('p12-effect')?.value);
      const med = normTxt(document.getElementById('p12-median')?.value);
      const err = document.getElementById('p12-err');
      const isEff = (effect.includes('크') || effect === 'o');
      const isMed = (med === '5');
      if (isEff && isMed) {
        err.style.display = 'none';
        handlePassAndNext('1-2', '1-3', '이상치와 중앙값 완료!', '이상치 때문에 평균은 대부분의 값보다 크며, 중앙값(5)이 자료를 더 잘 대표합니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 첫 번째는 "크다", 중앙값은 "5"입니다.';
      }
    }

    function check13Submit() {
      const med = normTxt(document.getElementById('p13-median')?.value);
      const err = document.getElementById('p13-err');
      const isMed = (med === '10.5' || med === '21/2');
      if (isMed) {
        err.style.display = 'none';
        handlePassAndNext('1-3', '2-1', '중앙값 계산 완료!', '자료가 짝수 개일 때 중앙값은 가운데 두 값의 평균인 10.5입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 중앙값은 "10.5"입니다.';
      }
    }

    function check21Submit() {
      const ord = normTxt(document.getElementById('p21-order')?.value);
      const dup = normTxt(document.getElementById('p21-dup')?.value);
      const err = document.getElementById('p21-err');
      const isOrd = ord.includes('작은');
      const isDup = (dup.includes('모두') || dup.includes('다'));
      if (isOrd && isDup) {
        err.style.display = 'none';
        handlePassAndNext('2-1', '2-2', '줄기와 잎 그림 규칙 완료!', '잎은 작은 수부터 차례로 적고, 중복된 값도 모두 적습니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 잎은 "작은 수부터", 중복은 "모두 적는다"입니다.';
      }
    }

    function check22Submit() {
      const min = normTxt(document.getElementById('p22-min')?.value);
      const cnt = normTxt(document.getElementById('p22-count')?.value);
      const err = document.getElementById('p22-err');
      if (min === '14' && cnt === '8') {
        err.style.display = 'none';
        handlePassAndNext('2-2', '2-3', '줄기와 잎 그림 해석 완료!', '최솟값은 14회, 30회 이상인 학생은 8명입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 최솟값은 14, 학생 수는 8입니다.';
      }
    }

    function check23Submit() {
      const adv = normTxt(document.getElementById('p23-adv')?.value);
      const suit = normTxt(document.getElementById('p23-suit')?.value);
      const err = document.getElementById('p23-err');
      const isAdv = (adv.includes('있') || adv === 'o');
      const isSuit = (suit.includes('적합') && !suit.includes('부적합'));
      if (isAdv && isSuit) {
        err.style.display = 'none';
        handlePassAndNext('2-3', '3-1', '장단점 비교 완료!', '줄기와 잎 그림은 원자료를 보존하지만, 자료가 많으면 도수분포표가 적합합니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 첫 번째는 "있다", 두 번째는 "적합"입니다.';
      }
    }

    function check31Submit() {
      const w = normTxt(document.getElementById('p31-width')?.value);
      const term = normTxt(document.getElementById('p31-term')?.value);
      const err = document.getElementById('p31-err');
      const isW = (w === '10');
      const isTerm = term.includes('도수');
      if (isW && isTerm) {
        err.style.display = 'none';
        handlePassAndNext('3-1', '3-2', '도수분포표 기초 완료!', '계급의 크기는 10점, 자료의 수는 도수입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 계급의 크기는 "10", 용어는 "도수"입니다.';
      }
    }

    function check32Submit() {
      const mark = normTxt(document.getElementById('p32-mark')?.value);
      const err = document.getElementById('p32-err');
      if (mark === '65') {
        err.style.display = 'none';
        handlePassAndNext('3-2', '3-3', '계급값 계산 완료!', '계급값 = (60 + 70) ÷ 2 = 65점입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 계급값은 "65"입니다.';
      }
    }

    function check33Submit() {
      const a = normTxt(document.getElementById('p33-a')?.value);
      const err = document.getElementById('p33-err');
      if (a === '10') {
        err.style.display = 'none';
        handlePassAndNext('3-3', '4-1', '도수 미지수 역추적 완료!', '미지수 A = 30 - 20 = 10명입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 미지수 A는 "10"입니다.';
      }
    }

    function check41Submit() {
      const x = normTxt(document.getElementById('p41-xaxis')?.value);
      const y = normTxt(document.getElementById('p41-yaxis')?.value);
      const err = document.getElementById('p41-err');
      const isX = x.includes('계급');
      const isY = y.includes('도수');
      if (isX && isY) {
        err.style.display = 'none';
        handlePassAndNext('4-1', '4-2', '히스토그램 구성 완료!', '가로축은 계급, 세로축은 도수를 나타냅니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 가로축은 "계급", 세로축은 "도수"입니다.';
      }
    }

    function check42Submit() {
      const area = normTxt(document.getElementById('p42-area')?.value);
      const err = document.getElementById('p42-err');
      if (area === '250') {
        err.style.display = 'none';
        handlePassAndNext('4-2', '4-3', '직사각형 넓이의 총합 완료!', '넓이의 총합 = (계급의 크기 10) × (도수의 총합 25) = 250입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 넓이의 총합은 "250"입니다.';
      }
    }

    function check43Submit() {
      const congr = normTxt(document.getElementById('p43-congr')?.value);
      const same = normTxt(document.getElementById('p43-same')?.value);
      const err = document.getElementById('p43-err');
      const isCongr = congr.includes('합동');
      const isSame = (same.includes('같') || same === 'o');
      if (isCongr && isSame) {
        err.style.display = 'none';
        handlePassAndNext('4-3', '5-1', '도수분포다각형 모핑 완료!', '삼각형이 서로 합동이므로 둘러싸인 넓이는 완벽히 같습니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 관계는 "합동", 넓이는 "같다"입니다.';
      }
    }

    function check51Submit() {
      const rel = normTxt(document.getElementById('p51-rel')?.value);
      const sum = normTxt(document.getElementById('p51-sum')?.value);
      const err = document.getElementById('p51-err');
      const isRel = (rel === '0.24' || rel === '.24');
      const isSum = (sum === '1' || sum === '1.0' || sum === '1.00');
      if (isRel && isSum) {
        err.style.display = 'none';
        handlePassAndNext('5-1', '5-2', '상대도수 계산 완료!', '상대도수 = 6 ÷ 25 = 0.24, 상대도수의 총합은 항상 1입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 상대도수는 "0.24", 총합은 "1"입니다.';
      }
    }

    function check52Submit() {
      const term = normTxt(document.getElementById('p52-term')?.value);
      const grp = normTxt(document.getElementById('p52-group')?.value);
      const err = document.getElementById('p52-err');
      const isTerm = term.includes('상대도수');
      const isGrp = grp.includes('b');
      if (isTerm && isGrp) {
        err.style.display = 'none';
        handlePassAndNext('5-2', '5-3', '두 집단 상대도수 비교 완료!', '도수의 총합이 다르면 상대도수로 비교하며, B반의 독서량이 더 많은 경향입니다.');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 용어는 "상대도수", 반은 "B반"입니다.';
      }
    }

    function check53Submit() {
      const area = normTxt(document.getElementById('p53-area')?.value);
      const err = document.getElementById('p53-err');
      if (area === '2') {
        err.style.display = 'none';
        handlePassAndNext('5-3', 'complete', '🎉 8단원 자료의 정리와 해석 완주 축하합니다!', '상대도수 다각형의 넓이 = (계급의 크기 2) × (총합 1) = 2로 항상 일정함을 마스터했습니다!');
      } else {
        err.style.display = 'block';
        err.innerText = '오답입니다. 둘러싸인 넓이는 "2"입니다.';
      }
    }
  `
};

// Generate HTML and write to g1_ch8_statistics.html
const htmlContent = createChapterHtml(ch8Config);
const targetPath = path.join(__dirname, 'g1_ch8_statistics.html');
fs.writeFileSync(targetPath, htmlContent, 'utf8');
console.log('Successfully built g1_ch8_statistics.html, size:', htmlContent.length);
