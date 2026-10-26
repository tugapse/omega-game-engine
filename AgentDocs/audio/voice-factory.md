## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | VoiceFactory |
| Source file | voice-factory.ts |

The **VoiceFactory** serves as the dynamic construction engine for the audio subsystem, responsible for the real-time instantiation and scheduling of complex Web Audio API graphs. It abstracts the mathematical and structural complexity of audio synthesis, sampling, and noise generation into a unified triggering interface.

**Functional Mission**
The primary mission of **VoiceFactory** is to transform high-level musical intent (represented by `VoiceTriggerOptions`) into low-level, time-accurate audio signal chains. It solves the problem of manual Web Audio node management by automatically constructing subgraphs that include envelopes, filters, spatialization, and parallel effect routing (reverb, delay, and distortion) for every individual sound event.

**System Context & Integration**
This component acts as the execution arm of the audio engine. It receives instructions to produce sound and connects the resulting audio nodes to the `routingDestination` (typically a sub-mix bus) and optional global effect buses. It relies heavily on [AudioCache](/AgentDocs/audio/audio-cache.md) to retrieve pre-loaded samples for sampler voices and operates within the temporal context of the `AudioContext` to ensure sample-accurate scheduling.

- **INTERNAL REFERENCES**: [AudioCache](/AgentDocs/audio/audio-cache.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `frequency` (via `VoiceTriggerOptions`)  The target pitch in Hertz.
- `duration` (via `VoiceTriggerOptions`)  Total lifespan of the audio event.
- `startTime` (via `VoiceTriggerOptions`)  The `AudioContext` timeline anchor.
- `volume` (via `VoiceTriggerOptions`)  Peak amplitude scaling.
- `pan` (via `VoiceTriggerOptions`)  Stereo positioning.
- `cutoff` (via `VoiceTriggerOptions`)  Filter frequency threshold.
- `reverbMix` (via `VoiceTriggerOptions`)  Send level to the reverb bus.
- `delayMix` (via `VoiceTriggerOptions`)  Send level to the delay bus.
- `distortionMix` (via `VoiceTriggerOptions`)  Intensity of the wave-shaping effect.
- `glideTime` (via `VoiceTriggerOptions`)  Duration of pitch portamento.
- `lfoRate` (via `VoiceTriggerOptions`)  Frequency of the vibrato LFO.
- `lfoDepth` (via `VoiceTriggerOptions`)  Amplitude of the vibrato LFO.

**Hardcoded Constants:**
- `noiseBuffer` (Default: `null`)  Cached white noise buffer.
- `distortionCurves` (Default: `Map<number, Float32Array>`)  Cache for wave-shaper curves.
- `attack` (Default: `0.005` for noise, `0.02` for synth)  Envelope attack time.
- `release` (Default: `0.1`)  Envelope release time.
- `peakVolume` (Default: `0.8`)  Normalized peak amplitude.
- `n_samples` (Default: `2048`)  Resolution for distortion curve generation.
- `bufferSize` (Default: `sampleRate * 2.0`)  Duration of the white noise buffer.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `VoiceTriggerOptions` | Interface | Defines the configuration schema for triggering any audio voice. |
| `VoiceFactory` | Class | The main orchestrator for creating and routing audio voices. |
| `triggerSynthVoice` | Method | Constructs an `OscillatorNode` with LFO and portamento support. |
| `triggerNoiseVoice` | Method | Generates a white noise burst using a cached `AudioBuffer`. |
| `triggerSamplerVoice` | Method | Plays a sample from `AudioCache` with frequency-based playback rate scaling. |
| `createSubGraph` | Method | (Private) Builds the standard processing chain: Envelope $\rightarrow$ Filter $\rightarrow$ Panner. |
| `routeParallelSends` | Method | (Private) Manages signal routing to reverb, delay, and distortion nodes. |
| `getWhiteNoiseBuffer` | Method | (Private) Generates or retrieves the singleton white noise `AudioBuffer`. |
| `makeDistortionCurve` | Method | (Private) Calculates and caches `Float32Array` curves for `WaveShaperNode`. |

## 4. Execution Logic & Flow
- **Initialization**: The factory is instantiated with an `AudioContext`, an `AudioCache` instance, a primary `routingDestination`, and optional `reverbBus` and `delayBus` nodes. It initializes an empty map for distortion curve caching and a null reference for the noise buffer.
- **Data Path**: 
    1. **Input**: A voice type (Synth, Noise, or Sampler) and `VoiceTriggerOptions`.
    2. **Processing**: 
        - **Source Generation**: Oscillator, BufferSource (Noise), or BufferSource (Sampler) is created.
        - **Sub-Graph Construction**: An envelope (GainNode) is scheduled, a BiquadFilter is configured (High-pass for noise, Low-pass for others), and a StereoPanner is applied.
        - **Effect Routing**: Signal is branched to parallel `GainNodes` for Reverb/Delay or a `WaveShaperNode` for Distortion.
    3. **Output**: The completed graph is connected to the `routingDestination` and scheduled to start/stop at specific `AudioContext` times.
- **Conditional Branching**:
    - **Portamento**: If `glideTime > 0`, the frequency uses `exponentialRampToValueAtTime` from `prevFrequency` to `note.frequency`.
    - **LFO**: If `lfoDepth > 0`, a secondary oscillator/gain chain is created to modulate the primary oscillator's frequency.
    - **Noise Filtering**: If `isNoise` is true, the filter type switches to `highpass` and the Q factor is adjusted.
    - **Distortion Caching**: `makeDistortionCurve` checks the `distortionCurves` map before performing mathematical calculations.

## 5. Resource Dependencies
- **Standard Libraries**: `Map`
- **Internal Modules**: 
    - [AudioCache](/AgentDocs/audio/audio-cache.md)
- **External Packages**: Web Audio API (`AudioContext`, `AudioNode`, `OscillatorNode`, `AudioBufferSourceNode`, `GainNode`, `BiquadFilterNode`, `StereoPannerNode`, `WaveShaperNode`)