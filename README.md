# DKitchen · vídeos desde HTML

Método **HyperFrames** de OpenMontage: cada reel es un `composicion.html` con una línea de tiempo GSAP en pausa (`window.TL`) y una promesa `window.LISTO`. `renderizar.cjs` lo abre en Chrome sin ventana, avanza fotograma a fotograma, captura y codifica con ffmpeg (1080×1920, H.264).

Se renderiza en **GitHub Actions** (el PC de trabajo no tiene memoria para ello): Actions → «Renderizar reel» → carpeta. El MP4 queda como artefacto «reel».

Para un reel nuevo: copiar `reels/reel-01`, cambiar imágenes (en `imagenes/`), textos y tiempos, subir y lanzar el flujo. **Todo vídeo lo revisa karc0 antes de publicarse.**
