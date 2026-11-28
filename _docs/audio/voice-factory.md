## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **VoiceFactory** | [src/audio/voice-factory.ts](/src/audio/voice-factory.ts) |

This component is responsible for synthesizing and managing various types of synthesized audio voices—including standard oscillators, noise generators, and sampled sounds—within an audio processing graph. Its primary responsibility is to translate high-level musical parameters (like note frequency, duration, and modulation settings) into concrete, time-scheduled audio events using the Web Audio API.

It acts as a core audio synthesis service within the application's sound engine. It interfaces with the `AudioCache` to retrieve samples and routes the resulting audio signals through a configurable processing chain, which includes effects like reverb and delay, before sending them to a final `routingDestination`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `VoiceTriggerOptions` | Interface | Defines optional parameters for voice triggering, such as volume, panning, cutoff frequency, and various modulation mixes (reverb, delay, distortion, chorus). |
| `VoiceFactory` | Class | Manages the creation and triggering of different types of synthesized voices (oscillator, noise, sampler) based on provided musical data. |
| `triggerSynthVoice` | Method | Creates and schedules an oscillator voice. It supports frequency gliding between two notes and LFO modulation of the oscillator's frequency. |
| `triggerNoiseVoice` | Method | Creates and schedules a continuous white noise buffer source, routing it through the defined audio graph. |
| `triggerSamplerVoice` | Method | Creates and schedules an `AudioBufferSourceNode` using a specific sample ID retrieved from the `AudioCache`, adjusting playback rate based on frequency. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component uses a factory pattern to instantiate specific audio nodes based on the trigger type. A critical internal method, `createSubGraph`, builds a standard processing chain for each voice, incorporating an ADSR-like envelope gain, a BiquadFilter, and a StereoPanner. Parallel sends are managed by `routeParallelSends` to inject signals into external buses (Reverb, Delay, Distortion) if configured.
- **Side Effects:** The code interacts heavily with the Web Audio API (`AudioContext`, `AudioNode` creation, scheduling `start`/`stop` events). It mutates internal state by caching generated white noise buffers (`noiseBuffer`) and distortion curves (`distortionCurves`).
- **Error Handling:** The code relies on the presence of necessary buses (`reverbBus`, `delayBus`) being provided in the constructor. If a mix parameter (e.g., `reverbMix`) is zero or undefined, the corresponding parallel send logic is skipped gracefully.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None (Relies on browser Web Audio API objects like `AudioContext`, `OscillatorNode`, `GainNode`, etc.).
- **Internal:** [AudioCache](/src/audio/audio-cache.ts)