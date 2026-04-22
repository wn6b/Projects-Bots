// js/core/app.js
import { UIEngine } from '../modules/ui-engine.js';

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('dynamic-content');
    
    // بناء الواجهة ديناميكياً
    const activateBtn = UIEngine.createButton('تهيئة بروتوكولات 2026', 'start-btn');
    mainContent.appendChild(activateBtn);

    UIEngine.updateStatus('النظام جاهز وفي وضع الاستعداد.');

    activateBtn.addEventListener('click', async () => {
        activateBtn.style.display = 'none';
        UIEngine.updateStatus('جاري تحميل وتحليل البيانات المركزية...', true);
        
        // محاكاة الاتصال بخوادم الـ 30 ملف
        await new Promise(res => setTimeout(res, 2000));
        
        UIEngine.updateStatus('تم تفريغ وبناء النواة بنجاح! WanoHost يعمل بأقصى طاقة.');
    });
});
