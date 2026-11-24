import { Mouse, Keybord, GamepadManager, Pointer } from "../core";
import { Engine } from "../engine";

export class EngineEventManager {
  private engine: Engine;
  private canvas: HTMLCanvasElement;

  constructor(engine: Engine, canvas: HTMLCanvasElement) {
    this.engine = engine;
    this.canvas = canvas;
  }

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
    // Touch, pen and mouse as pointers (Pointer); no browser scrolling or zooming on the canvas.
    this.canvas.style.touchAction = 'none';
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerUp);

    // Global event listeners
    document.addEventListener(
      'visibilitychange',
      this.onEngineVisibilityChange,
    );
    window.addEventListener('focus', this.onEngineWindowFocus);
    window.addEventListener('blur', this.onEngineWindowBlur);
  }

  private pointerXY(event: PointerEvent): [number, number] {
    const rect = this.canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  private onPointerDown = (event: PointerEvent): void => {
    this.canvas.setPointerCapture?.(event.pointerId);
    Pointer._down(event.pointerId, event.pointerType, ...this.pointerXY(event), event.timeStamp);
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!Pointer.active.has(event.pointerId)) return;
    // Coalesced events keep the full path of fast swipes.
    const events = event.getCoalescedEvents?.() ?? [];
    for (const e of events.length ? events : [event]) Pointer._move(event.pointerId, ...this.pointerXY(e), e.timeStamp);
  };

  private onPointerUp = (event: PointerEvent): void => {
    Pointer._up(event.pointerId, ...this.pointerXY(event), event.timeStamp);
  };

  public update(): void {
    Mouse.mouseMovement.x = 0;
    Mouse.mouseMovement.y = 0;
    Mouse.wheelX = 0;
    Mouse.wheelY = 0;
    Keybord.keyUp = {};
    Keybord.keyPress = {};

    GamepadManager.update();
  }

  private onEngineContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
  };

  private onEngineKeyDown = (event: KeyboardEvent): void => {
    Keybord.keyDown[event.key.toLowerCase()] = true;
  };

  private onEngineKeyUp = (event: KeyboardEvent): void => {
    if (Keybord.keyDown[event.key.toLowerCase()]) {
      Keybord.keyUp[event.key.toLowerCase()] = true;
      Keybord.keyPress[event.key.toLowerCase()] = true;
    }
    Keybord.keyDown[event.key.toLowerCase()] = false;
  };

  private onEngineMouseMove = (event: MouseEvent): void => {
    const canvasRect = this.canvas.getBoundingClientRect();
    Mouse.mousePosition.x = Math.max(event.clientX - canvasRect.x, 0);
    Mouse.mousePosition.y = Math.max(event.clientY - canvasRect.y, 0);
    Mouse.mouseMovement.x = event.movementX;
    Mouse.mouseMovement.y = event.movementY;
  };

  private onEngineMouseDown = (event: MouseEvent): void => {
    if (this.engine.isFocused) {
      event.preventDefault();
    }
    Mouse.mouseButtonDown[event.button] = true;
  };

  private onEngineMouseUp = (event: MouseEvent): void => {
    Mouse.mouseButtonDown[event.button] = false;
  };

  private onEngineMouseLeave = (): void => {
    for (const buttonIndex in Mouse.mouseButtonDown) {
      if (Mouse.mouseButtonDown[buttonIndex]) {
        Mouse.mouseButtonDown[buttonIndex] = false;
      }
    }
  };

  private onEngineFocus = (): void => {
    this.engine.isFocused = true;
  };

  private onEngineBlur = (): void => {
    this.engine.isFocused = false;
  };

  private onEngineMouseScroll = (event: WheelEvent): void => {
    if (!this.engine.isFocused) return;
    Mouse.wheelY = event.deltaY;
    Mouse.wheelX = event.deltaX;
  };

  private onEngineVisibilityChange = (): void => {
    this.engine.isTabActive = !document.hidden;
  };

  private onEngineWindowFocus = (): void => {
    this.engine.isWindowFocused = true;
  };

  private onEngineWindowBlur = (): void => {
    this.engine.isWindowFocused = false;
  };
}
