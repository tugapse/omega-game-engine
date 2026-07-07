/**
 * A static class for managing mouse input state.
 * It tracks button presses, cursor position, and movement deltas.
 */
export class Mouse {
  /**
   * A map that stores the pressed state of each mouse button.
   * `true` if the button is currently held down, `false` otherwise.
   * @type {{ [key: string]: boolean }}
   */
  public static mouseButtonDown: { [key: string]: boolean } = {};
  /**
   * The position of the mouse cursor when a button was last pressed.
   * @type {{ x: number, y: number }}
   */
  public static mouseClickPosition: { x: number; y: number } = { x: 0, y: 0 };
  /**
   * The current position of the mouse cursor relative to the viewport.
   * @type {{ x: number, y: number }}
   */
  public static mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  /**
   * The movement delta of the mouse since the last frame.
   * @type {{ x: number, y: number }}
   */
  public static mouseMovement: { x: number; y: number } = { x: 0, y: 0 };
  /**
   * The movement delta of the mouse wheel on the X-axis since the last frame.
   * @type {number}
   */
  public static wheelX = 0;
  /**
   * The movement delta of the mouse wheel on the Y-axis since the last frame.
   * @type {number}
   */
  public static wheelY = 0;

  /**
   * Gets the current mouse position relative to the canvas.
   * @returns A copy of the object with x and y coordinates.
   */
  public static getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition }; // Return a copy to prevent external modification
  }

  /**
   * Gets the mouse movement delta since the last frame.
   * @returns A copy of the object with x and y movement deltas.
   */
  public static getMouseMovement(): { x: number; y: number } {
    return { ...this.mouseMovement }; // Return a copy
  }

  /**
   * Checks if a specific mouse button is currently held down.
   * @param button - The mouse button to check (0 for left, 1 for middle, 2 for right).
   * @returns `true` if the button is down, `false` otherwise.
   */
  public static isMouseButtonDown(button: number): boolean {
    return this.mouseButtonDown[button] === true;
  }

  /**
   * Gets the mouse wheel scroll delta since the last frame.
   * @returns A copy of the object with x and y scroll deltas.
   */
  public static getMouseWheelDelta(): { x: number; y: number } {
    return { x: this.wheelX, y: this.wheelY }; // Return a copy
  }
}

/**
 * A static class for managing keyboard input state.
 * It tracks the pressed, down, and up states of each key.
 */
export class Keyboard {
  /**
   * A map that stores which keys are currently held down.
   * This state persists as long as the key is held.
   * @type {{ [key: string]: boolean }}
   */
  public static keyDown: { [key: string]: boolean } = {};
  /**
   * A map that stores which keys were released in the current frame.
   * This is a single-frame event.
   * @type {{ [key: string]: boolean }}
   */
  public static keyUp: { [key: string]: boolean } = {};
  /**
   * A map that stores which keys were pressed down in the current frame.
   * This is a single-frame event.
   * @type {{ [key: string]: boolean }}
   */
  public static keyPress: { [key: string]: boolean } = {};

  /**
   * Checks if a key is currently held down.
   * @param key - The key to check (e.g., 'w', 'a', 'shift'). Case-insensitive.
   * @returns `true` if the key is currently held down, `false` otherwise.
   */
  public static isKeyDown(key: string): boolean {
    return this.keyDown[key.toLowerCase()] === true;
  }

  /**
   * Checks if a key was pressed down in the current frame.
   * @param key - The key to check. Case-insensitive.
   * @returns `true` if the key was pressed in this frame, `false` otherwise.
   */
  public static isKeyPressed(key: string): boolean {
    return this.keyPress[key.toLowerCase()] === true;
  }

  /**
   * Checks if a key was released in the current frame.
   * @param key - The key to check. Case-insensitive.
   * @returns `true` if the key was released in this frame, `false` otherwise.
   */
  public static isKeyReleased(key: string): boolean {
    return this.keyUp[key.toLowerCase()] === true;
  }
}

/**
 * A static class for managing gamepad input state.
 */
export class GamepadManager {
  private static _gamepads: (Gamepad | null)[] = [];

  /**
   * Gets an array of all currently connected gamepads.
   * @returns An array of `Gamepad` objects, which may contain `null` entries for disconnected pads.
   */
  public static get gamepads(): (Gamepad | null)[] {
    return this._gamepads;
  }

  /**
   * Updates the internal list of gamepads. This should be called once per frame
   * to poll for the latest gamepad states.
   */
  public static update(): void {
    this._gamepads = Array.from(navigator.getGamepads());
  }
}

/**
 * Resets all single-frame input states.
 * This should be called at the end of each frame to correctly handle
 * "pressed" and "released" events for the next frame.
 */
export function cleanLastFrame() {
  Mouse.mouseMovement.x = 0;
  Mouse.mouseMovement.y = 0;
  Mouse.wheelX = 0;
  Mouse.wheelY = 0;
  Keyboard.keyUp = {};
  Keyboard.keyPress = {};
}
