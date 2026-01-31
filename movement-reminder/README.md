# 🧘 Pausa Activa - Recordatorio de Movimiento

Una aplicación web simple y elegante que te recuerda tomar pausas activas de 5 minutos cada 40 minutos de trabajo.

## ✨ Características

- **Temporizador de 40 minutos**: Contador visible que rastrea tu tiempo sentado
- **Pausas activas de 5 minutos**: Interrupciones suaves con ejercicios guiados
- **Ejercicios aleatorios**: Cada pausa incluye 3-4 ejercicios seleccionados aleatoriamente
- **Recordatorios mentales**: Siempre incluye descanso visual y cambio de postura
- **Persistencia de estado**: Continúa donde lo dejaste incluso si recargas la página
- **Diseño minimalista**: Interfaz calmada con colores suaves y animaciones sutiles

## 🎯 Ejercicios Incluidos

- Sentadillas (10–15)
- Estocadas o subir/bajar escalones
- Rotaciones de cuello y hombros
- Abrir el pecho (entrelazar manos atrás y estirar)
- Flexiones de tobillos y caderas

**Plus mental** (siempre incluido):
- Mirar algo lejos durante 20–30 segundos
- Cambiar de postura un rato (parado o apoyado)

## 🚀 Cómo Usar

### Ejecutar Localmente

1. **Abre el archivo HTML**:
   - Navega a la carpeta `movement-reminder`
   - Haz doble clic en `index.html`
   - O arrastra el archivo a tu navegador

2. **Inicia el temporizador**:
   - Haz clic en el botón "Iniciar"
   - El temporizador comenzará a contar desde 40:00

3. **Toma tu pausa**:
   - Cuando llegue a 0:00, aparecerá un modal con tu rutina
   - Sigue los ejercicios marcándolos como completados
   - El temporizador de pausa cuenta 5 minutos

4. **Termina la pausa**:
   - Espera a que termine el temporizador de 5 minutos
   - O haz clic en "Terminé antes" si finalizas más rápido
   - El ciclo se reinicia automáticamente

### Controles

- **Iniciar**: Comienza el temporizador de trabajo
- **Pausar**: Pausa el temporizador actual
- **Reiniciar**: Reinicia el temporizador a 40 minutos

## 📁 Estructura del Proyecto

```
movement-reminder/
├── index.html      # Estructura HTML principal
├── style.css       # Estilos y diseño visual
├── app.js          # Lógica de la aplicación
└── README.md       # Este archivo
```

## 🛠️ Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con glassmorphism y gradientes
- **JavaScript (Vanilla)**: Lógica de temporizadores y persistencia
- **localStorage**: Guarda el estado entre sesiones

## 💾 Persistencia de Estado

La aplicación guarda automáticamente:
- Tiempo restante
- Modo actual (trabajo/pausa)
- Estado del temporizador (corriendo/pausado)
- Ejercicios seleccionados para la pausa actual

Esto significa que puedes:
- Cerrar y reabrir el navegador
- Recargar la página
- Cerrar la pestaña

...y la aplicación continuará exactamente donde la dejaste.

## 🎨 Diseño

El diseño sigue principios de UI/UX modernos:
- **Colores suaves**: Paleta de azules y verdes calmantes
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Animaciones sutiles**: Transiciones suaves y no intrusivas
- **Tipografía clara**: Fuente Inter para máxima legibilidad
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 🔄 Ciclo de Uso

1. Inicias el temporizador (40 minutos)
2. Trabajas mientras el tiempo corre
3. Al llegar a 0, aparece el modal de pausa
4. Realizas 3-4 ejercicios aleatorios + recordatorios mentales
5. Después de 5 minutos (o al hacer clic en "Terminé antes")
6. El ciclo se reinicia automáticamente

## 📝 Notas

- **Sin backend**: Funciona completamente en el navegador
- **Sin dependencias**: No requiere instalación de paquetes
- **Privacidad**: Todos los datos se guardan localmente en tu navegador
- **Ligero**: Menos de 20KB en total

## 🌟 Consejos de Uso

- Mantén la pestaña abierta para que el temporizador funcione
- Usa pantalla completa (F11) para una experiencia más inmersiva
- Personaliza los tiempos editando las constantes en `app.js`:
  - `WORK_TIME`: Tiempo de trabajo en segundos (default: 2400 = 40 min)
  - `BREAK_TIME`: Tiempo de pausa en segundos (default: 300 = 5 min)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y comercial.

---

**¡Cuida tu salud y muévete regularmente! 🏃‍♂️💪**
