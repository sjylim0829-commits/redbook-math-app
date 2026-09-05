const fs = require('fs');

function sanitizeCh1() {
  let c = fs.readFileSync('build_ch1_interactive.js', 'utf8');

  const replaces = [
    ['placeholder="예: 1, 2, 3, 4, 6, 12"', 'placeholder="약수를 쉼표로 나열 (작은 수부터)"'],
    ['placeholder="예: 1, 2, 3, 6"', 'placeholder="공약수를 쉼표로 나열"'],
    ['placeholder="숫자만"', 'placeholder="최대공약수 (숫자)"'],
    ['placeholder="예: 배수"', 'placeholder="용어 입력 (예: 약수 / 배수)"'],
    ['id="p11-g1" class="form-control proof-input-text" style="width:80px; margin-top:4px;" placeholder="1"', 'id="p11-g1" class="form-control proof-input-text" style="width:80px; margin-top:4px;" placeholder="자연수 입력"'],
    ['placeholder="예: 2, 3, 5, 7"', 'placeholder="쉼표로 수 나열"'],
    ['placeholder="예: 4, 6, 8, 9, 10"', 'placeholder="쉼표로 수 나열"'],
    ['placeholder="예: 둘 다 아니다"', 'placeholder="소수 / 합성수 / 둘 다 아님"'],
    ['id="p21-base" class="form-control proof-input-text" style="width:60px;" placeholder="2"', 'id="p21-base" class="form-control proof-input-text" style="width:60px;" placeholder="밑 입력"'],
    ['id="p21-exp" class="form-control proof-input-text" style="width:60px;" placeholder="5"', 'id="p21-exp" class="form-control proof-input-text" style="width:60px;" placeholder="지수 입력"'],
    ['id="p21-val" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="32"', 'id="p21-val" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="계산 결과 입력"'],
    ['placeholder="예: 2^2 * 3^2"', 'placeholder="거듭제곱 꼴 (예: a^m * b^n)"'],
    ['placeholder="예: 2^2 * 3 * 5"', 'placeholder="거듭제곱 꼴 (예: a^m * b^n)"'],
    ['id="p23-cnt" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="12"', 'id="p23-cnt" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="개수 입력"'],
    ['id="p23-second" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="36"', 'id="p23-second" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="숫자 입력"'],
    ['placeholder="(4+1)*(2+1)"', 'placeholder="계산식 또는 수 입력"'],
    ['id="p31-gcd" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="6"', 'id="p31-gcd" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="최대공약수 (숫자)"'],
    ['id="p31-coprime" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="예"', 'id="p31-coprime" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="예 또는 아니오"'],
    ['id="p32-power" class="form-control proof-input-text" style="width:160px;" placeholder="2^2 * 3"', 'id="p32-power" class="form-control proof-input-text" style="width:160px;" placeholder="거듭제곱 꼴"'],
    ['id="p32-val" class="form-control proof-input-text" style="width:80px;" placeholder="12"', 'id="p32-val" class="form-control proof-input-text" style="width:80px;" placeholder="계산값 입력"'],
    ['id="p33-ans" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="12"', 'id="p33-ans" class="form-control proof-input-text" style="width:120px; margin-top:4px;" placeholder="최대공약수 (숫자)"'],
    ['id="p41-power" class="form-control proof-input-text" style="width:180px;" placeholder="2^2 * 3^2 * 5"', 'id="p41-power" class="form-control proof-input-text" style="width:180px;" placeholder="거듭제곱 꼴"'],
    ['id="p41-val" class="form-control proof-input-text" style="width:80px;" placeholder="180"', 'id="p41-val" class="form-control proof-input-text" style="width:80px;" placeholder="계산값 입력"'],
    ['id="p42-lcm" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="72"', 'id="p42-lcm" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="최소공배수 (숫자)"'],
    ['id="p42-rotA" class="form-control proof-input-text" style="width:60px;" placeholder="3"', 'id="p42-rotA" class="form-control proof-input-text" style="width:60px;" placeholder="회전수"'],
    ['id="p42-rotB" class="form-control proof-input-text" style="width:60px;" placeholder="2"', 'id="p42-rotB" class="form-control proof-input-text" style="width:60px;" placeholder="회전수"'],
    ['id="p43-min" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="60"', 'id="p43-min" class="form-control proof-input-text" style="width:100px; margin-top:4px;" placeholder="분(min) 입력"'],
    ['placeholder="예: 오전 8시 또는 8시"', 'placeholder="시각 입력 (예: 오전 N시)"'],
    ['id="p51-q1" class="form-control proof-input-text" style="width:80px; margin-top:4px;" placeholder="8"', 'id="p51-q1" class="form-control proof-input-text" style="width:80px; margin-top:4px;" placeholder="개수 입력"'],
    ['id="p51-q2" class="form-control proof-input-text" style="width:80px; margin-top:4px;" placeholder="6"', 'id="p51-q2" class="form-control proof-input-text" style="width:80px; margin-top:4px;" placeholder="개수 입력"'],
    ['id="p52-size" class="form-control proof-input-text" style="width:100px;" placeholder="12"', 'id="p52-size" class="form-control proof-input-text" style="width:100px;" placeholder="한 변의 길이(cm)"'],
    ['id="p52-count" class="form-control proof-input-text" style="width:100px;" placeholder="6"', 'id="p52-count" class="form-control proof-input-text" style="width:100px;" placeholder="필요한 장수"']
  ];

  for (const [target, rep] of replaces) {
    if (!c.includes(target)) {
      console.warn('Target not found in Ch1:', target);
    }
    c = c.replace(target, rep);
  }

  fs.writeFileSync('build_ch1_interactive.js', c, 'utf8');
  console.log('Sanitized build_ch1_interactive.js successfully.');
}

function sanitizeCh2() {
  let c = fs.readFileSync('build_ch2_interactive.js', 'utf8');

  const replaces = [
    ['placeholder="-2 등"', 'placeholder="부호와 수 (예: +3, -3)"'],
    ['placeholder="-7 등"', 'placeholder="부호와 수"'],
    ['placeholder="-500 등"', 'placeholder="부호와 수"'],
    ['placeholder="둘 다 아니다 등"', 'placeholder="양수 / 음수 / 둘 다 아님"'],
    ['placeholder="-2.5 또는 -5/2"', 'placeholder="소수 또는 분수 입력"'],
    ['placeholder="예: +4, -4"', 'placeholder="수를 쉼표로 나열"'],
    ['placeholder=">= 등"', 'placeholder="부등호 기호 (예: >, <, >=, <=)"'],
    ['placeholder="<= 등"', 'placeholder="부등호 기호 (예: >, <, >=, <=)"'],
    ['placeholder="-1 < x <= 5"', 'placeholder="부등식 입력 (예: a < x <= b)"'],
    ['placeholder="교환법칙"', 'placeholder="연산법칙 명칭"'],
    ['placeholder="결합법칙"', 'placeholder="연산법칙 명칭"'],
    ['placeholder="-5/3"', 'placeholder="분수 입력 (예: a/b)"'],
    ['placeholder="음수 등"', 'placeholder="양수 또는 음수"']
  ];

  for (const [target, rep] of replaces) {
    if (!c.includes(target)) {
      console.warn('Target not found in Ch2:', target);
    }
    c = c.replace(target, rep);
  }

  fs.writeFileSync('build_ch2_interactive.js', c, 'utf8');
  console.log('Sanitized build_ch2_interactive.js successfully.');
}

sanitizeCh1();
sanitizeCh2();
