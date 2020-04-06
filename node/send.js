const https = require('https')
const url = require('url')
const fs = require('fs')
const qs = require('querystring')
const multiparty = require('multiparty')

const httpsOption = {
    key: fs.readFileSync("./https/2_zhangpengfan.xyz.key"),
    cert: fs.readFileSync("./https/1_zhangpengfan.xyz_bundle.crt")
}

var app = https.createServer(httpsOption);


app.on('request', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const URL = url.parse(req.url, true);
    var NAME = URL.query.name
    console.log(URL);
    if (URL.pathname == '/setname') {
        let name = URL.query.name;
        if (fs.existsSync(`./users/${name}`)) {
            res.writeHead(200, { 'Content-Type': 'text/plain,charset=utf-8' });
            res.end('success')
            return
        }
        fs.mkdirSync(`./users/${name}`);
        fs.mkdirSync(`./users/${name}/img`)
        fs.mkdirSync(`./users/${name}/files`)
        let json = {
            message: [],
        }
        let str = JSON.stringify(json);
        fs.writeFileSync(`./users/${name}/${name}.json`, str);
        res.writeHead(200, { 'Content-Type': 'text/plain,charset=utf-8' });
        res.end('success')
    }
    if (URL.pathname == '/sendmessage') {
        let name = URL.query.name;
        let message = URL.query.message;
        let date = new Date();
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        let time = `${year}-${month}-${day}/${hour}:${minute}`
        let json = {
            'txt': message,
            'time': time,
            'type': 'txt'
        }
        fs.readFile(`./users/${name}/${name}.json`, (err, data) => {
            if (err) {
                return console.log(err)
            }
            let jsondata = JSON.parse(data.toString());
            jsondata.message.push(json);
            let str = JSON.stringify(jsondata)
            fs.writeFileSync(`./users/${name}/${name}.json`, str)
            res.writeHead(200, { 'Content-Type': 'text/plain,charset=utf-8' });
            res.end('success')
        })
    }
    if (URL.pathname == '/getuserjson') {
        fs.readFile(`./users/${NAME}/${NAME}.json`, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/plain,charset=utf-8' });
            res.end(data)
        })
    }
    if (URL.pathname == '/sendpic') {
        const form = new multiparty.Form({
            // uploadDir: '/usr/local/nginx/html/wx_send_img/' // 线上版
            uploadDir: './temp/' //开发版
        })
        let sendname = ''
        let filepath = ''
        let filename = ''
        form.parse(req) // 将请求参数传入，multiparty会进行相应处理
        form.on('field', (name, value) => { // 接收到数据参数时，触发field事件
            sendname = value;
        })

        form.on('file', (name, file, ...rest) => { // 接收到文件参数时，触发file事件
            filepath = file.path;
            filename = file.path.split('/')[6];
           
        })
       
        form.on('close', () => {  // 表单数据解析完成，触发close事件
            fs.readFile(`./users/${sendname}/${sendname}.json`, (err, data) => {
                let json = {
                    time: new Date(),
                    type: 'img',
                    url: `https://zhangpengfan.xyz/wx_send_img/${filename}`
                }
                let jsondata = JSON.parse(data.toString());
                jsondata.message.push(json);
                let str = JSON.stringify(jsondata);
                fs.writeFileSync(`./users/${sendname}/${sendname}.json`, str);
                res.writeHead(200, { 'Content-Type': 'text/plain,charset=utf-8' });
                res.end('success')
            })
          
        })


    }

})
app.listen(5002)

function deletefile (){
    let users = fs.readdirSync('./users')
    console.log(users)
    for(let i = 0;i<users.length;i++){
        let json = {
            message:[]
        }
        let str = JSON.stringify(json);
        fs.writeFileSync(`./users/${users[i]}/${users[i]}.json`,str);
    }
    let imgs = fs.readdirSync('/usr/local/nginx/html/wx_send_img/')
    for(let i =0;i<imgs.length;i++){
        fs.unlinkSync(`/usr/local/nginx/html/wx_send_img/${imgs[i]}`);
    }

}

setInterval(() => {
    deletefile() 
}, 604800000);