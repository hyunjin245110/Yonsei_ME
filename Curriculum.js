let Length;

Promise.all([1, 2].map(x =>
        fetch(`https://www.hwangsehyun.com/meyonsei/Curriculum-${x}.json`)
        .then(res => res.json())))
    .then(([{ Data }, { Data: Data2 }]) => {
        Length = Data.length;
        return Data.concat(Data2);
    })

    .then(Data => Array.prototype.filter.call(
            document.querySelectorAll(".content-box:first-child tbody td"),
            x => /[A-Z]{3}[0-9]{4}/.test(x.innerText)
        )
        .concat(...document.querySelectorAll(".content-box:not(:first-child) tbody td:first-child"))
        .reduce((accum, cur) => {
            const id = cur.innerText.trim();
            const Index = Data.findIndex(({ HAKNO }) => HAKNO === id);
            if(Index >= 0) {
                const Found = Data[Index];
                const hakgi = Index < Length ? 1 : 2;
                const date = new Date();
                const startyy = date.getFullYear();

                accum.push([cur, `http://ysweb.yonsei.ac.kr:8888/curri120601/curri_pop2.jsp?&hakno=${Found.HAKNO}&bb=${Found.BB}&sbb=${Found.SBB}&domain=H1&startyy=${startyy}&hakgi=${hakgi}`]);
            }
            return accum;
        }, [])
        .forEach(([element, href]) => {
            const a = document.createElement('a');
            a.classList.add('txt-blue', 'txt-line');
            a.innerText = element.innerHTML;
            Object.assign(a, { href });

            element.innerHTML = '';
            element.appendChild(a);
        }))

    .then(() => {
        const textarea = document.querySelector('textarea');
        textarea.style.width = window.innerWidth - 100;
        textarea.value = document.querySelector('#Content').innerHTML;
    });
