const fs = require('fs');
const path = require('path');

const inputPath = path.resolve('test-results.json');
const outputDir = path.resolve('docs');
const outputPath = path.join(outputDir, 'test-results.svg');

if (!fs.existsSync(inputPath)) {
  throw new Error('Missing test-results.json. Run Playwright with JSON reporter first.');
}

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

let passed = 0;
let failed = 0;
let skipped = 0;

function walkSuites(suites = []) {
  for (const suite of suites) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const results = test.results || [];
        const hasPassed = results.some((r) => r.status === 'passed');
        const hasFailed = results.some((r) => r.status === 'failed' || r.status === 'timedOut');
        const hasSkipped = results.length > 0 && results.every((r) => r.status === 'skipped' || r.status === 'interrupted');

        if (hasPassed) {
          passed += 1;
        } else if (hasFailed) {
          failed += 1;
        } else if (hasSkipped) {
          skipped += 1;
        }
      }
    }
    walkSuites(suite.suites || []);
  }
}

walkSuites(data.suites || []);

const maxValue = Math.max(passed, failed, skipped, 1);
const chartWidth = 260;
const scale = chartWidth / maxValue;
const bars = [
  { label: 'Passed', value: passed, color: '#16a34a', y: 30 },
  { label: 'Failed', value: failed, color: '#dc2626', y: 80 },
  { label: 'Skipped', value: skipped, color: '#ca8a04', y: 130 },
];

const barsSvg = bars
  .map((bar) => {
    const width = Math.round(bar.value * scale);
    return `
  <text x="12" y="${bar.y - 8}" font-size="12" fill="#111827">${bar.label}: ${bar.value}</text>
  <rect x="12" y="${bar.y}" width="${width}" height="20" rx="4" fill="${bar.color}"></rect>`;
  })
  .join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="170" viewBox="0 0 320 170">
  <rect width="100%" height="100%" fill="#ffffff"></rect>
  ${barsSvg}
</svg>
`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, svg, 'utf8');

console.log('Chart generated:', outputPath);
console.log({ passed, failed, skipped });
