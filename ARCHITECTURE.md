# avrySPhere Architecture Deep-Dive

## System Overview

avrySPhere is a **Single Page OS (SPOS)**. It mimics the behavior of a traditional kernel by using a central event/state bus to manage resources (windows, memory/state, and identity).

---

## 1. Data Flow: Identity Synthesis

Identity in avrySPhere is decoupled from the hardware.

```text
[Auth Screen] -> [Auth Store] -> [User Store] (Verify)
                      |
                      +--> [Window Store] (Load Session userId:orgId)
                      |
                      +--> [OS Store] (Apply User Theme/Accent)
```

### Persistence Strategy

We use `zustand/middleware/persist` with a custom `createJSONStorage`. This ensures that even if the tab is closed, the "Synthesis" (user context) and "Active Modalities" (open windows) are restored exactly as they were.

---

## 2. Rendering Mechanism: Window Families

To support complex workflows, avrySPhere implements **Window Families**.

- **Root Windows**: Standard applications.
- **Child Windows**: Modals or sub-tasks (e.g., File Properties).
- **Logic**: If a parent window is closed, the `useWindowStore` recursively closes all descendants to prevent "zombie" processes.

---

## 3. UI/UX: The Glassmorphic Shell

The aesthetic is driven by a combination of:

- **Tailwind CSS**: Utilizing `backdrop-blur-3xl` and custom gradients.
- **Mica Material Simulation**: Transparent panels that tint based on the underlying wallpaper (Desktop Layout).
- **Motion**: Framer Motion inspired CSS transitions for window opening/closing and workspace sliding.

---

## 4. Neural Link (AI) Integration

Avry AI is not a standalone chatbot but a system-integrated agent.

### Context Awareness

The AI is provided with a system context that identifies it as the owner of the OS. Future implementations allow the AI to call tools (via Function Calling) to manipulate the OS state (e.g., "Change my wallpaper to something dark").

### API Key Security

The API key is injected via `process.env.API_KEY`. The `GeminiService` creates a fresh instance of the client for every stream request to ensure that updated environmental keys or session tokens are always utilized.

---

## 5. Sphere Transitions

Transitions between layout modes (Spheres) are handled by `SphereSpace.tsx`.

| Mode        | Trigger             | Focus                              |
| :---------- | :------------------ | :--------------------------------- |
| **Desktop** | Viewport > 1024px   | Multi-tasking, Windowing           |
| **Tablet**  | Viewport 768-1024px | Hybrid, Touch-optimized grid       |
| **Mobile**  | Viewport < 768px    | Single-tasking, Gestures           |
| **Gaming**  | Manual Switch       | Content-first, Controller-friendly |
| **TV**      | Manual Switch       | Distance-viewing, Simple Nav       |

---

_Architectural design by avrySPhere Core._
