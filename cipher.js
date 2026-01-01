// 海门中学文化元素库
const HAIMEN_CULTURE = {
    buildings: [
        '弘謇楼', '行健楼', '博雅院', '致远馆', '思源堂',
        '明德楼', '求真楼', '务实堂', '博学院', '笃行馆'
    ],
    history: [
        '1903年创校', '张謇题写校名', '百年名校', '江苏省重点中学',
        '传承百年文脉', '培育时代英才', '历经沧桑岁月', '砥砺前行'
    ],
    motto: [
        '明德博学', '求真务实', '笃行致远', '弘毅自强',
        '格物致知', '诚意正心', '修身齐家', '立德树人'
    ],
    activities: [
        '校运会', '艺术节', '模联会议', '科技节', '读书节',
        '社团活动', '志愿服务', '研学旅行', '文化讲座'
    ],
    nature: [
        '梧桐大道', '银杏林', '樱花园', '荷花池', '紫藤长廊',
        '竹林深处', '桂花飘香', '月季盛开', '松柏常青'
    ],
    verbs: [
        '漫步在', '徜徉于', '驻足于', '穿过', '走过',
        '眺望', '回忆', '见证', '传承', '感受'
    ],
    adjectives: [
        '庄严的', '古朴的', '现代化的', '历史悠久的', '充满活力的',
        '宁静的', '书香浓郁的', '生机勃勃的', '底蕴深厚的'
    ]
};

// 生成基于token的伪随机数生成器
class SeededRandom {
    constructor(seed) {
        this.seed = this.hashCode(seed);
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    nextInt(max) {
        return Math.floor(this.next() * max);
    }

    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
}

// 创建动态映射表
function createMapping(token) {
    const random = new SeededRandom(token);
    const allChars = [];
    
    // 生成所有可能的字符（包括中文、英文、数字、标点）
    for (let i = 0x4e00; i <= 0x9fa5; i += 50) {
        allChars.push(String.fromCharCode(i));
    }
    for (let i = 33; i <= 126; i++) {
        allChars.push(String.fromCharCode(i));
    }
    
    const shuffled = random.shuffle(allChars);
    const mapping = new Map();
    
    // 创建字符到索引的映射
    for (let i = 0; i < 256; i++) {
        mapping.set(i, shuffled[i % shuffled.length]);
    }
    
    return mapping;
}

// 创建反向映射表
function createReverseMapping(token) {
    const mapping = createMapping(token);
    const reverseMap = new Map();
    
    for (const [key, value] of mapping) {
        reverseMap.set(value, key);
    }
    
    return reverseMap;
}

// 生成海门中学文化描述
function generateCultureText(data, token) {
    const random = new SeededRandom(token + data);
    const elements = [];
    
    // 随机选择文化元素
    const building = HAIMEN_CULTURE.buildings[random.nextInt(HAIMEN_CULTURE.buildings.length)];
    const verb = HAIMEN_CULTURE.verbs[random.nextInt(HAIMEN_CULTURE.verbs.length)];
    const adjective = HAIMEN_CULTURE.adjectives[random.nextInt(HAIMEN_CULTURE.adjectives.length)];
    const history = HAIMEN_CULTURE.history[random.nextInt(HAIMEN_CULTURE.history.length)];
    const motto = HAIMEN_CULTURE.motto[random.nextInt(HAIMEN_CULTURE.motto.length)];
    const activity = HAIMEN_CULTURE.activities[random.nextInt(HAIMEN_CULTURE.activities.length)];
    const nature = HAIMEN_CULTURE.nature[random.nextInt(HAIMEN_CULTURE.nature.length)];
    
    // 构造描述性句子
    const templates = [
        `${verb}${adjective}${building}，感受${history}的厚重底蕴。`,
        `${nature}边，${motto}的精神代代相传。`,
        `在${activity}中，学子们展现青春风采。`,
        `${building}见证了${history}，传承着${motto}的理念。`,
        `${adjective}${nature}旁，${building}静静矗立。`
    ];
    
    return templates[random.nextInt(templates.length)];
}

// 加密函数
function encrypt(text, token) {
    if (!text || !token) {
        throw new Error('文本和密钥不能为空');
    }
    
    if (text.length > 5000) {
        throw new Error('文本长度不能超过5000字符');
    }
    
    const timestamp = Date.now().toString();
    const random = new SeededRandom(token + timestamp);
    
    // 将文本转换为Base64以保持完整性
    const base64Text = btoa(unescape(encodeURIComponent(text)));
    
    // 将Base64文本分块处理
    const blockSize = 256;
    const blocks = [];
    
    for (let i = 0; i < base64Text.length; i += blockSize) {
        const block = base64Text.substring(i, Math.min(i + blockSize, base64Text.length));
        blocks.push(block);
    }
    
    // 创建每个块的映射
    const mapping = createMapping(token);
    
    // 加密每个块
    const encryptedBlocks = blocks.map((block, blockIndex) => {
        const encrypted = [];
        
        for (let i = 0; i < block.length; i++) {
            const charCode = block.charCodeAt(i);
            const mappedChar = mapping.get(charCode % 256);
            encrypted.push(mappedChar || block[i]);
        }
        
        const encryptedStr = encrypted.join('');
        const cultureText = generateCultureText(encryptedStr + blockIndex, token);
        
        return cultureText + '【' + encryptedStr + '】';
    });
    
    // 添加时间戳标记
    const timestampMarker = generateCultureText(timestamp, token);
    
    return `${timestampMarker}〖${timestamp}〗` + encryptedBlocks.join('');
}

// 解密函数
function decrypt(encryptedText, token) {
    if (!encryptedText || !token) {
        throw new Error('密文和密钥不能为空');
    }
    
    try {
        // 提取时间戳
        const timestampMatch = encryptedText.match(/〖(\d+)〗/);
        if (!timestampMatch) {
            throw new Error('无效的密文格式');
        }
        
        const timestamp = timestampMatch[1];
        const contentAfterTimestamp = encryptedText.substring(encryptedText.indexOf('〗') + 1);
        
        // 提取所有加密块
        const blockRegex = /【([^】]+)】/g;
        const blocks = [];
        let match;
        
        while ((match = blockRegex.exec(contentAfterTimestamp)) !== null) {
            blocks.push(match[1]);
        }
        
        if (blocks.length === 0) {
            throw new Error('未找到有效的加密内容');
        }
        
        // 创建反向映射
        const mapping = createMapping(token);
        const reverseMap = new Map();
        for (const [key, value] of mapping) {
            reverseMap.set(value, key);
        }
        
        // 解密每个块
        const decryptedBlocks = blocks.map(block => {
            const decrypted = [];
            
            for (let i = 0; i < block.length; i++) {
                const char = block[i];
                const originalCode = reverseMap.get(char);
                
                if (originalCode !== undefined) {
                    decrypted.push(String.fromCharCode(originalCode));
                } else {
                    decrypted.push(char);
                }
            }
            
            return decrypted.join('');
        });
        
        const base64Text = decryptedBlocks.join('');
        
        // 从Base64解码回原始文本
        return decodeURIComponent(escape(atob(base64Text)));
    } catch (error) {
        throw new Error('解密失败：' + error.message);
    }
}

// UI 交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    const tokenInput = document.getElementById('token');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const charCount = document.getElementById('charCount');
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const copyBtn = document.getElementById('copyBtn');
    const exampleBtn = document.getElementById('exampleBtn');
    
    // 字符计数
    inputText.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = `${count}/5000`;
        
        if (count > 4500) {
            charCount.style.color = '#dc3545';
        } else if (count > 4000) {
            charCount.style.color = '#ffc107';
        } else {
            charCount.style.color = '#666';
        }
    });
    
    // 加密按钮
    encryptBtn.addEventListener('click', function() {
        const token = tokenInput.value.trim();
        const text = inputText.value.trim();
        
        if (!token) {
            alert('请输入密钥');
            tokenInput.focus();
            return;
        }
        
        if (!text) {
            alert('请输入需要加密的文本');
            inputText.focus();
            return;
        }
        
        try {
            const encrypted = encrypt(text, token);
            outputText.value = encrypted;
        } catch (error) {
            alert('加密失败：' + error.message);
        }
    });
    
    // 解密按钮
    decryptBtn.addEventListener('click', function() {
        const token = tokenInput.value.trim();
        const text = inputText.value.trim();
        
        if (!token) {
            alert('请输入密钥');
            tokenInput.focus();
            return;
        }
        
        if (!text) {
            alert('请输入需要解密的文本');
            inputText.focus();
            return;
        }
        
        try {
            const decrypted = decrypt(text, token);
            outputText.value = decrypted;
        } catch (error) {
            alert('解密失败：' + error.message);
        }
    });
    
    // 复制按钮
    copyBtn.addEventListener('click', function() {
        if (!outputText.value) {
            alert('没有可复制的内容');
            return;
        }
        
        outputText.select();
        document.execCommand('copy');
        
        const originalText = this.textContent;
        this.textContent = '已复制！';
        setTimeout(() => {
            this.textContent = originalText;
        }, 2000);
    });
    
    // 示例文本按钮
    exampleBtn.addEventListener('click', function() {
        const exampleText = '这是一个测试文本，用于演示海门中学文化加密系统的功能。系统可以将任意文本加密为包含海门中学文化元素的自然语言段落。';
        inputText.value = exampleText;
        inputText.dispatchEvent(new Event('input'));
    });
});
