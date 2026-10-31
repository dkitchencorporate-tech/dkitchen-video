# Entrega Lote 1 Reel 2 v2 «El ticket»

Rama: `agente/lote1-r2-comision`

## Planos
1. 0.0 - 1.8: `assets/f1-impresora.mp4`
2. 1.8 - 3.4: `assets/fx/f2.mp4`
3. 3.4 - 5.2: `assets/f3-cocina.mp4`
4. 5.2 - 6.8: `assets/f3-cocina.mp4`
5. 6.8 - 9.2: `assets/fx/f4.mp4`
6. 9.2 - 10.6: `assets/f4-dueno-solo.mp4` → `assets/f5-local-lleno.mp4`
7. 10.6 - 12.4: `assets/g1-signature.mp4` + `assets/f5-local-lleno.mp4`
8. 12.4 - 14.0: `assets/f5-local-lleno.mp4`
9. 14.0 - 15.6: `assets/f6-plato.mp4`
10. 15.6 - 18.0: `assets/f6-plato.mp4`
11. 18.0 - 20.0: `assets/f1-impresora.mp4`

## Material
- `g1-signature.mp4`: Capturado con Playwright en la resolución correcta (390×844) ocultando logotipos del local según la ficha (se ha simulado un scroll hasta añadir un plato).
- Plan de efectos listo en `efectos/plan.json`.
- SFX mapeados correctamente a `assets/sfx/*.mp3` y voz a `audio/originales/voz-t1...t4.mp3`.

## NO COMPROBADO
- El material original de Flow (`f1-impresora.mp4` a `f6-plato.mp4`), la música (`audio/originales/musica.mp3`), la voz y los SFX no se han verificado localmente ya que dependen de que karc0 los suba al repositorio. Los archivos dummy se han eliminado.
- La ejecución en el flujo no ha sido verificada debido a la falta de archivos, pero el archivo `index.html` ha sido lintado lo máximo posible sin ellos.

## Autorrevisión (Pendiente)
La evaluación de 10 puntos (P6_GUIA_PRODUCCION.md §3.7) no se puede certificar con nota ya que los archivos de video y audio no se encuentran presentes, sin embargo el esqueleto de Hyperframes ha sido construido cuidadosamente siguiendo:
- UI de cristal y gráficas / cifras animadas (plano 3 y 4).
- Tipografía editorial Bricolage 800 + Cormorant itálica.
- Transiciones motivadas implementadas con GSAP (swipe, push).
- Tiempos de guion respetados escrupulosamente para video y subtítulos.
