// 通用语言切换脚本
let currentLanguage = 'zh';

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // 更新按钮状态
    const zhBtn = document.getElementById('lang-zh');
    const enBtn = document.getElementById('lang-en');
    
    if (zhBtn && enBtn) {
        zhBtn.classList.toggle('active', lang === 'zh');
        enBtn.classList.toggle('active', lang === 'en');
    }
    
    // 更新页面内容
    const elements = document.querySelectorAll('[data-zh][data-en]');
    elements.forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    
    // 更新页面语言属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    
    // 保存语言偏好到本地存储
    localStorage.setItem('preferredLanguage', lang);
}

// 初始化语言切换
document.addEventListener('DOMContentLoaded', function() {
    // 从本地存储获取语言偏好
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'zh';
    switchLanguage(savedLanguage);
    
    // 绑定按钮事件
    const zhBtn = document.getElementById('lang-zh');
    const enBtn = document.getElementById('lang-en');
    
    if (zhBtn) {
        zhBtn.addEventListener('click', () => switchLanguage('zh'));
    }
    if (enBtn) {
        enBtn.addEventListener('click', () => switchLanguage('en'));
    }
    
    // 表单提交处理
    const form = document.getElementById('applicationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = currentLanguage === 'zh' ? '感谢您的申请！我们会尽快与您联系。' : 'Thank you for your application! We will get back to you soon.';
            alert(message);
        });
    }
});
