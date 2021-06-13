//https://devcms.yonsei.ac.kr/me/faculty/professor_list.do

JSON.stringify(Array.prototype.map.call(document.querySelectorAll('.board-faculty-box'), x => {
    const arr = [
        x.querySelector('dt').textContent.trim(),
        x.querySelector('img').src
    ];
    const { href } = x.querySelector('.board-faculty-shortcut') || {};
    if (!href)
        return arr;
    arr.push(new URLSearchParams(new URL(href).search).get('userId'));
    return arr;
}));
