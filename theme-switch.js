(function () {
    const storageKey = 'vattentionTheme';
    const root = document.documentElement;
    const validThemes = ['dark', 'light'];

    function getSavedTheme() {
        const savedTheme = localStorage.getItem(storageKey);
        return validThemes.includes(savedTheme) ? savedTheme : 'dark';
    }

    function getLanguage() {
        return localStorage.getItem('preferredLanguage') === 'zh' ? 'zh' : 'en';
    }

    function getThemeLabel(theme) {
        const labels = {
            dark: { zh: '深色', en: 'Dark' },
            light: { zh: '浅色', en: 'Light' }
        };
        return labels[theme][getLanguage()];
    }

    function updateThemeButtons(theme) {
        document.querySelectorAll('[data-theme-choice]').forEach(button => {
            const isActive = button.getAttribute('data-theme-choice') === theme;
            button.setAttribute('aria-pressed', String(isActive));
            button.textContent = getThemeLabel(button.getAttribute('data-theme-choice'));
        });
    }

    function applyTheme(theme) {
        const nextTheme = validThemes.includes(theme) ? theme : 'dark';
        root.setAttribute('data-theme', nextTheme);
        root.style.colorScheme = nextTheme;
        localStorage.setItem(storageKey, nextTheme);
        updateThemeButtons(nextTheme);
    }

    function createThemeSwitcher() {
        if (document.querySelector('.theme-switcher')) {
            updateThemeButtons(getSavedTheme());
            return;
        }

        const switcher = document.createElement('div');
        switcher.className = 'theme-switcher';
        switcher.setAttribute('role', 'group');
        switcher.setAttribute('aria-label', 'Color theme');

        validThemes.forEach(theme => {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('data-theme-choice', theme);
            button.addEventListener('click', () => applyTheme(theme));
            switcher.appendChild(button);
        });

        document.body.appendChild(switcher);
        updateThemeButtons(getSavedTheme());
    }

    applyTheme(getSavedTheme());

    document.addEventListener('DOMContentLoaded', createThemeSwitcher);
    document.addEventListener('click', event => {
        if (event.target && (event.target.id === 'lang-zh' || event.target.id === 'lang-en')) {
            window.setTimeout(() => updateThemeButtons(getSavedTheme()), 0);
        }
    });

    window.setVattentionTheme = applyTheme;
})();
