// src/ch1/substeps_data.js
// 1단원 소인수분해 (g1_ch1_factors.html) 57개 전 서브스텝 정의 및 폼 템플릿
// 규칙 10 (소단원 스스로 확인하기 1문항 1페이지) 및 규칙 11 (대단원 스스로 마무리하기 전용 탭 14문항 분할) 완전 준수

window.SUBSTEP_CONFIG = {
  // ==========================================
  // Tab 0: 0. 준비학습 (pp. 6~7) — 4개 서브스텝
  // ==========================================
  '0-1': {
    mission: "<b>[준비 1] 약수와 배수의 뜻</b><br>교과서 6~7쪽: 좌측 [준비학습 복습 도표]를 관찰하고 12의 약수와 배수의 관계를 확인합니다. (초등학교 복습)",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q1</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 6의 약수를 모두 구하시오.</p>
          <input type="text" id="p01-div6" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="쉼표로 약수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 13의 약수를 모두 구하시오.</p>
          <input type="text" id="p01-div13" class="form-control proof-input-text" style="width:180px; margin-top:4px;" placeholder="쉼표로 약수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q2</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) 24의 배수를 가장 작은 수부터 3개 구하시오.</p>
          <input type="text" id="p01-mul24" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="쉼표로 배수 3개 나열">
        </div>
        <div id="p01-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check01Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '0-2': {
    mission: "<b>[준비 2] 공약수와 최대공약수</b><br>교과서 6~7쪽: 좌측 [공약수 벤다이어그램 도표]를 관찰하고 12와 18의 공약수 및 최대공약수를 확인합니다. (초등학교 복습)",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q1</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 12와 18의 공약수를 모두 구하시오.</p>
          <input type="text" id="p02-common" class="form-control proof-input-text" style="width:240px; margin-top:4px;" placeholder="쉼표로 공약수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 12와 18의 최대공약수를 구하시오.</p>
          <input type="text" id="p02-gcd" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="숫자 입력">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q2</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) 45와 60의 최대공약수를 구하시오.</p>
          <input type="text" id="p02-gcd45" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="숫자 입력">
        </div>
        <div id="p02-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check02Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '0-3': {
    mission: "<b>[준비 3] 공배수와 최소공배수</b><br>교과서 6~7쪽: 좌측 [수직선 도약 복습 도표]를 관찰하고 4와 6의 공배수 및 최소공배수를 확인합니다. (초등학교 복습)",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q1</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 4와 6의 최소공배수를 구하시오.</p>
          <input type="text" id="p03-lcm46" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="숫자 입력">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q2</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">2) 9와 12의 최소공배수를 구하시오.</p>
          <input type="text" id="p03-lcm912" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="숫자 입력">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q3</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) 두 수의 공배수는 최소공배수의 어떤 수인가요?</p>
          <input type="text" id="p03-prop" class="form-control proof-input-text" style="width:180px; margin-top:4px;" placeholder="수학적 관계 또는 용어 입력">
        </div>
        <div id="p03-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check03Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '0-4': {
    mission: "<b>[준비 4] 자연수의 분류 기준</b><br>교과서 6~7쪽: 좌측 [자연수 3분류 복습 도표]를 관찰하고 1부터 15까지의 자연수를 약수의 개수에 따라 분류해 봅니다. (초등학교 복습)",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 1부터 15까지의 자연수 중 약수의 개수가 1개뿐인 수는?</p>
          <input type="text" id="p04-g1" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="숫자 입력">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 1부터 15까지 중 약수의 개수가 2개인 수들을 모두 적으시오.</p>
          <input type="text" id="p04-g2" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="쉼표로 수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 1부터 15까지 중 약수의 개수가 3개 이상인 수들을 모두 적으시오.</p>
          <input type="text" id="p04-g3" class="form-control proof-input-text" style="width:260px; margin-top:4px;" placeholder="쉼표로 수 나열">
        </div>
        <div id="p04-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check04Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 1: 1. 소수와 합성수 (pp. 8~13) — 9개 서브스텝
  // ==========================================
  '1-1': {
    mission: "<b>[1.1 개념] 소수와 합성수의 뜻</b><br>교과서 9~10쪽: 1보다 큰 자연수 중에서 1과 자기 자신만을 약수로 가지는 수를 <b>소수</b>, 1과 자기 자신 이외의 수를 약수로 가지는 수를 <b>합성수</b>라고 합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 1은 소수인가요, 합성수인가요?</p>
          <input type="text" id="p11-one" class="form-control proof-input-text" style="width:240px; margin-top:4px;" placeholder="1의 분류 입력 (소수 / 합성수 / 기타)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) [문제 1] 13, 15, 20, 23, 29 중 소수를 모두 고르시오.</p>
          <input type="text" id="p11-primes" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="쉼표로 수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) [문제 1] 13, 15, 20, 23, 29 중 합성수를 모두 고르시오.</p>
          <input type="text" id="p11-composites" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="쉼표로 수 나열">
        </div>
        <div class="tip-card" style="background:#fef2f2; border-left:4px solid #ef4444; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#991b1b; margin-bottom:12px;">
          🚫 <b>주의:</b> <b>1은 소수도 아니고 합성수도 아닙니다.</b> 또한 <b>2는 유일한 짝수 소수</b>이며, 가장 작은 소수입니다.
        </div>
        <div id="p11-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check11Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '1-2': {
    mission: "<b>[1.1 함께하기] 에라토스테네스의 체</b><br>교과서 10~11쪽: 1부터 50까지의 자연수 격자판에서 체질하여 소수만을 걸러내 보세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <p style="font-weight:700; color:#1e293b; margin-bottom:12px;">좌측 시뮬레이터의 1단계부터 6단계 버튼을 차례로 실행하여 합성수들을 체질해 보세요.</p>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 1부터 50까지의 자연수 중 체질 후 남은 소수는 총 몇 개인가요?</p>
          <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
            <input type="text" id="p12-count" class="form-control proof-input-text" style="width:100px;" placeholder="개수 (숫자)">
            <span>개</span>
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 체로 걸러내고 남은 수들의 공통점은 무엇인가요?</p>
          <input type="text" id="p12-prop" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="수학적 성질 또는 용어 입력">
        </div>
        <div id="p12-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check12Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '1-3': {
    mission: "<b>[1.1 개념] 거듭제곱과 밑·지수</b><br>교과서 10~11쪽: 같은 수를 여러 번 곱한 것을 거듭제곱으로 나타내는 방법을 학습합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">문제 2 (1)</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) $2 \\times 2 \\times 3 \\times 3$ 을 거듭제곱으로 나타내시오.</p>
          <input type="text" id="p13-q1" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="거듭제곱 (예: a^m * b^n)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">개념 확인</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">2) $5^4$ 에서 밑과 지수는 각각 무엇인가요?</p>
          <div style="display:flex; align-items:center; gap:12px; margin-top:4px;">
            <span>밑: <input type="text" id="p13-base" class="form-control proof-input-text" style="width:70px;" placeholder="밑 (숫자)"></span>
            <span>지수: <input type="text" id="p13-exp" class="form-control proof-input-text" style="width:70px;" placeholder="지수 (숫자)"></span>
          </div>
        </div>
        <div id="p13-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check13Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '1-4': {
    mission: "<b>[1.1 확인 1] 소수와 합성수 구분</b><br>교과서 12쪽 1번: 다음 수가 소수인지 합성수인지 구분하세요. (8, 17, 39, 53)",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">1번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 8, 17, 39, 53 중에서 소수를 모두 적으시오.</p>
        <input type="text" id="p14-primes" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="쉼표로 소수 나열">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">2) 8, 17, 39, 53 중에서 합성수를 모두 적으시오.</p>
        <input type="text" id="p14-comp" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="쉼표로 합성수 나열">
        <div id="p14-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check14Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '1-5': {
    mission: "<b>[1.1 확인 2] 거듭제곱 표현</b><br>교과서 12쪽 2번: 다음 곱셈을 거듭제곱을 사용하여 나타내세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">2번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) $5 \\times 5 \\times 5 \\times 5$</p>
        <input type="text" id="p15-q1" class="form-control proof-input-text" style="width:140px; margin-top:4px;" placeholder="거듭제곱 (예: a^m)">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">2) $2 \\times 3 \\times 3 \\times 5$</p>
        <input type="text" id="p15-q2" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="거듭제곱 꼴 입력">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">3) $3 \\times 3 \\times 7 \\times 7 \\times 7 \\times 7 \\times 7$</p>
        <input type="text" id="p15-q3" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="거듭제곱 꼴 입력">
        <div id="p15-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check15Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '1-6': {
    mission: "<b>[1.1 확인 3] 소수와 합성수 성질 참/거짓 판단</b><br>교과서 12쪽 3번: 다음 보기 중에서 옳은 것을 모두 고르세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">3번 문항</span>
        <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:6px; line-height:1.6;">
          ㄱ. 모든 자연수는 약수가 2개 이상이다.<br>
          ㄴ. 모든 소수는 홀수이다.<br>
          ㄷ. 43은 소수이다.<br>
          ㄹ. 3의 배수 중에서 소수는 1개이다.
        </div>
        <p style="margin-top:10px; font-weight:700; color:#1e293b;">옳은 것을 모두 고르시오.</p>
        <input type="text" id="p16-q3" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="쉼표로 기호 나열 (예: ㄱ, ㄴ)">
        <div id="p16-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check16Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '1-7': {
    mission: "<b>[1.1 확인 4] 생활 속 문제: 세균 증식</b><br>교과서 12쪽 4번: 10분마다 2배씩 늘어나는 세균이 1시간 후 지금의 몇 배가 되는지 거듭제곱으로 나타내세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">4번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">한 시간(60분) 후 세균의 수는 지금 세균의 수의 몇 배인지 거듭제곱으로 나타내시오.</p>
        <input type="text" id="p17-bacteria" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="거듭제곱 (예: a^m)">
        <div id="p17-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check17Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '1-8': {
    mission: "<b>[1.1 확인 5] 지수 방정식과 합</b><br>교과서 12쪽 5번: $2^a = 64,\\; \\left(\\frac{1}{3}\\right)^b = \\frac{1}{27}$ 을 만족시키는 자연수 $a, b$에 대하여 $a+b$의 값을 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">5번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">$a+b$ 의 값을 구하시오.</p>
        <input type="text" id="p18-sum" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="숫자 입력">
        <div id="p18-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check18Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '1-9': {
    mission: "<b>[1.1 생각 넓히기] 열차 소수 역과 승객</b><br>교과서 13쪽: 1부터 30까지의 역에서 열차 승객이 배수마다 1명씩 내릴 때, 25번 역에서 내린 인원과 정확히 2명 내린 역(소수 역)을 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">생각 넓히기</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 25가 적혀 있는 역에서 내린 승객은 모두 몇 명인가요?</p>
        <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
          <input type="text" id="p19-train25" class="form-control proof-input-text" style="width:100px;" placeholder="인원수 (숫자)">
          <span>명</span>
        </div>
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">2) 내린 승객이 2명인 역(소수 역)에 적혀 있는 번호를 모두 구하시오.</p>
        <input type="text" id="p19-train2" class="form-control proof-input-text" style="width:100%; margin-top:4px;" placeholder="쉼표로 역 번호 나열">
        <div id="p19-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check19Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 2: 2. 소인수분해 (pp. 14~17) — 9개 서브스텝
  // ==========================================
  '2-1': {
    mission: "<b>[1.2 개념] 소인수와 인수의 뜻</b><br>교과서 14~15쪽: 12의 약수 중 소수인 2와 3을 12의 <b>소인수</b>라고 합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 12의 소인수를 모두 구하시오.</p>
          <input type="text" id="p21-primefac12" class="form-control proof-input-text" style="width:140px; margin-top:4px;" placeholder="쉼표로 소인수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) [문제 1] 30의 소인수를 모두 구하시오.</p>
          <input type="text" id="p21-pf30" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="쉼표로 소인수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) [문제 1] 45의 소인수를 모두 구하시오.</p>
          <input type="text" id="p21-pf45" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="쉼표로 소인수 나열">
        </div>
        <div id="p21-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check21Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-2': {
    mission: "<b>[1.2 개념] 소인수분해 가지치기 트리</b><br>교과서 14~15쪽: 나뭇가지가 갈라지듯 18, 24, 60을 소수만의 곱으로 분해합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 18을 소인수분해하시오.</p>
          <input type="text" id="p22-18" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="거듭제곱 (예: a * b^n)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 24를 소인수분해하시오.</p>
          <input type="text" id="p22-24" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="거듭제곱 (예: a^m * b)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 60을 소인수분해하시오.</p>
          <input type="text" id="p22-60" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="거듭제곱 (예: a^m * b * c)">
        </div>
        <div id="p22-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check22Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-3': {
    mission: "<b>[1.2 개념] 거듭제곱을 이용한 소인수분해</b><br>교과서 15~16쪽: 27, 36, 80, 126을 거듭제곱 꼴로 소인수분해합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">문제 3</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 27을 소인수분해하시오.</p>
          <input type="text" id="p23-27" class="form-control proof-input-text" style="width:180px; margin-top:4px;" placeholder="거듭제곱 꼴 입력">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 36을 소인수분해하시오.</p>
          <input type="text" id="p23-36" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="거듭제곱 꼴 입력">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 80을 소인수분해하시오.</p>
          <input type="text" id="p23-80" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="거듭제곱 꼴 입력">
        </div>
        <div id="p23-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check23Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-4': {
    mission: "<b>[1.2 확인 1] 소인수 모두 구하기</b><br>교과서 16쪽 1번: 다음 수의 소인수를 모두 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">1번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 15의 소인수를 모두 구하시오.</p>
        <input type="text" id="p24-15" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="쉼표로 소인수 나열">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">2) 22의 소인수를 모두 구하시오.</p>
        <input type="text" id="p24-22" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="쉼표로 소인수 나열">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">3) 49의 소인수를 모두 구하시오.</p>
        <input type="text" id="p24-49" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="소인수 입력">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">4) 70의 소인수를 모두 구하시오.</p>
        <input type="text" id="p24-70" class="form-control proof-input-text" style="width:180px; margin-top:4px;" placeholder="쉼표로 소인수 나열">
        <div id="p24-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check24Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-5': {
    mission: "<b>[1.2 확인 2] 소인수분해하기</b><br>교과서 16쪽 2번: 다음 수를 거듭제곱 꼴로 소인수분해하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">2번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 34를 소인수분해하시오.</p>
        <input type="text" id="p25-34" class="form-control proof-input-text" style="width:180px; margin-top:4px;" placeholder="거듭제곱 꼴 입력">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">2) 75를 소인수분해하시오.</p>
        <input type="text" id="p25-75" class="form-control proof-input-text" style="width:180px; margin-top:4px;" placeholder="거듭제곱 꼴 입력">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">3) 96을 소인수분해하시오.</p>
        <input type="text" id="p25-96" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="거듭제곱 꼴 입력">
        <div id="p25-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check25Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-6': {
    mission: "<b>[1.2 확인 3] 연속된 곱의 소인수 지수 구하기</b><br>교과서 16쪽 3번: $2 \\times 3 \\times 4 \\times 5 \\times 6$ 을 소인수분해했을 때 소인수 2의 지수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">3번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">소인수 2의 지수를 구하시오.</p>
        <input type="text" id="p26-exp2" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="지수 (숫자)">
        <div id="p26-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check26Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-7': {
    mission: "<b>[1.2 확인 4] 제곱수 만들기</b><br>교과서 16쪽 4번: 56에 자연수를 곱하여 어떤 자연수의 제곱이 되도록 할 때, 곱할 수 있는 가장 작은 자연수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">4번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">곱할 수 있는 가장 작은 자연수를 구하시오.</p>
        <input type="text" id="p27-square" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="가장 작은 수 (숫자)">
        <div id="p27-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check27Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-8': {
    mission: "<b>[1.2 확인 5] 선우와 은서의 조건 추론</b><br>교과서 16쪽 5번: 100보다 작은 자연수이며, 두 개의 소인수를 갖고 그 소인수의 합이 18인 자연수를 모두 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">5번 문항</span>
        <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:6px;">
          선우: "100보다 작은 자연수야."<br>
          은서: "두 개의 소인수를 갖는 수이고, 두 소인수의 합은 18이야."
        </div>
        <p style="margin-top:10px; font-weight:700; color:#1e293b;">두 설명을 동시에 만족시키는 자연수를 모두 구하시오.</p>
        <input type="text" id="p28-sunwoo" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="쉼표로 수 나열">
        <div id="p28-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check28Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-9': {
    mission: "<b>[1.2 생각 넓히기] 소인수분해로 약수 구하기 & 약수의 개수</b><br>교과서 17쪽: 160의 약수의 개수와 $2^{\\square} \\times 3^2$의 약수의 개수가 12일 때 $\\square$를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">생각 넓히기</span>
        <div style="margin-top:6px; margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 160의 약수의 개수를 구하시오.</p>
          <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
            <input type="text" id="p29-cnt160" class="form-control proof-input-text" style="width:100px;" placeholder="개수 (숫자)">
            <span>개</span>
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) $2^{\\square} \\times 3^2$ 의 약수의 개수가 12일 때, 빈칸 $\\square$에 들어갈 수는?</p>
          <input type="text" id="p29-exp" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="숫자 입력">
        </div>
        <div id="p29-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check29Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 3: 3. 최대공약수 (pp. 18~19) — 10개 서브스텝
  // ==========================================
  '3-1': {
    mission: "<b>[1.3 개념] 최대공약수와 서로소</b><br>교과서 18~19쪽: 최대공약수가 1인 두 자연수를 <b>서로소</b>라고 합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 최대공약수가 1인 두 자연수의 관계를 무엇이라고 하나요?</p>
          <input type="text" id="p31-def" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="수학 용어 입력">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) [문제 1] 두 수가 서로소인 쌍의 번호를 모두 고르시오.</p>
          <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:4px; line-height:1.6;">
            (1) 14, 15<br>
            (2) 10, 45<br>
            (3) 24, 35<br>
            (4) 17, 51
          </div>
          <input type="text" id="p31-coprime" class="form-control proof-input-text" style="width:160px; margin-top:8px;" placeholder="쉼표로 번호 나열 (작은 수부터)">
        </div>
        <div id="p31-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check31Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-2': {
    mission: "<b>[1.3 개념] 거듭제곱으로 최대공약수 구하기</b><br>교과서 18~19쪽: 24와 84를 소인수분해하여 공통인 소인수 중 지수가 작거나 같은 것을 택해 곱합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 24와 84의 최대공약수를 구하시오.</p>
          <input type="text" id="p32-gcd2484" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) $2^2 \\times 5^2$ 과 $2^2 \\times 5 \\times 7$ 의 최대공약수를 구하시오.</p>
          <input type="text" id="p32-q1" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 56과 140의 최대공약수를 구하시오.</p>
          <input type="text" id="p32-q2" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        </div>
        <div id="p32-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check32Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-3': {
    mission: "<b>[1.3 예제 & 문제 3] 세 수의 최대공약수 구하기</b><br>교과서 18~19쪽 예제: 세 수를 세로로 소인수분해 정렬하여 최대공약수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 60, 72, 150의 최대공약수를 구하시오.</p>
          <input type="text" id="p33-ex1" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 45, 75, 90의 최대공약수를 구하시오.</p>
          <input type="text" id="p33-follow" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 54, 72, 90의 최대공약수를 구하시오.</p>
          <input type="text" id="p33-q3" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        </div>
        <div id="p33-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check33Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-4': {
    mission: "<b>[1.3 확인 1] 두 수의 최대공약수 구하기</b><br>교과서 19쪽 1번: 다음 두 수의 최대공약수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">1번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) $2 \\times 7^2$ 과 $2^2 \\times 3^2 \\times 7$ 의 최대공약수를 구하시오.</p>
        <input type="text" id="p34-q1a" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">2) 84와 150의 최대공약수를 구하시오.</p>
        <input type="text" id="p34-q1b" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        <div id="p34-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check34Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-5': {
    mission: "<b>[1.3 확인 2] 세 수의 최대공약수 구하기</b><br>교과서 19쪽 2번: 다음 세 수의 최대공약수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">2번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) $2 \\times 3^2 \\times 7^2,\\; 3^2 \\times 7,\\; 3^2 \\times 5^2 \\times 7$ 의 최대공약수를 구하시오.</p>
        <input type="text" id="p35-q2a" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">2) 52, 65, 91의 최대공약수를 구하시오.</p>
        <input type="text" id="p35-q2b" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        <div id="p35-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check35Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-6': {
    mission: "<b>[1.3 확인 3] 15와 서로소인 수 구하기</b><br>교과서 19쪽 3번: 20 이상 30 이하의 자연수 중에서 15와 서로소인 자연수를 모두 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">3번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">20 이상 30 이하의 수 중 15와 서로소인 자연수를 모두 적으시오.</p>
        <input type="text" id="p36-coprimes" class="form-control proof-input-text" style="width:240px; margin-top:4px;" placeholder="쉼표로 수 나열">
        <div id="p36-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check36Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-7': {
    mission: "<b>[1.3 확인 4] 지수 미지수 최대공약수 조건</b><br>교과서 19쪽 4번: $2^a \\times 5^3 \\times 7$ 과 $2^3 \\times 3 \\times 5^b$ 의 최대공약수가 100일 때, $a+b$의 값을 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">4번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">$a+b$ 의 값을 구하시오.</p>
        <input type="text" id="p37-sum" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="계산값 a+b (숫자)">
        <div id="p37-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check37Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-8': {
    mission: "<b>[1.3 확인 5] 분수가 자연수가 되는 가장 큰 수</b><br>교과서 19쪽 5번: 두 수 $\\frac{105}{\\square},\\; \\frac{350}{\\square}$ 이 모두 자연수가 되게 하는 가장 큰 자연수 $\\square$를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">5번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">가장 큰 자연수 $\\square$는?</p>
        <input type="text" id="p38-max" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="가장 큰 수 (숫자)">
        <div id="p38-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check38Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-9': {
    mission: "<b>[1.3 확인 6] 나머지가 있는 수와 최대공약수</b><br>교과서 19쪽 6번: 107을 나누면 2가 남고, 153을 나누면 3이 남고, 90을 나누면 나누어떨어지는 가장 큰 자연수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">6번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">가장 큰 자연수를 구하시오.</p>
        <input type="text" id="p39-div" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="가장 큰 수 (숫자)">
        <div id="p39-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check39Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-10': {
    mission: "<b>[1.3 생각 넓히기] 21과의 최대공약수가 7인 수 추론</b><br>교과서 19쪽: 50보다 작은 두 자리 자연수 중 21과의 최대공약수가 7인 수들을 모두 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">생각 넓히기</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">50보다 작은 두 자리 자연수 중 21과의 최대공약수가 7인 수들을 모두 적으시오.</p>
        <input type="text" id="p310-wide" class="form-control proof-input-text" style="width:240px; margin-top:4px;" placeholder="쉼표로 수 나열">
        <div id="p310-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check310Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 4: 4. 최소공배수 (pp. 20~23) — 10개 서브스텝
  // ==========================================
  '4-1': {
    mission: "<b>[1.4 개념] 최소공배수와 소인수분해</b><br>교과서 20~21쪽: 월드컵(4년)과 마술대회(3년) 동시 개최 주기 및 54와 90의 최소공배수를 소인수분해로 구합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 4년 주기와 3년 주기 대회가 2022년 동시 개최 후 다음 동시 개최 연도는?</p>
          <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
            <input type="text" id="p41-cycle" class="form-control proof-input-text" style="width:120px;" placeholder="연도 입력 (숫자)">
            <span>년</span>
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 54와 90의 최소공배수를 구하시오.</p>
          <input type="text" id="p41-lcm5490" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최소공배수 (숫자)">
        </div>
        <div id="p41-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check41Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-2': {
    mission: "<b>[1.4 개념 & 예제] 톱니바퀴 맞물림 & 세 수의 최소공배수</b><br>교과서 20~21쪽: 맞물린 톱니바퀴 24개, 36개가 처음으로 다시 맞물릴 때의 톱니 수와 세 수의 최소공배수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 24개, 36개 톱니바퀴가 처음으로 다시 맞물리는 톱니 수는?</p>
          <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
            <input type="text" id="p42-gearLcm" class="form-control proof-input-text" style="width:120px;" placeholder="톱니 수 (숫자)">
            <span>개</span>
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 18, 28, 72의 최소공배수를 구하시오.</p>
          <input type="text" id="p42-ex1" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최소공배수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 16, 40, 60의 최소공배수를 구하시오.</p>
          <input type="text" id="p42-follow" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최소공배수 (숫자)">
        </div>
        <div id="p42-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check42Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-3': {
    mission: "<b>[1.4 확인 1] 두 수의 최소공배수 구하기</b><br>교과서 22쪽 1번: 다음 두 수의 최소공배수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">1번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) $3^2 \\times 11$ 과 $3 \\times 5 \\times 11$ 의 최소공배수를 구하시오.</p>
        <input type="text" id="p43-q1a" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최소공배수 (숫자)">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">2) 21과 27의 최소공배수를 구하시오.</p>
        <input type="text" id="p43-q1b" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최소공배수 (숫자)">
        <div id="p43-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check43Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-4': {
    mission: "<b>[1.4 확인 2] 세 수의 최소공배수 구하기</b><br>교과서 22쪽 2번: 다음 세 수의 최소공배수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">2번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) $2^2 \\times 3,\\; 2^4 \\times 3,\\; 2 \\times 3^3$ 의 최소공배수를 구하시오.</p>
        <input type="text" id="p44-q2a" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최소공배수 (숫자)">
        <p style="margin-top:12px; font-weight:700; color:#1e293b;">2) 6, 42, 63의 최소공배수를 구하시오.</p>
        <input type="text" id="p44-q2b" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최소공배수 (숫자)">
        <div id="p44-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check44Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-5': {
    mission: "<b>[1.4 확인 3] 분수를 자연수로 만드는 수</b><br>교과서 22쪽 3번: 두 수 $\\frac{1}{70},\\; \\frac{1}{98}$ 중 어느 것을 택하여 곱해도 자연수가 되는 가장 작은 자연수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">3번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">가장 작은 자연수를 구하시오.</p>
        <input type="text" id="p45-min" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="가장 작은 수 (숫자)">
        <div id="p45-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check45Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-6': {
    mission: "<b>[1.4 확인 4] 3A, 4A, 5A의 최소공배수와 A</b><br>교과서 22쪽 4번: 세 자연수 $3\\times A,\\; 4\\times A,\\; 5\\times A$의 최소공배수가 360일 때, $A$의 값을 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">4번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">$A$의 값을 구하시오.</p>
        <input type="text" id="p46-valA" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="A의 값 (숫자)">
        <div id="p46-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check46Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-7': {
    mission: "<b>[1.4 확인 5] 세 수 최소공배수 미지수 찾기</b><br>교과서 22쪽 5번: 서로 다른 세 자연수 $3^2 \\times 5^2,\\; 2 \\times 5^3,\\; \\square \\times 5^3$의 최소공배수가 $2 \\times 3^2 \\times 5^3$일 때, $\\square$ 안에 들어갈 수 있는 수를 모두 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">5번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">$\\square$ 안에 들어갈 수 있는 자연수를 모두 적으시오.</p>
        <input type="text" id="p47-candidates" class="form-control proof-input-text" style="width:240px; margin-top:4px;" placeholder="쉼표로 수 나열">
        <div id="p47-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check47Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-8': {
    mission: "<b>[1.4 확인 6] 가장 작은 세 자리 자연수</b><br>교과서 22쪽 6번: 18과 45로 각각 나누어떨어지는 가장 작은 세 자리 자연수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">6번 문항</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">가장 작은 세 자리 자연수를 구하시오.</p>
        <input type="text" id="p48-threeDigits" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="세 자리 수 (숫자)">
        <div id="p48-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check48Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-9': {
    mission: "<b>[1.4 생각 넓히기] 두 수의 합과 GCD, LCM 추론</b><br>교과서 23쪽: 두 자연수의 합이 44이고, 최대공약수가 4, 최소공배수가 72인 두 자연수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">생각 넓히기</span>
        <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:6px;">
          학생 1: "두 자연수의 합은 44야."<br>
          학생 2: "두 자연수의 최대공약수는 4이고, 최소공배수는 72야."
        </div>
        <p style="margin-top:10px; font-weight:700; color:#1e293b;">두 자연수를 모두 적으시오.</p>
        <input type="text" id="p49-pair" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="쉼표로 두 수 나열">
        <div id="p49-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check49Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-10': {
    mission: "<b>[1.4 디지털 쏙 수학] 소수를 판별하는 코딩 (알지오매스)</b><br>교과서 23쪽: 알지오매스 블록 코딩 알고리즘을 실행하여 115, 269, 2027을 판별하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">디지털 쏙 수학</span>
        <p style="font-weight:700; color:#1e293b; margin-top:8px;">1) 115는 소수인가요, 합성수인가요?</p>
        <input type="text" id="p410-115" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="소수 또는 합성수">
        <p style="font-weight:700; color:#1e293b; margin-top:10px;">2) 269는 소수인가요, 합성수인가요?</p>
        <input type="text" id="p410-269" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="소수 또는 합성수">
        <p style="font-weight:700; color:#1e293b; margin-top:10px;">3) 2027은 소수인가요, 합성수인가요?</p>
        <input type="text" id="p410-2027" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="소수 또는 합성수">
        <p style="font-weight:700; color:#1e293b; margin-top:10px;">4) 코딩에서 기준 변수 D는 무엇의 개수인가요?</p>
        <input type="text" id="p410-logic" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="수학적 개념 또는 용어 입력">
        <div id="p410-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check410Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 5: 5. 스스로 마무리하기 (pp. 24~26) — 14개 서브스텝 (전용 탭, 1문항 1페이지)
  // ==========================================
  '5-1': {
    mission: "<b>[마무리 01번] 달력 속 소수인 날짜 찾기</b><br>교과서 24쪽 1번: 1일부터 31일까지의 날짜 중에서 소수인 날짜의 총 개수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">1번 기본 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">1일부터 31일까지 중 소수인 날짜는 총 몇 개인가요?</p>
        <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
          <input type="text" id="p51-cnt" class="form-control proof-input-text" style="width:100px;" placeholder="개수 (숫자)">
          <span>개</span>
        </div>
        <div id="p51-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check51Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-2': {
    mission: "<b>[마무리 02번] 보기 중 옳은 것 고르기</b><br>교과서 24쪽 2번: 소수와 합성수의 성질 중 옳은 것을 모두 고르세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">2번 기본 문제</span>
        <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:6px; line-height:1.6;">
          ㄱ. 모든 소수는 약수가 2개이다.<br>
          ㄴ. 2를 제외한 모든 짝수는 소수가 아니다.<br>
          ㄷ. 일의 자리 숫자가 3인 수는 모두 소수이다.<br>
          ㄹ. 약수의 개수가 3인 수는 합성수이다.
        </div>
        <p style="margin-top:10px; font-weight:700; color:#1e293b;">옳은 것을 모두 고르시오.</p>
        <input type="text" id="p52-choice" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="쉼표로 기호 나열 (예: ㄱ, ㄷ)">
        <div id="p52-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check52Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-3': {
    mission: "<b>[마무리 03번] 거듭제곱 일의 자리 규칙성</b><br>교과서 24쪽 3번: $3^{13} + 5^4$ 의 일의 자리 숫자를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">3번 기본 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">$3^{13} + 5^4$ 의 일의 자리 숫자를 구하시오.</p>
        <input type="text" id="p53-digit" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="일의 자리 숫자">
        <div id="p53-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check53Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-4': {
    mission: "<b>[마무리 04번] 330의 소인수가 아닌 것</b><br>교과서 24쪽 4번: 다음 중 330의 소인수가 아닌 것의 번호를 고르세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">4번 기본 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">330의 소인수가 아닌 것의 번호를 고르시오.</p>
        <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:4px;">
          ① 2 &nbsp;&nbsp; ② 3 &nbsp;&nbsp; ③ 5 &nbsp;&nbsp; ④ 7 &nbsp;&nbsp; ⑤ 11
        </div>
        <input type="text" id="p54-no" class="form-control proof-input-text" style="width:100px; margin-top:8px;" placeholder="번호 선택 (1~5)">
        <div id="p54-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check54Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-5': {
    mission: "<b>[마무리 05번] 84를 a로 나누어 b² 만들기</b><br>교과서 25쪽 5번: 84를 가장 작은 자연수 $a$로 나누어 $b^2$이 되게 할 때, $a+b$의 값을 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">5번 기본 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">$a+b$ 의 값을 구하시오.</p>
        <input type="text" id="p55-sum" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="계산값 a+b (숫자)">
        <div id="p55-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check55Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-6': {
    mission: "<b>[마무리 06번] 서로소인 두 수 찾기</b><br>교과서 25쪽 6번: 다음 중에서 두 수가 서로소인 것의 번호를 고르세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">6번 표준 문제</span>
        <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:6px; line-height:1.6;">
          ① 13, 52 &nbsp;&nbsp;&nbsp; ② 15, 27<br>
          ③ 36, 45 &nbsp;&nbsp;&nbsp; ④ 35, $2 \\times 3^2$<br>
          ⑤ $2^2 \\times 3 \\times 5,\\; 2 \\times 3^2 \\times 5^2$
        </div>
        <p style="margin-top:10px; font-weight:700; color:#1e293b;">서로소인 것의 번호를 고르시오.</p>
        <input type="text" id="p56-cop" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="번호 선택 (1~5)">
        <div id="p56-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check56Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-7': {
    mission: "<b>[마무리 07번] 두 수의 최대공약수와 최소공배수</b><br>교과서 25쪽 7번: 두 수 $2^3 \\times 3 \\times 5$ 와 $2^2 \\times 3 \\times 7$ 의 최대공약수와 최소공배수를 차례대로 고르세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">7번 표준 문제</span>
        <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:6px; line-height:1.6;">
          ① $2^2 \\times 3,\\; 2^2 \\times 3 \\times 5$<br>
          ② $2^2 \\times 3,\\; 2^2 \\times 3 \\times 7$<br>
          ③ $2^2 \\times 3,\\; 2^2 \\times 3 \\times 5 \\times 7$<br>
          ④ $2^2 \\times 3,\\; 2^3 \\times 3 \\times 5 \\times 7$<br>
          ⑤ $2^3 \\times 3,\\; 2^3 \\times 3 \\times 5 \\times 7$
        </div>
        <p style="margin-top:10px; font-weight:700; color:#1e293b;">올바른 번호를 고르시오.</p>
        <input type="text" id="p57-ans" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="번호 선택 (1~5)">
        <div id="p57-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check57Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-8': {
    mission: "<b>[마무리 08번] A와 36의 관계 추론</b><br>교과서 25쪽 8번: 두 자연수 $A,\\; 36$의 최대공약수가 12, 최소공배수가 180일 때 $A$의 값을 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">8번 표준 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">자연수 $A$의 값을 구하시오.</p>
        <input type="text" id="p58-valA" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="A의 값 (숫자)">
        <div id="p58-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check58Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-9': {
    mission: "<b>[마무리 09번] 비가 3:7인 두 수의 최대공약수</b><br>교과서 25쪽 9번: 두 자연수의 비가 $3:7$이고 최소공배수가 420일 때, 두 수의 최대공약수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">9번 표준 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">두 수의 최대공약수를 구하시오.</p>
        <input type="text" id="p59-gcd" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        <div id="p59-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check59Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-10': {
    mission: "<b>[마무리 10번] 세 분수에 곱해 자연수가 되는 기약분수</b><br>교과서 25쪽 10번: 세 수 $\\frac{9}{5},\\; \\frac{36}{7},\\; \\frac{15}{14}$ 중 어느 것을 곱해도 자연수가 되는 가장 작은 기약분수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">10번 표준 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">가장 작은 기약분수를 구하시오.</p>
        <input type="text" id="p510-frac" class="form-control proof-input-text" style="width:140px; margin-top:4px;" placeholder="기약분수 꼴 입력 (예: a/b)">
        <div id="p510-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check510Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-11': {
    mission: "<b>[마무리 11번 서술형] 소인수분해와 최댓값·최솟값</b><br>교과서 26쪽 11번: 126의 가장 큰 소인수 $a$, 45의 가장 작은 소인수 $b$에 대하여 $a+b$의 값을 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">11번 서술형 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">$a+b$ 의 값을 구하시오.</p>
        <input type="text" id="p511-sum" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="계산값 a+b (숫자)">
        <div id="p511-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check511Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-12': {
    mission: "<b>[마무리 12번 서술형] 1부터 12까지 연속 곱의 소인수분해</b><br>교과서 26쪽 12번: $1\\times 2\\times \\cdots \\times 12 = 2^x \\times 3^y \\times 5^z \\times 7 \\times 11$ 일 때, $x+y+z$의 값을 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">12번 서술형 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">$x+y+z$ 의 값을 구하시오.</p>
        <input type="text" id="p512-sum" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="계산값 x+y+z (숫자)">
        <div id="p512-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check512Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-13': {
    mission: "<b>[마무리 13번 서술형] 세 수의 최대공약수 조건과 A</b><br>교과서 26쪽 13번: 세 수 72, 60, A의 최대공약수가 6일 때, 10보다 크고 20보다 작은 $A$의 값을 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">13번 서술형 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">10보다 크고 20보다 작은 $A$의 값을 구하시오.</p>
        <input type="text" id="p513-valA" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="A의 값 (숫자)">
        <div id="p513-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check513Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-14': {
    mission: "<b>[마무리 14번 서술형] GCD/LCM 연결 트리와 합</b><br>교과서 26쪽 14번: 아래 연결 트리에서 $A(=36), B(=18), C(=108)$ 일 때, $A+B+C$의 값을 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">14번 서술형 문제</span>
        <p style="margin-top:6px; font-weight:700; color:#1e293b;">$A+B+C$ 의 값을 구하시오.</p>
        <input type="text" id="p514-sum" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="계산값 A+B+C (숫자)">
        <div id="p514-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-top:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800; margin-top:14px;" onclick="check514Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 6: 6. 창의융합 프로젝트 (pp. 26~27) — 1개 서브스텝
  // ==========================================
  '6-1': {
    mission: "<b>[창의융합 프로젝트] 몬드리안 직사각형 분할 실험실</b><br>교과서 26~27쪽 창의융합 프로젝트: 네덜란드 화가 몬드리안의 작품처럼, 격자 판 위의 수가 면적이 되도록 겹치지 않는 직사각형들로 분할하고 삼원색을 칠해 나만의 수학 미술 작품을 완성해 보세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">창의융합 프로젝트</span>
        <p style="font-weight:700; color:#1e293b; margin-top:10px;">1) 몬드리안 분할 규칙에서, 각 직사각형의 넓이는 직사각형 안에 포함된 어떤 값과 같아야 하나요?</p>
        <input type="text" id="p61-rule" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="수학적 기준 또는 단어 입력">
        <p style="font-weight:700; color:#1e293b; margin-top:12px;">2) 분할할 때 7과 같은 소수나 9, 12와 같은 큰 수부터 먼저 그리는 것이 효과적인 까닭은 무엇인가요?</p>
        <input type="text" id="p61-strat" class="form-control proof-input-text" style="width:100%; margin-top:4px;" placeholder="이유 설명 (핵심 단어 포함)">
        <div class="tip-card" style="background:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#166534; margin-top:12px; margin-bottom:12px;">
          🎨 <b>수학과 미술의 융합:</b> 소수는 $1 \\times p$ 한 가지 모양으로만 분할되므로, 소수나 큰 수의 위치를 먼저 고정하면 복잡한 몬드리안 퍼즐도 쉽게 해결할 수 있습니다!
        </div>
        <div id="p61-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check61Submit()">✅ 제출 및 채점</button>
      </div>
    `
  }
};
