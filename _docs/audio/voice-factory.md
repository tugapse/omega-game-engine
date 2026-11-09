## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| VoiceFactory | audio/voice-factory.md |

This component is responsible for the dynamic creation and scheduling of various audio "voices" within the application. A voice represents a single, transient sound eventbe it a synthesized note, a sampled sound, or a burst of noise. Its primary responsibility is to construct the necessary Web Audio API graph for that specific sound, manage its lifecycle (start, duration, stop), and route it through the defined processing chain.

The `VoiceFactory` acts as a core service layer within the audio engine architecture. It abstracts the complexity of the Web Audio API graph construction, allowing higher-level components to simply request a sound trigger using a `VoiceTriggerOptions` object. It relies on the [AudioCache](/audio/audio-cache.md) for sample retrieval and routes all generated sounds to a specified [AudioNode](/audio/voice-factory.md) destination, while also managing parallel sends to global effects buses like reverb and delay.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| VoiceTriggerOptions | Interface | Defines parameters for triggering an audio voice, including frequency, duration, volume, and effect mix levels. |
| VoiceFactory | Class | Manages the creation and scheduling of audio voices. |
| triggerSynthVoice | Method | Creates and schedules a synthesizer voice using an `OscillatorNode`, supporting pitch glide and LFO vibrato. |
| triggerNoiseVoice | Method | Creates and schedules a white noise voice, suitable for percussion or ambient effects. |
| triggerSamplerVoice | Method | Creates and schedules a voice by playing back a specific sample from the [AudioCache](/audio/audio-cache.md), automatically adjusting playback rate for pitch shifting. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The factory uses `createSubGraph` to build a standardized processing chain for every voice, which includes an envelope generator (ADSR-like behavior), a BiquadFilter, and a StereoPanner. Synthesis and sampling methods then connect their respective sound sources (Oscillator, BufferSource) into this standardized graph. Parallel routing logic handles sending signals to optional reverb and delay buses, and applies distortion via a `WaveShaperNode` if configured.
- **Side Effects:** Mutates the internal state by caching generated white noise buffers and distortion curves. It interacts heavily with the external `AudioContext` to schedule and manipulate audio nodes.
- **Error Handling:** The component relies on the caller to provide valid parameters. Fallback mechanisms are implemented for optional parameters (e.g., using default cutoff frequencies or volume levels if `VoiceTriggerOptions` are missing).

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** Web Audio API (AudioContext, AudioNode, etc.)
- **Internal:** [AudioCache](/audio/audio-cache.md)