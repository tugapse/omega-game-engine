## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **AudioEngine** | [src/audio/audio-engine.ts](/src/audio/audio-engine.ts) |

This component serves as the core Web Audio Engine, responsible for constructing and managing the entire audio processing graph. Its primary responsibility is to handle the master output chain, manage routing between various sub-mix groups (synth, SFX, music), and integrate global effects return buses like reverb and delay. It ensures that the audio context is initialized correctly, respecting latency hints and sample rate configurations.

This class acts as a central service within the application's audio subsystem. It encapsulates the complex topology of the Web Audio API, providing controlled access points (getters and setters) for other parts of the application to route signals or modify global parameters without needing direct access to the underlying `AudioContext` nodes.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `AudioEngineConfig` | Interface | Defines configuration parameters for the `AudioEngine`, including optional `sampleRate` and `latencyHint`. |
| `AudioEngine` | Class | Manages the entire audio graph. Provides methods to initialize, suspend, resume the context, and access routing nodes. |
| `initialize()` | Method | Asynchronously resumes the `AudioContext` if it is currently suspended, typically required after a user gesture. |
| `suspend()` | Method | Asynchronously suspends the audio context thread to conserve system resources. |
| `resume()` | Method | Asynchronously resumes a suspended audio context thread. |
| `getContext()` | Method | Returns the underlying `AudioContext` instance. |
| `getAnalyser()` | Method | Returns the `AnalyserNode` used for frequency/time domain analysis of the master output. |
| `getSynthBus()` | Method | Returns the `GainNode` for the synthesizer sub-mix group. |
| `getSfxBus()` | Method | Returns the `GainNode` for the sound effects sub-mix group. |
| `getMusicBus()` | Method | Returns the `GainNode` for the music sub-mix group. |
| `getReverbBus()` | Method | Returns the `ConvolverNode` used for the reverb return bus. |
| `getDelayBus()` | Method | Returns the `DelayNode` used for the delay return bus. |
| `setMasterVolume(value: number)` | Method | Sets the gain value of the master volume control, clamping the input between 0 and 1. |
| `setBusVolume(category: 'synth' | 'sfx' | 'music', value: number)` | Method | Sets the gain for a specific sub-mix bus, clamping the input between 0 and 2. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The engine constructs three distinct graph sections: the Master Chain (Gain -> Compressor -> Analyser -> Destination), the Sub-Mix Buses (isolated Gain nodes routing to the Master Chain), and the FX Return Buses (parallel chains connected to the Master Chain). The `generateSyntheticImpulseResponse` method procedurally creates an impulse response buffer for the reverb unit based on specified duration and decay parameters.
- **Side Effects:** Mutates the global state of the browser's `AudioContext` (suspending/resuming it) and constructs internal graph topology by creating and connecting numerous Web Audio API nodes.
- **Error Handling:** The constructor uses a fallback mechanism (`window.AudioContext || (window as any).webkitAudioContext`) to ensure compatibility across different browser implementations. The `setMasterVolume` and `setBusVolume` methods enforce bounds checking (`Math.max(0, Math.min(1, value))` or `Math.max(0, Math.min(2, value))`) to prevent invalid gain values.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `AudioContext`, `GainNode`, `DynamicsCompressorNode`, `AnalyserNode`, `ConvolverNode`, `DelayNode`, `AudioBuffer`, `AudioContextOptions` (All are Web Audio API interfaces/types).
- **Internal:** None.