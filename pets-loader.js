// 宠物图片动态加载脚本
(function() {
    // 所有宠物图片配置
    const petsData = [
        { src: 'Pony01.jpg', name: 'Pony', nameZh: 'Pony', nameEn: 'Pony' },
        { src: 'beta-01.jpg', name: 'Beta', nameZh: '贝塔', nameEn: 'Beta' },
        { src: 'beta-02.jpg', name: 'Beta', nameZh: '贝塔', nameEn: 'Beta' },
        { src: 'beta-03.jpg', name: 'Beta', nameZh: '贝塔', nameEn: 'Beta' },
        { src: '带鱼&雪糕01.jpg', name: '带鱼&雪糕', nameZh: '带鱼&雪糕', nameEn: 'Daiyu & Oreo' },
        { src: '带鱼01.jpeg', name: '带鱼', nameZh: '带鱼', nameEn: 'Daiyu' },
        { src: '带鱼02.jpg', name: '带鱼', nameZh: '带鱼', nameEn: 'Daiyu' },
        { src: '雪糕01.jpeg', name: '雪糕', nameZh: '雪糕', nameEn: 'Oreo' },
        { src: '罐罐01.jpg', name: '罐罐', nameZh: '罐罐', nameEn: 'GuanGuan' },
        { src: '罐罐02.jpg', name: '罐罐', nameZh: '罐罐', nameEn: 'GuanGuan' },
        { src: '喷嚏01.jpg', name: '喷嚏', nameZh: '喷嚏', nameEn: 'Penti' },
        { src: '囧囧01.jpg', name: '囧囧', nameZh: '囧囧', nameEn: 'Jiongjiong' },
        { src: '囧囧02.jpg', name: '囧囧', nameZh: '囧囧', nameEn: 'Jiongjiong' },
        { src: '多米01.jpg', name: '多米', nameZh: '多米', nameEn: 'Domi' },
        { src: '奶油01.jpg', name: '奶油', nameZh: '奶油', nameEn: 'Naiyou' },
        { src: '小七01.jpg', name: '小七', nameZh: '小七', nameEn: 'Xiaoqi' },
        { src: '小七02.jpg', name: '小七', nameZh: '小七', nameEn: 'Xiaoqi' },
        { src: '小七03.png', name: '小七', nameZh: '小七', nameEn: 'Xiaoqi' },
        { src: '小七04.JPG', name: '小七', nameZh: '小七', nameEn: 'Xiaoqi' },
        { src: '晚安01.jpg', name: '晚安', nameZh: '晚安', nameEn: 'Wanan' },
        { src: '晚安02.jpg', name: '晚安', nameZh: '晚安', nameEn: 'Wanan' },
        { src: '肉松01.jpg', name: '肉松', nameZh: '肉松', nameEn: 'Rousong' },
        { src: '小佑01.png', name: '小佑', nameZh: '小佑', nameEn: 'Xiaoyou' },
        { src: '小佑02.JPG', name: '小佑', nameZh: '小佑', nameEn: 'Xiaoyou' },
        { src: '小佑03.png', name: '小佑', nameZh: '小佑', nameEn: 'Xiaoyou' },
        { src: '小佑04.JPG', name: '小佑', nameZh: '小佑', nameEn: 'Xiaoyou' },
        { src: '小橘01.png', name: '小橘', nameZh: '小橘', nameEn: 'Xiaoju' }
    ];

    // 创建宠物卡片 HTML
    function createPetCard(petData) {
        const card = document.createElement('div');
        card.className = 'pet-card';

        const avatar = document.createElement('div');
        avatar.className = 'pet-avatar';

        const img = document.createElement('img');
        img.dataset.src = `pets-photos/${petData.src}`; // 使用 data-src 懒加载
        img.alt = petData.name;
        img.onerror = function() { this.style.display = 'none'; };

        const nameDiv = document.createElement('div');
        nameDiv.className = 'pet-name';
        if (petData.nameZh && petData.nameEn) {
            nameDiv.setAttribute('data-zh', petData.nameZh);
            nameDiv.setAttribute('data-en', petData.nameEn);
        }
        nameDiv.textContent = petData.name;

        avatar.appendChild(img);
        avatar.appendChild(nameDiv);
        card.appendChild(avatar);

        return card;
    }

    // 懒加载图片
    function lazyLoadImages() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px' // 提前 50px 开始加载
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Fisher-Yates 洗牌算法
    function shuffleArray(array) {
        const shuffled = [...array]; // 创建副本
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // 初始化宠物展示
    function initPetsDisplay() {
        const track = document.getElementById('pets-scroll-track');
        if (!track) return;

        // 清空现有内容
        track.innerHTML = '';

        // 随机排序宠物数据
        const shuffledPets = shuffleArray(petsData);

        // 添加第一组宠物
        shuffledPets.forEach(petData => {
            track.appendChild(createPetCard(petData));
        });

        // 添加第二组（用于无缝循环）
        shuffledPets.forEach(petData => {
            track.appendChild(createPetCard(petData));
        });

        // 启动懒加载
        lazyLoadImages();
    }

    // 页面加载完成后初始化（不阻塞页面渲染）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPetsDisplay);
    } else {
        // DOM 已经加载完成
        initPetsDisplay();
    }
})();
