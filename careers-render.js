(function() {
    function getLanguage() {
        return localStorage.getItem('preferredLanguage') || document.documentElement.lang?.slice(0, 2) || 'en';
    }

    function localized(item, field, lang) {
        const suffix = lang === 'zh' ? 'Zh' : 'En';
        return item[`${field}${suffix}`] || item[`${field}En`] || '';
    }

    function createLocalizedElement(tagName, className, textZh, textEn, lang) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        element.setAttribute('data-zh', textZh);
        element.setAttribute('data-en', textEn);
        element.textContent = lang === 'zh' ? textZh : textEn;
        return element;
    }

    function renderCareers(lang = getLanguage()) {
        const container = document.getElementById('careers-list');
        const config = window.VATTENTION_CAREERS_CONFIG;

        if (!container || !config) return;

        container.innerHTML = '';

        config.categories.forEach(category => {
            const jobs = config.jobs.filter(job => {
                return job.categoryId === category.id && job.visible === true && job.url;
            });

            if (jobs.length === 0) return;

            const categoryElement = document.createElement('div');
            categoryElement.className = 'job-category';

            const heading = createLocalizedElement(
                'h3',
                'category-title',
                category.titleZh,
                category.titleEn,
                lang
            );

            const table = document.createElement('div');
            table.className = 'job-table';

            jobs.forEach(job => {
                const row = document.createElement('div');
                row.className = 'job-row';

                const link = document.createElement('a');
                link.href = job.url;
                link.className = 'job-link';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';

                const title = createLocalizedElement(
                    'div',
                    'job-title',
                    job.titleZh,
                    job.titleEn,
                    lang
                );
                const location = createLocalizedElement(
                    'div',
                    'job-location',
                    job.locationZh,
                    job.locationEn,
                    lang
                );

                link.append(title, location);
                row.appendChild(link);
                table.appendChild(row);
            });

            categoryElement.append(heading, table);
            container.appendChild(categoryElement);
        });
    }

    window.renderCareers = renderCareers;

    document.addEventListener('DOMContentLoaded', function() {
        renderCareers();
    });
})();
