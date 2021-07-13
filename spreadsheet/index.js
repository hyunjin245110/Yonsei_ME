const Document = '1TxxuvaXz1kVONdzyozlJptIR9sIU1sJNJYi3AwJVl-k';
const Key = "spreadsheet.json";

const { GoogleSpreadsheet } = require('google-spreadsheet');
const AWS = require('aws-sdk');

const { S3 } = AWS;
const s3 = new S3();

const main = () => (async() => {
        const { GOOGLE_KEY } = process.env;
        if (!GOOGLE_KEY)
            return Promise.reject("process.env.GOOGLE_KEY does not exsists!");

        const doc = new GoogleSpreadsheet(Document);
        doc.useApiKey(GOOGLE_KEY);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        let [rows] = await Promise.all([sheet.getRows(), sheet.loadHeaderRow()]);
        //rows.forEach(x => console.log(x._rawData));

        const { headerValues } = sheet;
        const IsIntern = headerValues.filter(x => x.startsWith('intern_'));
        const IsNotIntern = headerValues.filter(x => !x.startsWith('intern_'));
        console.log(IsIntern, IsNotIntern)

        rows = rows.map(row => {
            if (!row.intern_number)
                return row;

            const Intern = {};
            IsIntern.forEach(x => {
                const value = row[x];
                Intern[x.replace('intern_', '')] = value;
            });
            row.intern = Intern;
            return row;
        });

        rows.forEach(x => console.log(x.intern))

        return JSON.stringify(rows, [
            'intern',
            ...IsNotIntern,
            ...IsIntern.map(x => x.replace('intern_', '')),
        ]);
    })()
    .then(Body => s3.putObject({
        Bucket: "meyonsei",
        Key,
        Body,
        ContentType: "application/json",
        ACL: 'public-read',
    }).promise())
    .catch(error => error);

module.exports.handler = (event, context) => {
    if (context) context.callbackWaitsForEmptyEventLoop = false;

    console.log(event);
    //return new Promise(resolve => setTimeout(resolve, 1000000));
    return main(event).then(data => [data, data instanceof Error ? JSON.stringify(data, Object.getOwnPropertyNames(data)) : `
        <h1>Success!</h1>
        <a href="https://docs.google.com/spreadsheets/d/${Document}/edit#gid=0">Google Spreadsheet</a>
        <br/>
        <a href="https://meyonsei.s3-ap-northeast-2.amazonaws.com/${Key}">JSON<a/>
    `]).then(([data, body]) => ({
        body: `<html>
            <body>${body}</body>
        </html>
        `,
        isBase64Encoded: false,
        statusCode: data instanceof Error ? 500 : 200,
        headers: {
            'content-type': 'text/html'
        }
    }));
};

module.parent || main()
    .then(console.log)
    .catch(console.log);
