var request = require('request');

var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:90.0) Gecko/20100101 Firefox/90.0',
    'Accept': '*/*',
    'Accept-Language': 'en-GB,en;q=0.5',
    'Referer': 'https://social.beefeater.co.uk/',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'multipart/form-data; boundary=---------------------------6771139122198822583988785286',
    'Origin': 'https://social.beefeater.co.uk',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'TE': 'trailers',
};


async function getCode(code) {
    return new Promise(function (resolve, reject) {
        request({
            url: 'https://social.beefeater.co.uk/api/entrant/code',
            method: 'POST',
            headers: headers,
            body: `'$-----------------------------6771139122198822583988785286\r\nContent-Disposition: form-data; name="brand"\r\n\r\nbeefeater\r\n-----------------------------6771139122198822583988785286\r\nContent-Disposition: form-data; name="voucher_code"\r\n\r\n${code}\r\n-----------------------------6771139122198822583988785286--\r\n'`,
        }, function (error, response, body) {
            resolve(JSON.parse(body))
        });
    })
}


async function checkCode(code) {
    let body = await getCode(code)
    return body.next == 'data-capture'
}


module.exports.checkCode = checkCode