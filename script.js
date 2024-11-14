import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { Scene, PerspectiveCamera, WebGLRenderer, PointLight, MeshBasicMaterial, Mesh, FontLoader, TextGeometry } from 'three';

// Firebase configuratie
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Three.js Scène Setup
let scene, camera, renderer, textMesh, font;

function init() {
    scene = new Scene();
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-container').appendChild(renderer.domElement);

    const light = new PointLight(0xffffff, 1.5);
    light.position.set(50, 50, 50);
    scene.add(light);

    loadFontAndCreateText("Jouw Neon Sign");
    animate();
}

function loadFontAndCreateText(text) {
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
        font = loadedFont;
        createText(text);
    });
}

function createText(text) {
    if (textMesh) scene.remove(textMesh);

    const geometry = new TextGeometry(text, {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });

    const material = new MeshBasicMaterial({ color: document.getElementById('colorPicker').value });
    textMesh = new Mesh(geometry, material);
    geometry.center();
    scene.add(textMesh);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Opslaan van configuratie in Firestore
async function saveConfig() {
    try {
        const docRef = await addDoc(collection(db, "neon-configs"), {
            text: document.getElementById('textInput').value,
            color: document.getElementById('colorPicker').value,
            createdAt: new Date()
        });
        console.log("Configuratie opgeslagen met ID: ", docRef.id);
    } catch (e) {
        console.error("Fout bij opslaan van configuratie: ", e);
    }
}

// Event Listeners
document.getElementById('textInput').addEventListener('input', (event) => {
    createText(event.target.value);
});

document.getElementById('colorPicker').addEventListener('input', (event) => {
    if (textMesh) textMesh.material.color.set(event.target.value);
});

window.onload = init;
