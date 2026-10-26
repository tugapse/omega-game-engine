## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AudioEngine |
| Source file | audio-engine.ts |

The **AudioEngine** serves as the foundational sound processing backbone of the Omega engine. It is responsible for managing the lifecycle of the Web Audio API `AudioContext` and constructing a complex, permanent routing topology that governs how all digital signals are processed, mixed, and ultimately output to the hardware.

**Functional Mission**
The primary mission of the **AudioEngine** is to provide a centralized, high-performance audio routing graph. It solves the problem of signal management by implementing a hierarchical structure consisting of a master output chain, categorized sub-mix buses (Synth, SFX, Music), and global parallel effect return buses (Reverb, Delay). This ensures that all audio components have a predictable destination for their signals and a unified way to control global volume and dynamics.

**System Context & Integration**
As a core service, the **AudioEngine** acts as the terminal destination for all sound-producing entities within the engine. While it does not generate individual sounds itself, it provides the routing infrastructure that downstream modules, such as [voice-factory](/AgentDocs/audio/voice-factory.md), must utilize to inject audio into the system. It manages the transition from raw audio buffers to a processed, compressed, and analyzed signal stream, providing an `AnalyserNode` for real-time visualization and a master gain stage for global volume control.

- **INTERNAL REFERENCES**: [voice-factory](/AgentDocs/audio/voice-factory.md), [audio-engine.md](/AgentDocs/audio/audio-engine.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `sampleRate` (via `AudioEngineConfig`)  Sets the hardware sample rate for the `AudioContext`.
- `latencyHint` (via `AudioEngineConfig`)  Provides a hint to the browser regarding desired audio latency (e.g., 'interactive').

**Hardcoded Constants:**
- `masterVolumeNode.gain` (Default: `0.8`)  Initial master output level.
- `dynamicsCompressor.threshold` (Default: `-12`)  Threshold for the master compressor in dB.
- `dynamicsCompressor.knee` (Default: `30`)  Knee width for the master compressor.
- `dynamicsCompressor.ratio` (Default: `12`)  Compression ratio for the master compressor.
- `dynamicsCompressor.attack` (Default: `0.003`)  Attack time for the master compressor in seconds.
- `dynamicsCompressor.release` (Default: `0.25`)  Release time for the master compressor in seconds.
- `masterAnalyser.fftSize` (Default: `1024`)  Fast Fourier Transform size for visualization.
- `delayReturnBus.delayTime` (Default: `0.25`)  Initial delay time in seconds.
- `delayFeedbackGain.gain` (Default: `0.4`)  Initial feedback coefficient for the delay loop.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `AudioEngineConfig` | Interface | Configuration schema for initializing the `AudioContext`. |
| `AudioEngine` | Class | The central controller for the Web Audio graph and routing. |
| `initialize()` | Method | Resumes the `AudioContext` from a suspended state (requires user gesture). |
| `suspend()` | Method | Suspends the audio thread to conserve system resources. |
| `resume()` | Method | Resumes a suspended audio thread. |
| `getContext()` | Method | Returns the underlying `AudioContext` instance. |
| `getAnalyser()` | Method | Returns the master `AnalyserNode` for signal visualization. |
| `getSynthBus()` | Method | Returns the `GainNode` dedicated to synthesizer routing. |
| `getSfxBus()` | Method | Returns the `GainNode` dedicated to sound effect routing. |
| `getMusicBus()` | Method | Returns the `GainNode` dedicated to music routing. |
| `getReverbBus()` | Method | Returns the `ConvolverNode` for global reverb sends. |
| `getDelayBus()` | Method | Returns the `DelayNode` for global delay sends. |
| `setMasterVolume(value)` | Method | Updates the master gain level (clamped 0.0 - 1.0). |
| `setBusVolume(category, value)` | Method | Updates specific sub-mix gain levels (clamped 0.0 - 2.0). |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The constructor receives `AudioEngineConfig`.
    2. An `AudioContext` is instantiated (often in a `suspended` state).
    3. `buildMasterGraph()` is called to create the Master Gain $\rightarrow$ Compressor $\rightarrow$ Analyser $\rightarrow$ Destination chain.
    4. `buildFXReturnBuses()` is called to create the Reverb (via synthetic impulse) and Delay (via feedback loop) parallel chains.
    5. `buildSubMixBuses()` is called to create the Synth, SFX, and Music summing nodes.
- **Data Path**: 
    - **Input**: Audio signals from external sources (e.g., voices).
    - **Processing**: Signals route through Sub-mix Buses $\rightarrow$ Master Volume $\rightarrow$ Dynamics Compressor $\rightarrow$ Analyser.
    - **Parallel Processing**: Signals can be sent to `reverbReturnBus` or `delayReturnBus` before hitting the Master chain.
    - **Output**: Final signal is sent to `ctx.destination`.
- **Conditional Branching**:
    - `initialize()`/`resume()`/`suspend()`: Checks `ctx.state` before attempting state transitions to prevent redundant calls.
    - `setBusVolume()`: Uses ternary logic to select the appropriate `GainNode` based on the provided category string.

## 5. Resource Dependencies
- **Standard Libraries**: `window` (Web API)
- **Internal Modules**: 
    - No direct imports found in the provided source; however, it is part of the [audio](/AgentDocs/audio/index.md) subsystem.
- **External Packages**: Web Audio API (`AudioContext`, `GainNode`, `DynamicsCompressorNode`, `AnalyserNode`, `ConvolverNode`, `DelayNode`)