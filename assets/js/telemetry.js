// WVamoss Labs — Live Telemetry Waveform & Interactive Engine

// 1. Live Canvas Waveform Stream
const canvas = document.getElementById('telemetryCanvas');
const ctx = canvas.getContext('2d');
let points = [];
const maxPoints = 50;
let anomalyActive = false;

function resizeCanvas() {
  if (canvas && canvas.parentElement) {
    canvas.width = canvas.parentElement.clientWidth - 28;
    canvas.height = 64;
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < maxPoints; i++) {
  points.push(1.65 + (Math.random() * 0.1 - 0.05));
}

function drawWaveform() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = anomalyActive ? '#f43f5e' : '#06b6d4';
  ctx.lineWidth = 2;
  ctx.beginPath();

  const step = canvas.width / (maxPoints - 1);
  for (let i = 0; i < points.length; i++) {
    const normalized = (points[i] - 1.2) / 1.2;
    const y = canvas.height - (normalized * canvas.height * 0.8) - 6;
    const x = i * step;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.fillStyle = anomalyActive ? 'rgba(244, 63, 94, 0.08)' : 'rgba(6, 182, 212, 0.08)';
  ctx.fill();
}

setInterval(() => {
  let nextVal = 1.65 + (Math.random() * 0.12 - 0.06);
  if (anomalyActive) {
    nextVal = 2.24 + (Math.random() * 0.15 - 0.05);
  }
  points.shift();
  points.push(nextVal);
  drawWaveform();

  if (!anomalyActive) {
    const elPh = document.getElementById('val-ph');
    const elEc = document.getElementById('val-ec');
    const elTemp = document.getElementById('val-temp');
    const elDo = document.getElementById('val-do');
    if (elPh) elPh.innerText = (6.10 + Math.random() * 0.06).toFixed(2) + ' pH';
    if (elEc) elEc.innerText = nextVal.toFixed(2) + ' mS/cm';
    if (elTemp) elTemp.innerText = (19.4 + Math.random() * 0.2).toFixed(1) + ' °C';
    if (elDo) elDo.innerText = (6.2 + Math.random() * 0.15).toFixed(1) + ' mg/L';
  }
}, 800);

// 2. Anomaly Simulation Trigger
const btnAnomaly = document.getElementById('btn-inject-anomaly');
const agentLog = document.getElementById('agent-log');

if (btnAnomaly) {
  btnAnomaly.addEventListener('click', () => {
    anomalyActive = !anomalyActive;
    if (anomalyActive) {
      document.getElementById('btn-anomaly-text').innerText = 'Resolve Drift';
      btnAnomaly.className = 'px-2.5 py-1 rounded bg-rose-600 text-white text-[11px] font-mono font-medium transition flex items-center gap-1.5';
      
      const elEc = document.getElementById('val-ec');
      if (elEc) {
        elEc.innerText = '2.28 mS/cm';
        elEc.className = 'font-bold text-rose-400 text-sm animate-pulse';
      }
      const barEc = document.getElementById('bar-ec');
      if (barEc) {
        barEc.style.width = '92%';
        barEc.className = 'bg-rose-500 h-full rounded-full transition-all duration-500';
      }
      const stEc = document.getElementById('status-ec');
      if (stEc) {
        stEc.innerText = 'CRITICAL DRIFT';
        stEc.className = 'text-rose-400 font-bold';
      }

      if (agentLog) {
        agentLog.innerHTML = `
          <p class="text-rose-400 font-bold">⚠️ ANOMALY EVENT: Sensor 02 (EC) breached upper threshold (2.28 &gt; 2.0 mS/cm).</p>
          <p class="text-slate-300"><span class="text-cyan-400">[Claude 3.5 Sonnet Diagnostic Agent]:</span> Multi-sensor cross-check reveals stable water temperature (19.5°C) and nominal pH (6.14). Probable root cause: Dosing pump valve relay #2 stuck in open state.</p>
          <p class="text-emerald-400 font-semibold">[Automated Actuation Dispatch]: Triggering emergency dilution valve #4 for 6.0s. Actuator confirmation ACK received (12ms).</p>
        `;
      }
    } else {
      document.getElementById('btn-anomaly-text').innerText = 'Test Drift Anomaly';
      btnAnomaly.className = 'px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-slate-200 transition font-medium flex items-center gap-1.5';
      
      const elEc = document.getElementById('val-ec');
      if (elEc) {
        elEc.className = 'font-bold text-emerald-400 text-sm';
      }
      const barEc = document.getElementById('bar-ec');
      if (barEc) {
        barEc.style.width = '60%';
        barEc.className = 'bg-emerald-500 h-full rounded-full transition-all duration-500';
      }
      const stEc = document.getElementById('status-ec');
      if (stEc) {
        stEc.innerText = 'NOMINAL';
        stEc.className = 'text-emerald-400 font-semibold';
      }

      if (agentLog) {
        agentLog.innerHTML = `
          <p class="text-slate-500"># Anomaly resolved. Telemetry normalized to 1.68 mS/cm.</p>
          <p class="text-emerald-400 font-medium">✓ Local edge loop handling all sensor windows. Zero unnecessary cloud token spend.</p>
        `;
      }
    }
  });
}

// 3. Model Switcher
function switchModel(model) {
  const tabSnn = document.getElementById('tab-snn');
  const tabCae = document.getElementById('tab-cae');
  const tabIforest = document.getElementById('tab-iforest');
  const statLatency = document.getElementById('stat-latency');

  const defaultClass = 'px-2.5 py-0.5 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 transition';
  const activeClass = 'px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold transition';

  if (tabSnn) tabSnn.className = defaultClass;
  if (tabCae) tabCae.className = defaultClass;
  if (tabIforest) tabIforest.className = defaultClass;

  if (model === 'snn') {
    if (tabSnn) tabSnn.className = activeClass;
    if (statLatency) statLatency.innerText = 'Latency: 18.4ms · RAM: 42MB · F1: 0.892';
  } else if (model === 'cae') {
    if (tabCae) tabCae.className = activeClass;
    if (statLatency) statLatency.innerText = 'Latency: 46.2ms · RAM: 88MB · F1: 0.914';
  } else if (model === 'iforest') {
    if (tabIforest) tabIforest.className = activeClass;
    if (statLatency) statLatency.innerText = 'Latency: 84.0ms · RAM: 124MB · F1: 0.841';
  }
}

// 4. Interactive SAW Calculator
function updateSAW() {
  const sliderLat = document.getElementById('slider-latency');
  const sliderF1 = document.getElementById('slider-f1');
  if (!sliderLat || !sliderF1) return;

  const latW = parseFloat(sliderLat.value) / 100;
  const f1W = parseFloat(sliderF1.value) / 100;
  document.getElementById('weight-latency-val').innerText = latW.toFixed(2);
  document.getElementById('weight-f1-val').innerText = f1W.toFixed(2);

  const snnScore = (f1W * (0.892 / 0.914)) + (latW * (18.4 / 18.4)) + (0.2 * (42 / 42));
  const caeScore = (f1W * (0.914 / 0.914)) + (latW * (18.4 / 46.2)) + (0.2 * (42 / 88));
  const iforestScore = (f1W * (0.841 / 0.914)) + (latW * (18.4 / 84.0)) + (0.2 * (42 / 124));

  document.getElementById('score-snn').innerText = 'Score: ' + (snnScore * 0.7).toFixed(3);
  document.getElementById('score-cae').innerText = 'Score: ' + (caeScore * 0.7).toFixed(3);
  document.getElementById('score-iforest').innerText = 'Score: ' + (iforestScore * 0.7).toFixed(3);

  if (snnScore >= caeScore) {
    document.getElementById('saw-verdict').innerText = 'OPTIMAL: SNN (32-16)';
  } else {
    document.getElementById('saw-verdict').innerText = 'OPTIMAL: CAE (16-8-16)';
  }
}
