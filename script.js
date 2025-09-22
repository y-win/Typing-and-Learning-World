// ...原有数据和逻辑保持不变...

// 简易免费词库数据，实际可用开源词库JSON/API等替换
const wordBanks = {
  cte4: [
    { word: "abandon", phonetic: "/əˈbændən/", meaning: "放弃", exampleEn: "He abandoned the car in the parking lot.", exampleCn: "他把车丢在了停车场。" },
    { word: "ability", phonetic: "/əˈbɪləti/", meaning: "能力", exampleEn: "She has the ability to solve the problem.", exampleCn: "她有能力解决这个问题。" },
    { word: "account", phonetic: "/əˈkaʊnt/", meaning: "账户，解释", exampleEn: "I have a bank account.", exampleCn: "我有一个银行账户。" }
  ],
  cte6: [
    { word: "abstract", phonetic: "/ˈæbstrækt/", meaning: "摘要，抽象的", exampleEn: "This is an abstract idea.", exampleCn: "这是一个抽象的想法。" },
    { word: "accommodate", phonetic: "/əˈkɒmədeɪt/", meaning: "容纳，适应", exampleEn: "The hotel can accommodate 500 guests.", exampleCn: "这家酒店可容纳500位客人。" },
    { word: "acknowledge", phonetic: "/əkˈnɒlɪdʒ/", meaning: "承认，认可", exampleEn: "She refused to acknowledge her mistake.", exampleCn: "她拒绝承认自己的错误。" }
  ],
  ielts: [
    { word: "analyse", phonetic: "/ˈænəlaɪz/", meaning: "分析", exampleEn: "We need to analyse the results.", exampleCn: "我们需要分析结果。" },
    { word: "approach", phonetic: "/əˈprəʊtʃ/", meaning: "方法，接近", exampleEn: "He approached the problem differently.", exampleCn: "他以不同的方法处理这个问题。" },
    { word: "assume", phonetic: "/əˈsjuːm/", meaning: "假设，承担", exampleEn: "Don't assume too much.", exampleCn: "不要假设太多。" }
  ],
  toefl: [
    { word: "abundant", phonetic: "/əˈbʌndənt/", meaning: "丰富的", exampleEn: "The region has abundant natural resources.", exampleCn: "这个地区有丰富的自然资源。" },
    { word: "accelerate", phonetic: "/əkˈseləreɪt/", meaning: "加速", exampleEn: "The car accelerated quickly.", exampleCn: "汽车加速得很快。" },
    { word: "acquire", phonetic: "/əˈkwaɪər/", meaning: "获得", exampleEn: "Children acquire language easily.", exampleCn: "孩子们很容易习得语言。" }
  ]
};

let currentBank = "cte4";
let words = wordBanks[currentBank];
let currentIndex = 0;

// 学习记录，记录已看过的单词
let studyRecord = JSON.parse(localStorage.getItem("studyRecord") || '{}');

// 切换学习记录面板显示/隐藏
function toggleRecordPanel() {
  const panel = document.getElementById("record-panel");
  panel.classList.toggle("active");
}

// 刷新学习记录UI
function renderRecord() {
  const list = document.getElementById("record-list");
  list.innerHTML = "";
  const recordArr = studyRecord[currentBank] || [];
  if (recordArr.length === 0) {
    list.innerHTML = "<li style='color:#aaa;'>暂无记录</li>";
    return;
  }
  for (let i = recordArr.length - 1; i >= 0; i--) {
    const item = recordArr[i];
    const date = new Date(item.time).toLocaleString().replace(/\//g, '-');
    list.innerHTML += `<li><span>${item.word}</span><span style="font-size:.9em;color:#999;">${date.split(' ')[1]}</span></li>`;
  }
}

// 切换词库
function switchWordBank() {
  currentBank = document.getElementById('word-bank').value;
  words = wordBanks[currentBank];
  currentIndex = 0;
  loadWord();
  renderRecord();
}

// 加载单词到界面
function loadWord() {
  const w = words[currentIndex];
  document.getElementById("word").innerText = w.word;
  document.getElementById("phonetic").innerText = w.phonetic;
  document.getElementById("meaning").innerText = w.meaning;
  document.getElementById("example-en").innerText = w.exampleEn;
  document.getElementById("example-cn").innerText = w.exampleCn;
  // 默认隐藏例句
  document.getElementById("example-en").style.display = "none";
  document.getElementById("example-cn").style.display = "none";
  // 记录学习
  recordStudy(w.word);
  renderRecord();
}

// 记录学习单词
function recordStudy(word) {
  if (!studyRecord[currentBank]) studyRecord[currentBank] = [];
  // 如果已记录过该单词，则不重复记录
  if (studyRecord[currentBank].some(item => item.word === word)) return;
  studyRecord[currentBank].push({ word, time: Date.now() });
  localStorage.setItem("studyRecord", JSON.stringify(studyRecord));
}

// 例句显示/隐藏
function toggleDetails() {
  const en = document.getElementById("example-en");
  const cn = document.getElementById("example-cn");
  if (en.style.display === "none") {
    en.style.display = "block";
    cn.style.display = "block";
  } else {
    en.style.display = "none";
    cn.style.display = "none";
  }
}

// 朗读
function speakWord() {
  const word = words[currentIndex].word;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

// 下一个单词
function nextWord() {
  currentIndex = (currentIndex + 1) % words.length;
  loadWord();
}

// 上一个单词
function prevWord() {
  currentIndex = (currentIndex - 1 + words.length) % words.length;
  loadWord();
}

// 页面加载时
window.onload = function() {
  loadWord();
  renderRecord();
};