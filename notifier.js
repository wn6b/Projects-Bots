// js/modules/notifier.js
export class Notifier {
    static show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);
        
        SystemLogger.log(`Notification: ${message}`, type.toUpperCase());
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}
import { SystemLogger } from './logger.js';
