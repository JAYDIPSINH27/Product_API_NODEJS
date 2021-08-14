const fs = require('fs');
const http = require('http');
const url = require('url');


const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%TYPE%}/g, product.type);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.discount) output = output.replace(/{%NOT_DISCOUNT%}/g, 'not-discount');
    return output;
}
const tempOverview = fs.readFileSync(`${__dirname}/src/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/src/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/src/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/src/jsondata/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//Create Server
const server = http.createServer((req, res) => {
    
    
    const { query, pathname } = url.parse(req.url, true);
    //console.log(req.url);
    //console.log(url.parse(req.url, true));
    //const pathName = req.url;
    
    // Overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, { 'Content-type': 'text/html'})
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el));
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    // Product page
    } else if (pathname === '/product'){
        res.writeHead(200, { 'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API page
    }else if(pathname === '/api'){
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data);
 
    // Not found
    }else{
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header': '404Error'
        });
        fs.createReadStream('404.html').pipe(res);
    }
});

// Server Listening
server.listen(5000, '127.0.0.1', ()=>{
    console.log('Listening request on port 5000');
});