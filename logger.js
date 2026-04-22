// js/modules/logger.js
export class SystemLogger {
    static log(action, status = 'INFO') {
        const timestamp = new Date().toLocaleString('ar-IQ');
        const logEntry = `[${timestamp}] [${status}] : ${action}`;
        console.log(`%c ${logEntry}`, 'color: #00ffcc; font-weight: bold;');
        
        // حفظ السجلات في الذاكرة المحلية
        const logs = JSON.parse(localStorage.getItem('WanoLogs') || '[]');
        logs.push(logEntry);
        if(logs.length > 50) logs.shift(); // احتفاظ بآخر 50 سجل فقط
        localStorage.setItem('WanoLogs', JSON.stringify(logs));
    }
}
