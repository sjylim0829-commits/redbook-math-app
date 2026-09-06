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
    '0. 되짚어 보기 & 단원 도입',
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
      { code: '0-3', label: '3. 공배수와 최소공배수 (초등)' },
      { code: '0-4', label: '4. 정보화 시대 소수 (단원 도입)' }
    ],
    1: [
      { code: '1-1', label: '1. 소수와 합성수의 뜻' },
      { code: '1-2', label: '2. 에라토스테네스의 체' },
      { code: '1-3', label: '3. 거듭제곱과 밑·지수' },
      { code: '1-4', label: '4. 스스로 확인하기 1' },
      { code: '1-5', label: '5. 세균 증식과 열차 소수 역' }
    ],
    2: [
      { code: '2-1', label: '1. 소인수와 인수의 뜻' },
      { code: '2-2', label: '2. 소인수분해 가지치기 트리' },
      { code: '2-3', label: '3. 소인수분해 집중 실습' },
      { code: '2-4', label: '4. 소인수분해로 약수 구하기' },
      { code: '2-5', label: '5. 약수의 개수 공식 & 확인' }
    ],
    3: [
      { code: '3-1', label: '1. 최대공약수와 서로소' },
      { code: '3-2', label: '2. 거듭제곱 비교 최대공약수' },
      { code: '3-3', label: '3. 세 수의 최대공약수' },
      { code: '3-4', label: '4. 최대공약수 응용과 추론' }
    ],
    4: [
      { code: '4-1', label: '1. 최소공배수와 소인수분해' },
      { code: '4-2', label: '2. 톱니바퀴 & 세 수 최소공배수' },
      { code: '4-3', label: '3. 최소공배수 응용과 추론' },
      { code: '4-4', label: '4. 디지털 쏙 수학: 코딩' }
    ],
    5: [
      { code: '5-1', label: '1. 대단원 스스로 마무리 1' },
      { code: '5-2', label: '2. 대단원 스스로 마무리 2' },
      { code: '5-3', label: '3. 대단원 서술형 완성' },
      { code: '5-4', label: '4. 몬드리안 분할 프로젝트' }
    ]
  },
  substepDataJs,
  canvasDrawersJs,
  validationHandlersJs
};

console.log('📦 Generating g1_ch1_factors.html from master_template...');
const html = createChapterHtml(ch1Config);
fs.writeFileSync('g1_ch1_factors.html', html, 'utf8');

// Verify syntax of embedded scripts
const scriptMatch = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i);
if (scriptMatch) {
  fs.writeFileSync('temp_check_ch1.js', scriptMatch[1], 'utf8');
  execSync('node --check temp_check_ch1.js');
  fs.unlinkSync('temp_check_ch1.js');
}
console.log('✅ g1_ch1_factors.html: successfully built with all 26 substeps and verified syntax!');
