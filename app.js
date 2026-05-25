// Data Graph: Nodes di Universitas Bengkulu
const nodes = {
    "gerbang_depan": { name: "Gerbang Depan", lat: -3.7591745, lng: 102.2666268 },
    "gerbang_rektorat": { name: "Gerbang Rektorat", lat: -3.7607500, lng: 102.2726944 },
    "rektorat": { name: "Gedung Rektorat", lat: -3.7592081, lng: 102.2723468 },
    "fkip": { name: "Fakultas Keguruan (FKIP)", lat: -3.7576645, lng: 102.2750427 },
    "teknik": { name: "Fakultas Teknik", lat: -3.7591222, lng: 102.2767678 },
    "perpus": { name: "Perpustakaan Pusat", lat: -3.7569399, lng: 102.2748278 },
    "fisip": { name: "Fakultas ISIP", lat: -3.7592301, lng: 102.2744684 },
    "hukum": { name: "Fakultas Hukum", lat: -3.7606454, lng: 102.2684589 },
    "pertanian": { name: "Fakultas Pertanian", lat: -3.7594384, lng: 102.2692367 },
    "gerbang_belakang": { name: "Gerbang Belakang", lat: -3.7593945, lng: 102.2762219 },
    "mipa": { name: "Fakultas MIPA", lat: -3.7560807, lng: 102.2748758 },
    "glt": { name: "Gedung Layanan Terpadu (GLT)", lat: -3.758142, lng: 102.2719087 },
    "gsg": { name: "Gedung Serba Guna", lat: -3.7577123, lng: 102.2765796 },
    "masjid": { name: "Masjid Kampus", lat: -3.7590152, lng: 102.2759418 },
    "taman_2": { name: "Taman Arboretum", lat: -3.7615000, lng: 102.2705000 }
};

// POI Data (Cari di Sekitar)
const poiData = {
    restoran: [
        { name: "Unlimited Resto & Cafe", lat: -3.7639394, lng: 102.2705286 },
        { name: "Allbaik Chicken Unib", lat: -3.75917, lng: 102.27557 }
    ],
    hotel: [
        { name: "DJO FLOW INN HOTEL", lat: -3.7592384, lng: 102.2771315 },
        { name: "Queen Guest House", lat: -3.7685251, lng: 102.2705452 }
    ],
    spbu: [
        { name: "Pertamina SPBU Rawamakmur", lat: -3.7659404, lng: 102.2692455 },
        { name: "SPBU Jl. Bali", lat: -3.7842602, lng: 102.2657391 }
    ],
    parkir: [
        { name: "Parkiran Motor Teknik", lat: -3.7595000, lng: 102.2765000 },
        { name: "Parkiran FKIP", lat: -3.7578000, lng: 102.2748000 }
    ]
};

// Data Graph: Edges
const edges = [
    { from: "gerbang_depan", to: "gerbang_rektorat" },
    { from: "gerbang_depan", to: "hukum" },
    { from: "gerbang_depan", to: "fisip" },
    { from: "gerbang_depan", to: "fkip" },
    { from: "gerbang_depan", to: "masjid" },
    { from: "gerbang_rektorat", to: "rektorat" },
    { from: "gerbang_rektorat", to: "hukum" },
    { from: "gerbang_rektorat", to: "masjid" },
    { from: "gerbang_rektorat", to: "perpus" },
    { from: "gerbang_rektorat", to: "fisip" },
    { from: "rektorat", to: "masjid" },
    { from: "rektorat", to: "perpus" },
    { from: "rektorat", to: "hukum" },
    { from: "masjid", to: "fkip" },
    { from: "masjid", to: "perpus" },
    { from: "masjid", to: "fisip" },
    { from: "fkip", to: "gsg" },
    { from: "fkip", to: "fisip" },
    { from: "fkip", to: "perpus" },
    { from: "fisip", to: "perpus" },
    { from: "fisip", to: "pertanian" },
    { from: "fisip", to: "mipa" },
    { from: "fisip", to: "hukum" },
    { from: "perpus", to: "teknik" },
    { from: "perpus", to: "mipa" },
    { from: "perpus", to: "glt" },
    { from: "hukum", to: "taman_2" },
    { from: "teknik", to: "glt" },
    { from: "teknik", to: "pertanian" },
    { from: "teknik", to: "gerbang_belakang" },
    { from: "glt", to: "gsg" },
    { from: "glt", to: "mipa" },
    { from: "gsg", to: "gerbang_belakang" },
    { from: "gsg", to: "pertanian" },
    { from: "pertanian", to: "gerbang_belakang" },
    { from: "pertanian", to: "mipa" },
    { from: "taman_2", to: "rektorat" }
];

// Haversine Formula
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const p1 = lat1 * Math.PI / 180;
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Inisialisasi jarak dinamis
edges.forEach(edge => {
    edge.distance = Math.round(haversine(
        nodes[edge.from].lat, nodes[edge.from].lng,
        nodes[edge.to].lat, nodes[edge.to].lng
    ));
});

// Setup Leaflet Map
const map = L.map('map', { zoomControl: false }).setView([-3.7593, 102.2723], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);

const markers = {};
let poiMarkers = [];
let routeLayers = [];
let currentPathsData = [];
let activeRouteIndex = 0;
let currentMode = 'car';

// Local Storage Setup
let savedLocations = JSON.parse(localStorage.getItem('unibgo_saved')) || [];
let routeHistory = JSON.parse(localStorage.getItem('unibgo_history')) || [];

function toggleSaveLocation(id) {
    if (savedLocations.includes(id)) {
        savedLocations = savedLocations.filter(loc => loc !== id);
    } else {
        savedLocations.push(id);
    }
    localStorage.setItem('unibgo_saved', JSON.stringify(savedLocations));
    renderSavedList();
    
    // Update button in popup if it's open
    const btn = document.getElementById(`save-btn-${id}`);
    if (btn) {
        if (savedLocations.includes(id)) {
            btn.className = "popup-save-btn saved";
            btn.innerHTML = `<i class="fa-solid fa-bookmark"></i> Tersimpan`;
        } else {
            btn.className = "popup-save-btn";
            btn.innerHTML = `<i class="fa-regular fa-bookmark"></i> Simpan Lokasi`;
        }
    }
}

// Menyiapkan Select Input & Marker
const startSelect = document.getElementById('startNode');
const endSelect = document.getElementById('endNode');

for (const id in nodes) {
    const node = nodes[id];
    
    // Custom popup dengan tombol simpan
    const isSaved = savedLocations.includes(id);
    const popupContent = `
        <div style="text-align:center;">
            <b>${node.name}</b>
            <button id="save-btn-${id}" class="popup-save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSaveLocation('${id}')">
                <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i> ${isSaved ? 'Tersimpan' : 'Simpan Lokasi'}
            </button>
        </div>
    `;

    markers[id] = L.marker([node.lat, node.lng]).addTo(map).bindPopup(popupContent);
    startSelect.add(new Option(node.name, id));
    endSelect.add(new Option(node.name, id));
}

// View Switcher (Nav Rail)
const navBtns = document.querySelectorAll('.nav-btn');
const views = {
    'routing': document.getElementById('view-routing'),
    'saved': document.getElementById('view-saved'),
    'history': document.getElementById('view-history')
};

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update nav styling
        navBtns.forEach(b => b.style.color = 'var(--text-gray)');
        btn.style.color = 'var(--primary)';
        
        // Hide all views
        Object.values(views).forEach(v => v.classList.add('hidden'));
        
        // Show selected view
        const targetView = btn.dataset.view;
        views[targetView].classList.remove('hidden');

        if (targetView === 'saved') renderSavedList();
        if (targetView === 'history') renderHistoryList();
    });
});

// Render List Tersimpan
function renderSavedList() {
    const container = document.getElementById('savedListContainer');
    container.innerHTML = '';

    if (savedLocations.length === 0) {
        container.innerHTML = `<div style="padding: 20px; text-align:center; color: var(--text-gray);">Belum ada lokasi yang disimpan.</div>`;
        return;
    }

    savedLocations.forEach(id => {
        const node = nodes[id];
        if(!node) return;

        const el = document.createElement('div');
        el.className = 'list-item';
        el.innerHTML = `
            <div class="item-icon"><i class="fa-solid fa-location-dot"></i></div>
            <div class="item-details">
                <div class="item-title">${node.name}</div>
                <div class="item-subtitle">Universitas Bengkulu</div>
            </div>
        `;
        el.onclick = () => {
            // Set as destination and jump to routing view
            endSelect.value = id;
            document.querySelector('[data-view="routing"]').click();
            if(startSelect.value) calculateRoutes();
            map.flyTo([node.lat, node.lng], 17);
            markers[id].openPopup();
        };
        container.appendChild(el);
    });
}

// Render Riwayat
function renderHistoryList() {
    const container = document.getElementById('historyListContainer');
    container.innerHTML = '';

    if (routeHistory.length === 0) {
        container.innerHTML = `<div style="padding: 20px; text-align:center; color: var(--text-gray);">Belum ada riwayat pencarian.</div>`;
        return;
    }

    routeHistory.forEach((hist, idx) => {
        const startName = nodes[hist.startId] ? nodes[hist.startId].name : 'Lokasi awal';
        const endName = nodes[hist.endId] ? nodes[hist.endId].name : 'Tujuan';

        const el = document.createElement('div');
        el.className = 'list-item history';
        el.innerHTML = `
            <div class="item-icon"><i class="fa-solid fa-diamond-turn-right"></i></div>
            <div class="item-details">
                <div class="item-title">Ke ${endName}</div>
                <div class="item-subtitle">Dari ${startName}</div>
            </div>
        `;
        el.onclick = () => {
            startSelect.value = hist.startId;
            endSelect.value = hist.endId;
            document.querySelector('[data-view="routing"]').click();
            calculateRoutes();
        };
        container.appendChild(el);
    });
}

// UI Listeners Routing
document.getElementById('swapBtn').addEventListener('click', () => {
    const temp = startSelect.value;
    startSelect.value = endSelect.value;
    endSelect.value = temp;
    if(startSelect.value && endSelect.value) calculateRoutes();
});

startSelect.addEventListener('change', calculateRoutes);
endSelect.addEventListener('change', calculateRoutes);

const modeTabs = document.querySelectorAll('.mode-tab[data-mode]');
modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentMode = tab.dataset.mode;
        if(startSelect.value && endSelect.value) calculateRoutes();
    });
});

// Explore Chips (POI) Logic
const chipIcons = {
    'Restoran': { key: 'restoran', icon: 'fa-utensils', color: '#188038' },
    'Hotel': { key: 'hotel', icon: 'fa-bed', color: '#1a73e8' },
    'SPBU': { key: 'spbu', icon: 'fa-gas-pump', color: '#d93025' },
    'Tempat Parkir': { key: 'parkir', icon: 'fa-square-parking', color: '#e37400' }
};

document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const typeLabel = chip.querySelector('span').innerText;
        const typeData = chipIcons[typeLabel];
        
        if(!typeData || !poiData[typeData.key]) return;

        // Bersihkan marker lama dan rute
        poiMarkers.forEach(m => map.removeLayer(m));
        poiMarkers = [];
        routeLayers.forEach(l => map.removeLayer(l));
        routeLayers = [];
        document.getElementById('routeResults').innerHTML = `
            <div class="empty-state">
                <p>Menampilkan ${typeLabel} di sekitar Anda.</p>
            </div>
        `;

        // Buat ikon L.divIcon
        const customIcon = L.divIcon({
            className: 'custom-poi-icon',
            html: `<div style="background-color: ${typeData.color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><i class="fa-solid ${typeData.icon}"></i></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        // Tambahkan Marker POI
        const bounds = L.latLngBounds();
        poiData[typeData.key].forEach(poi => {
            const m = L.marker([poi.lat, poi.lng], { icon: customIcon }).addTo(map)
                .bindPopup(`<b>${poi.name}</b><br>Kategori: ${typeLabel}`);
            poiMarkers.push(m);
            bounds.extend([poi.lat, poi.lng]);
        });
        
        // Paskan view peta ke POI
        if(poiMarkers.length > 0) map.fitBounds(bounds, { padding: [50, 50] });
    });
});

// Fungsi Utilities
function calculateTotalDistance(path) {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i]; const v = path[i+1];
        const edge = edges.find(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));
        if (edge) distance += edge.distance;
    }
    return distance;
}

function formatTime(distance, mode) {
    const speed = mode === 'walk' ? 80 : 300; 
    const timeInMinutes = distance / speed;
    if (timeInMinutes < 1) return `${Math.round(timeInMinutes * 60)} detik`;
    const mins = Math.floor(timeInMinutes);
    const secs = Math.round((timeInMinutes - mins) * 60);
    return secs > 0 ? `${mins} mnt ${secs} dtk` : `${mins} mnt`;
}

// A* Algorithm
function aStar(startId, endId, mode, blockedEdges = []) {
    let openSet = [startId];
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    for (const id in nodes) {
        gScore[id] = Infinity;
        fScore[id] = Infinity;
    }
    
    gScore[startId] = 0;
    fScore[startId] = haversine(nodes[startId].lat, nodes[startId].lng, nodes[endId].lat, nodes[endId].lng);

    while (openSet.length > 0) {
        let currentId = openSet[0];
        for (let i = 1; i < openSet.length; i++) {
            if (fScore[openSet[i]] < fScore[currentId]) currentId = openSet[i];
        }

        if (currentId === endId) return reconstructPath(cameFrom, currentId);

        openSet = openSet.filter(id => id !== currentId);
        const neighbors = getNeighbors(currentId, mode, blockedEdges);

        for (const neighbor of neighbors) {
            const tentative_gScore = gScore[currentId] + neighbor.distance;
            if (tentative_gScore < gScore[neighbor.id]) {
                cameFrom[neighbor.id] = currentId;
                gScore[neighbor.id] = tentative_gScore;
                fScore[neighbor.id] = gScore[neighbor.id] + haversine(nodes[neighbor.id].lat, nodes[neighbor.id].lng, nodes[endId].lat, nodes[endId].lng);
                if (!openSet.includes(neighbor.id)) openSet.push(neighbor.id);
            }
        }
    }
    return null;
}

function getNeighbors(nodeId, mode, blockedEdges) {
    const neighbors = [];
    for (const edge of edges) {
        let isReversed = false;
        if (edge.from !== nodeId && edge.to !== nodeId) continue;
        if (edge.to === nodeId) isReversed = true;
        const neighborId = isReversed ? edge.from : edge.to;

        const isBlocked = blockedEdges.some(b => 
            (b[0] === nodeId && b[1] === neighborId) || (b[0] === neighborId && b[1] === nodeId)
        );
        if(isBlocked) continue;

        if (mode !== 'walk' && edge.walkOnly) continue; 
        
        neighbors.push({ id: neighborId, distance: edge.distance });
    }
    return neighbors;
}

function reconstructPath(cameFrom, currentId) {
    const totalPath = [currentId];
    while (cameFrom[currentId]) {
        currentId = cameFrom[currentId];
        totalPath.unshift(currentId);
    }
    return totalPath;
}

async function calculateRoutes() {
    const startId = startSelect.value;
    const endId = endSelect.value;
    if (!startId || !endId) return;

    // Bersihkan peta dari marker POI dan rute lama
    poiMarkers.forEach(m => map.removeLayer(m));
    poiMarkers = [];
    routeLayers.forEach(layer => map.removeLayer(layer));
    routeLayers = [];
    currentPathsData = [];
    document.getElementById('routeActions').classList.remove('hidden');

    // Tambahkan ke riwayat
    const newHistory = { startId, endId, timestamp: Date.now() };
    routeHistory = routeHistory.filter(h => !(h.startId === startId && h.endId === endId)); // Hapus duplikat
    routeHistory.unshift(newHistory);
    if(routeHistory.length > 10) routeHistory.pop(); // Batasi 10 riwayat
    localStorage.setItem('unibgo_history', JSON.stringify(routeHistory));

    const path1 = aStar(startId, endId, currentMode, []);
    if (!path1) {
        renderEmptyState("Tidak ada rute yang ditemukan.");
        return;
    }
    currentPathsData.push({ path: path1, isAlternative: false });

    if (path1.length > 2) {
        const midIdx = Math.floor(path1.length / 2);
        const alt1 = aStar(startId, endId, currentMode, [[path1[midIdx], path1[midIdx+1]]]);
        if (alt1 && JSON.stringify(alt1) !== JSON.stringify(path1)) {
            currentPathsData.push({ path: alt1, isAlternative: true });
            
            const qtrIdx = Math.floor(path1.length / 4);
            if(qtrIdx > 0 && qtrIdx !== midIdx) {
                const alt2 = aStar(startId, endId, currentMode, [[path1[qtrIdx], path1[qtrIdx+1]]]);
                if (alt2 && JSON.stringify(alt2) !== JSON.stringify(path1) && JSON.stringify(alt2) !== JSON.stringify(alt1)) {
                    currentPathsData.push({ path: alt2, isAlternative: true });
                }
            }
        }
    }

    activeRouteIndex = 0;
    const osrmMode = currentMode === 'walk' ? 'foot' : 'driving';
    
    document.getElementById('routeResults').innerHTML = '<div class="empty-state"><p><i class="fa-solid fa-spinner fa-spin"></i> Sedang mencari rute terbaik...</p></div>';

    for (let pIdx = 0; pIdx < currentPathsData.length; pIdx++) {
        const pathData = currentPathsData[pIdx];
        const path = pathData.path;
        let fullLatLngs = [];

        try {
            for (let i = 0; i < path.length - 1; i++) {
                const u = nodes[path[i]]; const v = nodes[path[i+1]];
                const url = `https://router.project-osrm.org/route/v1/${osrmMode}/${u.lng},${u.lat};${v.lng},${v.lat}?overview=full&geometries=geojson`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.code === 'Ok' && data.routes.length > 0) {
                    const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                    fullLatLngs = fullLatLngs.concat(coords);
                } else {
                    fullLatLngs.push([u.lat, u.lng]);
                    if (i === path.length - 2) fullLatLngs.push([v.lat, v.lng]);
                }
            }
        } catch(e) {
            fullLatLngs = path.map(id => [nodes[id].lat, nodes[id].lng]);
        }
        
        pathData.latlngs = fullLatLngs;
        pathData.distance = calculateTotalDistance(path);
        pathData.timeStr = formatTime(pathData.distance, currentMode);
        
        let viaNode = "";
        if(path.length > 2) {
            viaNode = nodes[path[Math.floor(path.length/2)]].name;
        } else {
            viaNode = "jalur langsung";
        }
        pathData.routeName = `lewat ${viaNode}`;
    }

    renderMapRoutes();
    renderRouteCards();
}

function renderMapRoutes() {
    routeLayers.forEach(layer => map.removeLayer(layer));
    routeLayers = [];

    for (let i = currentPathsData.length - 1; i >= 0; i--) {
        const isActive = i === activeRouteIndex;
        const pathData = currentPathsData[i];
        
        const layer = L.polyline(pathData.latlngs, {
            color: isActive ? '#1a73e8' : '#80868b',
            weight: isActive ? 6 : 5,
            opacity: isActive ? 1 : 0.6,
            zIndexOffset: isActive ? 100 : 0
        }).addTo(map);

        if(!isActive) {
            layer.on('click', () => {
                activeRouteIndex = i;
                renderMapRoutes();
                renderRouteCards();
            });
        }
        routeLayers.unshift(layer);
    }
    
    if (routeLayers[activeRouteIndex]) {
        map.fitBounds(routeLayers[activeRouteIndex].getBounds(), { padding: [50, 50] });
    }
}

function renderRouteCards() {
    const container = document.getElementById('routeResults');
    container.innerHTML = '';

    currentPathsData.forEach((data, idx) => {
        const isActive = idx === activeRouteIndex;
        const icon = currentMode === 'walk' ? 'fa-person-walking' : (currentMode === 'motorcycle' ? 'fa-motorcycle' : 'fa-car');
        const badgeText = data.isAlternative ? 'Rute alternatif' : 'Rute tercepat';
        
        const card = document.createElement('div');
        card.className = `route-card ${isActive ? 'active' : ''}`;
        card.innerHTML = `
            <div class="route-header">
                <div class="route-title">
                    <i class="fa-solid ${icon}" style="color: ${isActive ? 'var(--primary)' : 'var(--text-gray)'}"></i>
                    ${data.routeName}
                </div>
                <div class="route-time">${data.timeStr}</div>
            </div>
            <div class="route-desc">${badgeText}</div>
            <div class="route-dist">${Math.round(data.distance)} m</div>
            ${isActive ? `
            <div class="route-links">
                <span>Detail</span>
                <span>Pratinjau</span>
            </div>` : ''}
        `;
        
        card.onclick = () => {
            if(activeRouteIndex !== idx) {
                activeRouteIndex = idx;
                renderMapRoutes();
                renderRouteCards();
            }
        };
        container.appendChild(card);
    });
}

function renderEmptyState(msg) {
    document.getElementById('routeResults').innerHTML = `
        <div class="empty-state">
            <img src="https://maps.gstatic.com/tactile/directions/omnibox/empty_state_directions.png" width="100">
            <p>${msg}</p>
        </div>
    `;
}

// Menu Modal Logic
const menuBtn = document.querySelector('.menu-btn');
const modal = document.getElementById('menuModal');
const closeModalBtn = document.getElementById('closeModalBtn');

menuBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});
