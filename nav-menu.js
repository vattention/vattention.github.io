document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('.site-nav-toggle');
    const links = document.querySelectorAll('.site-nav-links a');

    if (!nav || !toggle) {
        return;
    }

    function setOpen(isOpen) {
        nav.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    }

    toggle.addEventListener('click', function() {
        setOpen(!nav.classList.contains('is-open'));
    });

    links.forEach(link => {
        link.addEventListener('click', function() {
            setOpen(false);
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            setOpen(false);
        }
    });
});
