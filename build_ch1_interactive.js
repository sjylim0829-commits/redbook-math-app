const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createChapterHtml } = require('./master_template.js');

const substepDataJs = fs.readFileSync(path.join(__dirname, 'src/ch1/substeps_data.js'), 'utf8');
const canvasDrawersJs = fs.readFileSync(path.join(__dirname, 'src/ch1/canvas_drawers.js'), 'utf8');
const validationHandlersJs = fs.readFileSync(path.join(__dirname, 'src/ch1/validation_handlers.js'), 'utf8');

const ch1Config = {
  chapterNum: 1,
  chapterTitle: '1. 소인수분해',
  chapterBadge: '중1 수학 1단원',
  mainTabs: [
    '0. 되짚어 보기 & 준비학습',
    '1. 소수와 합성수',
    '2. 소인수분해',
    '3. 최대공약수',
    '4. 최소공배수',
    '5. 스스로 마무리하기',
    '6. 창의융합 프로젝트'
  ],
  pillsConfig: {
    0: [
      { code: '0-1', label: '1. 약수와 배수' },
      { code: '0-2', label: '2. 공약수와 최대공약수' },
      { code: '0-3', label: '3. 공배수와 최소공배수' },
      { code: '0-4', label: '4. 자연수의 분류' }
    ],
    1: [
      { code: '1-1', label: '1. 소수와 합성수의 뜻' },
      { code: '1-2', label: '2. 에라토스테네스의 체' },
      { code: '1-3', label: '3. 거듭제곱과 밑·지수' },
      { code: '1-4', label: '4. [확인 1] 소수/합성수 구분' },
      { code: '1-5', label: '5. [확인 2] 거듭제곱 표현' },
      { code: '1-6', label: '6. [확인 3] 소수 성질 참/거짓' },
      { code: '1-7', label: '7. [확인 4] 세균 증식 거듭제곱' },
      { code: '1-8', label: '8. [확인 5] 지수 방정식과 합' },
      { code: '1-9', label: '9. 열차 소수 역과 승객' }
    ],
    2: [
      { code: '2-1', label: '1. 소인수와 인수의 뜻' },
      { code: '2-2', label: '2. 소인수분해 가지치기 트리' },
      { code: '2-3', label: '3. 소인수분해 집중 실습' },
      { code: '2-4', label: '4. [확인 1] 소인수 모두 구하기' },
      { code: '2-5', label: '5. [확인 2] 소인수분해하기' },
      { code: '2-6', label: '6. [확인 3] 연속 곱 소인수 2 지수' },
      { code: '2-7', label: '7. [확인 4] 제곱수 만들기' },
      { code: '2-8', label: '8. [확인 5] 선우·은서 조건 추론' },
      { code: '2-9', label: '9. 약수의 개수 공식' }
    ],
    3: [
      { code: '3-1', label: '1. 최대공약수와 서로소' },
      { code: '3-2', label: '2. 거듭제곱 비교 최대공약수' },
      { code: '3-3', label: '3. 세 수의 최대공약수' },
      { code: '3-4', label: '4. [확인 1] 두 수 최대공약수' },
      { code: '3-5', label: '5. [확인 2] 세 수 최대공약수' },
      { code: '3-6', label: '6. [확인 3] 15와 서로소인 수' },
      { code: '3-7', label: '7. [확인 4] 지수 미지수 조건' },
      { code: '3-8', label: '8. [확인 5] 분수 자연수 최대수' },
      { code: '3-9', label: '9. [확인 6] 나머지 나눗셈 최대수' },
      { code: '3-10', label: '10. 21과 GCD 7인 수 추론' }
    ],
    4: [
      { code: '4-1', label: '1. 최소공배수와 소인수분해' },
      { code: '4-2', label: '2. 톱니바퀴 & 세 수 최소공배수' },
      { code: '4-3', label: '3. [확인 1] 두 수 최소공배수' },
      { code: '4-4', label: '4. [확인 2] 세 수 최소공배수' },
      { code: '4-5', label: '5. [확인 3] 분수 자연수 최소수' },
      { code: '4-6', label: '6. [확인 4] 3A, 4A, 5A의 LCM' },
      { code: '4-7', label: '7. [확인 5] 세 수 LCM 미지수' },
      { code: '4-8', label: '8. [확인 6] 세 자리 공배수' },
      { code: '4-9', label: '9. 합과 GCD/LCM 추론' },
      { code: '4-10', label: '10. 디지털 쏙 수학: 코딩' }
    ],
    5: [
      { code: '5-1', label: '01. 달력 속 소수 날짜' },
      { code: '5-2', label: '02. 옳은 보기 고르기' },
      { code: '5-3', label: '03. 거듭제곱 일의 자리' },
      { code: '5-4', label: '04. 330의 소인수가 아닌 것' },
      { code: '5-5', label: '05. 84를 나누어 제곱수' },
      { code: '5-6', label: '06. 서로소인 두 수' },
      { code: '5-7', label: '07. 최대공약수·최소공배수' },
      { code: '5-8', label: '08. A와 36의 관계' },
      { code: '5-9', label: '09. 비 3:7인 두 수' },
      { code: '5-10', label: '10. 곱해 자연수 되는 기약분수' },
      { code: '5-11', label: '11. [서술] 소인수분해 합 a+b' },
      { code: '5-12', label: '12. [서술] 1~12 곱 지수합' },
      { code: '5-13', label: '13. [서술] 세 수 GCD 6 조건' },
      { code: '5-14', label: '14. [서술] GCD/LCM 연결 트리' }
    ],
    6: [
      { code: '6-1', label: '1. 몬드리안 분할 프로젝트' }
    ]
  },
  substepDataJs,
  canvasDrawersJs,
  validationHandlersJs
};

console.log('📦 Generating g1_ch1_factors.html from master_template (57 Substeps across 7 Tabs)...');
const html = createChapterHtml(ch1Config);
fs.writeFileSync('g1_ch1_factors.html', html, 'utf8');

// Verify syntax of embedded scripts
const scriptMatch = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i);
if (scriptMatch) {
  fs.writeFileSync('temp_check_ch1.js', scriptMatch[1], 'utf8');
  execSync('node --check temp_check_ch1.js');
  fs.unlinkSync('temp_check_ch1.js');
}
console.log('✅ g1_ch1_factors.html: successfully built with all 57 substeps and verified syntax!');
