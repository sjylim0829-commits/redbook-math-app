// src/ch1/validation_handlers.js
// Chapter 1: Submission Verification & Explanation View Handlers for all 57 Substeps

(function() {
  function normTxt(str) {
    if (!str) return '';
    return str.toString()
      .replace(/\s+/g, '')
      .replace(/×/g, '*')
      .replace(/·/g, '*')
      .replace(/,/g, ',')
      .replace(/Û`/g, '^2')
      .toLowerCase();
  }

  function showInlineErr(elemId, msg) {
    const el = document.getElementById(elemId);
    if (el) {
      el.innerText = msg;
      el.style.display = 'block';
    }
  }

  function hideInlineErr(elemId) {
    const el = document.getElementById(elemId);
    if (el) el.style.display = 'none';
  }

  function celebrate(nextCode) {
    if (typeof playSound === 'function') playSound('chime');
    if (typeof launchConfetti === 'function') launchConfetti();
    if (nextCode && typeof state !== 'undefined') {
      if (state.unlockedSteps && typeof state.unlockedSteps.add === 'function') {
        state.unlockedSteps.add(nextCode);
      }
      if (state.unlockedSubSteps && Array.isArray(state.unlockedSubSteps) && !state.unlockedSubSteps.includes(nextCode)) {
        state.unlockedSubSteps.push(nextCode);
      }
      if (typeof updatePillsStatus === 'function') updatePillsStatus();
    }
  }

  function renderVerifiedAnswerView(title, contentHtml, nextCode) {
    celebrate(nextCode);
    if (typeof state !== 'undefined') {
      state.verifiedViewData[state.subStep] = { title, contentHtml, nextCode };
    }
    const container = document.getElementById('form-work-area') || document.getElementById('proof-input-container');
    if (!container) return;

    let nextBtnHtml = '';
    if (nextCode && nextCode !== state.subStep) {
      nextBtnHtml = `
        <button class="btn btn-primary" style="margin-top:14px; width:100%; padding:10px; font-weight:800;" onclick="loadSubStep('${nextCode}')">
          🚀 다음 서브스텝 [${nextCode}]으로 이동하기 ➔
        </button>
      `;
    } else {
      nextBtnHtml = `
        <div style="margin-top:14px; background:#f0fdf4; border:2px solid #86efac; border-radius:8px; padding:12px; text-align:center; font-weight:800; color:#166534;">
          🎉 축하합니다! 1단원 소인수분해 전체 과정을 완벽하게 마스터하셨습니다!
        </div>
      `;
    }

    container.innerHTML = `
      <div class="card verified-answer-card" style="background:#ffffff; border:2px solid #10b981; padding:18px; border-radius:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
          <span style="font-size:1.4rem;">🎉</span>
          <h4 style="margin:0; font-weight:800; color:#065f46;">${title}</h4>
        </div>
        <div style="background:#f0fdf4; border-radius:8px; padding:12px 14px; font-size:0.9rem; line-height:1.7; color:#14532d; border:1px solid #bbf7d0;">
          ${contentHtml}
        </div>
        ${nextBtnHtml}
      </div>
    `;
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(container, { delimiters: [{left: "$", right: "$", display: false}] });
    }
  }

  // ==========================================
  // Tab 0: 준비학습 (0-1 ~ 0-4)
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
      renderVerifiedAnswerView("준비학습 1 완료!", "6의 약수: 1, 2, 3, 6<br>13의 약수: 1, 13<br>24의 배수: 24, 48, 72", "0-2");
    } else {
      showInlineErr('p01-err', '❌ 6의 약수(1, 2, 3, 6), 13의 약수(1, 13), 24의 배수(24, 48, 72)를 확인하세요!');
    }
  }

  function check02Submit() {
    hideInlineErr('p02-err');
    const com = normTxt(document.getElementById('p02-common').value);
    const gcd = normTxt(document.getElementById('p02-gcd').value);
    const gcd45 = normTxt(document.getElementById('p02-gcd45').value);

    const okCom = com.includes('1') && com.includes('2') && com.includes('3') && com.includes('6');
    const okGcd = (gcd === '6');
    const okGcd45 = (gcd45 === '15');

    if (okCom && okGcd && okGcd45) {
      renderVerifiedAnswerView("준비학습 2 완료!", "12와 18의 공약수: 1, 2, 3, 6<br>최대공약수: 6<br>45와 60의 최대공약수: 15", "0-3");
    } else {
      showInlineErr('p02-err', '❌ 공약수(1, 2, 3, 6)와 최대공약수(6, 15)를 다시 확인하세요!');
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
      renderVerifiedAnswerView("준비학습 3 완료!", "4와 6의 최소공배수: 12<br>9와 12의 최소공배수: 36<br>공배수는 최소공배수의 배수입니다.", "0-4");
    } else {
      showInlineErr('p03-err', '❌ 4와 6의 LCM(12), 9와 12의 LCM(36) 및 성질(배수)을 확인하세요!');
    }
  }

  function check04Submit() {
    hideInlineErr('p04-err');
    const g1 = normTxt(document.getElementById('p04-g1').value);
    const g2 = normTxt(document.getElementById('p04-g2').value);
    const g3 = normTxt(document.getElementById('p04-g3').value);

    const ok1 = (g1 === '1');
    const ok2 = g2.includes('2') && g2.includes('3') && g2.includes('5') && g2.includes('7') && g2.includes('11') && g2.includes('13');
    const ok3 = g3.includes('4') && g3.includes('6') && g3.includes('8') && g3.includes('9');

    if (ok1 && ok2 && ok3) {
      renderVerifiedAnswerView("준비학습 4 완료!", "약수 1개: 1<br>약수 2개(소수): 2, 3, 5, 7, 11, 13<br>약수 3개 이상(합성수): 4, 6, 8, 9, 10, 12, 14, 15", "1-1");
    } else {
      showInlineErr('p04-err', '❌ 약수의 개수별 분류를 정확히 확인하세요!');
    }
  }

  // ==========================================
  // Tab 1: 소수와 합성수 (1-1 ~ 1-9)
  // ==========================================
  function check11Submit() {
    hideInlineErr('p11-err');
    const one = normTxt(document.getElementById('p11-one').value);
    const p = normTxt(document.getElementById('p11-primes').value);
    const c = normTxt(document.getElementById('p11-composites').value);

    const okOne = one.includes('소수도') || one.includes('아님') || one.includes('둘다') || one.includes('기타');
    const okP = p.includes('13') && p.includes('23') && p.includes('29');
    const okC = c.includes('15') && c.includes('20');

    if (okOne && okP && okC) {
      renderVerifiedAnswerView("1.1 소수와 합성수의 뜻 마스터!", "1은 소수도 합성수도 아닙니다.<br>소수: 13, 23, 29<br>합성수: 15, 20", "1-2");
    } else {
      showInlineErr('p11-err', '❌ 1의 성질(둘 다 아님)과 소수(13, 23, 29), 합성수(15, 20)를 확인하세요!');
    }
  }

  function check12Submit() {
    hideInlineErr('p12-err');
    const cnt = normTxt(document.getElementById('p12-count').value);
    const prop = normTxt(document.getElementById('p12-prop').value);

    const okCnt = (cnt === '15');
    const okProp = prop.includes('소수') || prop.includes('약수');

    if (okCnt && okProp) {
      renderVerifiedAnswerView("에라토스테네스의 체 완료!", "1부터 50까지의 소수는 총 15개입니다.<br>소수 목록: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47", "1-3");
    } else {
      showInlineErr('p12-err', '❌ 체질 후 남은 소수의 개수(15개)와 공통 성질(소수)을 확인하세요!');
    }
  }

  function check13Submit() {
    hideInlineErr('p13-err');
    const q1 = normTxt(document.getElementById('p13-q1').value);
    const base = normTxt(document.getElementById('p13-base').value);
    const exp = normTxt(document.getElementById('p13-exp').value);

    const ok1 = q1.includes('2^2') && q1.includes('3^2');
    const okBase = (base === '5');
    const okExp = (exp === '4');

    if (ok1 && okBase && okExp) {
      renderVerifiedAnswerView("거듭제곱과 밑·지수 완료!", "2 × 2 × 3 × 3 = 2² × 3²<br>5⁴에서 밑은 5, 지수는 4입니다.", "1-4");
    } else {
      showInlineErr('p13-err', '❌ 거듭제곱 표현(2^2 * 3^2)과 밑(5), 지수(4)를 확인하세요!');
    }
  }

  function check14Submit() {
    hideInlineErr('p14-err');
    const p = normTxt(document.getElementById('p14-primes').value);
    const c = normTxt(document.getElementById('p14-comp').value);

    const okP = p.includes('17') && p.includes('53') && !p.includes('8') && !p.includes('39');
    const okC = c.includes('8') && c.includes('39') && !c.includes('17') && !c.includes('53');

    if (okP && okC) {
      renderVerifiedAnswerView("1.1 확인 1 완료!", "소수: 17, 53 (약수가 2개)<br>합성수: 8, 39 (약수가 3개 이상)", "1-5");
    } else {
      showInlineErr('p14-err', '❌ 소수(17, 53)와 합성수(8, 39)를 다시 확인하세요!');
    }
  }

  function check15Submit() {
    hideInlineErr('p15-err');
    const q1 = normTxt(document.getElementById('p15-q1').value);
    const q2 = normTxt(document.getElementById('p15-q2').value);
    const q3 = normTxt(document.getElementById('p15-q3').value);

    const ok1 = (q1 === '5^4');
    const ok2 = q2.includes('2') && q2.includes('3^2') && q2.includes('5');
    const ok3 = q3.includes('3^2') && q3.includes('7^5');

    if (ok1 && ok2 && ok3) {
      renderVerifiedAnswerView("1.1 확인 2 완료!", "(1) 5⁴<br>(2) 2 × 3² × 5<br>(3) 3² × 7⁵", "1-6");
    } else {
      showInlineErr('p15-err', '❌ 5^4, 2*3^2*5, 3^2*7^5 거듭제곱 꼴을 정확히 입력하세요!');
    }
  }

  function check16Submit() {
    hideInlineErr('p16-err');
    const q3 = normTxt(document.getElementById('p16-q3').value);
    const ok = q3.includes('ㄷ') && q3.includes('ㄹ') && !q3.includes('ㄱ') && !q3.includes('ㄴ');

    if (ok) {
      renderVerifiedAnswerView("1.1 확인 3 완료!", "옳은 보기: ㄷ, ㄹ<br>ㄱ(거짓): 1은 약수가 1개입니다.<br>ㄴ(거짓): 2는 짝수인 소수입니다.", "1-7");
    } else {
      showInlineErr('p16-err', '❌ 옳은 보기 기호(ㄷ, ㄹ)를 확인하세요!');
    }
  }

  function check17Submit() {
    hideInlineErr('p17-err');
    const bac = normTxt(document.getElementById('p17-bacteria').value);
    const ok = bac.includes('2^6') || bac.includes('64');

    if (ok) {
      renderVerifiedAnswerView("1.1 확인 4 완료!", "10분마다 2배 늘어나므로 60분 후에는 2⁶배 = 64배가 됩니다.", "1-8");
    } else {
      showInlineErr('p17-err', '❌ 10분마다 2배 ➔ 60분 후 거듭제곱(2^6)을 확인하세요!');
    }
  }

  function check18Submit() {
    hideInlineErr('p18-err');
    const sum = normTxt(document.getElementById('p18-sum').value);
    const ok = (sum === '9');

    if (ok) {
      renderVerifiedAnswerView("1.1 확인 5 완료!", "2⁶ = 64 ➔ a = 6<br>(1/3)³ = 1/27 ➔ b = 3<br>따라서 a + b = 6 + 3 = 9입니다.", "1-9");
    } else {
      showInlineErr('p18-err', '❌ a=6, b=3 이므로 a+b의 값을 다시 계산하세요!');
    }
  }

  function check19Submit() {
    hideInlineErr('p19-err');
    const t25 = normTxt(document.getElementById('p19-train25').value);
    const t2 = normTxt(document.getElementById('p19-train2').value);

    const ok25 = (t25 === '3');
    const ok2 = t2.includes('2') && t2.includes('3') && t2.includes('5') && t2.includes('7') && t2.includes('11');

    if (ok25 && ok2) {
      renderVerifiedAnswerView("1.1 생각 넓히기 완료!", "25의 약수는 1, 5, 25로 3명이 내립니다.<br>내린 승객이 2명인 역은 소수 역: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29역입니다.", "2-1");
    } else {
      showInlineErr('p19-err', '❌ 25번 역 하차 인원(3명)과 2명 하차 역(소수 역들)을 확인하세요!');
    }
  }

  // ==========================================
  // Tab 2: 소인수분해 (2-1 ~ 2-9)
  // ==========================================
  function check21Submit() {
    hideInlineErr('p21-err');
    const pf12 = normTxt(document.getElementById('p21-primefac12').value);
    const pf30 = normTxt(document.getElementById('p21-pf30').value);
    const pf45 = normTxt(document.getElementById('p21-pf45').value);

    const ok12 = pf12.includes('2') && pf12.includes('3') && !pf12.includes('4') && !pf12.includes('6');
    const ok30 = pf30.includes('2') && pf30.includes('3') && pf30.includes('5');
    const ok45 = pf45.includes('3') && pf45.includes('5') && !pf45.includes('9');

    if (ok12 && ok30 && ok45) {
      renderVerifiedAnswerView("소인수의 뜻 완료!", "12의 소인수: 2, 3<br>30의 소인수: 2, 3, 5<br>45의 소인수: 3, 5", "2-2");
    } else {
      showInlineErr('p21-err', '❌ 약수 중 오직 소수만을 적어야 합니다! (12: 2, 3 / 30: 2, 3, 5 / 45: 3, 5)', );
    }
  }

  function check22Submit() {
    hideInlineErr('p22-err');
    const s18 = normTxt(document.getElementById('p22-18').value);
    const s24 = normTxt(document.getElementById('p22-24').value);
    const s60 = normTxt(document.getElementById('p22-60').value);

    const ok18 = (s18 === '2*3^2' || s18 === '3^2*2');
    const ok24 = (s24 === '2^3*3' || s24 === '3*2^3');
    const ok60 = s60.includes('2^2') && s60.includes('3') && s60.includes('5');

    if (ok18 && ok24 && ok60) {
      renderVerifiedAnswerView("소인수분해 가지치기 트리 완료!", "18 = 2 × 3²<br>24 = 2³ × 3<br>60 = 2² × 3 × 5", "2-3");
    } else {
      showInlineErr('p22-err', '❌ 거듭제곱 표현(18: 2*3^2, 24: 2^3*3, 60: 2^2*3*5)을 확인하세요!');
    }
  }

  function check23Submit() {
    hideInlineErr('p23-err');
    const s27 = normTxt(document.getElementById('p23-27').value);
    const s36 = normTxt(document.getElementById('p23-36').value);
    const s80 = normTxt(document.getElementById('p23-80').value);

    const ok27 = (s27 === '3^3');
    const ok36 = s36.includes('2^2') && s36.includes('3^2');
    const ok80 = (s80 === '2^4*5' || s80 === '5*2^4');

    if (ok27 && ok36 && ok80) {
      renderVerifiedAnswerView("소인수분해 집중 실습 완료!", "27 = 3³<br>36 = 2² × 3²<br>80 = 2⁴ × 5", "2-4");
    } else {
      showInlineErr('p23-err', '❌ 27(=3^3), 36(=2^2*3^2), 80(=2^4*5)을 확인하세요!');
    }
  }

  function check24Submit() {
    hideInlineErr('p24-err');
    const f15 = normTxt(document.getElementById('p24-15').value);
    const f22 = normTxt(document.getElementById('p24-22').value);
    const f49 = normTxt(document.getElementById('p24-49').value);
    const f70 = normTxt(document.getElementById('p24-70').value);

    const ok15 = f15.includes('3') && f15.includes('5');
    const ok22 = f22.includes('2') && f22.includes('11');
    const ok49 = (f49 === '7');
    const ok70 = f70.includes('2') && f70.includes('5') && f70.includes('7');

    if (ok15 && ok22 && ok49 && ok70) {
      renderVerifiedAnswerView("1.2 확인 1 완료!", "15의 소인수: 3, 5<br>22의 소인수: 2, 11<br>49의 소인수: 7<br>70의 소인수: 2, 5, 7", "2-5");
    } else {
      showInlineErr('p24-err', '❌ 15(3, 5), 22(2, 11), 49(7), 70(2, 5, 7)의 소인수를 확인하세요!');
    }
  }

  function check25Submit() {
    hideInlineErr('p25-err');
    const s34 = normTxt(document.getElementById('p25-34').value);
    const s75 = normTxt(document.getElementById('p25-75').value);
    const s96 = normTxt(document.getElementById('p25-96').value);

    const ok34 = (s34 === '2*17' || s34 === '17*2');
    const ok75 = (s75 === '3*5^2' || s75 === '5^2*3');
    const ok96 = (s96 === '2^5*3' || s96 === '3*2^5');

    if (ok34 && ok75 && ok96) {
      renderVerifiedAnswerView("1.2 확인 2 완료!", "34 = 2 × 17<br>75 = 3 × 5²<br>96 = 2⁵ × 3", "2-6");
    } else {
      showInlineErr('p25-err', '❌ 34(=2*17), 75(=3*5^2), 96(=2^5*3) 소인수분해를 확인하세요!');
    }
  }

  function check26Submit() {
    hideInlineErr('p26-err');
    const exp = normTxt(document.getElementById('p26-exp2').value);
    const ok = (exp === '4');

    if (ok) {
      renderVerifiedAnswerView("1.2 확인 3 완료!", "2 × 3 × 4 × 5 × 6 = 2 × 3 × 2² × 5 × (2 × 3) = 2⁴ × 3² × 5<br>따라서 소인수 2의 지수는 4입니다.", "2-7");
    } else {
      showInlineErr('p26-err', '❌ 2의 지수(4)를 다시 확인하세요!');
    }
  }

  function check27Submit() {
    hideInlineErr('p27-err');
    const sq = normTxt(document.getElementById('p27-square').value);
    const ok = (sq === '14');

    if (ok) {
      renderVerifiedAnswerView("1.2 확인 4 완료!", "56 = 2³ × 7 에서 지수가 모두 짝수가 되려면 2 × 7 = 14를 곱해야 합니다.", "2-8");
    } else {
      showInlineErr('p27-err', '❌ 56=2^3*7 에서 홀수 지수를 짝수로 만드는 가장 작은 수(14)를 확인하세요!');
    }
  }

  function check28Submit() {
    hideInlineErr('p28-err');
    const val = normTxt(document.getElementById('p28-sunwoo').value);
    const ok = val.includes('65') && val.includes('77');

    if (ok) {
      renderVerifiedAnswerView("1.2 확인 5 완료!", "두 소인수의 합이 18인 소수 쌍: (5, 13) ➔ 5 × 13 = 65, (7, 11) ➔ 7 × 11 = 77<br>따라서 만족하는 수는 65, 77입니다.", "2-9");
    } else {
      showInlineErr('p28-err', '❌ 소인수의 합이 18이 되는 100 미만 수(65, 77)를 확인하세요!');
    }
  }

  function check29Submit() {
    hideInlineErr('p29-err');
    const cnt160 = normTxt(document.getElementById('p29-cnt160').value);
    const exp = normTxt(document.getElementById('p29-exp').value);

    const ok160 = (cnt160 === '12');
    const okExp = (exp === '3');

    if (ok160 && okExp) {
      renderVerifiedAnswerView("1.2 생각 넓히기 완료!", "160 = 2⁵ × 5¹ ➔ (5+1)(1+1) = 12개<br>(□ + 1)(2 + 1) = 12 ➔ □ + 1 = 4 ➔ □ = 3", "3-1");
    } else {
      showInlineErr('p29-err', '❌ 160의 약수의 개수(12)와 지수 빈칸(3)을 확인하세요!');
    }
  }

  // ==========================================
  // Tab 3: 최대공약수 (3-1 ~ 3-10)
  // ==========================================
  function check31Submit() {
    hideInlineErr('p31-err');
    const def = normTxt(document.getElementById('p31-def').value);
    const cop = normTxt(document.getElementById('p31-coprime').value);

    const okDef = def.includes('서로소');
    const okCop = cop.includes('1') && cop.includes('3') && !cop.includes('2') && !cop.includes('4');

    if (okDef && okCop) {
      renderVerifiedAnswerView("서로소의 뜻 완료!", "최대공약수가 1인 두 자연수를 <b>서로소</b>라고 합니다.<br>서로소인 쌍: (1) 14와 15, (3) 24와 35", "3-2");
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
      renderVerifiedAnswerView("거듭제곱으로 최대공약수 구하기 완료!", "24와 84의 최대공약수: 2² × 3 = 12<br>문제 1: 2² × 5 = 20<br>문제 2: 28", "3-3");
    } else {
      showInlineErr('p32-err', '❌ 24와 84의 GCD(12), 문제 1(20), 문제 2(28)를 확인하세요!');
    }
  }

  function check33Submit() {
    hideInlineErr('p33-err');
    const ex1 = normTxt(document.getElementById('p33-ex1').value);
    const fol = normTxt(document.getElementById('p33-follow').value);
    const q3 = normTxt(document.getElementById('p33-q3').value);

    const okEx1 = (ex1 === '6');
    const okFol = (fol === '15');
    const okQ3 = (q3 === '18');

    if (okEx1 && okFol && okQ3) {
      renderVerifiedAnswerView("세 수의 최대공약수 완료!", "60, 72, 150의 최대공약수: 6<br>45, 75, 90의 최대공약수: 15<br>54, 72, 90의 최대공약수: 18", "3-4");
    } else {
      showInlineErr('p33-err', '❌ 예제(6), 따라하기(15), 문제 3(18)의 최대공약수를 확인하세요!');
    }
  }

  function check34Submit() {
    hideInlineErr('p34-err');
    const q1a = normTxt(document.getElementById('p34-q1a').value);
    const q1b = normTxt(document.getElementById('p34-q1b').value);

    const ok1a = (q1a === '14');
    const ok1b = (q1b === '6');

    if (ok1a && ok1b) {
      renderVerifiedAnswerView("1.3 확인 1 완료!", "(1) 2 × 7 = 14<br>(2) 84와 150의 최대공약수: 6", "3-5");
    } else {
      showInlineErr('p34-err', '❌ (1) 14, (2) 6 최대공약수를 확인하세요!');
    }
  }

  function check35Submit() {
    hideInlineErr('p35-err');
    const q2a = normTxt(document.getElementById('p35-q2a').value);
    const q2b = normTxt(document.getElementById('p35-q2b').value);

    const ok2a = (q2a === '63');
    const ok2b = (q2b === '13');

    if (ok2a && ok2b) {
      renderVerifiedAnswerView("1.3 확인 2 완료!", "(1) 3² × 7 = 63<br>(2) 52, 65, 91의 최대공약수: 13", "3-6");
    } else {
      showInlineErr('p35-err', '❌ (1) 63, (2) 13 최대공약수를 확인하세요!');
    }
  }

  function check36Submit() {
    hideInlineErr('p36-err');
    const cop = normTxt(document.getElementById('p36-coprimes').value);
    const ok = cop.includes('22') && cop.includes('23') && cop.includes('26') && cop.includes('28') && cop.includes('29');

    if (ok) {
      renderVerifiedAnswerView("1.3 확인 3 완료!", "15 = 3 × 5 이므로 3과 5의 배수를 제외한 수: 22, 23, 26, 28, 29", "3-7");
    } else {
      showInlineErr('p36-err', '❌ 20 이상 30 이하 중 15와 서로소인 수(22, 23, 26, 28, 29)를 확인하세요!');
    }
  }

  function check37Submit() {
    hideInlineErr('p37-err');
    const sum = normTxt(document.getElementById('p37-sum').value);
    const ok = (sum === '4');

    if (ok) {
      renderVerifiedAnswerView("1.3 확인 4 완료!", "최대공약수 100 = 2² × 5² 이므로 a = 2, b = 2 ➔ a + b = 4입니다.", "3-8");
    } else {
      showInlineErr('p37-err', '❌ a=2, b=2 이므로 a+b=4 입니다!');
    }
  }

  function check38Submit() {
    hideInlineErr('p38-err');
    const max = normTxt(document.getElementById('p38-max').value);
    const ok = (max === '35');

    if (ok) {
      renderVerifiedAnswerView("1.3 확인 5 완료!", "105와 350의 최대공약수: 35", "3-9");
    } else {
      showInlineErr('p38-err', '❌ 105와 350의 최대공약수(35)를 확인하세요!');
    }
  }

  function check39Submit() {
    hideInlineErr('p39-err');
    const div = normTxt(document.getElementById('p39-div').value);
    const ok = (div === '15');

    if (ok) {
      renderVerifiedAnswerView("1.3 확인 6 완료!", "107 - 2 = 105, 153 - 3 = 150, 90 의 최대공약수는 15입니다.", "3-10");
    } else {
      showInlineErr('p39-err', '❌ 105, 150, 90의 최대공약수(15)를 확인하세요!');
    }
  }

  function check310Submit() {
    hideInlineErr('p310-err');
    const wide = normTxt(document.getElementById('p310-wide').value);
    const ok = wide.includes('14') && wide.includes('28') && wide.includes('35');

    if (ok) {
      renderVerifiedAnswerView("1.3 생각 넓히기 완료!", "21과의 최대공약수가 7인 수: 7 × k (k는 3과 서로소)<br>k = 2(14), 4(28), 5(35) ➔ 14, 28, 35", "4-1");
    } else {
      showInlineErr('p310-err', '❌ 50 미만 두 자리 수(14, 28, 35)를 확인하세요!');
    }
  }

  // ==========================================
  // Tab 4: 최소공배수 (4-1 ~ 4-10)
  // ==========================================
  function check41Submit() {
    hideInlineErr('p41-err');
    const cycle = normTxt(document.getElementById('p41-cycle').value);
    const lcm = normTxt(document.getElementById('p41-lcm5490').value);

    const okCycle = (cycle === '2034');
    const okLcm = (lcm === '270');

    if (okCycle && okLcm) {
      renderVerifiedAnswerView("최소공배수와 소인수분해 완료!", "4년과 3년의 LCM = 12년 ➔ 2022 + 12 = 2034년<br>54와 90의 최소공배수: 270", "4-2");
    } else {
      showInlineErr('p41-err', '❌ 다음 개최 연도(2034)와 54, 90의 최소공배수(270)를 확인하세요!');
    }
  }

  function check42Submit() {
    hideInlineErr('p42-err');
    const g = normTxt(document.getElementById('p42-gearLcm').value);
    const ex1 = normTxt(document.getElementById('p42-ex1').value);
    const fol = normTxt(document.getElementById('p42-follow').value);

    const okG = (g === '72');
    const okEx1 = (ex1 === '504');
    const okFol = (fol === '240');

    if (okG && okEx1 && okFol) {
      renderVerifiedAnswerView("톱니바퀴 & 세 수의 최소공배수 완료!", "톱니 맞물림: 72개<br>18, 28, 72의 최소공배수: 504<br>16, 40, 60의 최소공배수: 240", "4-3");
    } else {
      showInlineErr('p42-err', '❌ 톱니 수(72), 예제(504), 따라하기(240) 최소공배수를 확인하세요!');
    }
  }

  function check43Submit() {
    hideInlineErr('p43-err');
    const q1a = normTxt(document.getElementById('p43-q1a').value);
    const q1b = normTxt(document.getElementById('p43-q1b').value);

    const ok1a = (q1a === '495');
    const ok1b = (q1b === '189');

    if (ok1a && ok1b) {
      renderVerifiedAnswerView("1.4 확인 1 완료!", "(1) 3² × 5 × 11 = 495<br>(2) 21과 27의 최소공배수: 189", "4-4");
    } else {
      showInlineErr('p43-err', '❌ (1) 495, (2) 189 최소공배수를 확인하세요!');
    }
  }

  function check44Submit() {
    hideInlineErr('p44-err');
    const q2a = normTxt(document.getElementById('p44-q2a').value);
    const q2b = normTxt(document.getElementById('p44-q2b').value);

    const ok2a = (q2a === '432');
    const ok2b = (q2b === '126');

    if (ok2a && ok2b) {
      renderVerifiedAnswerView("1.4 확인 2 완료!", "(1) 2⁴ × 3³ = 432<br>(2) 6, 42, 63의 최소공배수: 126", "4-5");
    } else {
      showInlineErr('p44-err', '❌ (1) 432, (2) 126 최소공배수를 확인하세요!');
    }
  }

  function check45Submit() {
    hideInlineErr('p45-err');
    const min = normTxt(document.getElementById('p45-min').value);
    const ok = (min === '490');

    if (ok) {
      renderVerifiedAnswerView("1.4 확인 3 완료!", "70과 98의 최소공배수는 2 × 5 × 7² = 490입니다.", "4-6");
    } else {
      showInlineErr('p45-err', '❌ 70과 98의 최소공배수(490)를 확인하세요!');
    }
  }

  function check46Submit() {
    hideInlineErr('p46-err');
    const valA = normTxt(document.getElementById('p46-valA').value);
    const ok = (valA === '6');

    if (ok) {
      renderVerifiedAnswerView("1.4 확인 4 완료!", "3, 4, 5의 최소공배수는 60이므로 60 × A = 360 ➔ A = 6입니다.", "4-7");
    } else {
      showInlineErr('p46-err', '❌ 60 * A = 360 ➔ A=6 입니다!');
    }
  }

  function check47Submit() {
    hideInlineErr('p47-err');
    const val = normTxt(document.getElementById('p47-candidates').value);
    const ok = val.includes('1') && val.includes('3') && val.includes('6') && val.includes('9') && val.includes('18');

    if (ok) {
      renderVerifiedAnswerView("1.4 확인 5 완료!", "가능한 자연수 □는 18(= 2 × 3²)의 약수들입니다.<br>➔ 1, 3, 6, 9, 18", "4-8");
    } else {
      showInlineErr('p47-err', '❌ 가능한 자연수(1, 3, 6, 9, 18)를 확인하세요!');
    }
  }

  function check48Submit() {
    hideInlineErr('p48-err');
    const val = normTxt(document.getElementById('p48-threeDigits').value);
    const ok = (val === '180');

    if (ok) {
      renderVerifiedAnswerView("1.4 확인 6 완료!", "18과 45의 최소공배수는 90이며, 세 자리 자연수 중 가장 작은 수는 90 × 2 = 180입니다.", "4-9");
    } else {
      showInlineErr('p48-err', '❌ 최소공배수 90의 세 자리 배수(180)를 확인하세요!');
    }
  }

  function check49Submit() {
    hideInlineErr('p49-err');
    const pair = normTxt(document.getElementById('p49-pair').value);
    const ok = pair.includes('8') && pair.includes('36');

    if (ok) {
      renderVerifiedAnswerView("1.4 생각 넓히기 완료!", "최대공약수 4, 최소공배수 72, 합이 44인 두 수는 8과 36입니다.", "4-10");
    } else {
      showInlineErr('p49-err', '❌ 두 자연수(8, 36)를 확인하세요!');
    }
  }

  function check410Submit() {
    hideInlineErr('p410-err');
    const v115 = normTxt(document.getElementById('p410-115').value);
    const v269 = normTxt(document.getElementById('p410-269').value);
    const v2027 = normTxt(document.getElementById('p410-2027').value);
    const log = normTxt(document.getElementById('p410-logic').value);

    const ok115 = v115.includes('합성수');
    const ok269 = v269.includes('소수');
    const ok2027 = v2027.includes('소수');
    const okLog = log.includes('약수');

    if (ok115 && ok269 && ok2027 && okLog) {
      renderVerifiedAnswerView("1.4 디지털 쏙 수학 완료!", "115: 합성수 (5 × 23)<br>269: 소수<br>2027: 소수<br>변수 D: 약수의 개수 (D=2이면 소수)", "5-1");
    } else {
      showInlineErr('p410-err', '❌ 115(합성수), 269(소수), 2027(소수) 및 변수 D(약수의 개수)를 확인하세요!');
    }
  }

  // ==========================================
  // Tab 5: 스스로 마무리하기 (5-1 ~ 5-14)
  // ==========================================
  function check51Submit() {
    hideInlineErr('p51-err');
    const cnt = normTxt(document.getElementById('p51-cnt').value);
    const ok = (cnt === '11');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 01 완료!", "1부터 31일까지 소수 날짜는 총 11개입니다.<br>소수 날짜: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31일", "5-2");
    } else {
      showInlineErr('p51-err', '❌ 1~31일 중 소수 날짜의 개수(11개)를 확인하세요!');
    }
  }

  function check52Submit() {
    hideInlineErr('p52-err');
    const choice = normTxt(document.getElementById('p52-choice').value);
    const ok = choice.includes('ㄱ') && choice.includes('ㄴ') && choice.includes('ㄹ') && !choice.includes('ㄷ');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 02 완료!", "옳은 보기: ㄱ, ㄴ, ㄹ<br>ㄷ(거짓): 33, 63, 93 등은 합성수입니다.", "5-3");
    } else {
      showInlineErr('p52-err', '❌ 옳은 보기 기호(ㄱ, ㄴ, ㄹ)를 확인하세요!');
    }
  }

  function check53Submit() {
    hideInlineErr('p53-err');
    const digit = normTxt(document.getElementById('p53-digit').value);
    const ok = (digit === '8');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 03 완료!", "3¹³의 일의 자리: 3<br>5⁴의 일의 자리: 5<br>3 + 5 = 8 입니다.", "5-4");
    } else {
      showInlineErr('p53-err', '❌ 3^13(일의 자리 3) + 5^4(일의 자리 5) = 8 입니다!');
    }
  }

  function check54Submit() {
    hideInlineErr('p54-err');
    const no = normTxt(document.getElementById('p54-no').value);
    const ok = (no === '4' || no === '7');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 04 완료!", "330 = 2 × 3 × 5 × 11 이므로 7은 소인수가 아닙니다. ➔ ④", "5-5");
    } else {
      showInlineErr('p54-err', '❌ 330의 소인수가 아닌 것의 번호(④)를 확인하세요!');
    }
  }

  function check55Submit() {
    hideInlineErr('p55-err');
    const sum = normTxt(document.getElementById('p55-sum').value);
    const ok = (sum === '23');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 05 완료!", "84 = 2² × 3 × 7 ➔ a = 21, b = 2 ➔ a + b = 23", "5-6");
    } else {
      showInlineErr('p55-err', '❌ a=21, b=2 이므로 a+b=23 입니다!');
    }
  }

  function check56Submit() {
    hideInlineErr('p56-err');
    const cop = normTxt(document.getElementById('p56-cop').value);
    const ok = (cop === '4');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 06 완료!", "④ 35(= 5 × 7)와 2 × 3²(= 18)은 공통인 소인수가 없으므로 서로소입니다.", "5-7");
    } else {
      showInlineErr('p56-err', '❌ 서로소인 쌍 번호(④)를 확인하세요!');
    }
  }

  function check57Submit() {
    hideInlineErr('p57-err');
    const ans = normTxt(document.getElementById('p57-ans').value);
    const ok = (ans === '4');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 07 완료!", "최대공약수: 2² × 3<br>최소공배수: 2³ × 3 × 5 × 7 ➔ ④", "5-8");
    } else {
      showInlineErr('p57-err', '❌ 올바른 보기 번호(④)를 확인하세요!');
    }
  }

  function check58Submit() {
    hideInlineErr('p58-err');
    const valA = normTxt(document.getElementById('p58-valA').value);
    const ok = (valA === '60');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 08 완료!", "A = 2² × 3 × 5 = 60 입니다.", "5-9");
    } else {
      showInlineErr('p58-err', '❌ A의 값(60)을 확인하세요!');
    }
  }

  function check59Submit() {
    hideInlineErr('p59-err');
    const gcd = normTxt(document.getElementById('p59-gcd').value);
    const ok = (gcd === '20');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 09 완료!", "최대공약수를 G라 하면 G × 3 × 7 = 420 ➔ G = 20입니다.", "5-10");
    } else {
      showInlineErr('p59-err', '❌ 최대공약수(20)를 확인하세요!');
    }
  }

  function check510Submit() {
    hideInlineErr('p510-err');
    const frac = normTxt(document.getElementById('p510-frac').value);
    const ok = (frac === '70/3');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 10 완료!", "분자 = LCM(5, 7, 14) = 70<br>분모 = GCD(9, 36, 15) = 3 ➔ 70/3", "5-11");
    } else {
      showInlineErr('p510-err', '❌ 기약분수(70/3)를 확인하세요!');
    }
  }

  function check511Submit() {
    hideInlineErr('p511-err');
    const sum = normTxt(document.getElementById('p511-sum').value);
    const ok = (sum === '10');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 11 서술형 완료!", "126 = 2 × 3² × 7 ➔ a = 7<br>45 = 3² × 5 ➔ b = 3<br>a + b = 7 + 3 = 10", "5-12");
    } else {
      showInlineErr('p511-err', '❌ a=7, b=3 ➔ a+b=10 입니다!');
    }
  }

  function check512Submit() {
    hideInlineErr('p512-err');
    const sum = normTxt(document.getElementById('p512-sum').value);
    const ok = (sum === '17');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 12 서술형 완료!", "1부터 12까지의 곱 = 2¹⁰ × 3⁵ × 5² × 7 × 11<br>x = 10, y = 5, z = 2 ➔ x + y + z = 17", "5-13");
    } else {
      showInlineErr('p512-err', '❌ x=10, y=5, z=2 ➔ x+y+z=17 입니다!');
    }
  }

  function check513Submit() {
    hideInlineErr('p513-err');
    const valA = normTxt(document.getElementById('p513-valA').value);
    const ok = (valA === '18');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 13 서술형 완료!", "세 수의 최대공약수가 6이고 10 < A < 20 이므로 A = 18입니다.", "5-14");
    } else {
      showInlineErr('p513-err', '❌ 10과 20 사이의 수(18)를 확인하세요!');
    }
  }

  function check514Submit() {
    hideInlineErr('p514-err');
    const sum = normTxt(document.getElementById('p514-sum').value);
    const ok = (sum === '162');

    if (ok) {
      renderVerifiedAnswerView("스스로 마무리하기 14 서술형 완료!", "A = GCD(144, 48) = 36<br>B = GCD(54, 36) = 18<br>C = LCM(36, 54) = 108<br>A + B + C = 36 + 18 + 108 = 162", "6-1");
    } else {
      showInlineErr('p514-err', '❌ A=36, B=18, C=108 ➔ A+B+C=162 입니다!');
    }
  }

  // ==========================================
  // Tab 6: 창의융합 프로젝트 (6-1)
  // ==========================================
  function check61Submit() {
    hideInlineErr('p61-err');
    const rule = normTxt(document.getElementById('p61-rule').value);
    const strat = normTxt(document.getElementById('p61-strat').value);

    const okRule = rule.includes('수') || rule.includes('넓이') || rule.includes('값');
    const okStrat = strat.includes('한') || strat.includes('경우') || strat.includes('모양') || strat.includes('적');

    if (okRule && okStrat) {
      renderVerifiedAnswerView(
        "🏆 1단원 소인수분해 57개 서브스텝 전 과정 완벽 마스터!",
        "축하합니다! 스스로 확인하기와 스스로 마무리하기 전 문항, 몬드리안 창의융합 프로젝트까지 57개 서브스텝을 모두 100% 완수하셨습니다!",
        "6-1"
      );
    } else {
      showInlineErr('p61-err', '❌ 분할 규칙(주어진 수/넓이)과 소수/큰 수를 먼저 그리는 까닭을 확인하세요!');
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
  window.check16Submit = check16Submit;
  window.check17Submit = check17Submit;
  window.check18Submit = check18Submit;
  window.check19Submit = check19Submit;

  window.check21Submit = check21Submit;
  window.check22Submit = check22Submit;
  window.check23Submit = check23Submit;
  window.check24Submit = check24Submit;
  window.check25Submit = check25Submit;
  window.check26Submit = check26Submit;
  window.check27Submit = check27Submit;
  window.check28Submit = check28Submit;
  window.check29Submit = check29Submit;

  window.check31Submit = check31Submit;
  window.check32Submit = check32Submit;
  window.check33Submit = check33Submit;
  window.check34Submit = check34Submit;
  window.check35Submit = check35Submit;
  window.check36Submit = check36Submit;
  window.check37Submit = check37Submit;
  window.check38Submit = check38Submit;
  window.check39Submit = check39Submit;
  window.check310Submit = check310Submit;

  window.check41Submit = check41Submit;
  window.check42Submit = check42Submit;
  window.check43Submit = check43Submit;
  window.check44Submit = check44Submit;
  window.check45Submit = check45Submit;
  window.check46Submit = check46Submit;
  window.check47Submit = check47Submit;
  window.check48Submit = check48Submit;
  window.check49Submit = check49Submit;
  window.check410Submit = check410Submit;

  window.check51Submit = check51Submit;
  window.check52Submit = check52Submit;
  window.check53Submit = check53Submit;
  window.check54Submit = check54Submit;
  window.check55Submit = check55Submit;
  window.check56Submit = check56Submit;
  window.check57Submit = check57Submit;
  window.check58Submit = check58Submit;
  window.check59Submit = check59Submit;
  window.check510Submit = check510Submit;
  window.check511Submit = check511Submit;
  window.check512Submit = check512Submit;
  window.check513Submit = check513Submit;
  window.check514Submit = check514Submit;

  window.check61Submit = check61Submit;
})();
