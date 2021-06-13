/*<h3><span class="titm01">NEWS</span><span class="titm02">뉴스</span></h3>
<a class="btn-more" title="더보기" href="/me/community/news.do">더보기 ></a>*/

const isDev = window.location.hostname === 'www.kbdlab.xyz';
const getTemplate = () => isDev ? fetch('template.html')
    .then(res => res.text())
    .then(text => {
        const template = document.createElement('div');
        template.innerHTML = text;
        return template;
    }) : Promise.resolve(document.querySelector('.container'));


function getTitle(title, href) {
    const element = document.createElement('a');
    element.href = href;
    element.setAttribute('class', 'px-3 title shadow bg-light mb-0 d-block');
    element.innerHTML = `
    <h6 class="d-inline text-white " data-en="Demo Title">${title}</h6>
    <h6 class="d-inline float-end text-white 16px "> 더보기  &gt;</h6>
    `;

    return element;
}


function getCarousel(template) {
    console.log('Carousel', template);

    const section = document.createElement('section');
    const id = 'carousel';
    const imgs = [...template.querySelectorAll('img')];


    section.classList.add('row', 'bg-white');

    const indicators = imgs.reduce((accum, cur, i) => accum + `
    <button type="button" data-bs-target="#${id}" data-bs-slide-to="${i}" ${i ? '':'class="active"'}></button>`, '');

    const items = imgs.reduce((accum, { src }, i) => accum + `
        <div class="carousel-item ${i ? '':'active'}">
            <div class="carousel-caption d-none d-md-block">
            <h4 class="d-inline bg-white text-body">${decodeURIComponent(new URL(window.location.origin+ src).hash).substr(1)}</h4>
          </div>
        </div>`, '');

    section.innerHTML = `<div id=${id} class="carousel slide px-0" data-bs-ride="carousel">
      <div class="carousel-indicators">${indicators}</div>
      <div class="carousel-inner">${items}</div>
      
      <button class="carousel-control-prev" type="button" data-bs-target="#${id}"  data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${id}"  data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>`;

    section.querySelectorAll('.carousel-item').forEach((x, i) => {
        const img = imgs[i];
        const cloned = img.cloneNode();
        img.classList.add('d-block', 'm-auto', 'h-100', 'mw-100', 'position-relative');
        cloned.classList.add('position-absolute', 'blurred', 'w-100', 'm-auto');

        x.prepend(img);
        x.prepend(cloned);
    });

    const carousel = new bootstrap.Carousel(section.firstElementChild, {
        interval: 5000,
        //wrap: true
    });
    section.firstElementChild.querySelector('.carousel-control-prev').addEventListener('click', carousel.prev.bind(carousel));
    section.firstElementChild.querySelector('.carousel-control-next').addEventListener('click', carousel.next.bind(carousel));
    section.firstElementChild.querySelector('.carousel-indicators').addEventListener('click', ({ path: [target] }) => carousel.to(Number(target.dataset.bsSlideTo)));
    return section;
}


function getCards(template, title) {
    console.log('Cards', template);
    const section = document.createElement('section');
    section.classList.add('container', 'mx-auto', 'w-100');
    section.appendChild(getTitle(title, template.querySelector('a').href.split('?')[0]));

    template.querySelectorAll('li').forEach(x => {
        if (!x.firstElementChild)
            return;

        const [title, date, img] = ['dt a', 'dd:last-child', 'img'].map(x.querySelector.bind(x));
        //console.log(title, date, img);

        const card = document.createElement('a');
        card.href = title.href;
        card.setAttribute('class', 'col-sm-12 col-md-6 col-xl-3 bg-white shadow border');

        card.innerHTML += `
        <div class="m-2 m-md-3 rounded">
            <div class="card-body">
                <h6 class="card-title text-secondary mb-3">${title.textContent}</h6>
            </div>
        </div>`;

        if (img) {
            img.classList.add('w-100');
            card.querySelector('.card-body').appendChild(img);
        }

        section.appendChild(card);
    });

    return section;
}


function getBoard(template, title) {
    console.log('Original', template);

    const section = document.createElement('div');
    section.classList.add('col-lg-6', 'col-12', 'mb-4', 'bg-white', 'shadow');

    const ul = template.querySelector('.mobile-hide');
    ul.classList.add('px-3');
    section.appendChild(ul);

    section.querySelectorAll('li').forEach(x => x.classList.add('d-flex', 'w-100', 'my-2'));

    section.querySelectorAll('a').forEach(x => x.setAttribute('class', 'flex-grow-1 overflow-ellipsis font-weight-bolder text-dark'));
    section.querySelectorAll('span').forEach(x => x.classList.add('ms-3', 'text-muted'));
    section.prepend(getTitle(title, template.querySelector('a').href.split('?')[0]));
    return section;
}



let _shadow;
window.shadow = new Promise(resolve => _shadow = resolve);
window.addEventListener('DOMContentLoaded', () => {
    const shadow = (isDev ? document.body : document.querySelector('.container')).attachShadow({ mode: 'open' });
    const BootstrapLink = document.createElement('link');
    const style = document.createElement('style');
    _shadow(shadow);

    BootstrapLink.rel = 'stylesheet';
    BootstrapLink.href = document.querySelector('link[rel="preload"][as="style"]').href;
    style.textContent = `main {
        background: #f1f5fa;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    
    main *{
        text-decoration: none;
    }
    
    .row {
        --bs-gutter-x: 0;
    }
    
    .carousel-item {
        height: 50vh;
    }
    
    .blurred {
        top:0;
        bottom:0;
        filter: blur(20px);
    }
    
    .overflow-ellipsis { 
        text-overflow: ellipsis;
        overflow: hidden; 
        white-space: nowrap;
    }
    
    .title {
        padding-top: 0.3rem; 
        padding-bottom: 0.1rem;
        background: rgb(56,46,227);
        background: linear-gradient(90deg, rgba(56,46,227,1) 0%, rgba(53,72,167,1) 0%, rgba(56,207,227,1) 100%);
        font-family: 'Do Hyeon', sans-serif;
    }
    `;
    shadow.appendChild(BootstrapLink);
    shadow.appendChild(style);

    getTemplate().then(template => {
        console.log(template);

        const main = document.createElement('main');
        const sections = Array.prototype.slice.call(template.querySelectorAll('section'), 1, 10);
        main.classList.add('container-fluid', 'pb-5');

        try {
            const section = getCarousel(sections[5]);
            main.appendChild(section);
        }
        catch (error) {
            console.warn(error);
        }
        main.appendChild(getCards(sections[0], '뉴스'));

        const seminars = sections[1];
        /*[...seminars.querySelectorAll('li.material-type02')]
        .sort((a, b) => a.querySelector('dd:last-child').textContent.localeCompare(b.querySelector('dd:last-child').textContent))
            .forEach(x => seminars.appendChild(x));*/
        const events = sections[2];
        [...seminars.querySelectorAll('dd:last-child'), ...events.querySelectorAll('dd:last-child')]
        .forEach(x => x.textContent = '');
        main.appendChild(getCards(seminars, '세미나'));
        main.appendChild(getCards(events, '행사'));

        const boards = document.createElement('section');
        boards.appendChild(getBoard(sections[3], '학부 공지사항'));
        boards.appendChild(getBoard(sections[4], '대학원 공지사항'));
        boards.classList.add('row');
        boards.querySelectorAll('.title').forEach(x => {
            x.classList.remove('shadow');
        });
        main.appendChild(boards);


        try {
            const iframe = template.querySelector('iframe');
            main.appendChild(iframe);
        }
        catch (error) {
            console.error(error);
        }

        Array.prototype.slice.call(main.querySelectorAll('section'), 1).forEach(x => x.setAttribute('class', 'row m-3 m-lg-5 py-3'));
        isDev && main.querySelectorAll('img').forEach(x => x.src = 'img.png');

        shadow.appendChild(main);
    });
});


window.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.top-right-header-box ul');
    button.innerHTML += `<li>
        <a class="en">English Site</a>
    </li>`;

    button.querySelector('.en').addEventListener('click', () => window.shadow.then(shadow => shadow.querySelectorAll('[data-en]').forEach(x => x.textContent = x.dataset.en)))
});
