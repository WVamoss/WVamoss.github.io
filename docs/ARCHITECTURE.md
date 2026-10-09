# Resource-Aware Edge Intelligence Framework (RAEIF)

## Architecture Overview

RAEIF is a high-throughput, resource-constrained anomaly detection and cognitive diagnostics framework designed for edge systems (specifically Raspberry Pi 4 Model B / ARM64).

```
+-------------------------------------------------------------------+
|                        PHYSICAL EDGE TIER                         |
|                                                                   |
|  [pH Sensor]   [EC Sensor]   [Water Temp]   [Dissolved Oxygen]    |
|       |             |              |                |             |
|       +-------------+--------------+----------------+             |
|                            | (1.0 Hz Sliding Window)              |
|                            v                                      |
|                 [ Circular Buffer (RAM) ]                         |
|                            |                                      |
|                            v                                      |
|         [ Simple Additive Weighting (SAW) Gate ]                  |
|          Weights: Latency: 0.35 | F1: 0.25 | Cost: 0.40           |
|                            |                                      |
|         +------------------+------------------+                   |
|         |                  |                  |                   |
|         v                  v                  v                   |
|     [SNN 32-16]       [CAE 16-8-16]     [iForest 100t]            |
|       (18.4ms)           (46.2ms)           (84.0ms)              |
+----------------------------+--------------------------------------+
                             | Anomaly Gate Breach (F1 >= 0.80)
                             v
+-------------------------------------------------------------------+
|                     COGNITIVE REASONING TIER                      |
|                                                                   |
|                [ Anthropic Claude 3.5 Sonnet ]                    |
|           • Prompt Caching on Baseline Telemetry                  |
|           • Tool Use: Actuator Relays & Root-Cause                |
|                            |                                      |
|                            v                                      |
|             [ Automated Physical Actuation Dispatch ]             |
+-------------------------------------------------------------------+
```

## Hardware Testbed Specification

- **SBC:** Raspberry Pi 4 Model B (Rev 1.4)
- **SoC:** Broadcom BCM2711 Quad-core Cortex-A72 (ARM v8) 64-bit SoC @ 1.5GHz
- **RAM:** 4GB LPDDR4-3200 SDRAM
- **OS:** Raspberry Pi OS 64-bit (Debian 12 Bookworm, Linux kernel 6.6)
- **Edge Inference Runtime:** Python 3.11 / NumPy / ONNX Runtime ARM64
