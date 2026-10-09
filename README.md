# WVamoss Labs — Edge Intelligence & Industrial Anomaly Triage

[![Platform](https://img.shields.io/badge/Platform-Raspberry%20Pi%204%20%7C%20ARM64-blue.svg)](https://wvamosslabs.me)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Engine](https://img.shields.io/badge/Engine-RAEIF%20v0.4.2-cyan.svg)](https://wvamosslabs.me)
[![Diagnostics](https://img.shields.io/badge/Reasoning-Claude%203.5%20Sonnet%20API-orange.svg)](https://wvamosslabs.me)

Official repository for **WVamoss Labs** and the **Resource-Aware Edge Intelligence Framework (RAEIF)**. 

Live documentation & interactive console: **[https://wvamosslabs.me](https://wvamosslabs.me)**

---

## ⚡ Key Highlights

- **Sub-100ms Edge Inference:** Spiking Neural Network (SNN) achieves **18.4ms** measured latency on Raspberry Pi 4 BCM2711.
- **Adaptive Model Selection:** Dynamic ranking between **SNN (32-16)**, **Convolutional Autoencoder (CAE 16-8-16)**, and **Isolation Forest (100 trees)** via Simple Additive Weighting (SAW).
- **Cognitive Diagnostics Loop:** Only anomalous telemetry breach vectors trigger **Claude 3.5 Sonnet** via Tool Use and Prompt Caching for root-cause reasoning and automated closed-loop mitigation.
- **Local Resilience (Plan C):** Zero cloud broker dependency; zero message broker overhead; local CSV and memory ring buffer fallback.

---

## 📊 Benchmark Summary (Raspberry Pi 4 Model B)

| Model Architecture | Detection F1-Score | Measured Latency | RAM Footprint | CPU Load | SAW Score |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **SNN (32-16)** | **0.892** | **18.4 ms** | **42.1 MB** | **12.4%** | **0.884 [Rank 1]** |
| **CAE (16-8-16)** | **0.914** | **46.2 ms** | **88.5 MB** | **24.8%** | **0.762 [Rank 2]** |
| **Isolation Forest** | 0.841 | 84.0 ms | 124.0 MB | 38.1% | 0.618 [Rank 3] |

---

## 🚀 Quickstart

```bash
# Clone the repository
git clone https://github.com/WVamoss/WVamoss.github.io.git
cd WVamoss.github.io

# Install the edge runtime engine
pip install wvamoss-edge-runtime
```

### Python SDK Usage

```python
from wvamoss_edge import TelemetryEngine, SAWEvaluator, ClaudeAgent

# Ingest multi-sensor stream (pH, EC, Water Temp, Dissolved Oxygen)
engine = TelemetryEngine(sensors=["pH", "EC", "Temp", "DO"], window_sec=1.0)

# Evaluate optimal model via SAW multi-criteria weights
model = SAWEvaluator.select(latency_cost=0.35, f1_benefit=0.25)

# Autonomous detection loop
for window in engine.stream():
    anomaly = model.predict(window)
    if anomaly.is_persistent:
        # Route anomaly vector to Claude 3.5 Sonnet diagnostic agent
        triage = ClaudeAgent.diagnose(anomaly)
        triage.dispatch_actuator()
```

---

## 📁 Repository Structure

```text
WVamoss.github.io/
├── assets/
│   ├── css/
│   │   └── main.css          # Core stylesheets
│   └── js/
│       └── telemetry.js      # Live telemetry canvas & interactive demo engine
├── docs/
│   └── ARCHITECTURE.md       # Detailed technical pipeline and testbed specs
├── index.html                # Platform landing page & live telemetry console
├── CNAME                     # Domain pointer (wvamosslabs.me)
├── LICENSE                   # MIT License
└── README.md                 # Project documentation
```

---

## 📬 Contact & Inquiries

- Founder: Ghori Ghuraishi Mulyadi
- Email: [founder@wvamosslabs.me](mailto:founder@wvamosslabs.me)
- Platform: [https://wvamosslabs.me](https://wvamosslabs.me)
