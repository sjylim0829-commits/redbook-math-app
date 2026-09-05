const fs = require('fs');
const { execSync } = require('child_process');
const { createChapterHtml } = require('./master_template.js');

const ch1Config = {
  chapterNum: 1,
  chapterTitle: '1. 소인수분해',
  chapterBadge: '중1 수학 1단원',
  mainTabs: [
    '0. 되짚어 보기',
    '1.1 소수와 합성수',
    '1.2 소인수분해',
    '1.3 최대공약수',
    '1.4 최소공배수',
    '1.5 마무리 & 프로젝트'
  ],
  pillsConfig: {
    0: [
      { code: '0-1', label: '1. 약수 타일 직사각형 (초등)' },
      { code: '0-2', label: '2. 공약수와 최대공약수 (초등)' },
      { code: '0-3', label: '3. 공배수와 최소공배수 (초등)' }
    ],
    1: [
      { code: '1-1', label: '1. 자연수 분류 저울 (생각열기)' },
      { code: '1-2', label: '2. 소수와 합성수의 뜻' },
      { code: '1-3', label: '3. 에라토스테네스의 체' },
      { code: '1-4', label: '4. 소수/합성수 판별 퀴즈' }
    ],
    2: [
      { code: '2-1', label: '1. 거듭제곱 블록 배가기' },
      { code: '2-2', label: '2. 소인수분해 가지치기 트리' },
      { code: '2-3', label: '3. 소인수분해 격자표 약수 생성' },
      { code: '2-4', label: '4. 약수의 개수 공식 탐구' }
    ],
    3: [
      { code: '3-1', label: '1. 공약수 벤다이어그램' },
      { code: '3-2', label: '2. 소인수 거듭제곱 비교 저울' },
      { code: '3-3', label: '3. 최대공약수 형성평가' }
    ],
    4: [
      { code: '4-1', label: '1. 소인수분해로 최소공배수 구하기' },
      { code: '4-2', label: '2. 톱니바퀴 맞물림 회전기' },
      { code: '4-3', label: '3. 최소공배수 형성평가' }
    ],
    5: [
      { code: '5-1', label: '1. 1단원 스스로 마무리' },
      { code: '5-2', label: '2. 창의융합: 몬드리안 직사각형 분할' }
    ]
  },
  substepDataJs: `
    const SUBSTEP_CONFIG = {
      '0-1': {
        mission: "<b>[되짚어 보기 1] 약수와 배수의 관계 (초등 5~6학년)</b><br>교과서 10쪽: 좌측 인터랙티브 타일 배열기를 조작하여 12개의 타일로 만들 수 있는 직사각형의 가로, 세로를 찾고 12의 모든 약수를 적어보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:14px;">
              <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q1</span>
              <p style="margin-top:6px; font-weight:700; color:#1e293b;">12개의 타일로 만들 수 있는 직사각형의 변의 길이(약수)를 작은 수부터 차례로 모두 적으세요.</p>
              <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
                <span>12의 약수:</span>
                <input type="text" id="p01-ans" class="form-control proof-input-text" style="width:240px;" placeholder="예: 1, 2, 3, 4, 6, 12">
              </div>
            </div>
            <div id="p01-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check01Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '0-2': {
        mission: "<b>[되짚어 보기 2] 공약수와 최대공약수 (초등 5~6학년)</b><br>18의 약수와 24의 약수를 구하고, 두 수의 공통된 약수(공약수) 중 가장 큰 최대공약수를 찾으세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 18과 24의 공약수를 모두 쓰세요.</p>
              <input type="text" id="p02-common" class="form-control proof-input-text" style="width:100%; margin-top:4px;" placeholder="예: 1, 2, 3, 6">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 18과 24의 최대공약수를 구하세요.</p>
              <input type="text" id="p02-gcd" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="숫자만">
            </div>
            <div id="p02-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check02Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '0-3': {
        mission: "<b>[되짚어 보기 3] 공배수와 최소공배수 (초등 5~6학년)</b><br>4와 6의 배수를 각각 구하고, 두 수의 공배수 중 가장 작은 최소공배수를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 4와 6의 최소공배수를 구하세요.</p>
              <input type="text" id="p03-lcm" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="숫자 입력">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 4와 6의 공배수는 최소공배수의 어떤 수인가요?</p>
              <input type="text" id="p03-prop" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="예: 배수">
            </div>
            <div id="p03-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check03Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '1-1': {
        mission: "<b>[교과서 12쪽 생각열기] 자연수의 분류 (약수의 개수)</b><br>1부터 10까지의 수를 약수의 개수가 1개인 수, 2개인 수, 3개 이상인 수의 세 바구니로 분류해 보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 약수가 1개인 자연수는 무엇인가요?</p>
              <input type="text" id="p11-g1" class="form-control proof-input-text" style="width:80px; margin-top:4px;" placeholder="1">
            </div>
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">2) 약수가 2개인 자연수를 10 이하에서 모두 적으세요.</p>
              <input type="text" id="p11-g2" class="form-control proof-input-text" style="width:180px; margin-top:4px;" placeholder="예: 2, 3, 5, 7">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">3) 약수가 3개 이상인 자연수를 10 이하에서 모두 적으세요.</p>
              <input type="text" id="p11-g3" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="예: 4, 6, 8, 9, 10">
            </div>
            <div id="p11-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check11Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '1-2': {
        mission: "<b>[교과서 13~14쪽] 소수와 합성수의 뜻</b><br>1보다 큰 자연수 중에서 1과 자기 자신만을 약수로 가지는 수를 <b>소수</b>, 1보다 큰 자연수 중에서 소수가 아닌 수를 <b>합성수</b>라고 합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 1은 소수인가요, 합성수인가요?</p>
              <input type="text" id="p12-one" class="form-control proof-input-text" style="width:240px; margin-top:4px;" placeholder="예: 둘 다 아니다">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 가장 작은 소수이자 유일한 짝수 소수는 무엇인가요?</p>
              <input type="text" id="p12-two" class="form-control proof-input-text" style="width:80px; margin-top:4px;" placeholder="숫자">
            </div>
            <div id="p12-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check12Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '1-3': {
        mission: "<b>[교과서 15쪽 활동] 에라토스테네스의 체</b><br>고대 그리스 수학자 에라토스테네스가 고안한 방법으로 1부터 50까지의 자연수 중 소수를 체질하여 걸러내 보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <p style="font-weight:700; color:#1e293b; margin-bottom:12px;">좌측의 [에라토스테네스의 체 단계별 실행] 버튼들을 차례로 눌러 1부터 50까지의 소수를 찾아보세요.</p>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">1부터 50까지의 자연수 중 소수는 총 몇 개인가요?</p>
              <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                <input type="text" id="p13-count" class="form-control proof-input-text" style="width:100px;" placeholder="개수">
                <span>개</span>
              </div>
            </div>
            <div id="p13-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check13Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '1-4': {
        mission: "<b>[교과서 16쪽 문제] 소수와 합성수 판별 퀴즈</b><br>다음 수들이 소수인지 합성수인지 정확하게 판별해 보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:10px;">
              <span>• 17 : </span>
              <input type="text" id="p14-q1" class="form-control proof-input-text" style="width:100px;" placeholder="소수/합성수">
            </div>
            <div style="margin-bottom:10px;">
              <span>• 27 : </span>
              <input type="text" id="p14-q2" class="form-control proof-input-text" style="width:100px;" placeholder="소수/합성수">
            </div>
            <div style="margin-bottom:14px;">
              <span>• 31 : </span>
              <input type="text" id="p14-q3" class="form-control proof-input-text" style="width:100px;" placeholder="소수/합성수">
            </div>
            <div id="p14-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check14Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '2-1': {
        mission: "<b>[교과서 18쪽] 거듭제곱의 표현 (밑과 지수)</b><br>같은 수를 여러 번 곱할 때 곱하는 수(밑)와 곱한 횟수(지수)를 사용하여 거듭제곱으로 나타내는 방법을 탐구합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 2를 5번 곱한 것(2×2×2×2×2)에서 밑과 지수는?</p>
              <div style="display:flex; gap:12px; margin-top:6px;">
                <span>밑: <input type="text" id="p21-base" class="form-control proof-input-text" style="width:60px;" placeholder="2"></span>
                <span>지수: <input type="text" id="p21-exp" class="form-control proof-input-text" style="width:60px;" placeholder="5"></span>
              </div>
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 2의 5제곱(2^5)의 계산 결과는?</p>
              <input type="text" id="p21-val" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="32">
            </div>
            <div id="p21-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check21Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '2-2': {
        mission: "<b>[교과서 20~21쪽] 소인수분해 방법 (가지치기 트리)</b><br>1보다 큰 자연수를 오직 소수들의 곱으로만 나타내는 것을 <b>소인수분해</b>라고 합니다. 좌측 가지치기 트리를 통해 36과 60을 소인수분해해 보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 36을 소인수분해하여 거듭제곱으로 나타내세요.</p>
              <input type="text" id="p22-36" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="예: 2^2 * 3^2">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 60을 소인수분해하여 거듭제곱으로 나타내세요.</p>
              <input type="text" id="p22-60" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="예: 2^2 * 3 * 5">
            </div>
            <div id="p22-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check22Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '2-3': {
        mission: "<b>[교과서 23쪽] 소인수분해 격자표를 이용한 약수 구하기</b><br>72 = 2^3 × 3^2 의 약수를 2의 거듭제곱(1, 2, 4, 8)과 3의 거듭제곱(1, 3, 9)의 곱셈 격자표로 찾아보세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 72의 약수는 총 몇 개인가요?</p>
              <input type="text" id="p23-cnt" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="12">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 72의 약수 중 2번째로 큰 수는?</p>
              <input type="text" id="p23-second" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="36">
            </div>
            <div id="p23-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check23Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '2-4': {
        mission: "<b>[교과서 24쪽] 약수의 개수 공식 탐구</b><br>자연수 N이 a^m × b^n 으로 소인수분해될 때, 약수의 개수는 <b>(m+1)(n+1)</b>개입니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 2^4 × 3^2 의 약수의 개수는?</p>
              <input type="text" id="p24-q1" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="(4+1)*(2+1)">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 100 = 2^2 × 5^2 의 약수의 개수는?</p>
              <input type="text" id="p24-q2" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="숫자">
            </div>
            <div id="p24-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check24Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '3-1': {
        mission: "<b>[교과서 26~27쪽] 공약수와 서로소 (벤다이어그램)</b><br>두 수의 공약수가 1뿐일 때 두 수를 <b>서로소</b>라고 합니다. 18과 24의 공약수를 벤다이어그램으로 관찰하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 18과 24의 최대공약수는?</p>
              <input type="text" id="p31-gcd" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="6">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 9와 14는 서로소인가요? (예 / 아니오)</p>
              <input type="text" id="p31-coprime" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="예">
            </div>
            <div id="p31-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check31Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '3-2': {
        mission: "<b>[교과서 28쪽] 소인수분해를 이용한 최대공약수 구하기</b><br>소인수분해를 이용하면 각 수의 공통인 소인수 중 지수가 <b>작거나 같은 것</b>을 택하여 곱합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">2^2 × 3 과 2^3 × 3^2 의 최대공약수는?</p>
              <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                <span>거듭제곱 꼴: </span>
                <input type="text" id="p32-power" class="form-control proof-input-text" style="width:160px;" placeholder="2^2 * 3">
                <span>값: </span>
                <input type="text" id="p32-val" class="form-control proof-input-text" style="width:80px;" placeholder="12">
              </div>
            </div>
            <div id="p32-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check32Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '3-3': {
        mission: "<b>[교과서 30쪽 문제] 최대공약수 형성평가</b><br>세 수 24, 36, 60 의 최대공약수를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">24, 36, 60 의 최대공약수를 입력하세요.</p>
              <input type="text" id="p33-ans" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="12">
            </div>
            <div id="p33-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check33Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '4-1': {
        mission: "<b>[교과서 32쪽] 소인수분해를 이용한 최소공배수 구하기</b><br>각 수의 모든 소인수에 대하여 지수가 <b>크거나 같은 것</b>을 택하여 곱합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">2^2 × 3 과 2 × 3^2 × 5 의 최소공배수는?</p>
              <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                <span>거듭제곱 꼴: </span>
                <input type="text" id="p41-power" class="form-control proof-input-text" style="width:180px;" placeholder="2^2 * 3^2 * 5">
                <span>값: </span>
                <input type="text" id="p41-val" class="form-control proof-input-text" style="width:80px;" placeholder="180">
              </div>
            </div>
            <div id="p41-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check41Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '4-2': {
        mission: "<b>[교과서 34쪽 활동] 톱니바퀴 맞물림 회전 시뮬레이터</b><br>톱니의 개수가 각각 24개, 36개인 두 톱니바퀴 A, B가 맞물려 회전할 때, 처음으로 다시 맞물릴 때까지 맞물리는 톱니의 수(최소공배수)와 각각의 회전수를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 처음으로 다시 맞물릴 때까지 돌아간 톱니의 최소 개수(최소공배수)는?</p>
              <input type="text" id="p42-lcm" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="72">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 이때 톱니바퀴 A와 B는 각각 몇 바퀴 회전했나요?</p>
              <div style="display:flex; gap:12px; margin-top:6px;">
                <span>A: <input type="text" id="p42-rotA" class="form-control proof-input-text" style="width:60px;" placeholder="3"> 바퀴</span>
                <span>B: <input type="text" id="p42-rotB" class="form-control proof-input-text" style="width:60px;" placeholder="2"> 바퀴</span>
              </div>
            </div>
            <div id="p42-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check42Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '4-3': {
        mission: "<b>[교과서 36쪽] 최소공배수 형성평가</b><br>어느 버스 터미널에서 일반버스는 15분마다, 좌석버스는 20분마다 출발합니다. 오전 7시에 두 버스가 동시에 출발한 후 처음으로 다시 동시에 출발하는 시각을 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 15와 20의 최소공배수는 몇 분인가요?</p>
              <input type="text" id="p43-min" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="60">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 다시 동시에 출발하는 시각은?</p>
              <input type="text" id="p43-time" class="form-control proof-input-text" style="width:140px; margin-top:4px;" placeholder="예: 오전 8시 또는 8시">
            </div>
            <div id="p43-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check43Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '5-1': {
        mission: "<b>[대단원 스스로 마무리] 소인수분해 핵심 정리</b><br>1단원의 핵심 개념인 소수, 소인수분해, 최대공약수, 최소공배수 개념을 종합 점검합니다.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 20보다 작은 소수의 개수는 몇 개인가요?</p>
              <input type="text" id="p51-q1" class="form-control proof-input-text" style="width:80px; margin-top:4px;" placeholder="8">
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 두 자연수 A, B의 최대공약수가 12일 때, 두 수의 공약수의 개수는?</p>
              <input type="text" id="p51-q2" class="form-control proof-input-text" style="width:80px; margin-top:4px;" placeholder="6">
            </div>
            <div id="p51-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check51Submit()">✅ 제출 및 채점</button>
          </div>
        \`
      },
      '5-2': {
        mission: "<b>[창의융합 프로젝트] 몬드리안 직사각형 분할 (교과서 38쪽)</b><br>가로 36cm, 세로 24cm 인 직사각형 모양의 종이를 남김없이 똑같은 크기의 가장 큰 정사각형 모양으로 분할하려 합니다. 최대공약수를 활용해 타일의 한 변의 길이와 총 타일의 개수를 구하세요.",
        formHtml: \`
          <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
            <div style="margin-bottom:12px;">
              <p style="font-weight:700; color:#1e293b;">1) 가장 큰 정사각형 타일의 한 변의 길이는? (최대공약수)</p>
              <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
                <input type="text" id="p52-size" class="form-control proof-input-text" style="width:100px;" placeholder="12">
                <span>cm</span>
              </div>
            </div>
            <div style="margin-bottom:14px;">
              <p style="font-weight:700; color:#1e293b;">2) 필요한 정사각형 타일은 총 몇 장인가요?</p>
              <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
                <input type="text" id="p52-count" class="form-control proof-input-text" style="width:100px;" placeholder="6">
                <span>장</span>
              </div>
            </div>
            <div id="p52-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
            <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check52Submit()">🏆 1단원 최종 마스터 제출</button>
          </div>
        \`
      }
    };
  `,
  canvasDrawersJs: `
    // State store for Interactive Simulators in Chapter 1
    const simState = {
      tileRows: 2,
      tileCols: 6,
      classifiedGroups: { 1: 1, 2: 2, 3: 2, 4: 3, 5: 2, 6: 3, 7: 2, 8: 3, 9: 3, 10: 3 },
      sieveStep: 0,
      powerBase: 2,
      powerExp: 3,
      treeStep: 1,
      vennA: 18,
      vennB: 24,
      gearAngle: 0,
      mondrianSize: 12
    };
    window.simState = simState;

    function setupSubstepSimulator(two, code, simController) {
      if (!two) return;
      two.clear();
      const w = two.width, h = two.height;
      const cx = w / 2, cy = h / 2;

      if (simController) {
        simController.style.display = 'block';
      }

      if (code === '0-1') {
        // 0-1: 12 tiles rectangle array builder
        if (simController) {
          simController.innerHTML = \`
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">🧱 12개 타일 직사각형 배열기:</span>
              <div style="display:flex; gap:6px;">
                <button class="btn" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.82rem;" onclick="setTileArray(1, 12)">1 × 12 배열</button>
                <button class="btn" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.82rem;" onclick="setTileArray(2, 6)">2 × 6 배열</button>
                <button class="btn" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.82rem;" onclick="setTileArray(3, 4)">3 × 4 배열</button>
              </div>
              <span id="tile-array-badge" style="background:#f0fdf4; color:#166534; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #86efac;">
                배열: \${simState.tileRows}행 × \${simState.tileCols}열 = 12
              </span>
            </div>
          \`;
        }
        renderTileArrayCanvas(two, simState.tileRows, simState.tileCols);
      } else if (code === '1-1') {
        // 1-1: 자연수 분류 저울
        if (simController) {
          simController.innerHTML = \`
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">⚖️ 1~10 약수 개수 분류 저울:</span>
              <div style="display:flex; gap:4px; flex-wrap:wrap;">
                \${[1,2,3,4,5,6,7,8,9,10].map(n => \`<button class="btn" style="padding:2px 7px; font-size:0.78rem; background:#f1f5f9; font-weight:700;" onclick="inspectNumberFactors(\${n})">\${n}</button>\`).join('')}
              </div>
              <span id="classify-badge" style="background:#eef2ff; color:#4338ca; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                선택: 2 (약수: 1, 2 ➔ 2개)
              </span>
            </div>
          \`;
        }
        renderClassifyCanvas(two, 2);
      } else if (code === '1-3') {
        // 1-3: 에라토스테네스의 체
        if (simController) {
          simController.innerHTML = \`
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#d97706; font-size:0.92rem;">🔍 에라토스테네스의 체 (1~50):</span>
              <div style="display:flex; gap:4px; flex-wrap:wrap;">
                <button class="btn" style="background:#fee2e2; color:#b91c1c; font-weight:700; font-size:0.78rem;" onclick="stepSieve(1)">1단계: 1 제외</button>
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:700; font-size:0.78rem;" onclick="stepSieve(2)">2단계: 2배수 지우기</button>
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:700; font-size:0.78rem;" onclick="stepSieve(3)">3단계: 3배수 지우기</button>
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:700; font-size:0.78rem;" onclick="stepSieve(4)">4단계: 5배수 지우기</button>
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:700; font-size:0.78rem;" onclick="stepSieve(5)">5단계: 7배수 지우기</button>
                <button class="btn" style="background:#dcfce7; color:#15803d; font-weight:800; font-size:0.78rem;" onclick="stepSieve(6)">🏆 소수 15개 발견!</button>
              </div>
            </div>
          \`;
        }
        renderSieveCanvas(two, simState.sieveStep);
      } else if (code === '2-1') {
        // 2-1: 거듭제곱 배가 시뮬레이터
        if (simController) {
          simController.innerHTML = \`
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">📈 거듭제곱 블록 배가 시뮬레이터:</span>
              <div style="display:flex; gap:6px;">
                <button class="btn" style="background:#eef2ff; color:#4338ca; font-weight:700; font-size:0.82rem;" onclick="setPowerSim(2, 1)">2¹ = 2</button>
                <button class="btn" style="background:#eef2ff; color:#4338ca; font-weight:700; font-size:0.82rem;" onclick="setPowerSim(2, 2)">2² = 4</button>
                <button class="btn" style="background:#eef2ff; color:#4338ca; font-weight:700; font-size:0.82rem;" onclick="setPowerSim(2, 3)">2³ = 8</button>
                <button class="btn" style="background:#eef2ff; color:#4338ca; font-weight:700; font-size:0.82rem;" onclick="setPowerSim(2, 4)">2⁴ = 16</button>
                <button class="btn" style="background:#eef2ff; color:#4338ca; font-weight:700; font-size:0.82rem;" onclick="setPowerSim(2, 5)">2⁵ = 32</button>
              </div>
              <span id="power-readout" style="background:#fdf2f8; color:#be185d; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem; border:1px solid #fbcfe8;">
                2³ = 8 (밑: 2, 지수: 3)
              </span>
            </div>
          \`;
        }
        renderPowerCanvas(two, simState.powerBase, simState.powerExp);
      } else if (code === '2-2') {
        // 2-2: 소인수분해 가지치기 트리 빌더
        if (simController) {
          simController.innerHTML = \`
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#059669; font-size:0.92rem;">🌳 소인수분해 가지치기 트리:</span>
              <div style="display:flex; gap:6px;">
                <button class="btn" style="background:#f0fdf4; color:#166534; font-weight:700; font-size:0.82rem;" onclick="stepFactorTree(36)">36 가지치기 분해</button>
                <button class="btn" style="background:#f0fdf4; color:#166534; font-weight:700; font-size:0.82rem;" onclick="stepFactorTree(60)">60 가지치기 분해</button>
                <button class="btn" style="background:#f0fdf4; color:#166534; font-weight:700; font-size:0.82rem;" onclick="stepFactorTree(72)">72 가지치기 분해</button>
              </div>
            </div>
          \`;
        }
        renderFactorTreeCanvas(two, 36);
      } else if (code === '2-3') {
        // 2-3: 격자표 약수 생성기
        if (simController) {
          simController.innerHTML = \`
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4338ca; font-size:0.92rem;">📊 소인수 격자 곱셈표 (72 = 2³ × 3²):</span>
              <span style="background:#e0f2fe; color:#0369a1; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                약수 개수: (3+1) × (2+1) = 12개
              </span>
            </div>
          \`;
        }
        renderFactorGridCanvas(two);
      } else if (code === '3-1') {
        // 3-1: 공약수 벤다이어그램
        if (simController) {
          simController.innerHTML = \`
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#0284c7; font-size:0.92rem;">⭕ 18과 24의 공약수 벤다이어그램:</span>
              <div style="display:flex; gap:6px;">
                <button class="btn" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.82rem;" onclick="setVennFactors(18, 24)">18 & 24 벤다이어그램</button>
                <button class="btn" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.82rem;" onclick="setVennFactors(12, 18)">12 & 18 벤다이어그램</button>
              </div>
              <span style="background:#fef3c7; color:#b45309; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                공약수: 1, 2, 3, 6 (최대공약수: 6)
              </span>
            </div>
          \`;
        }
        renderVennCanvas(two, 18, 24);
      } else if (code === '3-2') {
        // 3-2: 소인수 거듭제곱 비교 저울
        if (simController) {
          simController.innerHTML = \`
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#4f46e5; font-size:0.92rem;">⚖️ 거듭제곱 지수 비교 (작은 지수 선택):</span>
              <button class="btn btn-primary" style="font-size:0.82rem; font-weight:800; padding:4px 12px;" onclick="compareGcdPowers()">🔍 최소 지수 추출 ➔ 최대공약수 도출</button>
            </div>
          \`;
        }
        renderGcdPowerCanvas(two);
      } else if (code === '4-2') {
        // 4-2: 톱니바퀴 맞물림 회전기
        if (simController) {
          simController.innerHTML = \`
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#d97706; font-size:0.92rem;">⚙️ 톱니바퀴 A(24개) & B(36개) 맞물림 회전:</span>
              <div style="display:flex; gap:6px;">
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:800; font-size:0.82rem;" onclick="rotateGears(1)">▶ 회전 진행 (24톱니)</button>
                <button class="btn" style="background:#fef3c7; color:#b45309; font-weight:800; font-size:0.82rem;" onclick="rotateGears(2)">▶ 48톱니</button>
                <button class="btn" style="background:#dcfce7; color:#15803d; font-weight:800; font-size:0.82rem;" onclick="rotateGears(3)">🏆 72톱니 (동시 복귀!)</button>
                <button class="btn" style="background:#f1f5f9; color:#475569; font-size:0.82rem;" onclick="resetGears()">🔄 초기화</button>
              </div>
              <span id="gear-readout" style="background:#e0f2fe; color:#0369a1; font-weight:800; padding:4px 10px; border-radius:12px; font-size:0.82rem;">
                현재: 0톱니 (A: 0바퀴, B: 0바퀴)
              </span>
            </div>
          \`;
        }
        renderGearCanvas(two, 0, 0);
      } else if (code === '5-2') {
        // 5-2: 몬드리안 직사각형 분할
        if (simController) {
          simController.innerHTML = \`
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <span style="font-weight:800; color:#e11d48; font-size:0.92rem;">🎨 몬드리안 타일 분할 (36cm × 24cm):</span>
              <div style="display:flex; gap:6px;">
                <button class="btn" style="background:#fee2e2; color:#be123c; font-weight:700; font-size:0.82rem;" onclick="setMondrianTiles(6)">변의 길이: 6cm (24장)</button>
                <button class="btn" style="background:#dcfce7; color:#15803d; font-weight:800; font-size:0.82rem;" onclick="setMondrianTiles(12)">🏆 최대공약수: 12cm (6장)</button>
              </div>
            </div>
          \`;
        }
        renderMondrianCanvas(two, 36, 24, simState.mondrianSize);
      } else {
        // Generic visual fallback
        if (simController) simController.style.display = 'none';
        const title = two.makeText(SUBSTEP_TITLES[code] || '1단원 소인수분해', cx, cy - 30);
        title.size = 18; title.weight = 800; title.fill = '#4f46e5';
        const sub = two.makeText('교과서 수학 개념 및 탐구 활동', cx, cy + 15);
        sub.size = 14; sub.fill = '#64748b';
      }

      two.update();
    }

    // --- CANVAS RENDERERS (Two.js) ---

    function renderTileArrayCanvas(two, rows, cols) {
      two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      const title = two.makeText(\`12개의 타일 배열: \${rows}행 × \${cols}열 = 12\`, cx, 40);
      title.size = 16; title.weight = 800; title.fill = '#1e293b';

      const tileW = Math.min(38, Math.floor(400 / cols));
      const tileH = Math.min(38, Math.floor(240 / rows));
      const startX = cx - (cols * tileW) / 2 + tileW / 2;
      const startY = cy - (rows * tileH) / 2 + tileH / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rect = two.makeRoundedRectangle(startX + c * tileW, startY + r * tileH, tileW - 4, tileH - 4, 4);
          rect.fill = '#38bdf8'; rect.stroke = '#0284c7'; rect.linewidth = 2;
        }
      }

      const info = two.makeText(\`가로 \${cols}개, 세로 \${rows}개 ➔ 12의 약수 쌍: (\${rows}, \${cols})\`, cx, cy + 140);
      info.size = 15; info.weight = 800; info.fill = '#0369a1';
      two.update();
    }

    function renderClassifyCanvas(two, targetNum) {
      two.clear();
      const cx = two.width / 2;
      const title = two.makeText('자연수의 약수 개수 분류 저울 (교과서 12쪽)', cx, 35);
      title.size = 16; title.weight = 800; title.fill = '#1e293b';

      // 3 Baskets
      const b1 = two.makeRoundedRectangle(cx - 180, 160, 160, 180, 12);
      b1.fill = '#f8fafc'; b1.stroke = '#cbd5e1'; b1.linewidth = 2;
      const t1 = two.makeText('약수 1개', cx - 180, 95);
      t1.size = 15; t1.weight = 800; t1.fill = '#64748b';
      const c1 = two.makeText('1', cx - 180, 160);
      c1.size = 24; c1.weight = 800; c1.fill = '#0f172a';

      const b2 = two.makeRoundedRectangle(cx, 160, 160, 180, 12);
      b2.fill = '#fef3c7'; b2.stroke = '#f59e0b'; b2.linewidth = 2.5;
      const t2 = two.makeText('약수 2개 (소수)', cx, 95);
      t2.size = 15; t2.weight = 800; t2.fill = '#b45309';
      const c2 = two.makeText('2, 3, 5, 7', cx, 160);
      c2.size = 20; c2.weight = 800; c2.fill = '#b45309';

      const b3 = two.makeRoundedRectangle(cx + 180, 160, 160, 180, 12);
      b3.fill = '#f0fdf4'; b3.stroke = '#10b981'; b3.linewidth = 2;
      const t3 = two.makeText('약수 3개 이상 (합성수)', cx + 180, 95);
      t3.size = 14; t3.weight = 800; t3.fill = '#047857';
      const c3 = two.makeText('4, 6, 8, 9, 10', cx + 180, 160);
      c3.size = 18; c3.weight = 800; c3.fill = '#047857';

      two.update();
    }

    function renderSieveCanvas(two, step) {
      two.clear();
      const cx = two.width / 2;
      const title = two.makeText('에라토스테네스의 체 (1~50)', cx, 30);
      title.size = 16; title.weight = 800; title.fill = '#1e293b';

      const cols = 10, rows = 5;
      const startX = cx - 180, startY = 75;
      const cellW = 38, cellH = 38;
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

      for (let i = 1; i <= 50; i++) {
        const c = (i - 1) % cols;
        const r = Math.floor((i - 1) / cols);
        const x = startX + c * cellW;
        const y = startY + r * cellH;

        let isCrossed = false;
        let isPrimeHighlight = false;

        if (step >= 1 && i === 1) isCrossed = true;
        if (step >= 2 && i > 2 && i % 2 === 0) isCrossed = true;
        if (step >= 3 && i > 3 && i % 3 === 0) isCrossed = true;
        if (step >= 4 && i > 5 && i % 5 === 0) isCrossed = true;
        if (step >= 5 && i > 7 && i % 7 === 0) isCrossed = true;
        if (step >= 6 && primes.includes(i)) isPrimeHighlight = true;

        const rect = two.makeRoundedRectangle(x, y, 32, 32, 6);
        if (isPrimeHighlight) {
          rect.fill = '#fef08a'; rect.stroke = '#eab308'; rect.linewidth = 2.5;
        } else if (isCrossed) {
          rect.fill = '#fee2e2'; rect.stroke = '#fca5a5'; rect.linewidth = 1;
        } else {
          rect.fill = '#f8fafc'; rect.stroke = '#cbd5e1'; rect.linewidth = 1;
        }

        const txt = two.makeText(String(i), x, y);
        txt.size = 13;
        txt.weight = isPrimeHighlight ? 800 : (isCrossed ? 400 : 600);
        txt.fill = isPrimeHighlight ? '#854d0e' : (isCrossed ? '#ef4444' : '#1e293b');
      }

      two.update();
    }

    function renderPowerCanvas(two, base, exp) {
      two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      const val = Math.pow(base, exp);

      const title = two.makeText(\`거듭제곱: \${base}^\${exp} = \${val}\`, cx, 40);
      title.size = 18; title.weight = 800; title.fill = '#4f46e5';

      const blocksCount = Math.min(32, val);
      const cols = 8;
      const bW = 28, bH = 28;
      const rows = Math.ceil(blocksCount / cols);
      const startX = cx - (cols * bW) / 2 + bW / 2;
      const startY = cy - (rows * bH) / 2;

      for (let i = 0; i < blocksCount; i++) {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const rect = two.makeRoundedRectangle(startX + c * bW, startY + r * bH, bW - 4, bH - 4, 4);
        rect.fill = '#818cf8'; rect.stroke = '#4f46e5'; rect.linewidth = 2;
      }

      const desc = two.makeText(\`밑(곱하는 수): \${base} | 지수(곱한 횟수): \${exp} ➔ 총 \${val}개\`, cx, cy + 120);
      desc.size = 15; desc.weight = 700; desc.fill = '#334155';
      two.update();
    }

    function renderFactorTreeCanvas(two, target) {
      two.clear();
      const cx = two.width / 2;
      const title = two.makeText(\`\${target} 의 소인수분해 가지치기 트리\`, cx, 40);
      title.size = 17; title.weight = 800; title.fill = '#059669';

      // Root
      const r0 = two.makeCircle(cx, 90, 24);
      r0.fill = '#e0f2fe'; r0.stroke = '#0284c7'; r0.linewidth = 2.5;
      const t0 = two.makeText(String(target), cx, 90);
      t0.size = 15; t0.weight = 800; t0.fill = '#0369a1';

      if (target === 36) {
        // 36 -> 2 & 18
        two.makeLine(cx, 114, cx - 80, 160).stroke = '#94a3b8';
        two.makeLine(cx, 114, cx + 80, 160).stroke = '#94a3b8';

        const p1 = two.makeCircle(cx - 80, 160, 20);
        p1.fill = '#fef08a'; p1.stroke = '#eab308'; p1.linewidth = 2;
        two.makeText('2', cx - 80, 160).fill = '#854d0e';

        const c1 = two.makeCircle(cx + 80, 160, 20);
        c1.fill = '#f8fafc'; c1.stroke = '#cbd5e1'; c1.linewidth = 2;
        two.makeText('18', cx + 80, 160);

        // 18 -> 2 & 9
        two.makeLine(cx + 80, 180, cx + 40, 230).stroke = '#94a3b8';
        two.makeLine(cx + 80, 180, cx + 120, 230).stroke = '#94a3b8';

        const p2 = two.makeCircle(cx + 40, 230, 20);
        p2.fill = '#fef08a'; p2.stroke = '#eab308'; p2.linewidth = 2;
        two.makeText('2', cx + 40, 230).fill = '#854d0e';

        const c2 = two.makeCircle(cx + 120, 230, 20);
        c2.fill = '#f8fafc'; c2.stroke = '#cbd5e1'; c2.linewidth = 2;
        two.makeText('9', cx + 120, 230);

        // 9 -> 3 & 3
        two.makeLine(cx + 120, 250, cx + 90, 300).stroke = '#94a3b8';
        two.makeLine(cx + 120, 250, cx + 150, 300).stroke = '#94a3b8';

        const p3 = two.makeCircle(cx + 90, 300, 20);
        p3.fill = '#fef08a'; p3.stroke = '#eab308'; p3.linewidth = 2;
        two.makeText('3', cx + 90, 300).fill = '#854d0e';

        const p4 = two.makeCircle(cx + 150, 300, 20);
        p4.fill = '#fef08a'; p4.stroke = '#eab308'; p4.linewidth = 2;
        two.makeText('3', cx + 150, 300).fill = '#854d0e';

        const res = two.makeText('36 = 2 × 2 × 3 × 3 = 2² × 3²', cx, 360);
        res.size = 16; res.weight = 800; res.fill = '#059669';
      } else {
        const res = two.makeText(\`\${target} 소인수분해 트리 완성\`, cx, 240);
        res.size = 16; res.weight = 800; res.fill = '#059669';
      }

      two.update();
    }

    function renderFactorGridCanvas(two) {
      two.clear();
      const cx = two.width / 2;
      const title = two.makeText('72 = 2³ × 3² 의 약수 곱셈표 (교과서 23쪽)', cx, 35);
      title.size = 16; title.weight = 800; title.fill = '#1e293b';

      const startX = cx - 140, startY = 80;
      const cellW = 70, cellH = 42;
      const colHeaders = ['×', '1', '3', '9'];
      const rowHeaders = ['1', '2', '4', '8'];

      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 4; c++) {
          const x = startX + c * cellW;
          const y = startY + r * cellH;
          const rect = two.makeRectangle(x, y, cellW - 2, cellH - 2);

          if (r === 0 || c === 0) {
            rect.fill = '#f1f5f9'; rect.stroke = '#94a3b8';
          } else {
            rect.fill = '#ffffff'; rect.stroke = '#cbd5e1';
          }

          let val = '';
          if (r === 0) val = colHeaders[c];
          else if (c === 0) val = rowHeaders[r - 1];
          else {
            val = String(parseInt(rowHeaders[r - 1]) * parseInt(colHeaders[c]));
          }

          const txt = two.makeText(val, x, y);
          txt.size = 14;
          txt.weight = (r === 0 || c === 0) ? 800 : 600;
          txt.fill = (r === 0 || c === 0) ? '#4f46e5' : '#1e293b';
        }
      }

      const formula = two.makeText('약수의 개수: (3 + 1) × (2 + 1) = 4 × 3 = 12개', cx, startY + 5 * cellH + 30);
      formula.size = 15; formula.weight = 800; formula.fill = '#059669';

      two.update();
    }

    function renderVennCanvas(two, a, b) {
      two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      const title = two.makeText(\`\${a}과 \${b}의 공약수 벤다이어그램\`, cx, 40);
      title.size = 17; title.weight = 800; title.fill = '#1e293b';

      const c1 = two.makeCircle(cx - 65, cy, 95);
      c1.fill = 'rgba(14, 165, 233, 0.2)'; c1.stroke = '#0284c7'; c1.linewidth = 3;

      const c2 = two.makeCircle(cx + 65, cy, 95);
      c2.fill = 'rgba(245, 158, 11, 0.2)'; c2.stroke = '#d97706'; c2.linewidth = 3;

      // Labels
      two.makeText(\`\${a}의 약수\`, cx - 110, cy - 80).weight = 800;
      two.makeText(\`\${b}의 약수\`, cx + 110, cy - 80).weight = 800;

      // Factors in A only (9, 18)
      two.makeText('9, 18', cx - 100, cy).fill = '#0284c7';

      // Factors in B only (4, 8, 12, 24)
      two.makeText('4, 8, 12, 24', cx + 100, cy).fill = '#d97706';

      // Intersection (1, 2, 3, 6)
      const common = two.makeText('1, 2, 3, 6', cx, cy - 10);
      common.size = 17; common.weight = 800; common.fill = '#059669';

      const gcdLbl = two.makeText('최대공약수: 6', cx, cy + 30);
      gcdLbl.size = 15; gcdLbl.weight = 800; gcdLbl.fill = '#dc2626';

      two.update();
    }

    function renderGcdPowerCanvas(two) {
      two.clear();
      const cx = two.width / 2;
      const title = two.makeText('소인수분해로 최대공약수 구하기 (교과서 28쪽)', cx, 40);
      title.size = 16; title.weight = 800; title.fill = '#1e293b';

      const t1 = two.makeText('A = 2² × 3', cx, 110);
      t1.size = 18; t1.weight = 800; t1.fill = '#0284c7';

      const t2 = two.makeText('B = 2³ × 3²', cx, 160);
      t2.size = 18; t2.weight = 800; t2.fill = '#d97706';

      // Divider line
      two.makeLine(cx - 150, 195, cx + 150, 195).stroke = '#94a3b8';

      const arrow = two.makeText('↓ 공통 소인수의 작은(같은) 지수 선택 ↓', cx, 230);
      arrow.size = 14; arrow.weight = 700; arrow.fill = '#64748b';

      const gcdRes = two.makeText('최대공약수 = 2² × 3 = 12', cx, 280);
      gcdRes.size = 20; gcdRes.weight = 800; gcdRes.fill = '#059669';

      two.update();
    }

    function renderGearCanvas(two, angleA, angleB) {
      two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      const title = two.makeText('톱니바퀴 맞물림 시뮬레이터 (A: 24개, B: 36개)', cx, 35);
      title.size = 16; title.weight = 800; title.fill = '#1e293b';

      // Gear A (Radius 65, 24 teeth)
      const gA = two.makeCircle(cx - 85, cy, 65);
      gA.fill = '#e0f2fe'; gA.stroke = '#0284c7'; gA.linewidth = 4;
      two.makeText('A (24개)', cx - 85, cy - 10).weight = 800;

      // Gear B (Radius 95, 36 teeth)
      const gB = two.makeCircle(cx + 85, cy, 95);
      gB.fill = '#fef3c7'; gB.stroke = '#d97706'; gB.linewidth = 4;
      two.makeText('B (36개)', cx + 85, cy - 10).weight = 800;

      const meshing = two.makeText('최소공배수 = 72 (A: 3바퀴, B: 2바퀴 회전)', cx, cy + 130);
      meshing.size = 15; meshing.weight = 800; meshing.fill = '#059669';

      two.update();
    }

    function renderMondrianCanvas(two, w, h, s) {
      two.clear();
      const cx = two.width / 2, cy = two.height / 2;
      const title = two.makeText(\`몬드리안 타일링 (가로 \${w}cm, 세로 \${h}cm, 타일 \${s}cm)\`, cx, 40);
      title.size = 16; title.weight = 800; title.fill = '#1e293b';

      const cols = Math.floor(w / s);
      const rows = Math.floor(h / s);
      const tSize = 65;
      const startX = cx - (cols * tSize) / 2 + tSize / 2;
      const startY = cy - (rows * tSize) / 2 + tSize / 2;

      const colors = ['#f87171', '#60a5fa', '#fde047', '#ffffff', '#ffffff', '#38bdf8'];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rect = two.makeRectangle(startX + c * tSize, startY + r * tSize, tSize - 2, tSize - 2);
          rect.fill = colors[(r * cols + c) % colors.length];
          rect.stroke = '#0f172a';
          rect.linewidth = 3;
        }
      }

      const info = two.makeText(\`최대공약수 타일 크기 \${s}cm ➔ 가로 \${cols}개 × 세로 \${rows}개 = 총 \${cols * rows}장\`, cx, cy + 130);
      info.size = 15; info.weight = 800; info.fill = '#e11d48';

      two.update();
    }
  `,
  validationHandlersJs: `
    function showInlineErr(id, msg) {
      SoundFX.error();
      const el = document.getElementById(id);
      if (el) { el.style.display = 'block'; el.innerText = msg; }
    }

    // --- CONTROLLER ACTION FUNCTIONS ---

    function setTileArray(r, c) {
      SoundFX.click();
      simState.tileRows = r;
      simState.tileCols = c;
      const badge = document.getElementById('tile-array-badge');
      if (badge) badge.innerText = \`배열: \${r}행 × \${c}열 = 12\`;
      if (twoInstance) renderTileArrayCanvas(twoInstance, r, c);
    }

    function inspectNumberFactors(n) {
      SoundFX.click();
      const badge = document.getElementById('classify-badge');
      const factorCounts = { 1: 1, 2: 2, 3: 2, 4: 3, 5: 2, 6: 4, 7: 2, 8: 4, 9: 3, 10: 4 };
      const groupNames = { 1: '약수 1개 (1)', 2: '약수 2개 (소수)', 3: '약수 3개 이상 (합성수)' };
      const grp = n === 1 ? 1 : (factorCounts[n] === 2 ? 2 : 3);
      if (badge) badge.innerText = \`선택: \${n} (약수 \${factorCounts[n]}개 ➔ \${groupNames[grp]})\`;
      if (twoInstance) renderClassifyCanvas(twoInstance, n);
    }

    function stepSieve(step) {
      SoundFX.click();
      simState.sieveStep = step;
      if (step === 6) SoundFX.success();
      if (twoInstance) renderSieveCanvas(twoInstance, step);
    }

    function setPowerSim(b, e) {
      SoundFX.click();
      simState.powerBase = b;
      simState.powerExp = e;
      const readout = document.getElementById('power-readout');
      if (readout) readout.innerText = \`\${b}^\${e} = \${Math.pow(b, e)} (밑: \${b}, 지수: \${e})\`;
      if (twoInstance) renderPowerCanvas(twoInstance, b, e);
    }

    function stepFactorTree(target) {
      SoundFX.click();
      if (twoInstance) renderFactorTreeCanvas(twoInstance, target);
    }

    function setVennFactors(a, b) {
      SoundFX.click();
      simState.vennA = a;
      simState.vennB = b;
      if (twoInstance) renderVennCanvas(twoInstance, a, b);
    }

    function compareGcdPowers() {
      SoundFX.success();
      if (twoInstance) renderGcdPowerCanvas(twoInstance);
    }

    function rotateGears(step) {
      SoundFX.click();
      simState.gearAngle = step * 120;
      const readout = document.getElementById('gear-readout');
      if (step === 3) {
        SoundFX.success();
        if (readout) readout.innerText = '72톱니 완료! (A: 3바퀴, B: 2바퀴 ➔ 처음 맞물림 위치 복귀!)';
      } else {
        if (readout) readout.innerText = \`회전: \${step * 24}톱니 (A: \${step}바퀴, B: \${(step * 24 / 36).toFixed(1)}바퀴)\`;
      }
      if (twoInstance) renderGearCanvas(twoInstance, step, step);
    }

    function resetGears() {
      SoundFX.click();
      const readout = document.getElementById('gear-readout');
      if (readout) readout.innerText = '현재: 0톱니 (A: 0바퀴, B: 0바퀴)';
      if (twoInstance) renderGearCanvas(twoInstance, 0, 0);
    }

    function setMondrianTiles(size) {
      SoundFX.click();
      simState.mondrianSize = size;
      if (size === 12) SoundFX.success();
      if (twoInstance) renderMondrianCanvas(twoInstance, 36, 24, size);
    }

    // --- CHECK SUBMIT FUNCTIONS ---

    function check01Submit() {
      const v = normTxt(document.getElementById('p01-ans').value);
      if (v.includes('1') && v.includes('2') && v.includes('3') && v.includes('4') && v.includes('6') && v.includes('12')) {
        renderVerifiedAnswerView("약수 타일 배열 탐구 성공!", "12의 약수는 1, 2, 3, 4, 6, 12 입니다.", "0-2");
      } else {
        showInlineErr('p01-err', '❌ 12의 모든 약수(1, 2, 3, 4, 6, 12)를 확인하세요!');
      }
    }

    function check02Submit() {
      const c = normTxt(document.getElementById('p02-common').value);
      const g = normTxt(document.getElementById('p02-gcd').value);
      if (c.includes('1') && c.includes('2') && c.includes('3') && c.includes('6') && g === '6') {
        renderVerifiedAnswerView("공약수와 최대공약수 마스터!", "18과 24의 공약수는 1, 2, 3, 6 이며 최대공약수는 6입니다.", "0-3");
      } else {
        showInlineErr('p02-err', '❌ 공약수(1, 2, 3, 6)와 최대공약수(6)를 확인하세요!');
      }
    }

    function check03Submit() {
      const lcm = normTxt(document.getElementById('p03-lcm').value);
      const prop = normTxt(document.getElementById('p03-prop').value);
      if (lcm === '12' && prop.includes('배수')) {
        renderVerifiedAnswerView("🏆 되짚어 보기 마스터! 1단원 해금!", "4와 6의 최소공배수는 12이며, 공배수는 최소공배수의 배수입니다.", "1-1");
      } else {
        showInlineErr('p03-err', '❌ 최소공배수(12)와 성질(배수)을 확인하세요!');
      }
    }

    function check11Submit() {
      const g1 = normTxt(document.getElementById('p11-g1').value);
      const g2 = normTxt(document.getElementById('p11-g2').value);
      const g3 = normTxt(document.getElementById('p11-g3').value);
      if (g1 === '1' && g2.includes('2') && g2.includes('3') && g2.includes('5') && g2.includes('7') && g3.includes('4') && g3.includes('6')) {
        renderVerifiedAnswerView("자연수의 분류 생각열기 완수!", "약수 1개: 1 / 약수 2개: 2, 3, 5, 7 / 약수 3개 이상: 4, 6, 8, 9, 10", "1-2");
      } else {
        showInlineErr('p11-err', '❌ 약수의 개수별 분류를 정확히 확인하세요!');
      }
    }

    function check12Submit() {
      const one = normTxt(document.getElementById('p12-one').value);
      const two = normTxt(document.getElementById('p12-two').value);
      if ((one.includes('아니') || one.includes('소수도') || one.includes('합성수도')) && two === '2') {
        renderVerifiedAnswerView("소수와 합성수의 뜻 마스터!", "1은 소수도 합성수도 아니며, 가장 작은 소수는 2입니다.", "1-3");
      } else {
        showInlineErr('p12-err', '❌ 1의 성질(둘 다 아님)과 유일한 짝수 소수(2)를 확인하세요!');
      }
    }

    function check13Submit() {
      const cnt = normTxt(document.getElementById('p13-count').value);
      if (cnt === '15') {
        renderVerifiedAnswerView("에라토스테네스의 체 마스터!", "1부터 50까지의 자연수 중 소수는 15개입니다.", "1-4");
      } else {
        showInlineErr('p13-err', '❌ 1~50 사이의 소수는 총 15개입니다!');
      }
    }

    function check14Submit() {
      const q1 = normTxt(document.getElementById('p14-q1').value);
      const q2 = normTxt(document.getElementById('p14-q2').value);
      const q3 = normTxt(document.getElementById('p14-q3').value);
      if (q1.includes('소수') && q2.includes('합성수') && q3.includes('소수')) {
        renderVerifiedAnswerView("소수와 합성수 판별 마스터!", "17(소수), 27(합성수 = 3³), 31(소수)", "2-1");
      } else {
        showInlineErr('p14-err', '❌ 17(소수), 27(합성수), 31(소수) 판별을 확인하세요!');
      }
    }

    function check21Submit() {
      const b = normTxt(document.getElementById('p21-base').value);
      const e = normTxt(document.getElementById('p21-exp').value);
      const v = normTxt(document.getElementById('p21-val').value);
      if (b === '2' && e === '5' && v === '32') {
        renderVerifiedAnswerView("거듭제곱의 표현 마스터!", "밑은 2, 지수는 5이며 2^5 = 32 입니다.", "2-2");
      } else {
        showInlineErr('p21-err', '❌ 밑(2), 지수(5), 값(32)을 확인하세요!');
      }
    }

    function check22Submit() {
      const v36 = normTxt(document.getElementById('p22-36').value);
      const v60 = normTxt(document.getElementById('p22-60').value);
      const ok36 = (v36.includes('2^2') && v36.includes('3^2')) || (v36 === '2*2*3*3');
      const ok60 = (v60.includes('2^2') && v60.includes('3') && v60.includes('5')) || (v60 === '2*2*3*5');
      if (ok36 && ok60) {
        renderVerifiedAnswerView("소인수분해 가지치기 마스터!", "36 = 2² × 3², 60 = 2² × 3 × 5", "2-3");
      } else {
        showInlineErr('p22-err', '❌ 36(2² × 3²)과 60(2² × 3 × 5)의 소인수분해를 확인하세요!');
      }
    }

    function check23Submit() {
      const cnt = normTxt(document.getElementById('p23-cnt').value);
      const sec = normTxt(document.getElementById('p23-second').value);
      if (cnt === '12' && sec === '36') {
        renderVerifiedAnswerView("격자표 약수 구하기 마스터!", "72의 약수는 총 12개이며, 2번째로 큰 수는 36입니다.", "2-4");
      } else {
        showInlineErr('p23-err', '❌ 약수의 개수(12)와 2번째로 큰 약수(36)를 확인하세요!');
      }
    }

    function check24Submit() {
      const q1 = normTxt(document.getElementById('p24-q1').value);
      const q2 = normTxt(document.getElementById('p24-q2').value);
      if (q1 === '15' && q2 === '9') {
        renderVerifiedAnswerView("약수의 개수 공식 마스터!", "(4+1)(2+1) = 15개, 100의 약수는 (2+1)(2+1) = 9개", "3-1");
      } else {
        showInlineErr('p24-err', '❌ 약수의 개수(15, 9)를 확인하세요!');
      }
    }

    function check31Submit() {
      const gcd = normTxt(document.getElementById('p31-gcd').value);
      const cop = normTxt(document.getElementById('p31-coprime').value);
      if (gcd === '6' && (cop.includes('예') || cop === 'O' || cop === 'YES')) {
        renderVerifiedAnswerView("공약수와 서로소 마스터!", "최대공약수는 6이며, 9와 14는 공약수가 1뿐이므로 서로소입니다.", "3-2");
      } else {
        showInlineErr('p31-err', '❌ 최대공약수(6)와 서로소 판별(예)을 확인하세요!');
      }
    }

    function check32Submit() {
      const pow = normTxt(document.getElementById('p32-power').value);
      const val = normTxt(document.getElementById('p32-val').value);
      if (pow.includes('2^2') && pow.includes('3') && val === '12') {
        renderVerifiedAnswerView("소인수분해로 최대공약수 구하기 마스터!", "최대공약수 = 2² × 3 = 12", "3-3");
      } else {
        showInlineErr('p32-err', '❌ 거듭제곱 꼴(2^2 * 3)과 값(12)을 확인하세요!');
      }
    }

    function check33Submit() {
      const ans = normTxt(document.getElementById('p33-ans').value);
      if (ans === '12') {
        renderVerifiedAnswerView("최대공약수 형성평가 통과!", "24, 36, 60 의 최대공약수는 12입니다.", "4-1");
      } else {
        showInlineErr('p33-err', '❌ 세 수의 최대공약수(12)를 확인하세요!');
      }
    }

    function check41Submit() {
      const pow = normTxt(document.getElementById('p41-power').value);
      const val = normTxt(document.getElementById('p41-val').value);
      if (pow.includes('2^2') && pow.includes('3^2') && pow.includes('5') && val === '180') {
        renderVerifiedAnswerView("소인수분해로 최소공배수 구하기 마스터!", "최소공배수 = 2² × 3² × 5 = 180", "4-2");
      } else {
        showInlineErr('p41-err', '❌ 거듭제곱 꼴(2^2 * 3^2 * 5)과 값(180)을 확인하세요!');
      }
    }

    function check42Submit() {
      const lcm = normTxt(document.getElementById('p42-lcm').value);
      const rA = normTxt(document.getElementById('p42-rotA').value);
      const rB = normTxt(document.getElementById('p42-rotB').value);
      if (lcm === '72' && rA === '3' && rB === '2') {
        renderVerifiedAnswerView("톱니바퀴 맞물림 탐구 완수!", "최소공배수 72톱니 (A바퀴 3회전, B바퀴 2회전)", "4-3");
      } else {
        showInlineErr('p42-err', '❌ 최소공배수(72)와 회전수(A: 3, B: 2)를 확인하세요!');
      }
    }

    function check43Submit() {
      const min = normTxt(document.getElementById('p43-min').value);
      const time = normTxt(document.getElementById('p43-time').value);
      if (min === '60' && (time.includes('8') || time.includes('08:00'))) {
        renderVerifiedAnswerView("최소공배수 활용 문제 마스터!", "최소공배수 60분 ➔ 다시 동시 출발하는 시각: 오전 8시", "5-1");
      } else {
        showInlineErr('p43-err', '❌ 최소공배수(60분)와 시각(8시)을 확인하세요!');
      }
    }

    function check51Submit() {
      const q1 = normTxt(document.getElementById('p51-q1').value);
      const q2 = normTxt(document.getElementById('p51-q2').value);
      if (q1 === '8' && q2 === '6') {
        renderVerifiedAnswerView("1단원 스스로 마무리 완수!", "20 이하 소수 8개, 12의 약수 개수 6개", "5-2");
      } else {
        showInlineErr('p51-err', '❌ 소수 개수(8)와 공약수 개수(6)를 확인하세요!');
      }
    }

    function check52Submit() {
      const size = normTxt(document.getElementById('p52-size').value);
      const cnt = normTxt(document.getElementById('p52-count').value);
      if (size === '12' && cnt === '6') {
        renderVerifiedAnswerView("🏆 1단원 소인수분해 전체 마스터 달성!", "축하합니다! 가장 큰 정사각형 타일은 12cm, 필요한 타일은 6장입니다.", "5-2");
      } else {
        showInlineErr('p52-err', '❌ 타일 크기(12cm)와 장수(6장)를 확인하세요!');
      }
    }

    // Attach actions & checks to window
    window.setTileArray = setTileArray;
    window.inspectNumberFactors = inspectNumberFactors;
    window.stepSieve = stepSieve;
    window.setPowerSim = setPowerSim;
    window.stepFactorTree = stepFactorTree;
    window.setVennFactors = setVennFactors;
    window.compareGcdPowers = compareGcdPowers;
    window.rotateGears = rotateGears;
    window.resetGears = resetGears;
    window.setMondrianTiles = setMondrianTiles;

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
    window.check41Submit = check41Submit;
    window.check42Submit = check42Submit;
    window.check43Submit = check43Submit;
    window.check51Submit = check51Submit;
    window.check52Submit = check52Submit;
  `
};

const html = createChapterHtml(ch1Config);
fs.writeFileSync('g1_ch1_factors.html', html, 'utf8');

const scriptMatch = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i);
fs.writeFileSync('temp_check_ch1.js', scriptMatch[1], 'utf8');
execSync('node --check temp_check_ch1.js');
fs.unlinkSync('temp_check_ch1.js');
console.log('✅ g1_ch1_factors.html: successfully built with updated interactive simulators and master_template!');
