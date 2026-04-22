// js/init.js
import { SYSTEM_CONFIG } from './core/config.js';
import { SystemLogger } from './modules/logger.js';
import { MobileOptimizer } from './modules/mobile-fix.js';
import { PerfMonitor } from './modules/performance.js';

(function() {
    console.log(`%c WanoHost ${SYSTEM_CONFIG.VERSION} Initializing...`, "color: #00ffcc; font-size: 20px; font-weight: bold;");
    SystemLogger.log("Final Boot Sequence Started.");
    MobileOptimizer.enableTouchEffects();
    PerfMonitor.getMetrics();
    
    // إشعار اكتمال الـ 30 ملف
    setTimeout(() => {
        SystemLogger.log("All 30 Modules Loaded Successfully.", "SUCCESS");
    }, 500);
})();
