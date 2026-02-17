# Antigravity - Interactive Physics Simulation

[🇪🇸 Versión en Español abajo](#simulación-de-física-antigravedad)

## Overview
**Antigravity** is an interactive web-based physics simulation built with **Matter.js** and **TypeScript**. It offers a playful sandbox environment where users can experiment with gravity, time, and forces in a visually immersive "Cyberpunk/Neon" interface.

The project demonstrates high-performance 2D rigid body physics rendering in a modern browser environment without heavy game engines.

## Key Features
- **Gravity Control**: Manipulate gravity in both X and Y axes. Invert gravity to make objects float up or create "wind" effects.
- **Time Dilation**: A "Time Scale" slider allows you to slow down the simulation (Matrix-style bullet time) or speed it up.
- **Interactive Physics**:
  - **Drag & Drop**: Grab any object with your mouse and throw it.
  - **Attractor Mode**: Objects are magnetically pulled towards your mouse cursor.
  - **Pulse Explosion**: One-click radial explosion to scatter objects.
- **Material Properties**: Adjust the *bounciness* (restitution) and *air friction* of objects in real-time.
- **Modern UI**: A glassmorphism-styled "Head-Up Display" (HUD) for controlling the simulation.

## Architecture & Technology
The project is built using a lightweight technology stack focused on performance and clean code.

### Tech Stack
- **Vite**: Ultra-fast build tool and dev server.
- **TypeScript**: For type-safe code and better maintainability.
- **Matter.js**: A 2D rigid body physics engine for the web.

### How it Works
1.  **Physics Engine (`Engine`)**: The core brain. It calculates collisions, forces, and movements for all bodies (rectangles, circles, polygons) 60 times per second.
2.  **Renderer (`Render`)**: Draws the calculated state of the objects onto an HTML5 Canvas. We use a custom transparency trick to create motion trails.
3.  **World State**: The "World" acts as a container for all physical bodies. Using the Composite pattern, we manage walls, mouse constraints, and dynamic shapes.
4.  **Event Loop**: We hook into the `beforeUpdate` event of the physics engine to apply custom logic like the "Attractor" force, which manually applies vector forces to objects based on the mouse position.

---

# Simulación de Física Antigravedad

## Descripción General
**Antigravedad** es una simulación de física interactiva basada en la web, construida con **Matter.js** y **TypeScript**. Ofrece un entorno "sandbox" donde los usuarios pueden experimentar con la gravedad, el tiempo y las fuerzas en una interfaz visual inmersiva de estilo "Cyberpunk/Neón".

Este proyecto demuestra la renderización de física de cuerpos rígidos en 2D de alto rendimiento en navegadores modernos, sin necesidad de motores de juego pesados.

## Características Principales
- **Control de Gravedad**: Manipula la gravedad en los ejes X e Y. Invierte la gravedad para que los objetos floten hacia arriba o crea efectos de "viento".
- **Dilatación del Tiempo**: Un control deslizante de "Escala de Tiempo" te permite ralentizar la simulación (estilo Matrix) o acelerarla.
- **Física Interactiva**:
  - **Arrastrar y Soltar**: Agarra cualquier objeto con el mouse y lánzalo.
  - **Modo Atractor**: Los objetos son atraídos magnéticamente hacia el cursor del mouse.
  - **Pulso de Explosión**: Una explosión radial de un clic para dispersar los objetos.
- **Propiedades Materiales**: Ajusta el *rebote* (restitución) y la *fricción del aire* de los objetos en tiempo real.
- **Interfaz Moderna**: Un panel de control estilo "HUD" (Head-Up Display) con efecto de vidrio esmerilado (glassmorphism).

## Arquitectura y Tecnología
El proyecto está construido utilizando un stack tecnológico ligero enfocado en el rendimiento y código limpio.

### Tecnologías
- **Vite**: Herramienta de construcción y servidor de desarrollo ultra rápido.
- **TypeScript**: Para un código seguro y fácil de mantener.
- **Matter.js**: Un motor de física de cuerpos rígidos 2D para la web.

### Cómo Funciona
1.  **Motor de Física (`Engine`)**: El cerebro central. Calcula colisiones, fuerzas y movimientos para todos los cuerpos (rectángulos, círculos, polígonos) 60 veces por segundo.
2.  **Renderizador (`Render`)**: Dibuja el estado calculado de los objetos en un Canvas HTML5.
3.  **Estado del Mundo**: El "Mundo" actúa como un contenedor para todos los cuerpos físicos. Usando el patrón Composite, gestionamos paredes, restricciones del mouse y formas dinámicas.
4.  **Bucle de Eventos**: Nos conectamos al evento `beforeUpdate` del motor de física para aplicar lógica personalizada como la fuerza de "Atractor", que aplica vectorialmente fuerzas a los objetos basándose en la posición del mouse.
