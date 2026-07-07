import { Mouse, Keyboard, GamepadManager } from "../core";
import { Engine } from "../engine";

/**
 * Manages all browser-level input and focus events for the engine.
 * This class attaches listeners to the canvas and window to capture user input
 * and updates the static `Mouse`, `Keyboard`, and `GamepadManager` state classes.
 */
export class EngineEventManager {
  private engine: Engine;
  private canvas: HTMLCanvasElement;

  /**
   * Creates an instance of EngineEventManager.
   * @param engine - The main engine instance.
   * @param canvas - The HTML canvas element to attach listeners to.
   */
  constructor(engine: Engine, canvas: HTMLCanvasElement) {
    this.engine = engine;
    this.canvas = canvas;
  }

  /**
   * Attaches all necessary event listeners to the canvas and window.
   */
  public initialize(): void {
    this.canvas.tabIndex = 0; // Make canvas focusable
    // Canvas-specific event listeners
    this.canvas.addEventListener('contextmenu', this.onEngineContextMenu);
    this.canvas.addEventListener('keydown', this.onEngineKeyDown);
    this.canvas.addEventListener('keyup', this.onEngineKeyUp);
    this.canvas.addEventListener('mousemove', this.onEngineMouseMove);
    this.canvas.addEventListener('mousedown', this.onEngineMouseDown);
    this.canvas.addEventListener('mouseup', this.onEngineMouseUp);
    this.canvas.addEventListener('mouseleave', this.onEngineMouseLeave);
    this.canvas.addEventListener('focus', this.onEngineFocus);
    this.canvas.addEventListener('blur', this.onEngineBlur);
    this.canvas.addEventListener('wheel', this.onEngineMouseScroll);

    // Global event listeners
    document.addEventListener(
      'visibilitychange',
      this.onEngineVisibilityChange,
    );
    window.addEventListener('focus', this.onEngineWindowFocus);
    window.addEventListener('blur', this.onEngineWindowBlur);
  }

  /**
   * Called once per frame to update input states.
   * It resets per-frame data (like mouse movement and key presses) and polls for gamepad state.
   */
  public update(): void {
    Mouse.mouseMovement.x = 0;
    Mouse.mouseMovement.y = 0;
    Mouse.wheelX = 0;
    Mouse.wheelY = 0;
    Keyboard.keyUp = {};
    Keyboard.keyPress = {};

    GamepadManager.update();
  }

  /**
   * Prevents the browser's default context menu from appearing over the canvas.
   * @private
   */
  private onEngineContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
  };

  /**
   * Handles the `keydown` event, updating the `Keyboard.keyDown` state.
   * @private
   */
  private onEngineKeyDown = (event: KeyboardEvent): void => {
    Keyboard.keyDown[event.key.toLowerCase()] = true;
  };

  /**
   * Handles the `keyup` event, updating the `Keyboard.keyUp`, `keyPress`, and `keyDown` states.
   * @private
   */
  private onEngineKeyUp = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    if (Keyboard.keyDown[key]) {
      Keyboard.keyUp[key] = true;
      Keyboard.keyPress[key] = true;
    }
    Keyboard.keyDown[key] = false;
  };

  /**
   * Handles the `mousemove` event, updating the mouse position and movement delta.
   * @private
   */
  private onEngineMouseMove = (event: MouseEvent): void => {
    const canvasRect = this.canvas.getBoundingClientRect();
    Mouse.mousePosition.x = Math.max(event.clientX - canvasRect.x, 0);
    Mouse.mousePosition.y = Math.max(event.clientY - canvasRect.y, 0);
    Mouse.mouseMovement.x = event.movementX;
    Mouse.mouseMovement.y = event.movementY;
  };

  /**
   * Handles the `mousedown` event, updating the mouse button state.
   * @private
   */
  private onEngineMouseDown = (event: MouseEvent): void => {
    if (this.engine.isFocused) {
      event.preventDefault();
    }
    Mouse.mouseButtonDown[event.button] = true;
  };

  /**
   * Handles the `mouseup` event, updating the mouse button state.
   * @private
   */
  private onEngineMouseUp = (event: MouseEvent): void => {
    Mouse.mouseButtonDown[event.button] = false;
  };

  /**
   * Handles the `mouseleave` event, ensuring all mouse buttons are marked as up.
   * @private
   */
  private onEngineMouseLeave = (): void => {
    for (const buttonIndex in Mouse.mouseButtonDown) {
      if (Mouse.mouseButtonDown[buttonIndex]) {
        Mouse.mouseButtonDown[buttonIndex] = false;
      }
    }
  };

  /**
   * Handles the `focus` event on the canvas.
   * @private
   */
  private onEngineFocus = (): void => {
    this.engine.isFocused = true;
  };

  /**
   * Handles the `blur` event on the canvas.
   * @private
   */
  private onEngineBlur = (): void => {
    this.engine.isFocused = false;
  };

  /**
   * Handles the `wheel` event, updating the mouse scroll delta.
   * @private
   */
  private onEngineMouseScroll = (event: WheelEvent): void => {
    if (!this.engine.isFocused) return;
    Mouse.wheelY = event.deltaY;
    Mouse.wheelX = event.deltaX;
  };

  /**
   * Handles the `visibilitychange` event for the document, tracking if the tab is active.
   * @private
   */
  private onEngineVisibilityChange = (): void => {
    this.engine.isTabActive = !document.hidden;
  };

  /**
   * Handles the `focus` event on the window.
   * @private
   */
  private onEngineWindowFocus = (): void => {
    this.engine.isWindowFocused = true;
  };

  /**
   * Handles the `blur` event on the window.
   * @private
   */
  private onEngineWindowBlur = (): void => {
    this.engine.isWindowFocused = false;
  };
}
