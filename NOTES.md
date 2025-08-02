# System Diagram for examples/main.js

This diagram illustrates the architecture of the MuJoCo WASM example viewer.

```mermaid
graph TD
    subgraph "User"
        MouseInput[Mouse Input]
        GUIInput[GUI Controls]
    end

    subgraph "Application Logic (main.js)"
        Demo[MuJoCoDemo Class]
        DragManager[DragStateManager]
        OrbitCtrl[OrbitControls]
        Utils[mujocoUtils.js]
    end

    subgraph "Core Libraries"
        ThreeJS[THREE.js Engine]
        Mujoco[MuJoCo Wasm Engine]
        LilGUI[lil-gui]
    end

    subgraph "Browser"
        Canvas[HTML Canvas]
    end

    %% Initialization Flow
    Start[Page Load] -->|"await load_mujoco()"| Mujoco
    Start -->|"new MuJoCoDemo()"| Demo
    Demo -->|"init()"| Utils
    Utils -->|"loadSceneFromURL()"| ThreeJS
    Demo -->|"setupGUI()"| LilGUI

    %% User Interaction Flow
    MouseInput -->|Camera Control| OrbitCtrl
    MouseInput -->|Object Dragging| DragManager
    GUIInput -->|Adjust Parameters| LilGUI
    LilGUI -->|Update sim params| Demo

    %% Render Loop (executed by Demo.render)
    subgraph "Animation Loop"
        direction LR
        LoopStart(Render Loop Start) --> Physics
        Physics --> Graphics
        Graphics --> LoopEnd(End Frame)
    end

    %% Detailed Flows within Loop
    OrbitCtrl -- "camera.update()" --> LoopStart
    DragManager -- "force data" --> Physics
    Demo -- "simulation.step()" --> Mujoco
    Mujoco -- "Updated Physics State" --> Graphics
    Demo -- "Update THREE.js transforms" --> ThreeJS
    ThreeJS -- "renderer.render()" --> Canvas
```

### Diagram Explanation

This diagram shows:
1.  **Initialization**: How the main components (`MuJoCoDemo`, `MuJoCo Wasm`, `THREE.js`) are loaded and set up when the page loads.
2.  **User Interaction**: How mouse and GUI inputs are handled by `OrbitControls`, `DragStateManager`, and `lil-gui`, which in turn communicate with the main `MuJoCoDemo` class.
3.  **Render Loop**: The core animation loop that continuously runs, divided into a physics update step and a graphics update step.
    - The **Physics** step takes user input (like dragging forces), advances the `MuJoCo` simulation via `simulation.step()`, and produces a new physical state for all objects.
    - The **Graphics** step takes the new state from the physics simulation, updates the positions and rotations of the corresponding `THREE.js` objects, and finally renders the visual scene to the HTML canvas.
