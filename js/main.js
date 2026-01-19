// Script para agregar hotspots dinámicamente
const modelViewer = document.querySelector('model-viewer');
const addHotspotBtn = document.getElementById('addHotspotMode');
let addHotspotMode = false;
let hotspotCounter = 4; // Comienza después de los 3 hotspots existentes

// Alternar modo de agregar hotspot
addHotspotBtn.addEventListener('click', () => {
    addHotspotMode = !addHotspotMode;
    addHotspotBtn.classList.toggle('active');
    addHotspotBtn.textContent = addHotspotMode ? '❌ Cancelar' : '➕ Modo Agregar Hotspot';
    modelViewer.style.cursor = addHotspotMode ? 'crosshair' : 'grab';
});

// Agregar hotspot al hacer click en el modelo
modelViewer.addEventListener('click', (event) => {
    if (!addHotspotMode) return;
    
    const hit = modelViewer.positionAndNormalFromPoint(event.clientX, event.clientY);
    
    if (hit) {
        const position = `${hit.position.x}m ${hit.position.y}m ${hit.position.z}m`;
        const normal = `${hit.normal.x}m ${hit.normal.y}m ${hit.normal.z}m`;
        
        // Crear nuevo hotspot
        const hotspot = document.createElement('button');
        hotspot.className = 'Hotspot';
        hotspot.slot = `hotspot-${hotspotCounter}`;
        hotspot.dataset.position = position;
        hotspot.dataset.normal = normal;
        hotspot.dataset.visibilityAttribute = 'visible';
        
        const annotation = document.createElement('div');
        annotation.className = 'HotspotAnnotation';
        annotation.textContent = `Punto ${hotspotCounter}`;
        
        hotspot.appendChild(annotation);
        modelViewer.appendChild(hotspot);
        
        // Mostrar código en consola
        console.log(`
Hotspot ${hotspotCounter} creado:
<button 
  class="Hotspot" 
  slot="hotspot-${hotspotCounter}" 
  data-position="${position}" 
  data-normal="${normal}"
  data-visibility-attribute="visible">
  <div class="HotspotAnnotation">Punto ${hotspotCounter}</div>
</button>
        `);
        
        hotspotCounter++;
        
        // Mensaje al usuario
        alert(`Hotspot creado en:\nPosición: ${position}\nNormal: ${normal}\n\nRevisa la consola para copiar el código HTML.`);
    }
});

// Mostrar coordenadas al pasar el mouse (útil para ajustar posiciones)
modelViewer.addEventListener('mousemove', (event) => {
    if (!addHotspotMode) return;
    
    const hit = modelViewer.positionAndNormalFromPoint(event.clientX, event.clientY);
    if (hit) {
        modelViewer.title = `Pos: (${hit.position.x.toFixed(2)}, ${hit.position.y.toFixed(2)}, ${hit.position.z.toFixed(2)})`;
    }
});
