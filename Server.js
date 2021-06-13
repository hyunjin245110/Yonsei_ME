import sql from 'mssql';
import express from 'express';
import CORS from 'cors';

import { isMain } from './utils.js'

let data;

sql.connect({
        user: 'meyonsei',
        password: '1111',
        server: '119.205.211.56',
        database: 'meyonsei',
        options: {
            encrypt: true,
            trustServerCertificate: true,
        }
    }) //bbs_id, bbs_subject, reg_date
    .then(() => sql.query `SELECT * FROM op_board ORDER BY reg_date`)
    .then(({ recordset }) => //console.dir(recordset, { maxArrayLength: null }))
        data = recordset.map(({ bbs_id, bbs_subject, bbs_memo }) => ({
            Board: {
                //kor_notice: 3908,
                //kor_more: 3914,
                kor_news: 3915,
                kor_job: 3916,
            }[bbs_id],
            data: {
                articleNo: '',
                parentNo: 0,
                htmlYn: 'Y',
                articleTitle: bbs_subject || ' ',
                writerNm: '기계공학부',
                articleText: bbs_memo || ' ',
            },
        })).filter(x => x.Board))
    .then(() => console.log("Serving", data[0], data[data.length - 1]))
    .catch(console.log);

export const router = express.Router()
    .get('/', (req, res) => res.json(data));


isMain(
    import.meta.url) && function() {
    express().use(CORS({
            origin: [
                'https://devcms.yonsei.ac.kr',
                'https://kbdlab.hwangsehyun.com',
            ]
        })).use('/', router)
        .run(8000);
};
