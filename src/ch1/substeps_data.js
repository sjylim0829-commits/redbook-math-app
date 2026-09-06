// src/ch1/substeps_data.js
// Chapter 1: Factors & Primes (소인수분해) 26 Substeps Configuration Data

const SUBSTEP_CONFIG = {
  // ==========================================
  // Tab 0: 되짚어 보기 & 단원 도입 (pp. 6~9)
  // ==========================================
  '0-1': {
    mission: "<b>[되짚어 보기 1] 약수와 배수의 관계 (초등 5~6학년)</b><br>교과서 8쪽: 좌측 인터랙티브 타일 배열기를 조작하여 12개의 정사각형 타일로 직사각형을 만들어 약수의 성질을 탐구하고, 배수의 규칙을 확인하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q1</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 6의 약수를 작은 수부터 차례로 모두 적으시오.</p>
          <input type="text" id="p01-div6" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="쉼표로 약수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q2</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">2) 13의 약수를 작은 수부터 차례로 모두 적으시오.</p>
          <input type="text" id="p01-div13" class="form-control proof-input-text" style="width:180px; margin-top:4px;" placeholder="쉼표로 약수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q3</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) 24의 배수를 가장 작은 수부터 차례로 3개 적으시오.</p>
          <input type="text" id="p01-mul24" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="쉼표로 배수 3개 나열">
        </div>
        <div class="tip-card" style="background:#f8fafc; border-left:4px solid #0284c7; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#475569; margin-bottom:12px;">
          💡 <b>핵심 팁:</b> $a = b \\times c$ 일 때, $b$와 $c$는 $a$의 <b>약수</b>이고, $a$는 $b$와 $c$의 <b>배수</b>입니다.
        </div>
        <div id="p01-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check01Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '0-2': {
    mission: "<b>[되짚어 보기 2] 공약수와 최대공약수 (초등 5~6학년)</b><br>교과서 8쪽: 두 수의 공통인 약수(공약수)를 벤다이어그램으로 관찰하고, 공약수 중 가장 큰 최대공약수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q1</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 12와 18의 공약수를 모두 쓰시오.</p>
          <input type="text" id="p02-common" class="form-control proof-input-text" style="width:240px; margin-top:4px;" placeholder="쉼표로 공약수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q2</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">2) 12와 18의 최대공약수를 구하시오.</p>
          <input type="text" id="p02-gcd" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="숫자 입력">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">초등 복습 Q3</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) 45와 54의 최대공약수를 구하시오.</p>
          <input type="text" id="p02-gcd45" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="숫자 입력">
        </div>
        <div class="tip-card" style="background:#f8fafc; border-left:4px solid #0284c7; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#475569; margin-bottom:12px;">
          💡 <b>공약수의 성질:</b> 두 수의 공약수는 두 수의 <b>최대공약수의 약수</b>입니다.
        </div>
        <div id="p02-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check02Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '0-3': {
    mission: "<b>[되짚어 보기 3] 공배수와 최소공배수 (초등 5~6학년)</b><br>교과서 8쪽: 수직선 상에서 두 수의 배수가 도약하여 만나는 지점을 확인하고, 공배수와 최소공배수의 관계를 탐구하세요.",
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
    mission: "<b>[단원 도입 & 생각열기] 정보화 시대의 소수 (자연수의 분류)</b><br>교과서 8~9쪽: 자연을 생물과 비생물로 분류하듯, 자연수는 '약수의 개수'에 따라 1개, 2개, 3개 이상의 세 바구니로 분류할 수 있습니다. 좌측 저울로 1~10까지의 수를 분류해 보세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 1부터 10까지의 자연수 중 약수가 1개뿐인 수는 무엇인가요?</p>
          <input type="text" id="p04-g1" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="숫자 입력">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 1부터 10까지의 자연수 중 약수가 2개뿐인 수들을 모두 적으시오.</p>
          <input type="text" id="p04-g2" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="쉼표로 수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 1부터 10까지의 자연수 중 약수가 3개 이상인 수들을 모두 적으시오.</p>
          <input type="text" id="p04-g3" class="form-control proof-input-text" style="width:260px; margin-top:4px;" placeholder="쉼표로 수 나열">
        </div>
        <div class="tip-card" style="background:#fef3c7; border-left:4px solid #f59e0b; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#92400e; margin-bottom:12px;">
          ⚠️ <b>오개념 바로잡기:</b> 2, 3, 5 등과 같은 <b>소수(素數)</b>는 0.1, 2.3과 같은 <b>소수(小數, 소수점 수)</b>와는 한자 및 개념이 전혀 다른 수입니다.
        </div>
        <div id="p04-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check04Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 1: 1. 소수와 합성수 (pp. 10~13)
  // ==========================================
  '1-1': {
    mission: "<b>[1.1 개념] 소수와 합성수의 뜻</b><br>교과서 9~10쪽: 1보다 큰 자연수 중에서 1과 자기 자신만을 약수로 가지는 수를 <b>소수</b>(약수 2개), 1과 자기 자신 이외의 수를 약수로 가지는 수를 <b>합성수</b>(약수 3개 이상)라고 합니다.",
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
    mission: "<b>[1.1 함께하기] 에라토스테네스의 체</b><br>교과서 10~11쪽: 고대 그리스 수학자 에라토스테네스가 고안한 방법으로, 1부터 50까지의 자연수 격자판에서 체질하여 소수만을 걸러내 보세요.",
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
    mission: "<b>[1.1 개념 & 문제 2] 거듭제곱과 밑·지수의 표현</b><br>교과서 10~11쪽: 같은 수를 여러 번 곱할 때 곱하는 수(밑)와 곱한 횟수(지수)를 사용하여 거듭제곱으로 나타내는 방법을 탐구합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) $2 \\times 2 \\times 2 \\times 5 \\times 5$ 를 거듭제곱으로 나타내시오.</p>
          <input type="text" id="p13-q1" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="거듭제곱 (예: a^m * b^n)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) $3 \\times 3 \\times 7 \\times 11 \\times 11 \\times 11$ 을 거듭제곱으로 나타내시오.</p>
          <input type="text" id="p13-q2" class="form-control proof-input-text" style="width:260px; margin-top:4px;" placeholder="거듭제곱 (예: a^m * b * c^n)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) $2^5$ 에서 밑과 지수를 각각 적으시오.</p>
          <div style="display:flex; gap:16px; margin-top:6px;">
            <span>밑: <input type="text" id="p13-base" class="form-control proof-input-text" style="width:70px;" placeholder="밑 (숫자)"></span>
            <span>지수: <input type="text" id="p13-exp" class="form-control proof-input-text" style="width:70px;" placeholder="지수 (숫자)"></span>
          </div>
        </div>
        <div class="tip-card" style="background:#fdf2f8; border-left:4px solid #ec4899; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#9d174d; margin-bottom:12px;">
          ⚡ <b>거듭제곱의 위력:</b> 두께 0.1mm 종이를 42번 접으면 $0.1 \\times 2^{42} \\approx 439,805\\text{ km}$로 지구에서 달까지의 거리(약 384,400 km)보다 길어집니다!
        </div>
        <div id="p13-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check13Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '1-4': {
    mission: "<b>[1.1 스스로 확인하기 1] 기본 문제 (1~3번)</b><br>교과서 12쪽: 소수와 합성수 판별, 거듭제곱 표현, 소수의 성질에 대한 참/거짓 판단을 확인하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">1번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 8, 17, 39, 53 중에서 소수를 모두 고르시오.</p>
          <input type="text" id="p14-q1" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="쉼표로 소수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">2번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">2) $5 \\times 5 \\times 5 \\times 5$ 를 거듭제곱으로 나타내시오.</p>
          <input type="text" id="p14-q2" class="form-control proof-input-text" style="width:140px; margin-top:4px;" placeholder="거듭제곱 (예: a^m)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">3번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) 다음 보기 중 옳은 것을 모두 고르시오.</p>
          <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:4px; line-height:1.6;">
            ㄱ. 모든 자연수는 약수가 2개 이상이다.<br>
            ㄴ. 모든 소수는 홀수이다.<br>
            ㄷ. 43은 소수이다.<br>
            ㄹ. 3의 배수 중에서 소수는 1개이다.
          </div>
          <input type="text" id="p14-q3" class="form-control proof-input-text" style="width:160px; margin-top:8px;" placeholder="기호 입력 (예: ㄱ, ㄴ)">
        </div>
        <div id="p14-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check14Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '1-5': {
    mission: "<b>[1.1 스스로 확인하기 2 & 생각 넓히기] 세균 증식과 열차 소수 역</b><br>교과서 12쪽: 10분마다 2배 늘어나는 세균, 거듭제곱 방정식 $2^a=64, 3^b=27$, 1~30번 열차 역 중 내린 승객이 2명인 소수 역을 탐구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">4번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 10분마다 2배씩 늘어나는 세균은 1시간(60분) 후 지금의 몇 배가 되나요?</p>
          <input type="text" id="p15-bacteria" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="거듭제곱 (예: a^m)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">5번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">2) $2^a = 64,\\; 3^b = 27$ 일 때, $a + b$ 의 값을 구하시오.</p>
          <input type="text" id="p15-eq" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="계산 결과 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#fef3c7; color:#b45309; padding:3px 8px; border-radius:6px; font-weight:700;">생각 넓히기 (열차 소수 역)</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) $k$번째 열차는 $k$의 배수 역마다 승객이 1명씩 내립니다. 25번 역에서 내린 승객은 총 몇 명인가요?</p>
          <input type="text" id="p15-train25" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="인원수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">4) 1~30번 역 중 내린 승객이 정확히 2명인 역(소수 역)의 번호를 작은 수부터 모두 적으시오.</p>
          <input type="text" id="p15-train2" class="form-control proof-input-text" style="width:100%; margin-top:4px;" placeholder="쉼표로 역 번호 나열">
        </div>
        <div id="p15-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check15Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 2: 2. 소인수분해 (pp. 14~17)
  // ==========================================
  '2-1': {
    mission: "<b>[1.2 생각열기] 소인수와 인수의 뜻</b><br>교과서 13쪽: 12를 두 자연수의 곱으로 나타내고, 12의 약수(인수) 중에서 소수인 <b>소인수</b>의 개념을 확립합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 12의 약수(인수)를 작은 수부터 차례로 모두 적으시오.</p>
          <input type="text" id="p21-factors12" class="form-control proof-input-text" style="width:240px; margin-top:4px;" placeholder="쉼표로 약수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 12의 약수 중에서 소수(소인수)인 수를 모두 적으시오.</p>
          <input type="text" id="p21-primefac12" class="form-control proof-input-text" style="width:140px; margin-top:4px;" placeholder="쉼표로 소인수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) [문제 1] 30의 소인수를 모두 구하시오.</p>
          <input type="text" id="p21-pf30" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="쉼표로 소인수 나열">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">4) [문제 1] 45의 소인수를 모두 구하시오.</p>
          <input type="text" id="p21-pf45" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="쉼표로 소인수 나열">
        </div>
        <div class="tip-card" style="background:#f8fafc; border-left:4px solid #4f46e5; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#475569; margin-bottom:12px;">
          💡 <b>소인수의 뜻:</b> 어떤 자연수의 약수(인수) 중에서 <b>소수인 것</b>을 그 자연수의 <b>소인수</b>라고 합니다.
        </div>
        <div id="p21-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check21Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-2': {
    mission: "<b>[1.2 개념 & 예제] 소인수분해 방법과 가지치기 트리</b><br>교과서 14쪽: 1보다 큰 자연수를 오직 소수들만의 곱으로 나타내는 것을 <b>소인수분해</b>라고 합니다. 좌측 가지치기 트리와 나눗셈법으로 수를 분해해 보세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 18을 소인수분해하여 거듭제곱으로 나타내시오.</p>
          <input type="text" id="p22-18" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="거듭제곱 (예: a * b^n)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 24를 소인수분해하여 거듭제곱으로 나타내시오.</p>
          <input type="text" id="p22-24" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="거듭제곱 (예: a^m * b)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 60을 소인수분해하여 거듭제곱으로 나타내시오.</p>
          <input type="text" id="p22-60" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="거듭제곱 (예: a^m * b * c)">
        </div>
        <div class="tip-card" style="background:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#166534; margin-bottom:12px;">
          🌳 <b>유일성 원리:</b> 곱하는 순서를 생각하지 않으면, 1보다 큰 자연수를 소인수분해한 결과는 <b>오직 한 가지뿐</b>입니다!
        </div>
        <div id="p22-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check22Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-3': {
    mission: "<b>[1.2 문제 1] 소인수분해 집중 실습</b><br>교과서 14쪽 문제 1: 27, 36, 80, 126의 4개 자연수를 단계별로 소인수분해하여 거듭제곱 표준 형태로 완성하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 27을 소인수분해하시오.</p>
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
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">4) 126을 소인수분해하시오.</p>
          <input type="text" id="p23-126" class="form-control proof-input-text" style="width:220px; margin-top:4px;" placeholder="거듭제곱 꼴 입력">
        </div>
        <div id="p23-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check23Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-4': {
    mission: "<b>[1.2 예제 & 탐구] 소인수분해를 이용한 약수 구하기</b><br>교과서 15쪽 예제: $63 = 3^2 \\times 7$ 의 약수를 $3^2$의 약수(1, 3, 9)와 7의 약수(1, 7)의 2차원 곱셈 격자표로 빠짐없이 찾아보세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 63의 약수를 작은 수부터 차례로 모두 적으시오.</p>
          <input type="text" id="p24-div63" class="form-control proof-input-text" style="width:280px; margin-top:4px;" placeholder="쉼표로 약수 나열 (작은 수부터)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 다음 수 중 $2^3 \\times 3^2$ 의 약수인 것을 모두 고르시오.</p>
          <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:4px;">
            보기: $3^2$,\\; $2^2 \\times 3^2$,\\; $3^3$,\\; $2^3 \\times 3$,\\; $2^4 \\times 3$
          </div>
          <input type="text" id="p24-test" class="form-control proof-input-text" style="width:100%; margin-top:8px;" placeholder="쉼표로 약수 나열">
        </div>
        <div class="tip-card" style="background:#f8fafc; border-left:4px solid #6366f1; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#475569; margin-bottom:12px;">
          💡 <b>원리:</b> $a^m \\times b^n$ 의 약수는 $a^m$의 약수와 $b^n$의 약수를 각각 하나씩 골라 곱한 것들입니다.
        </div>
        <div id="p24-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check24Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '2-5': {
    mission: "<b>[1.2 약수의 개수 & 스스로 확인하기] 공식 탐구와 응용</b><br>교과서 16쪽: $18 = 2 \\times 3^2$ 약수 표를 통해 약수의 개수 공식 $(m+1)(n+1)$을 도출하고, 제곱수 만들기 문제에 도전하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) $160 = 2^5 \\times 5$ 의 약수의 개수는 총 몇 개인가요?</p>
          <input type="text" id="p25-cnt160" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="개수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) $2^\\square \\times 3^2$ 의 약수의 개수가 12일 때, $\\square$ 안에 들어갈 수는?</p>
          <input type="text" id="p25-exp" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="숫자 입력">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 56에 자연수를 곱하여 어떤 수의 제곱이 되게 할 때, 곱할 수 있는 가장 작은 자연수는?</p>
          <input type="text" id="p25-square" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="가장 작은 수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">4) 100보다 작은 자연수 중 두 소인수의 합이 18인 자연수를 모두 적으시오.</p>
          <input type="text" id="p25-sunwoo" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="쉼표로 수 나열">
        </div>
        <div id="p25-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check25Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 3: 3. 최대공약수 (pp. 17~19)
  // ==========================================
  '3-1': {
    mission: "<b>[1.3 생각열기] 최대공약수와 서로소의 뜻</b><br>교과서 17~18쪽: 직사각형 도안을 가능한 한 가장 큰 정사각형으로 채우는 타일링과, 최대공약수가 1인 두 자연수 '서로소'의 개념을 탐구합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 두 자연수 8과 15처럼 최대공약수가 1인 두 자연수를 무엇이라고 하나요?</p>
          <input type="text" id="p31-def" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="수학 용어 입력">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 다음 중에서 두 수가 서로소인 쌍의 번호를 모두 고르시오.</p>
          <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:4px; line-height:1.6;">
            (1) 14, 15<br>
            (2) 10, 45<br>
            (3) 24, 35<br>
            (4) 17, 51
          </div>
          <input type="text" id="p31-coprime" class="form-control proof-input-text" style="width:160px; margin-top:8px;" placeholder="쉼표로 번호 나열 (작은 수부터)">
        </div>
        <div class="tip-card" style="background:#f8fafc; border-left:4px solid #0284c7; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#475569; margin-bottom:12px;">
          💡 <b>주의:</b> 서로소인 두 수는 '공통인 소인수가 없다'는 뜻이지만, 1은 모든 수의 공약수이므로 <b>공약수가 1뿐인 관계</b>입니다.
        </div>
        <div id="p31-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check31Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-2': {
    mission: "<b>[1.3 개념] 소인수분해를 이용한 최대공약수 구하기</b><br>교과서 17~18쪽: 두 수 24와 84를 소인수분해하고, 밑이 같은 거듭제곱 중 '지수가 작거나 같은 것'을 곱하여 최대공약수를 구하세요.",
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
    mission: "<b>[1.3 예제] 세 수의 최대공약수 구하기</b><br>교과서 18~19쪽 예제: 세 수 60, 72, 150과 45, 75, 90을 세로로 소인수분해 정렬하여 세 수의 최대공약수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">예제</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 60, 72, 150의 최대공약수를 구하시오.</p>
          <input type="text" id="p33-ex1" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">따라 하기</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">2) 45, 75, 90의 최대공약수를 구하시오.</p>
          <input type="text" id="p33-follow" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">문제 3</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) 54, 72, 90의 최대공약수를 구하시오.</p>
          <input type="text" id="p33-q3" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        </div>
        <div id="p33-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check33Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '3-4': {
    mission: "<b>[1.3 스스로 확인하기 & 생각 넓히기] 최대공약수 응용과 추론</b><br>교과서 18~19쪽: 분수를 자연수로 만드는 수, 나머지 조건 연산, 21과의 최대공약수가 7인 50 이하 두 자리 자연수를 모두 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) $2^a \\times 5^3 \\times 7$ 과 $2^3 \\times 3 \\times 5^b$ 의 최대공약수가 100일 때, $a+b$ 의 값은?</p>
          <input type="text" id="p34-q4" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="계산값 a+b (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 두 수 $\\frac{105}{\\square},\\; \\frac{350}{\\square}$ 이 모두 자연수가 되게 하는 가장 큰 자연수 $\\square$ 는?</p>
          <input type="text" id="p34-q5" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="가장 큰 수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 107을 나누면 2가 남고, 153을 나누면 3이 남고, 90을 나누면 나누어떨어지는 가장 큰 자연수는?</p>
          <input type="text" id="p34-q6" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="가장 큰 수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">4) 50보다 작은 두 자리 자연수 중 21과의 최대공약수가 7인 수들을 모두 적으시오.</p>
          <input type="text" id="p34-wide" class="form-control proof-input-text" style="width:240px; margin-top:4px;" placeholder="쉼표로 수 나열">
        </div>
        <div id="p34-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check34Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 4: 4. 최소공배수 (pp. 20~23)
  // ==========================================
  '4-1': {
    mission: "<b>[1.4 생각열기] 최소공배수와 소인수분해</b><br>교과서 20~21쪽: 월드컵(4년)과 마술대회(3년) 동시 개최 주기 및 54와 90의 최소공배수에서 '지수가 크거나 같은 것과 나머지 모든 소인수'를 곱하는 원리를 탐구합니다.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 4년 주기 대회와 3년 주기 대회가 2022년에 동시 개최되었다면 다음 동시 개최 연도는?</p>
          <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
            <input type="text" id="p41-cycle" class="form-control proof-input-text" style="width:120px;" placeholder="연도 입력 (숫자)">
            <span>년</span>
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 54와 90의 최소공배수를 구하시오.</p>
          <input type="text" id="p41-lcm5490" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최소공배수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) $2^2 \\times 5$ 와 $2 \\times 3 \\times 5$ 의 최소공배수를 구하시오.</p>
          <input type="text" id="p41-q1a" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최소공배수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">4) 45와 63의 최소공배수를 구하시오.</p>
          <input type="text" id="p41-q1b" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최소공배수 (숫자)">
        </div>
        <div id="p41-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check41Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-2': {
    mission: "<b>[1.4 톱니바퀴 맞물림 & 세 수의 최소공배수]</b><br>교과서 20~21쪽: 맞물려 돌아가는 톱니바퀴 A(24개), B(36개)가 처음으로 다시 같은 톱니에서 맞물릴 때까지의 회전수와 세 수의 최소공배수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 톱니 24개와 36개 톱니바퀴가 처음으로 다시 맞물리는 톱니 수는?</p>
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
    mission: "<b>[1.4 스스로 확인하기 & 생각 넓히기] 최소공배수 응용과 추론</b><br>교과서 22쪽: $\\frac{1}{70}, \\frac{1}{98}$에 곱해 자연수가 되는 수, $3A, 4A, 5A$의 최소공배수가 360일 때 $A$값, 합이 44이고 GCD가 4, LCM이 72인 두 수를 찾으세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 두 수 $\\frac{1}{70},\\; \\frac{1}{98}$ 중 어느 것에 곱해도 자연수가 되는 가장 작은 자연수는?</p>
          <input type="text" id="p43-q3" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="가장 작은 수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 세 자연수 $3\\times A,\\; 4\\times A,\\; 5\\times A$의 최소공배수가 360일 때, $A$의 값은?</p>
          <input type="text" id="p43-q4" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="A의 값 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 18과 45로 각각 나누어떨어지는 가장 작은 세 자리 자연수는?</p>
          <input type="text" id="p43-q6" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="세 자리 수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">4) 두 수의 합이 44, 최대공약수가 4, 최소공배수가 72인 두 자연수를 모두 적으시오.</p>
          <input type="text" id="p43-wide" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="쉼표로 두 수 나열">
        </div>
        <div id="p43-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check43Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '4-4': {
    mission: "<b>[1.4 디지털 쏙 수학] 소수를 판별하는 코딩 (알지오매스)</b><br>교과서 23쪽: 알지오매스 블록 코딩 알고리즘(1부터 N까지의 수로 나누어 나머지가 0인 약수의 개수 D가 2개인지 확인)을 실행하여 115, 269, 2027을 판별하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <p style="font-weight:700; color:#1e293b; margin-bottom:12px;">좌측 시뮬레이터에 수를 입력하고 [알고리즘 실행] 버튼을 눌러 소수 판별 과정을 확인해 보세요.</p>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 115는 소수인가요, 합성수인가요?</p>
          <input type="text" id="p44-115" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="소수 또는 합성수">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 269는 소수인가요, 합성수인가요?</p>
          <input type="text" id="p44-269" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="소수 또는 합성수">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">3) 2027은 소수인가요, 합성수인가요?</p>
          <input type="text" id="p44-2027" class="form-control proof-input-text" style="width:160px; margin-top:4px;" placeholder="소수 또는 합성수">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">4) 코딩에서 입력한 수가 소수인지 판별하는 기준 변수 D는 무엇의 개수인가요?</p>
          <input type="text" id="p44-logic" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="수학적 개념 또는 용어 입력">
        </div>
        <div id="p44-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check44Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },

  // ==========================================
  // Tab 5: 5. 마무리 & 프로젝트 (pp. 24~27)
  // ==========================================
  '5-1': {
    mission: "<b>[1.5 스스로 마무리하기 1] 기본 문제 (1~5번)</b><br>교과서 24~25쪽: 달력 속 31일까지의 날짜 중 소수 찾기, 330의 소인수, 일의 자리 규칙성 $3^{13}+5^4$, 84를 $a$로 나누어 $b^2$ 만들기.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">1번 문항 (달력)</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 1일부터 31일까지의 날짜 중 소수인 날짜는 총 몇 개인가요?</p>
          <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
            <input type="text" id="p51-calendarCount" class="form-control proof-input-text" style="width:100px;" placeholder="개수 (숫자)">
            <span>개</span>
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">2번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">2) 다음 보기 중 옳은 것을 모두 고르시오.</p>
          <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:0.85rem; color:#334155; margin-top:4px; line-height:1.6;">
            ㄱ. 모든 소수는 약수가 2개이다.<br>
            ㄴ. 2를 제외한 모든 짝수는 소수가 아니다.<br>
            ㄷ. 일의 자리 숫자가 3인 수는 모두 소수이다.<br>
            ㄹ. 약수의 개수가 3인 수는 합성수이다.
          </div>
          <input type="text" id="p51-q2" class="form-control proof-input-text" style="width:160px; margin-top:8px;" placeholder="쉼표로 기호 나열 (예: ㄱ, ㄷ)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">3번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) $3^{13} + 5^4$ 의 일의 자리 숫자를 구하시오.</p>
          <input type="text" id="p51-q3" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="일의 자리 숫자">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">4번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">4) 330의 소인수가 아닌 것의 번호를 고르시오. (1) 2 (2) 3 (3) 5 (4) 7 (5) 11</p>
          <input type="text" id="p51-q4" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="번호 선택 (1~5)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">5번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">5) 84를 가장 작은 자연수 $a$로 나누어 $b^2$이 되게 할 때, $a+b$ 의 값은?</p>
          <input type="text" id="p51-q5" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="계산값 a+b (숫자)">
        </div>
        <div id="p51-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check51Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-2': {
    mission: "<b>[1.5 스스로 마무리하기 2] 표준 문제 (6~10번)</b><br>교과서 24~25쪽: 서로소 판정, 최대공약수/최소공배수, $A$와 36의 관계, 비 3:7인 두 수, 세 분수에 곱해 자연수가 되는 가장 작은 분수를 구하세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">6번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 두 수가 서로소인 것의 번호를 고르시오. (1) 13, 52 (2) 15, 27 (3) 36, 45 (4) 35, 2×3² (5) 2²×3×5, 2×3²×5²</p>
          <input type="text" id="p52-q6" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="번호 선택 (1~5)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">8번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">2) 두 자연수 $A,\\; 36$의 최대공약수가 12, 최소공배수가 180일 때 $A$의 값은?</p>
          <input type="text" id="p52-q8" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="A의 값 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">9번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) 두 자연수의 비가 $3:7$이고 최소공배수가 420일 때, 두 수의 최대공약수는?</p>
          <input type="text" id="p52-q9" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">10번 문항</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">4) 세 수 $\\frac{9}{5},\\; \\frac{36}{7},\\; \\frac{15}{14}$ 중 어느 것을 택하여 곱해도 자연수가 되는 가장 작은 기약분수는?</p>
          <input type="text" id="p52-q10" class="form-control proof-input-text" style="width:140px; margin-top:4px;" placeholder="기약분수 꼴 입력 (예: a/b)">
        </div>
        <div id="p52-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check52Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-3': {
    mission: "<b>[1.5 스스로 마무리하기 3] 서술형 완성 (11~14번)</b><br>교과서 26쪽: 서술형 문제 11번(126, 45 소인수), 12번(1×...×12 소인수분해 지수합), 13번(세 수 72, 60, A 최대공약수), 14번(연결된 GCD/LCM 트리) 풀이를 작성하세요. (펜 도구 사용 가능)",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">11번 서술형</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">1) 126의 가장 큰 소인수 $a$, 45의 가장 작은 소인수 $b$ 에 대하여 $a+b$ 의 값은?</p>
          <input type="text" id="p53-q11" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="계산값 a+b (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">12번 서술형</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">2) $1\\times 2\\times \\cdots \\times 12 = 2^x \\times 3^y \\times 5^z \\times 7 \\times 11$ 일 때, $x+y+z$ 의 값은?</p>
          <input type="text" id="p53-q12" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="계산값 x+y+z (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">13번 서술형</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">3) 세 수 72, 60, A의 최대공약수가 6일 때, 10보다 크고 20보다 작은 $A$의 값은?</p>
          <input type="text" id="p53-q13" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="A의 값 (숫자)">
        </div>
        <div style="margin-bottom:14px;">
          <span style="font-size:0.85rem; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700;">14번 서술형</span>
          <p style="margin-top:6px; font-weight:700; color:#1e293b;">4) 좌측 연결 트리에서 $A(=36), B(=18), C(=108)$ 일 때, $A+B+C$ 의 값은?</p>
          <input type="text" id="p53-q14" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="계산값 A+B+C (숫자)">
        </div>
        <div id="p53-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check53Submit()">✅ 제출 및 채점</button>
      </div>
    `
  },
  '5-4': {
    mission: "<b>[1.5 창의융합 프로젝트] 몬드리안 직사각형 분할 실험실</b><br>교과서 26~27쪽 창의융합 프로젝트: 네덜란드 화가 몬드리안의 작품처럼, 격자 판 위의 수가 면적이 되도록 겹치지 않는 직사각형들로 분할하고 삼원색을 칠해 나만의 수학 미술 작품을 완성해 보세요.",
    formHtml: `
      <div class="card" style="background:#ffffff; border:2px solid #cbd5e1; padding:18px; border-radius:12px;">
        <p style="font-weight:700; color:#1e293b; margin-bottom:12px;">좌측 몬드리안 직사각형 분할 실험실을 조작하여 분할 규칙을 확인하고 아래 물음에 답해 보세요.</p>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">1) 몬드리안 분할 규칙에서, 각 직사각형의 넓이는 직사각형 안에 포함된 어떤 값과 같아야 하나요?</p>
          <input type="text" id="p54-rule" class="form-control proof-input-text" style="width:200px; margin-top:4px;" placeholder="수학적 기준 또는 단어 입력">
        </div>
        <div style="margin-bottom:14px;">
          <p style="font-weight:700; color:#1e293b;">2) 분할할 때 7과 같은 소수나 9, 12와 같은 큰 수부터 먼저 그리는 것이 효과적인 까닭은 무엇인가요?</p>
          <input type="text" id="p54-strat" class="form-control proof-input-text" style="width:100%; margin-top:4px;" placeholder="이유 설명 (핵심 단어 포함)">
        </div>
        <div class="tip-card" style="background:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; border-radius:6px; font-size:0.84rem; color:#166534; margin-bottom:12px;">
          🎨 <b>수학과 미술의 융합:</b> 소수는 $1 \\times p$ 한 가지 모양으로만 분할되므로, 소수나 큰 수의 위치를 먼저 고정하면 복잡한 몬드리안 퍼즐도 쉽게 해결할 수 있습니다!
        </div>
        <div id="p54-err" style="display:none; color:#dc2626; font-size:0.85rem; font-weight:700; margin-bottom:10px;"></div>
        <button class="btn btn-primary" style="width:100%; padding:10px; font-weight:800;" onclick="check54Submit()">✅ 제출 및 채점</button>
      </div>
    `
  }
};
