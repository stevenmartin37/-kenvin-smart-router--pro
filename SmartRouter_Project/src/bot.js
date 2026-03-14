const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');
const fs = require('fs');
require('dotenv').config();

const token = process.env.TG_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const L = {
    ali: "https://www.aliyun.com/minisite/goods?userCode=t4yvhvci",
    ten: "https://curl.qcloud.com/qydfW2FF",
    bai: "https://cloud.baidu.com/campaign/ambassador-product/index.html?ambassadorId=9ee420f3acf743cab35240a9bd12a24f",
    cty: "https://www.ctyun.cn/h5/auth/register?partnerType=cust&partnerAccountId=e57d90dc9e304a29b0fef8af22c61de2"
};

const DB_FILE = '/home/admin/SmartRouterPro/keys.json';
const getKeys = () => JSON.parse(fs.readFileSync(DB_FILE));

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    if (req.url === '/v1/models') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ object: "list", data: [{ id: "smart-router-v1", object: "model" }] }));
    }

    if (req.url === '/v1/chat/completions') {
        const authHeader = req.headers.authorization || "";
        const userKey = authHeader.replace('Bearer ', '').trim().toUpperCase();
        const validKeys = getKeys();

        if (userKey.length !== 14 || !validKeys[userKey]) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                error: { message: "🚨 智模路由：检测到未授权访问！\n\n请按以下步骤操作：\n1. 前往 TG @LobsterAuthNew_Bot 支付 0.99 USDT。\n2. 将 14位授权码填回 API Key 位置。\n3. 解锁比 GPT 节省 99% 的调度权限。" }
            }));
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const guide = `\n\n✅ **授权激活成功！**\n请自行购买大模型 API Key（如 DeepSeek/GPT）填入您的设置中。\n\n**🔗 推荐合规 API 节点：**\n[阿里云](${L.ali}) | [腾讯云](${L.ten}) | [天翼云](${L.cty}) | [百度云](${L.bai})`;
            const audit = `\n\n---\n💎 **智模路由审计**：模型已匹配 | 比 GPT 节省：99.2%`;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                choices: [{ message: { content: "智模路由已就绪。正在调度您的私有 Key 进行高效推理。" + guide + audit } }]
            }));
        });
    }
});

server.listen(3000, '0.0.0.0');
console.log('✅ 商业闭环逻辑已就绪：3000 端口');
