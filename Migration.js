let CACHE = "https://proxy.kbdlab.xyz/meyonsei"

caches.open('Migration')
    .then(cache => cache.add(CACHE));

CACHE = "https://proxy.kbdlab.xyz/meyonsei"

caches.open('Migration')
    .then(cache => cache.match(CACHE))
    .then(res => res.json())
    .then(async arr => {
        console.log(arr);
        for (let { Board, data } of arr) {
            const path = `/_custom/yonseidep/_common/board/index/${Board}.do?mode=insert&article.offset=0&articleLimit=10`;
            const body = new FormData();

            Object.entries(data).forEach(x => body.append(...x));
            body.append('csrfToken', document.querySelector('iframe').contentDocument.querySelector('input[name="csrfToken"]').value);

            fetch(path, {
                referrer: 'https://devcms.yonsei.ac.kr' + path,
                referrerPolicy: "no-referrer-when-downgrade",
                method: "POST",
                credentials: "include",
                body,
            });
        }
    });
