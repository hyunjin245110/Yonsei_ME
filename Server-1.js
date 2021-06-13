import sql from 'mssql';
import express from 'express';
import CORS from 'cors';
let arr;

sql.connect('mssql://meyonsei:1111@119.205.211.56/meyonsei')
    .then(() => sql.query `SELECT bbs_id, bbs_subject, reg_date FROM op_board ORDER BY reg_date`)
    .then(({ recordset }) => //console.dir(recordset, { maxArrayLength: null }))
        arr = recordset.map(({ bbs_id, bbs_subject, bbs_memo }) => ({
            Board: {
                kor_notice: 3914,
                kor_more: 3908,
            }[bbs_id],
            body: {
                articleNo: '',
                parentNo: 0,
                htmlYn: 'Y',
                articleTitle: bbs_subject || '',
                writerNm: '기계공학부',
                articleText: bbs_memo || '',
            },
        })).filter(x => x.Board))
    .catch(console.log);

export const router = express.Router()
    .use(CORS({
        origin: 'https://devcms.yonsei.ac.kr'
    }))
    .get('/', (req, res) => {
        res.json(arr);
        return;

        fn(Token)
            .then(data => console.log('Success:', data))
            .catch(error => {
                delete error.timings;
                console.log(error);
                arr.unshift(fn);
            });
    });
