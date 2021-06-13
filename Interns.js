const CloudFront = t => 'https://cloudfront.hwangsehyun.com/proxy?' + new URLSearchParams({ t });
const ThreshholdWidth = 720;
const parser = new DOMParser();


let Sticky, Card, ScrollSpy, NavLinks, Content, ScrollSpyObj, Placeholders;

window.addEventListener('DOMContentLoaded', function () {
    Sticky = document.querySelector('.Sticky');
    Card = Sticky.firstElementChild;
    ScrollSpy = document.querySelector('#ScrollSpy');
    Placeholders = ScrollSpy.nextElementSibling;
    Content = document.querySelector('#Content');
    NavLinks = document.querySelectorAll('.nav-link');
});


let IsMobile;

function OnResize() {
    const BodyWidth = document.body.clientWidth;
    const _IsMobile = BodyWidth < ThreshholdWidth;

    if (_IsMobile) {
        ScrollSpy.style.width = "calc(100% - var(--bs-gutter-x)/2)";
        Card.style.width = 'unset';
    }
    else {
        ScrollSpy.style.width = "unset";
        Card.style.width = BodyWidth - ScrollSpy.scrollWidth + 'px';
    }

    if (IsMobile === _IsMobile)
        return IsMobile;

    IsMobile = _IsMobile;
    console.log('Changed to mobile layout:', IsMobile);

    if (IsMobile) {
        ScrollSpyObj && ScrollSpyObj.dispose();
        ScrollSpyObj = undefined;
        const Active = ScrollSpy.querySelector('.list-group-item-action.active');
        Active && Active.after(Card);
    }

    else {
        Sticky.appendChild(Card);
        try {
            ScrollSpyObj = new bootstrap.ScrollSpy(document.body, {
                target: ScrollSpy
            });
        }
        catch (error) {
            console.warn(error);
            $('body').scrollspy({ target: ScrollSpy });
        }
        //const Offsets = Array.prototype.map.call(Placeholders.children, x => window.pageYOffset + x.getBoundingClientRect().top);
        //ScrollSpyObj._offsets = Offsets;
        //console.log('New offset', Offsets);
    }





    return IsMobile;
}

window.onresize = OnResize;


const Handlers = [

    ({
        intern: {
            number,
            condition,
            supports,
            topics
        }
    }) => {

        Content.innerHTML = `
        <span class="display-1">${number}</span>
        <span class="display-5">의</span>
        <p class="display-5">학부 인턴을 모집합니다.</p>

        <h3>모집 대상</h3>
        <p>${condition}</p>

        <h3>수혜 사항</h3>
        <p>${supports}</p>

        <h3>연구 주제</h3>
        <ul class="list-unstyled"></ul>
        `;

        const list = Content.querySelector('ul');
        topics.split('\n').forEach(x => {
            const item = document.createElement('li');
            item.textContent = x;
            list.appendChild(item);
        });
    },


    ({ lab_image }) => {
        const image = 'https://hwangsehyun.s3-ap-southeast-1.amazonaws.com/meyonsei-labs/' + lab_image;
        Content.innerHTML = `
            <a target="_blank" href="${image}">
                <img
                    style="max-height: 50vh; max-width: 100%"
                    src="${image}"
                />
            </a>`;
    },


    ({ lab_video }) => {
        let video = '';

        if (lab_video.includes('drive.google.com'))
            video = lab_video;
        else if (lab_video.includes('https://youtu.be/'))
            video = 'https://www.youtube.com/embed/' + lab_video.split('https://youtu.be/')[1];
        else
            return;

        Content.innerHTML = `
        <iframe width="100%"
            frameBorder="0"
            allowfullscreen="allowfullscreen"
            mozallowfullscreen="mozallowfullscreen"
            msallowfullscreen="msallowfullscreen"
            oallowfullscreen="oallowfullscreen"
            webkitallowfullscreen="webkitallowfullscreen"
            src="${video}">
        </iframe>`;
    },

    ({ id }) => fetch(CloudFront('https://devcms.yonsei.ac.kr/faculty/name_search.do?' + new URLSearchParams({
        mode: 'report',
        userId: id,
    }))).then(res => res.text())
    .then(data => {
        console.log(data);
        Content.innerHTML = '';
        Content.appendChild(parser.parseFromString(data, 'text/html').querySelector('table'));
    }),


];


let ActiveHandlers = [];

function ScrollSpyHandler() {
    const Active = ScrollSpy.querySelector('.list-group-item-action.active');
    if (!Active)
        return;

    const { name } = Active.dataset;
    console.log(name);

    const row = data.find(x => x.name === name);
    const img = row.logo && CloudFront(row.logo);

    Card.querySelector('.card-body').innerHTML = `
        <h3>${name} ${row.name_en} 교수님</h3>
        <a target="_blank" href="${row.lab_link}">
            <h5>${row.lab_name}</h5>
            ${img ? `<img class="mw-100 "src="${img}"/>` :''}
        </a>
        `;

    if (Handlers.length !== NavLinks.length) {
        console.warn(Handlers, NavLinks);
        throw new Error('lengths do not match');
    }

    ActiveHandlers.forEach((x, i) => NavLinks[i].removeEventListener('click', x));
    ActiveHandlers = Handlers.map(x => x.bind(undefined, row));
    ActiveHandlers.forEach((x, i) => NavLinks[i].addEventListener('click', x));

    ActiveHandlers[0]();
    Handler({ target: NavLinks[0] });
}


function ScrollSpyOnClick(element) {
    if (ScrollSpyObj)
        return true;

    const Active = ScrollSpy.querySelector('.list-group-item-action.active');
    Active && Active.classList.remove('active');
    element.classList.add('active');

    try {
        ScrollSpyHandler();
        element.after(Card);
    }
    catch (error) {
        console.error(error);
        element.classList.remove('active');
    }
    return false;
}

let data;

let ActiveElement;

function Handler({ target }) {
    ActiveElement && ActiveElement.classList.remove('active');
    ActiveElement = target;
    target.classList.add('active');
}

fetch('https://hwangsehyun.s3-ap-southeast-1.amazonaws.com/meyonsei.json')
    .then(res => res.json())
    .then(_data => {
        console.log(_data);
        data = _data.filter(x => x.intern);
        console.log(data);

        data.forEach(x => {
            ScrollSpy.innerHTML += `
            <a href="#${x.name}"
                onclick="return ScrollSpyOnClick(this)"
                data-name="${x.name}"
                class="list-group-item list-group-item-action d-inline-flex"
            >

                <img src="${x.photo}" class="rounded-circle" style="height: 3rem; max-width: 3rem"/>

                <div class="d-flex flex-column flex-grow w-100 ml-3 text-nowrap " style="white-space: nowrap">
                    <div class="fw-bold">${x.name} ${x.name_en}</div>
                    <div class="flex-grow-1 position-relative" style="overflow-x: hidden">
                        <span class="LeftRight position-absolute">${x.lab_name}</span>
                    </div>
                </div>
            </a>
            `;

            const Placeholder = document.createElement('div');
            Placeholder.textContent = x.name;
            Placeholder.id = x.name;
            Placeholder.classList.add('flex-grow-1');
            Placeholders.appendChild(Placeholder);
        });

        /*Placeholders.isInViewport() ||
            Placeholders.scrollIntoView({
                block: 'nearest',
                smooth: true,
            });*/
        Placeholders.innerHTML += '<div style="height: 5rem"></div>';

        window.addEventListener('activate.bs.scrollspy', ScrollSpyHandler);

        NavLinks.forEach(x => x.addEventListener('click', Handler));

        return Promise.allSettled(Array.prototype.map.call(ScrollSpy.querySelectorAll('img'), x =>
            Promise.any(['load', 'error'].map(event =>
                new Promise(resolve =>
                    x.addEventListener(event, resolve, { once: true }))
            ))));

    })
    .then(console.log)
    .then(OnResize)
    .then(IsMobile => {
        const First = ScrollSpy.firstElementChild;
        First.classList.add('active');
        if (IsMobile) {
            ScrollSpyOnClick(First);
        }
        else
            ScrollSpyHandler();
    });
