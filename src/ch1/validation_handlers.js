// src/ch1/validation_handlers.js
// Chapter 1: Validation Handlers and Scoring Engine for all 26 Substeps

(function() {
  function normTxt(v) {
    return v ? v.trim().replace(/\s+/g, '').toUpperCase() : '';
  }
  window.normTxt = normTxt;

  function showInlineErr(id, msg) {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'block';
      el.innerHTML = msg;
    }
  }

  function hideInlineErr(id) {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'none';
      el.innerHTML = '';
    }
  }

  // ==========================================
  // Tab 0 Checks
  // ==========================================
  function check01Submit() {
    hideInlineErr('p01-err');
    const d6 = normTxt(document.getElementById('p01-div6').value);
    const d13 = normTxt(document.getElementById('p01-div13').value);
    const m24 = normTxt(document.getElementById('p01-mul24').value);

    const ok6 = d6.includes('1') && d6.includes('2') && d6.includes('3') && d6.includes('6');
    const ok13 = d13.includes('1') && d13.includes('13');
    const ok24 = m24.includes('24') && m24.includes('48') && m24.includes('72');

    if (ok6 && ok13 && ok24) {
      renderVerifiedAnswerView(
        "되짚어 보기 1 완료!",
        "6의 약수: 1, 2, 3, 6<br>13의 약수: 1, 13<br>24의 배수: 24, 48, 72...",
        "0-2"
      );
    } else {
      showInlineErr('p01-err', '❌ 6의 약수(1, 2, 3, 6), 13의 약수(1, 13), 24의 배수(24, 48, 72)를 다시 확인해 보세요!');
    }
  }

  function check02Submit() {
    hideInlineErr('p02-err');
    const c = normTxt(document.getElementById('p02-common').value);
    const g = normTxt(document.getElementById('p02-gcd').value);
    const g45 = normTxt(document.getElementById('p02-gcd45').value);

    const okC = c.includes('1') && c.includes('2') && c.includes('3') && c.includes('6');
    const okG = (g === '6');
    const okG45 = (g45 === '9');

    if (okC && okG && okG45) {
      renderVerifiedAnswerView(
        "되짚어 보기 2 완료!",
        "12와 18의 공약수: 1, 2, 3, 6<br>12와 18의 최대공약수: 6<br>45와 54의 최대공약수: 9",
        "0-3"
      );
    } else {
      showInlineErr('p02-err', '❌ 12와 18의 공약수(1, 2, 3, 6) 및 최대공약수(6), 45와 54의 최대공약수(9)를 확인하세요!');
    }
  }

  function check03Submit() {
    hideInlineErr('p03-err');
    const l46 = normTxt(document.getElementById('p03-lcm46').value);
    const l912 = normTxt(document.getElementById('p03-lcm912').value);
    const p = normTxt(document.getElementById('p03-prop').value);

    const ok46 = (l46 === '12');
    const ok912 = (l912 === '36');
    const okP = p.includes('배수');

    if (ok46 && ok912 && okP) {
      renderVerifiedAnswerView(
        "되짚어 보기 3 완료!",
        "4와 6의 최소공배수: 12<br>9와 12의 최소공배수: 36<br>공배수는 최소공배수의 배수입니다.",
        "0-4"
      );
    } else {
      showInlineErr('p03-err', '❌ 4와 6의 최소공배수(12), 9와 12의 최소공배수(36) 및 성질(배수)을 확인하세요!');
    }
  }

  function check04Submit() {
    hideInlineErr('p04-err');
    const g1 = normTxt(document.getElementById('p04-g1').value);
    const g2 = normTxt(document.getElementById('p04-g2').value);
    const g3 = normTxt(document.getElementById('p04-g3').value);

    const ok1 = (g1 === '1');
    const ok2 = g2.includes('2') && g2.includes('3') && g2.includes('5') && g2.includes('7');
    const ok3 = g3.includes('4') && g3.includes('6') && g3.includes('8') && g3.includes('9') && g3.includes('10');

    if (ok1 && ok2 && ok3) {
      renderVerifiedAnswerView(
        "단원 도입 & 생각열기 완료!",
        "약수 1개인 수: 1<br>약수 2개인 수(소수): 2, 3, 5, 7<br>약수 3개 이상인 수(합성수): 4, 6, 8, 9, 10",
        "1-1"
      );
    } else {
      showInlineErr('p04-err', '❌ 약수의 개수별 분류(1 / 2, 3, 5, 7 / 4, 6, 8, 9, 10)를 다시 확인하세요!');
    }
  }

  // ==========================================
  // Tab 1 Checks
  // ==========================================
  function check11Submit() {
    hideInlineErr('p11-err');
    const one = normTxt(document.getElementById('p11-one').value);
    const p = normTxt(document.getElementById('p11-primes').value);
    const c = normTxt(document.getElementById('p11-composites').value);

    const okOne = one.includes('소수도') || one.includes('아님') || one.includes('둘다');
    const okP = p.includes('13') && p.includes('23') && p.includes('29');
    const okC = c.includes('15') && c.includes('20');

    if (okOne && okP && okC) {
      renderVerifiedAnswerView(
        "1.1 소수와 합성수의 뜻 마스터!",
        "1은 소수도 아니고 합성수도 아닙니다.<br>소수: 13, 23, 29 (약수가 2개)<br>합성수: 15, 20 (약수가 3개 이상)",
        "1-2"
      );
    } else {
      showInlineErr('p11-err', '❌ 1의 성질(둘 다 아님)과 소수(13, 23, 29), 합성수(15, 20) 구분을 확인하세요!');
    }
  }

  function check12Submit() {
    hideInlineErr('p12-err');
    const cnt = normTxt(document.getElementById('p12-count').value);
    const prop = normTxt(document.getElementById('p12-prop').value);

    const okCnt = (cnt === '15');
    const okProp = prop.includes('소수') || prop.includes('2개') || prop.includes('자기자신');

    if (okCnt && okProp) {
      renderVerifiedAnswerView(
        "에라토스테네스의 체 완료!",
        "1부터 50까지의 자연수 중 소수는 총 15개입니다.<br>(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47)<br>남은 수들은 모두 1과 자기 자신만을 약수로 가지는 소수입니다.",
        "1-3"
      );
    } else {
      showInlineErr('p12-err', '❌ 1부터 50까지 소수의 총 개수(15개)와 남은 수들의 공통점(소수)을 확인하세요!');
    }
  }

  function check13Submit() {
    hideInlineErr('p13-err');
    const q1 = normTxt(document.getElementById('p13-q1').value).replace(/X/g, '*');
    const q2 = normTxt(document.getElementById('p13-q2').value).replace(/X/g, '*');
    const b = normTxt(document.getElementById('p13-base').value);
    const e = normTxt(document.getElementById('p13-exp').value);

    const okQ1 = q1.includes('2^3') && q1.includes('5^2');
    const okQ2 = q2.includes('3^2') && q2.includes('7') && q2.includes('11^3');
    const okB = (b === '2');
    const okE = (e === '5');

    if (okQ1 && okQ2 && okB && okE) {
      renderVerifiedAnswerView(
        "거듭제곱과 밑·지수 완료!",
        "1) 2³ × 5²<br>2) 3² × 7 × 11³<br>3) 2⁵에서 밑은 2, 지수는 5입니다.",
        "1-4"
      );
    } else {
      showInlineErr('p13-err', '❌ 거듭제곱 표기(2^3 * 5^2, 3^2 * 7 * 11^3)와 밑(2), 지수(5)를 확인하세요!');
    }
  }

  function check14Submit() {
    hideInlineErr('p14-err');
    const q1 = normTxt(document.getElementById('p14-q1').value);
    const q2 = normTxt(document.getElementById('p14-q2').value);
    const q3 = normTxt(document.getElementById('p14-q3').value);

    const ok1 = q1.includes('17') && q1.includes('53') && !q1.includes('8') && !q1.includes('39');
    const ok2 = q2.includes('5^4');
    const ok3 = q3.includes('ㄷ') && q3.includes('ㄹ') && !q3.includes('ㄱ') && !q3.includes('ㄴ');

    if (ok1 && ok2 && ok3) {
      renderVerifiedAnswerView(
        "1.1 스스로 확인하기 1 완료!",
        "1번: 소수는 17, 53입니다.<br>2번: 5 × 5 × 5 × 5 = 5⁴<br>3번: 옳은 것은 ㄷ, ㄹ 입니다.",
        "1-5"
      );
    } else {
      showInlineErr('p14-err', '❌ 소수 판별(17, 53), 거듭제곱(5^4), 옳은 보기(ㄷ, ㄹ)를 확인하세요!');
    }
  }

  function check15Submit() {
    hideInlineErr('p15-err');
    const bac = normTxt(document.getElementById('p15-bacteria').value);
    const eq = normTxt(document.getElementById('p15-eq').value);
    const t25 = normTxt(document.getElementById('p15-train25').value);
    const t2 = normTxt(document.getElementById('p15-train2').value);

    const okBac = bac.includes('2^6') || bac === '64';
    const okEq = (eq === '9');
    const okT25 = (t25 === '3');
    const okT2 = t2.includes('2') && t2.includes('3') && t2.includes('5') && t2.includes('7') &&
                 t2.includes('11') && t2.includes('13') && t2.includes('17') && t2.includes('19') &&
                 t2.includes('23') && t2.includes('29');

    if (okBac && okEq && okT25 && okT2) {
      renderVerifiedAnswerView(
        "1.1 심화 & 생각 넓히기 마스터!",
        "세균 1시간 후: 2⁶ = 64배<br>방정식: 2⁶=64 (a=6), 3³=27 (b=3) ➔ a+b=9<br>25번 역 하차: 1, 5, 25번째 열차 (3명)<br>승객 2명인 역: 30 이하의 소수 10개 (2, 3, 5, 7, 11, 13, 17, 19, 23, 29)",
        "2-1"
      );
    } else {
      showInlineErr('p15-err', '❌ 세균 배수(2^6), a+b(9), 25번역 승객(3명), 소수 역 목록을 다시 확인하세요!');
    }
  }

  // ==========================================
  // Tab 2 Checks
  // ==========================================
  function check21Submit() {
    hideInlineErr('p21-err');
    const f12 = normTxt(document.getElementById('p21-factors12').value);
    const pf12 = normTxt(document.getElementById('p21-primefac12').value);
    const pf30 = normTxt(document.getElementById('p21-pf30').value);
    const pf45 = normTxt(document.getElementById('p21-pf45').value);

    const okF12 = f12.includes('1') && f12.includes('2') && f12.includes('3') && f12.includes('4') && f12.includes('6') && f12.includes('12');
    const okPf12 = pf12.includes('2') && pf12.includes('3');
    const okPf30 = pf30.includes('2') && pf30.includes('3') && pf30.includes('5');
    const okPf45 = pf45.includes('3') && pf45.includes('5') && !pf45.includes('2');

    if (okF12 && okPf12 && okPf30 && okPf45) {
      renderVerifiedAnswerView(
        "소인수의 뜻 완료!",
        "12의 인수: 1, 2, 3, 4, 6, 12<br>12의 소인수: 2, 3<br>30의 소인수: 2, 3, 5<br>45의 소인수: 3, 5",
        "2-2"
      );
    } else {
      showInlineErr('p21-err', '❌ 12의 인수/소인수(2, 3), 30의 소인수(2, 3, 5), 45의 소인수(3, 5)를 확인하세요!');
    }
  }

  function check22Submit() {
    hideInlineErr('p22-err');
    const n18 = normTxt(document.getElementById('p22-18').value).replace(/X/g, '*');
    const n24 = normTxt(document.getElementById('p22-24').value).replace(/X/g, '*');
    const n60 = normTxt(document.getElementById('p22-60').value).replace(/X/g, '*');

    const ok18 = n18.includes('2') && n18.includes('3^2');
    const ok24 = n24.includes('2^3') && n24.includes('3');
    const ok60 = n60.includes('2^2') && n60.includes('3') && n60.includes('5');

    if (ok18 && ok24 && ok60) {
      renderVerifiedAnswerView(
        "소인수분해 가지치기 트리 완료!",
        "18 = 2 × 3²<br>24 = 2³ × 3<br>60 = 2² × 3 × 5",
        "2-3"
      );
    } else {
      showInlineErr('p22-err', '❌ 18(2 * 3^2), 24(2^3 * 3), 60(2^2 * 3 * 5)의 거듭제곱 소인수분해를 확인하세요!');
    }
  }

  function check23Submit() {
    hideInlineErr('p23-err');
    const n27 = normTxt(document.getElementById('p23-27').value).replace(/X/g, '*');
    const n36 = normTxt(document.getElementById('p23-36').value).replace(/X/g, '*');
    const n80 = normTxt(document.getElementById('p23-80').value).replace(/X/g, '*');
    const n126 = normTxt(document.getElementById('p23-126').value).replace(/X/g, '*');

    const ok27 = n27.includes('3^3');
    const ok36 = n36.includes('2^2') && n36.includes('3^2');
    const ok80 = n80.includes('2^4') && n80.includes('5');
    const ok126 = n126.includes('2') && n126.includes('3^2') && n126.includes('7');

    if (ok27 && ok36 && ok80 && ok126) {
      renderVerifiedAnswerView(
        "소인수분해 집중 실습 완료!",
        "27 = 3³<br>36 = 2² × 3²<br>80 = 2⁴ × 5<br>126 = 2 × 3² × 7",
        "2-4"
      );
    } else {
      showInlineErr('p23-err', '❌ 27(3^3), 36(2^2 * 3^2), 80(2^4 * 5), 126(2 * 3^2 * 7) 소인수분해를 확인하세요!');
    }
  }

  function check24Submit() {
    hideInlineErr('p24-err');
    const d63 = normTxt(document.getElementById('p24-div63').value);
    const test = normTxt(document.getElementById('p24-test').value).replace(/X/g, '*');

    const ok63 = d63.includes('1') && d63.includes('3') && d63.includes('7') && d63.includes('9') && d63.includes('21') && d63.includes('63');
    const okTest = test.includes('3^2') && test.includes('2^2') && test.includes('2^3') && !test.includes('2^4');

    if (ok63 && okTest) {
      renderVerifiedAnswerView(
        "소인수분해로 약수 구하기 완료!",
        "63 = 3² × 7 의 약수: 1, 3, 7, 9, 21, 63<br>2³ × 3²의 약수: 3², 2² × 3², 2³ × 3",
        "2-5"
      );
    } else {
      showInlineErr('p24-err', '❌ 63의 약수 6개와 2³ × 3²의 약수(3^2, 2^2 * 3^2, 2^3 * 3)를 확인하세요!');
    }
  }

  function check25Submit() {
    hideInlineErr('p25-err');
    const cnt = normTxt(document.getElementById('p25-cnt160').value);
    const exp = normTxt(document.getElementById('p25-exp').value);
    const sq = normTxt(document.getElementById('p25-square').value);
    const sw = normTxt(document.getElementById('p25-sunwoo').value);

    const okCnt = (cnt === '12');
    const okExp = (exp === '3');
    const okSq = (sq === '14');
    const okSw = sw.includes('65') && sw.includes('77');

    if (okCnt && okExp && okSq && okSw) {
      renderVerifiedAnswerView(
        "약수의 개수 & 스스로 확인 완료!",
        "160 = 2⁵ × 5 의 약수 개수: (5+1) × (1+1) = 12개<br>약수 12개 지수 네모: 3<br>56에 곱할 가장 작은 자연수: 2 × 7 = 14<br>합이 18인 두 소인수를 갖는 수: 65 (5×13), 77 (7×11)",
        "3-1"
      );
    } else {
      showInlineErr('p25-err', '❌ 160의 약수 개수(12), 네모(3), 제곱수 만들기(14), 두 수(65, 77)를 확인하세요!');
    }
  }

  // ==========================================
  // Tab 3 Checks
  // ==========================================
  function check31Submit() {
    hideInlineErr('p31-err');
    const def = normTxt(document.getElementById('p31-def').value);
    const cop = normTxt(document.getElementById('p31-coprime').value);

    const okDef = def.includes('서로소');
    const okCop = cop.includes('1') && cop.includes('3') && !cop.includes('2') && !cop.includes('4');

    if (okDef && okCop) {
      renderVerifiedAnswerView(
        "서로소의 뜻 완료!",
        "최대공약수가 1인 두 자연수를 <b>서로소</b>라고 합니다.<br>서로소인 쌍: (1) 14와 15, (3) 24와 35",
        "3-2"
      );
    } else {
      showInlineErr('p31-err', '❌ 용어(서로소)와 서로소인 쌍 번호((1), (3))를 다시 확인하세요!');
    }
  }

  function check32Submit() {
    hideInlineErr('p32-err');
    const g2484 = normTxt(document.getElementById('p32-gcd2484').value);
    const q1 = normTxt(document.getElementById('p32-q1').value);
    const q2 = normTxt(document.getElementById('p32-q2').value);

    const okG = (g2484 === '12' || g2484.includes('2^2*3'));
    const ok1 = (q1 === '20' || q1.includes('2^2*5'));
    const ok2 = (q2 === '28');

    if (okG && ok1 && ok2) {
      renderVerifiedAnswerView(
        "소인수분해로 최대공약수 구하기 완료!",
        "24와 84의 최대공약수: 2² × 3 = 12<br>2² × 5² 과 2² × 5 × 7 의 최대공약수: 2² × 5 = 20<br>56과 140의 최대공약수: 28",
        "3-3"
      );
    } else {
      showInlineErr('p32-err', '❌ 최대공약수 계산 결과(12, 20, 28)를 다시 확인하세요!');
    }
  }

  function check33Submit() {
    hideInlineErr('p33-err');
    const ex = normTxt(document.getElementById('p33-ex1').value);
    const fol = normTxt(document.getElementById('p33-follow').value);
    const q3 = normTxt(document.getElementById('p33-q3').value);

    const okEx = (ex === '6');
    const okFol = (fol === '15');
    const okQ3 = (q3 === '18');

    if (okEx && okFol && okQ3) {
      renderVerifiedAnswerView(
        "세 수의 최대공약수 완료!",
        "60, 72, 150의 최대공약수: 2 × 3 = 6<br>45, 75, 90의 최대공약수: 3 × 5 = 15<br>54, 72, 90의 최대공약수: 18",
        "3-4"
      );
    } else {
      showInlineErr('p33-err', '❌ 세 수의 최대공약수(6, 15, 18)를 다시 확인하세요!');
    }
  }

  function check34Submit() {
    hideInlineErr('p34-err');
    const q4 = normTxt(document.getElementById('p34-q4').value);
    const q5 = normTxt(document.getElementById('p34-q5').value);
    const q6 = normTxt(document.getElementById('p34-q6').value);
    const wide = normTxt(document.getElementById('p34-wide').value);

    const ok4 = (q4 === '4');
    const ok5 = (q5 === '35');
    const ok6 = (q6 === '15');
    const okW = wide.includes('14') && wide.includes('28') && wide.includes('35') && wide.includes('49');

    if (ok4 && ok5 && ok6 && okW) {
      renderVerifiedAnswerView(
        "최대공약수 스스로 확인 & 생각 넓히기 완료!",
        "1) a=2, b=2 ➔ a+b=4<br>2) 105와 350의 최대공약수: 35<br>3) gcd(105, 150, 90) = 15<br>4) 21과의 최대공약수가 7인 50 이하 두 자리 수: 14, 28, 35, 49",
        "4-1"
      );
    } else {
      showInlineErr('p34-err', '❌ a+b(4), 분모(35), 어떤 수(15), 두 자리 수 목록(14, 28, 35, 49)을 확인하세요!');
    }
  }

  // ==========================================
  // Tab 4 Checks
  // ==========================================
  function check41Submit() {
    hideInlineErr('p41-err');
    const cyc = normTxt(document.getElementById('p41-cycle').value);
    const l5490 = normTxt(document.getElementById('p41-lcm5490').value);
    const q1a = normTxt(document.getElementById('p41-q1a').value);
    const q1b = normTxt(document.getElementById('p41-q1b').value);

    const okCyc = (cyc === '2034');
    const okL = (l5490 === '270');
    const ok1a = (q1a === '60');
    const ok1b = (q1b === '315');

    if (okCyc && okL && ok1a && ok1b) {
      renderVerifiedAnswerView(
        "소인수분해로 최소공배수 구하기 완료!",
        "1) 다음 동시 개최 연도: 2022 + 12 = 2034년<br>2) 54와 90의 최소공배수: 2 × 3³ × 5 = 270<br>3) 최소공배수: 2² × 3 × 5 = 60<br>4) 45와 63의 최소공배수: 315",
        "4-2"
      );
    } else {
      showInlineErr('p41-err', '❌ 동시 개최 연도(2034), 최소공배수(270, 60, 315)를 확인하세요!');
    }
  }

  function check42Submit() {
    hideInlineErr('p42-err');
    const gLcm = normTxt(document.getElementById('p42-gearLcm').value);
    const ex = normTxt(document.getElementById('p42-ex1').value);
    const fol = normTxt(document.getElementById('p42-follow').value);

    const okG = (gLcm === '72');
    const okEx = (ex === '504');
    const okFol = (fol === '240');

    if (okG && okEx && okFol) {
      renderVerifiedAnswerView(
        "톱니바퀴 맞물림 & 세 수의 최소공배수 완료!",
        "톱니 24개와 36개의 최소공배수: 72톱니 (A 3회전, B 2회전 후 재맞물림)<br>18, 28, 72의 최소공배수: 504<br>16, 40, 60의 최소공배수: 240",
        "4-3"
      );
    } else {
      showInlineErr('p42-err', '❌ 톱니 수(72) 및 세 수의 최소공배수(504, 240)를 확인하세요!');
    }
  }

  function check43Submit() {
    hideInlineErr('p43-err');
    const q3 = normTxt(document.getElementById('p43-q3').value);
    const q4 = normTxt(document.getElementById('p43-q4').value);
    const q6 = normTxt(document.getElementById('p43-q6').value);
    const wide = normTxt(document.getElementById('p43-wide').value);

    const ok3 = (q3 === '490');
    const ok4 = (q4 === '6');
    const ok6 = (q6 === '180');
    const okW = (wide.includes('36') && wide.includes('8'));

    if (ok3 && ok4 && ok6 && okW) {
      renderVerifiedAnswerView(
        "최소공배수 스스로 확인 & 생각 넓히기 완료!",
        "1) 70과 98의 최소공배수: 490<br>2) 세 수의 최소공배수 60A = 360 ➔ A = 6<br>3) 18과 45의 공배수 중 세 자리 최소: 180<br>4) 합이 44, gcd 4, lcm 72인 두 수: 36, 8",
        "4-4"
      );
    } else {
      showInlineErr('p43-err', '❌ 최소공배수(490), A의 값(6), 세 자리 수(180), 두 자연수(36, 8)를 확인하세요!');
    }
  }

  function check44Submit() {
    hideInlineErr('p44-err');
    const n115 = normTxt(document.getElementById('p44-115').value);
    const n269 = normTxt(document.getElementById('p44-269').value);
    const n2027 = normTxt(document.getElementById('p44-2027').value);
    const log = normTxt(document.getElementById('p44-logic').value);

    const ok115 = n115.includes('합성수');
    const ok269 = n269.includes('소수') && !n269.includes('합성수');
    const ok2027 = n2027.includes('소수') && !n2027.includes('합성수');
    const okLog = log.includes('약수');

    if (ok115 && ok269 && ok2027 && okLog) {
      renderVerifiedAnswerView(
        "디지털 쏙 수학: 소수 판별 코딩 완료!",
        "115: 합성수 (5 × 23)<br>269: 소수 (약수가 1과 269 뿐)<br>2027: 소수 (약수가 1과 2027 뿐)<br>판별 기준 변수 D는 1부터 N까지 나눈 약수의 개수입니다.",
        "5-1"
      );
    } else {
      showInlineErr('p44-err', '❌ 115(합성수), 269(소수), 2027(소수) 및 판별 기준 변수(약수의 개수)를 확인하세요!');
    }
  }

  // ==========================================
  // Tab 5 Checks
  // ==========================================
  function check51Submit() {
    hideInlineErr('p51-err');
    const cal = normTxt(document.getElementById('p51-calendarCount').value);
    const q2 = normTxt(document.getElementById('p51-q2').value);
    const q3 = normTxt(document.getElementById('p51-q3').value);
    const q4 = normTxt(document.getElementById('p51-q4').value);
    const q5 = normTxt(document.getElementById('p51-q5').value);

    const okCal = (cal === '11');
    const ok2 = q2.includes('ㄱ') && q2.includes('ㄴ') && q2.includes('ㄹ') && !q2.includes('ㄷ');
    const ok3 = (q3 === '8');
    const ok4 = (q4 === '4' || q4 === '7');
    const ok5 = (q5 === '23');

    if (okCal && ok2 && ok3 && ok4 && ok5) {
      renderVerifiedAnswerView(
        "대단원 스스로 마무리하기 1 완료!",
        "1번: 31일까지 소수 날짜는 11개<br>2번: 옳은 보기: ㄱ, ㄴ, ㄹ<br>3번: 3¹³ + 5⁴ 의 일의 자리 숫자: 3 + 5 = 8<br>4번: 330의 소인수가 아닌 것: (4) 7<br>5번: 84 ÷ a = b² ➔ a=21, b=2 ➔ a+b=23",
        "5-2"
      );
    } else {
      showInlineErr('p51-err', '❌ 달력 소수 개수(11), 보기(ㄱ, ㄴ, ㄹ), 일의 자리(8), 번호(4), a+b(23)를 확인하세요!');
    }
  }

  function check52Submit() {
    hideInlineErr('p52-err');
    const q6 = normTxt(document.getElementById('p52-q6').value);
    const q8 = normTxt(document.getElementById('p52-q8').value);
    const q9 = normTxt(document.getElementById('p52-q9').value);
    const q10 = normTxt(document.getElementById('p52-q10').value);

    const ok6 = (q6 === '4' || q6.includes('35'));
    const ok8 = (q8 === '60');
    const ok9 = (q9 === '20');
    const ok10 = (q10 === '70/3' || q10.includes('70') && q10.includes('3'));

    if (ok6 && ok8 && ok9 && ok10) {
      renderVerifiedAnswerView(
        "대단원 스스로 마무리하기 2 완료!",
        "6번: 서로소인 쌍은 (4) 35와 2×3²<br>8번: A × 36 = 12 × 180 ➔ A = 60<br>9번: 3 × 7 × g = 420 ➔ 최대공약수 g = 20<br>10번: 가장 작은 기약분수는 70/3 입니다.",
        "5-3"
      );
    } else {
      showInlineErr('p52-err', '❌ 서로소 번호(4), A(60), 최대공약수(20), 기약분수(70/3)를 확인하세요!');
    }
  }

  function check53Submit() {
    hideInlineErr('p53-err');
    const q11 = normTxt(document.getElementById('p53-q11').value);
    const q12 = normTxt(document.getElementById('p53-q12').value);
    const q13 = normTxt(document.getElementById('p53-q13').value);
    const q14 = normTxt(document.getElementById('p53-q14').value);

    const ok11 = (q11 === '10');
    const ok12 = (q12 === '17');
    const ok13 = (q13 === '18');
    const ok14 = (q14 === '162');

    if (ok11 && ok12 && ok13 && ok14) {
      renderVerifiedAnswerView(
        "대단원 서술형 문제 완벽 마스터!",
        "11번: a=7, b=3 ➔ a+b = 10<br>12번: 1~12의 곱에서 2¹⁰ × 3⁵ × 5² ➔ x+y+z = 10+5+2 = 17<br>13번: gcd(72, 60, A)=6 이고 10<A<20 ➔ A = 18<br>14번: A=36, B=18, C=108 ➔ A+B+C = 162",
        "5-4"
      );
    } else {
      showInlineErr('p53-err', '❌ 서술형 11번(10), 12번(17), 13번(18), 14번(162)을 다시 확인하세요!');
    }
  }

  function check54Submit() {
    hideInlineErr('p54-err');
    const rule = normTxt(document.getElementById('p54-rule').value);
    const strat = normTxt(document.getElementById('p54-strat').value);

    const okRule = rule.includes('수') || rule.includes('넓이') || rule.includes('값');
    const okStrat = strat.includes('한') || strat.includes('경우') || strat.includes('모양') || strat.includes('적');

    if (okRule && okStrat) {
      renderVerifiedAnswerView(
        "🏆 1단원 소인수분해 전체 마스터 달성!",
        "축하합니다! 몬드리안 창의융합 미술 프로젝트까지 1단원 26개 서브스텝을 모두 100% 완수하였습니다!<br>소인수분해의 개념, 최대공약수와 최소공배수의 성질을 완벽하게 습득하였습니다.",
        "5-4"
      );
    } else {
      showInlineErr('p54-err', '❌ 분할 규칙(주어진 수/넓이)과 소수/큰 수를 먼저 그리는 까닭(경우의 수가 적음/모양이 한 가지뿐)을 확인하세요!');
    }
  }

  // Export all check functions to window
  window.check01Submit = check01Submit;
  window.check02Submit = check02Submit;
  window.check03Submit = check03Submit;
  window.check04Submit = check04Submit;

  window.check11Submit = check11Submit;
  window.check12Submit = check12Submit;
  window.check13Submit = check13Submit;
  window.check14Submit = check14Submit;
  window.check15Submit = check15Submit;

  window.check21Submit = check21Submit;
  window.check22Submit = check22Submit;
  window.check23Submit = check23Submit;
  window.check24Submit = check24Submit;
  window.check25Submit = check25Submit;

  window.check31Submit = check31Submit;
  window.check32Submit = check32Submit;
  window.check33Submit = check33Submit;
  window.check34Submit = check34Submit;

  window.check41Submit = check41Submit;
  window.check42Submit = check42Submit;
  window.check43Submit = check43Submit;
  window.check44Submit = check44Submit;

  window.check51Submit = check51Submit;
  window.check52Submit = check52Submit;
  window.check53Submit = check53Submit;
  window.check54Submit = check54Submit;

})();
