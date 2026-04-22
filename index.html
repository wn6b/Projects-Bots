<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wano 3D Nature - 2026 Edition</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #050505; font-family: sans-serif; }
        canvas { display: block; }
        #ui-overlay {
            position: absolute;
            top: 20px;
            left: 20px;
            color: #00ff88;
            pointer-events: none;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
    </style>
</head>
<body>

    <div id="ui-overlay">
        <h1>Wano Studio - Project: Organic Text</h1>
    </div>

    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
            }
        }
    </script>

    <script type="module">
        import * as THREE from 'three';
        import { FontLoader } from 'three/addons/loaders/FontLoader.js';
        import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        // إعداد المشهد
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // التحكم بالكاميرا
        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 10);

        // الإضاءة
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x00ff88, 2);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // تحميل الخط وصناعة الـ "أغصان"
        const loader = new FontLoader();
        // نستخدم خط Helvetiker المتوفر مع المكتبة
        loader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
            const textGeo = new TextGeometry('WANO', {
                font: font,
                size: 3,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 5
            });

            textGeo.center();

            // مادة "الأغصان" - Wireframe يعطي شكل التشابك
            const material = new THREE.MeshPhongMaterial({ 
                color: 0x00ff88, 
                wireframe: true, 
                transparent: true, 
                opacity: 0.8 
            });

            const textMesh = new THREE.Mesh(textGeo, material);
            scene.add(textMesh);

            // إضافة تأثير الجزيئات المتطايرة كأنه غابة رقمية
            const particlesGeo = new THREE.BufferGeometry();
            const particlesCount = 500;
            const posArray = new Float32Array(particlesCount * 3);

            for(let i=0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 30;
            }
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMaterial = new THREE.PointsMaterial({ size: 0.05, color: 0x00ff88 });
            const particlesMesh = new THREE.Points(particlesGeo, particlesMaterial);
            scene.add(particlesMesh);

            // التحريك
            function animate() {
                requestAnimationFrame(animate);
                textMesh.rotation.y += 0.005;
                particlesMesh.rotation.y -= 0.002;
                controls.update();
                renderer.render(scene, camera);
            }
            animate();
        });

        // استجابة لتغيير حجم الشاشة
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

    </script>
</body>
</html>