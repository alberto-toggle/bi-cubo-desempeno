# Componentes del asistente

- `status-island.tsx`: Kokonut UI / Dorian Baffier, MIT. https://kokonutui.com/r/status-island.json. Se excluye la demo del proveedor.
- `prompt-composer.tsx`: Cult UI. https://cult-ui.com/r/prompt-composer.json. Compositor original con avatar Warp y transiciones, adaptado a los textos del producto.
- `prompt-library.tsx`: Cult UI. https://cult-ui.com/r/prompt-library.json. Biblioteca original; reutiliza el Button Base UI del producto y aísla el resto de sus primitivas en `primitives/` y las consultas se proporcionan desde la funcionalidad del cubo.
- `streamed-response.tsx`: presentación propia por fragmentos con Motion y soporte de movimiento reducido.

Los bloques de producto no importan Playground. La obtención de cifras, permisos y simulación de respuestas permanece en features/services. La animación progresiva no implica una conexión a un modelo de IA.

- `agent-lanes.tsx`: adaptación de AI Agent Lanes, @kokonutui (MIT), https://kokonutui.com/r/ai-agent-lanes.json. Conserva carriles temporales, barras y conectores; avance controlado por el servicio demo, sin reproducción ni datos internos.
- `ai-orb.tsx`: AI Orb, konsstepnov, https://21st.dev/r/konsstepnov/ai-orb. Conserva thinking-orbs, transiciones entre estados y lectura de tokens; etiquetas accesibles en español.
