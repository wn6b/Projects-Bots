// js/modules/mobile-fix.js
export const MobileOptimizer = {
    enableTouchEffects() {
        document.addEventListener('touchstart', (e) => {
            const circle = document.createElement('div');
            circle.className = 'touch-ripple';
            circle.style.left = `${e.touches[0].clientX}px`;
            circle.style.top = `${e.touches[0].clientY}px`;
            document.body.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    }
};
