// js/modules/performance.js
export const PerfMonitor = {
    getMetrics() {
        const memory = navigator.deviceMemory || 'Unknown';
        const connection = navigator.connection ? navigator.connection.effectiveType : 'Unknown';
        console.log(`[Perf] Memory: ${memory}GB, Network: ${connection}`);
        return { memory, connection };
    }
};
