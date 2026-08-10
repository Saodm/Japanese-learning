
(function() {
  // Data
  // 三种假名的数据（平假名 / 片假名 / 罗马音）
  const GROUPS = [
    {
      id: 1, name: '清音', emoji: '🌸',
      data: [
        ['あ','ア','a'],['い','イ','i'],['う','ウ','u'],['え','エ','e'],['お','オ','o'],
        ['か','カ','ka'],['き','キ','ki'],['く','ク','ku'],['け','ケ','ke'],['こ','コ','ko'],
        ['さ','サ','sa'],['し','シ','shi'],['す','ス','su'],['せ','セ','se'],['そ','ソ','so'],
        ['た','タ','ta'],['ち','チ','chi'],['つ','ツ','tsu'],['て','テ','te'],['と','ト','to'],
        ['な','ナ','na'],['に','ニ','ni'],['ぬ','ヌ','nu'],['ね','ネ','ne'],['の','ノ','no'],
        ['は','ハ','ha'],['ひ','ヒ','hi'],['ふ','フ','fu'],['へ','ヘ','he'],['ほ','ホ','ho'],
        ['ま','マ','ma'],['み','ミ','mi'],['む','ム','mu'],['め','メ','me'],['も','モ','mo'],
        ['や','ヤ','ya'],['ゆ','ユ','yu'],['よ','ヨ','yo'],
        ['ら','ラ','ra'],['り','リ','ri'],['る','ル','ru'],['れ','レ','re'],['ろ','ロ','ro'],
        ['わ','ワ','wa'],['を','ヲ','wo'],['ん','ン','n'],
      ]
    },
    {
      id: 2, name: '浊音・半浊音', emoji: '🌊',
      data: [
        ['が','ガ','ga'],['ぎ','ギ','gi'],['ぐ','グ','gu'],['げ','ゲ','ge'],['ご','ゴ','go'],
        ['ざ','ザ','za'],['じ','ジ','ji'],['ず','ズ','zu'],['ぜ','ゼ','ze'],['ぞ','ゾ','zo'],
        ['だ','ダ','da'],['ぢ','ヂ','di'],['づ','ヅ','du'],['で','デ','de'],['ど','ド','do'],
        ['ば','バ','ba'],['び','ビ','bi'],['ぶ','ブ','bu'],['べ','ベ','be'],['ぼ','ボ','bo'],
        ['ぱ','パ','pa'],['ぴ','ピ','pi'],['ぷ','プ','pu'],['ぺ','ペ','pe'],['ぽ','ポ','po'],
      ]
    },
    {
      id: 3, name: '拗音', emoji: '🍡',
      data: [
        ['きゃ','キャ','kya'],['きゅ','キュ','kyu'],['きょ','キョ','kyo'],
        ['しゃ','シャ','sha'],['しゅ','シュ','shu'],['しょ','ショ','sho'],
        ['ちゃ','チャ','cha'],['ちゅ','チュ','chu'],['ちょ','チョ','cho'],
        ['にゃ','ニャ','nya'],['にゅ','ニュ','nyu'],['にょ','ニョ','nyo'],
        ['ひゃ','ヒャ','hya'],['ひゅ','ヒュ','hyu'],['ひょ','ヒョ','hyo'],
        ['みゃ','ミャ','mya'],['みゅ','ミュ','myu'],['みょ','ミョ','myo'],
        ['りゃ','リャ','rya'],['りゅ','リュ','ryu'],['りょ','リョ','ryo'],
        ['ぎゃ','ギャ','gya'],['ぎゅ','ギュ','gyu'],['ぎょ','ギョ','gyo'],
        ['じゃ','ジャ','ja'],['じゅ','ジュ','ju'],['じょ','ジョ','jo'],
        ['びゃ','ビャ','bya'],['びゅ','ビュ','byu'],['びょ','ビョ','byo'],
        ['ぴゃ','ピャ','pya'],['ぴゅ','ピュ','pyu'],['ぴょ','ピョ','pyo'],
      ]
    },
  ];

  // 五种考察方式：同一种音内部的五个关卡各用一种
  const MODE_DEFS = {
    1: { name: '拖拽配对', emoji: '🖐️', desc: '把假名拖到对应的罗马音' },
    2: { name: '假名选读音', emoji: '🔤', desc: '看假名，选出正确的罗马音' },
    3: { name: '读音选假名', emoji: '🎴', desc: '看罗马音，选出对应的假名' },
    4: { name: '翻牌配对', emoji: '🃏', desc: '翻开卡片，配成假名与罗马音' },
    5: { name: '听力挑战', emoji: '🎧', desc: '听读音，选出对应的假名' },
  };

  // 15 个关卡：清音 / 浊音・半浊音 / 拗音 各 5 关
  const LEVELS = [];
  for (let g = 0; g < GROUPS.length; g++) {
    for (let m = 1; m <= 5; m++) {
      LEVELS.push({
        id: g * 5 + m,
        groupId: GROUPS[g].id,
        groupName: GROUPS[g].name,
        emoji: GROUPS[g].emoji,
        data: GROUPS[g].data,
        mode: m,
        modeName: MODE_DEFS[m].name,
        desc: MODE_DEFS[m].desc,
        rounds: 5,
      });
    }
  }

  // 图表数据（平假名 / 片假名 / 罗马音）
  const CHART_SEION = [
    ['あ行', [['あ','ア','a'],['い','イ','i'],['う','ウ','u'],['え','エ','e'],['お','オ','o']]],
    ['か行', [['か','カ','ka'],['き','キ','ki'],['く','ク','ku'],['け','ケ','ke'],['こ','コ','ko']]],
    ['さ行', [['さ','サ','sa'],['し','シ','shi'],['す','ス','su'],['せ','セ','se'],['そ','ソ','so']]],
    ['た行', [['た','タ','ta'],['ち','チ','chi'],['つ','ツ','tsu'],['て','テ','te'],['と','ト','to']]],
    ['な行', [['な','ナ','na'],['に','ニ','ni'],['ぬ','ヌ','nu'],['ね','ネ','ne'],['の','ノ','no']]],
    ['は行', [['は','ハ','ha'],['ひ','ヒ','hi'],['ふ','フ','fu'],['へ','ヘ','he'],['ほ','ホ','ho']]],
    ['ま行', [['ま','マ','ma'],['み','ミ','mi'],['む','ム','mu'],['め','メ','me'],['も','モ','mo']]],
    ['や行', [['や','ヤ','ya'],null,['ゆ','ユ','yu'],null,['よ','ヨ','yo']]],
    ['ら行', [['ら','ラ','ra'],['り','リ','ri'],['る','ル','ru'],['れ','レ','re'],['ろ','ロ','ro']]],
    ['わ行', [['わ','ワ','wa'],null,null,null,['を','ヲ','wo']]],
    ['ん行', [['ん','ン','n'],null,null,null,null]],
  ];
  const CHART_DAKUON = [
    ['が行', [['が','ガ','ga'],['ぎ','ギ','gi'],['ぐ','グ','gu'],['げ','ゲ','ge'],['ご','ゴ','go']]],
    ['ざ行', [['ざ','ザ','za'],['じ','ジ','ji'],['ず','ズ','zu'],['ぜ','ゼ','ze'],['ぞ','ゾ','zo']]],
    ['だ行', [['だ','ダ','da'],['ぢ','ヂ','di'],['づ','ヅ','du'],['で','デ','de'],['ど','ド','do']]],
    ['ば行', [['ば','バ','ba'],['び','ビ','bi'],['ぶ','ブ','bu'],['べ','ベ','be'],['ぼ','ボ','bo']]],
    ['ぱ行', [['ぱ','パ','pa'],['ぴ','ピ','pi'],['ぷ','プ','pu'],['ぺ','ペ','pe'],['ぽ','ポ','po']]],
  ];
  const CHART_YOUON = [
    ['きゃ行', [['きゃ','キャ','kya'],['きゅ','キュ','kyu'],['きょ','キョ','kyo']]],
    ['しゃ行', [['しゃ','シャ','sha'],['しゅ','シュ','shu'],['しょ','ショ','sho']]],
    ['ちゃ行', [['ちゃ','チャ','cha'],['ちゅ','チュ','chu'],['ちょ','チョ','cho']]],
    ['にゃ行', [['にゃ','ニャ','nya'],['にゅ','ニュ','nyu'],['にょ','ニョ','nyo']]],
    ['ひゃ行', [['ひゃ','ヒャ','hya'],['ひゅ','ヒュ','hyu'],['ひょ','ヒョ','hyo']]],
    ['みゃ行', [['みゃ','ミャ','mya'],['みゅ','ミュ','myu'],['みょ','ミョ','myo']]],
    ['りゃ行', [['りゃ','リャ','rya'],['りゅ','リュ','ryu'],['りょ','リョ','ryo']]],
    ['ぎゃ行', [['ぎゃ','ギャ','gya'],['ぎゅ','ギュ','gyu'],['ぎょ','ギョ','gyo']]],
    ['じゃ行', [['じゃ','ジャ','ja'],['じゅ','ジュ','ju'],['じょ','ジョ','jo']]],
    ['びゃ行', [['びゃ','ビャ','bya'],['びゅ','ビュ','byu'],['びょ','ビョ','byo']]],
    ['ぴゃ行', [['ぴゃ','ピャ','pya'],['ぴゅ','ピュ','pyu'],['ぴょ','ピョ','pyo']]],
  ];

  const KANA_COUNT = 5;
  const STORAGE_KEY = 'kana_wrong_answers';
  const STARS_KEY = 'kana_level_stars';

  let testMode = false;   // 测试模式：主页输入 saodm 临时开启，刷新即恢复
  let typedSeq = '';

  // State
  let currentView = 'home';
  let currentLevel = 1;
  let currentRound = 1;
  let totalErrors = 0;          // errors across all rounds of current level
  let roundKana = [];           // [{hiragana, katakana, romaji, showAs}, ...]
  let romajiOptions = [];       // strings
  let placements = {};          // { kanaIndex: zoneIndex }
  let reversePlacements = {};   // { zoneIndex: kanaIndex }
  let roundChecked = false;     // has current round been checked & passed?
  let roundCheckedResult = {};  // { zoneIndex: true|false } — result of last check

  // 四选一 / 翻牌配对状态
  let quizOrder = [];
  let quizIndex = 0;
  let quizAnswered = false;
  let quizTimer = null;
  let matchCards = [];
  let matchFlipped = [];
  let matchLockedCount = 0;
  let matchBusy = false;
  let matchTimer = null;

  // Drag state
  let dragInfo = null;          // drag metadata
  const DRAG_DEADZONE = 6;      // px — minimum movement before real drag starts
  const SNAP_THRESHOLD = 90;    // px — 吸附距离上限（实际阈值会随框大小缩放）

  // 拖动期间锁定页面滚动，避免移动端手指拖动时页面跟着滚导致定位错乱
  let dragTouchLockHandler = null;
  function setDragTouchLock(on) {
    if (on) {
      document.body.style.overflow = 'hidden';
      dragTouchLockHandler = (e) => { e.preventDefault(); };
      document.addEventListener('touchmove', dragTouchLockHandler, { passive: false });
    } else {
      document.body.style.overflow = '';
      if (dragTouchLockHandler) document.removeEventListener('touchmove', dragTouchLockHandler);
      dragTouchLockHandler = null;
    }
  }

  // DOM
  const $ = s => document.querySelector(s);
  const homeView = $('#homeView');
  const levelsView = $('#levelsView');
  const gameView = $('#gameView');
  const chartView = $('#chartView');
  const wrongAnswersView = $('#wrongAnswersView');
  const homeProgress = $('#homeProgress');
  const levelsList = $('#levelsList');
  const chartContent = $('#chartContent');
  const kanaPool = $('#kanaPool');
  const romajiGrid = $('#romajiGrid');
  const quizArea = $('#quizArea');
  const btnCheck = $('#btnCheck');
  const btnRoundNext = $('#btnRoundNext');
  const roundBadge = $('#roundBadge');
  const levelBadge = $('#levelBadge');
  const errorBadge = $('#errorBadge');
  const hintText = $('#hintText');
  const starOverlay = $('#starOverlay');
  const starsRow = $('#starsRow');
  const starTitle = $('#starTitle');
  const starLevelLabel = $('#starLevelLabel');
  const starSummary = $('#starSummary');
  const btnStarNext = $('#btnStarNext');
  const gamePanel = $('#gamePanel');
  const waContent = $('#waContent');

  // View switching
  function showView(name) {
    currentView = name;
    homeView.classList.toggle('active', name === 'home');
    levelsView.classList.toggle('active', name === 'levels');
    gameView.classList.toggle('active', name === 'game');
    chartView.classList.toggle('active', name === 'chart');
    wrongAnswersView.classList.toggle('active', name === 'wrongAnswers');
    memorySetsView.classList.toggle('active', name === 'memorySets');
    memoryView.classList.toggle('active', name === 'memory');
  }

  // Persistence
  function loadWrongAnswers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }
  function saveWrongAnswers(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch { /* quota exceeded */ }
  }
  function recordWrongAnswer(level, kanaChar, kanaType, romaji, userRomaji) {
    const data = loadWrongAnswers();
    const lvl = data[level] = data[level] || {};
    const key = `${kanaChar}|${romaji}`;
    if (lvl[key]) {
      lvl[key].count++;
    } else {
      lvl[key] = { kana: kanaChar, kanaType, romaji, count: 1 };
    }
    saveWrongAnswers(data);
  }
  function clearWrongAnswers(level) {
    const data = loadWrongAnswers();
    if (level) delete data[level];
    saveWrongAnswers(data);
  }
  function loadStars() {
    try { return JSON.parse(localStorage.getItem(STARS_KEY)) || {}; }
    catch { return {}; }
  }
  function saveStars(levelId, stars) {
    if (testMode) return; // 测试模式不写数据，退出后恢复原样
    const data = loadStars();
    data[levelId] = Math.max(data[levelId] || 0, stars);
    try { localStorage.setItem(STARS_KEY, JSON.stringify(data)); }
    catch { /* quota exceeded */ }
  }

  // Helpers
  function shuffle(arr) { const a = arr.slice(); for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

  // Round setup
  function setupRound(levelId, rNum) {
    currentLevel = levelId;
    currentRound = rNum;
    const lv = LEVELS[levelId - 1];
    const levelData = lv.data;
    const shuffledData = shuffle(levelData);
    const picked = shuffledData.slice(0, KANA_COUNT);

    roundKana = picked.map(([h, k, r]) => ({
      hiragana: h, katakana: k, romaji: r,
      showAs: Math.random() < 0.5 ? 'hiragana' : 'katakana',
    }));

    // 拖拽区域只在“拖拽配对”关卡显示，其他关卡显示 quizArea
    const isDrag = lv.mode === 1;
    const dragParts = [kanaPool, romajiGrid, ...gamePanel.querySelectorAll('.section-label, .divider')];
    dragParts.forEach(el => { el.style.display = isDrag ? '' : 'none'; });
    quizArea.style.display = isDrag ? 'none' : 'block';

    roundChecked = false;
    roundCheckedResult = {};

    if (isDrag) {
      // 第 3、4、5 轮为“七选五”：5 个正确罗马音 + 2 个干扰项
      const correctRomaji = roundKana.map(k => k.romaji);
      if (rNum >= 3) {
        const others = levelData.filter(([,,r]) => !correctRomaji.includes(r));
        const extras = shuffle(others).slice(0, 2).map(([,,r]) => r);
        romajiOptions = shuffle([...correctRomaji, ...extras]);
      } else {
        romajiOptions = shuffle(correctRomaji);
      }
      placements = {};
      reversePlacements = {};
      renderGame();
    } else if (lv.mode === 4) {
      setupMatch();
    } else {
      setupQuiz();
    }
    updateUI();
  }

  function renderGame() {
    // Kana pool
    kanaPool.innerHTML = '';
    roundKana.forEach((k, i) => {
      const card = createKanaCard(k, i);
      if (!(i in placements)) {
        kanaPool.appendChild(card);
      }
    });

    // Romaji zones
    romajiGrid.innerHTML = '';
    romajiOptions.forEach((r, i) => {
      const zone = document.createElement('div');
      zone.className = 'romaji-zone';
      zone.dataset.zoneIndex = i;
      zone.innerHTML = `<span class="zone-label">${r}</span>`;
      romajiGrid.appendChild(zone);
    });

    // 根据选项数量切换网格列数（7 个选项时排成一行）
    romajiGrid.classList.toggle('cols-7', romajiOptions.length > 5);

    // Place kana that are already assigned into their zones
    for (const [ki, zi] of Object.entries(placements)) {
      const zone = romajiGrid.querySelectorAll('.romaji-zone')[zi];
      if (zone) {
        const k = roundKana[ki];
        const card = createKanaCard(k, parseInt(ki));
        card.classList.add('in-zone');
        zone.appendChild(card);
        zone.classList.add('filled');
      }
    }

    // Grey out placed kana in pool
    updatePoolGhosts();
  }

  function createKanaCard(kanaObj, index) {
    const card = document.createElement('div');
    card.className = 'kana-card';
    card.dataset.kanaIndex = index;
    card.textContent = kanaObj.showAs === 'hiragana' ? kanaObj.hiragana : kanaObj.katakana;
    card.setAttribute('draggable', 'false');

    // Pointer events for drag
    card.addEventListener('pointerdown', (e) => onDragStart(e, card, index));
    // Touch: prevent scrolling while dragging
    card.addEventListener('touchstart', (e) => {
      // don't preventDefault here, let pointerdown handle it
    }, { passive: true });

    return card;
  }

  function updatePoolGhosts() {
    // Cards in pool that are placed
    kanaPool.querySelectorAll('.kana-card').forEach(card => {
      const ki = parseInt(card.dataset.kanaIndex);
      card.classList.toggle('placed', ki in placements);
    });
  }

  function updateUI() {
    const lv = LEVELS[currentLevel - 1];
    levelBadge.textContent = `第${currentLevel}关 · ${lv.groupName} · ${lv.modeName}`;
    roundBadge.textContent = `第${currentRound}轮/共${lv.rounds}轮`;
    errorBadge.textContent = `⚠️ ${totalErrors}次`;

    if (lv.mode === 1) {
      const placed = Object.keys(placements).length;
      const need = KANA_COUNT;
      if (roundChecked) {
        hintText.textContent = '✅ 正确！';
        btnCheck.style.display = 'none';
        btnRoundNext.style.display = 'inline-block';
      } else {
        hintText.textContent = placed >= need ? '准备完成，点击确认' : `还差 ${need - placed} 个`;
        btnCheck.style.display = 'inline-block';
        btnCheck.disabled = placed < need;
        btnRoundNext.style.display = 'none';
      }
    } else if (lv.mode === 4) {
      btnCheck.style.display = 'none';
      if (roundChecked) {
        hintText.textContent = '✅ 全部配对完成！';
        btnRoundNext.style.display = 'inline-block';
      } else {
        hintText.textContent = `已配对 ${matchLockedCount}/${KANA_COUNT}`;
        btnRoundNext.style.display = 'none';
      }
    } else {
      btnCheck.style.display = 'none';
      if (roundChecked) {
        hintText.textContent = '✅ 本轮完成！';
        btnRoundNext.style.display = 'inline-block';
      } else {
        hintText.textContent = `第 ${quizIndex + 1} / ${KANA_COUNT} 题`;
        btnRoundNext.style.display = 'none';
      }
    }

    if (roundChecked) {
      btnRoundNext.textContent = currentRound >= lv.rounds ? '🎉 查看结果' : '下一轮 →';
    }
  }

  // ═══════════ 考察方式：四选一（模式 2/3/5）与翻牌配对（模式 4） ═══════════
  function levelRomaPool(lv) { return lv.data.map(d => d[2]); }

  function setupQuiz() {
    quizOrder = shuffle([0, 1, 2, 3, 4]);
    quizIndex = 0;
    quizAnswered = false;
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const lv = LEVELS[currentLevel - 1];
    const k = roundKana[quizOrder[quizIndex]];
    const h = k.hiragana, kata = k.katakana, romaji = k.romaji;
    let prompt = '', correctLabel = '', optionClass = 'kana', opts = [], glyphHtml = '';

    if (lv.mode === 2) {
      const glyph = k.showAs === 'hiragana' ? h : kata;
      prompt = '它读什么？';
      correctLabel = romaji;
      optionClass = 'roma';
      opts = pickDistractors(levelRomaPool(lv), romaji, 3, x => (x[x.length - 1] === romaji[romaji.length - 1] ? 1 : 0));
      glyphHtml = `<div class="quiz-glyph">${glyph}</div>`;
    } else if (lv.mode === 3) {
      const useKata = Math.random() < 0.5;
      const pool = lv.data.map(d => (useKata ? d[1] : d[0]));
      correctLabel = useKata ? kata : h;
      prompt = `哪个${useKata ? '片' : '平'}假名读「${romaji}」？`;
      opts = pickDistractors(pool, correctLabel, 3, x => (x[0] === h[0] ? 1 : 0));
    } else {
      prompt = '听一听，你听到的是哪个假名？';
      correctLabel = h;
      opts = pickDistractors(lv.data.map(d => d[0]), h, 3, x => (x[0] === h[0] ? 1 : 0));
      glyphHtml = '<div class="quiz-glyph">🎧</div>';
      speakKana(h);
    }

    const optHtml = opts.map((label, i) =>
      `<button class="opt-card ${optionClass}" data-opt="${i}">${label}</button>`).join('');
    quizArea.innerHTML = `
      <div class="quiz-box">
        <p class="quiz-progress">第 ${quizIndex + 1} / ${KANA_COUNT} 题</p>
        ${lv.mode === 5 ? '<button class="btn btn-secondary btn-small" id="btnReplay">🔊 再听一遍</button>' : ''}
        <div class="quiz-prompt">${prompt}</div>
        ${glyphHtml}
        <div class="opt-grid">${optHtml}</div>
        <p class="mem-feedback" id="quizFeedback"></p>
      </div>`;

    const replay = document.getElementById('btnReplay');
    if (replay) replay.addEventListener('click', () => speakKana(h));

    // 每道新题都重置答题状态，否则答完第一题后面全部点不动
    quizAnswered = false;
    const kanaForRecord = k.showAs === 'hiragana' ? h : kata;
    quizArea.querySelectorAll('.opt-card').forEach(el => {
      el.addEventListener('click', () => {
        if (quizAnswered) return;
        quizAnswered = true;
        const idx = parseInt(el.dataset.opt);
        const chosen = opts[idx];
        const isCorrect = chosen === correctLabel;
        const fb = document.getElementById('quizFeedback');
        if (isCorrect) {
          el.classList.add('correct');
          fb.textContent = '✓ 正确！';
          fb.className = 'mem-feedback ok';
        } else {
          totalErrors++;
          errorBadge.textContent = `⚠️ ${totalErrors}次`;
          el.classList.add('wrong');
          fb.textContent = `正确答案是「${correctLabel}」`;
          fb.className = 'mem-feedback bad';
          opts.forEach((o, i) => {
            if (o === correctLabel) quizArea.querySelectorAll('.opt-card')[i].classList.add('correct');
          });
          recordWrongAnswer(currentLevel, kanaForRecord, k.showAs, romaji, chosen);
        }
        quizTimer = setTimeout(advanceQuiz, 950);
      });
    });
  }

  function advanceQuiz() {
    quizIndex++;
    if (quizIndex >= KANA_COUNT) {
      roundChecked = true;
      updateUI();
    } else {
      renderQuizQuestion();
      updateUI();
    }
  }

  function setupMatch() {
    const cards = [];
    roundKana.forEach((k, i) => {
      cards.push({ kind: 'kana', ki: i, label: k.showAs === 'hiragana' ? k.hiragana : k.katakana, flipped: false, matched: false });
      cards.push({ kind: 'roma', ki: i, label: k.romaji, flipped: false, matched: false });
    });
    matchCards = shuffle(cards);
    matchFlipped = [];
    matchLockedCount = 0;
    matchBusy = false;
    renderMatch();
  }

  function renderMatch() {
    quizArea.innerHTML = `
      <div class="quiz-box">
        <p class="quiz-progress">先翻一张假名卡，再翻一张罗马音卡：配对成功会保留，配错会翻回去，记住位置</p>
        <div class="match-grid">
          ${matchCards.map((c, i) => `
            <button class="match-card" data-i="${i}">
              <span class="match-back">❓</span>
              <span class="match-front ${c.kind}">${c.label}</span>
            </button>`).join('')}
        </div>
        <p class="mem-feedback" id="quizFeedback"></p>
      </div>`;
    quizArea.querySelectorAll('.match-card').forEach(btn => {
      btn.addEventListener('click', () => onMatchClick(parseInt(btn.dataset.i), btn));
    });
  }

  function onMatchClick(i, btn) {
    if (roundChecked || matchBusy) return;
    const c = matchCards[i];
    if (c.matched || c.flipped) return;
    if (matchFlipped.length >= 2) return;

    c.flipped = true;
    btn.classList.add('flipped');
    matchFlipped.push({ i, btn });

    if (matchFlipped.length === 2) {
      const [a, b] = matchFlipped;
      const ca = matchCards[a.i];
      const cb = matchCards[b.i];
      if (ca.ki === cb.ki && ca.kind !== cb.kind) {
        ca.matched = cb.matched = true;
        matchLockedCount++;
        a.btn.classList.add('matched');
        b.btn.classList.add('matched');
        matchFlipped = [];
        if (matchLockedCount === KANA_COUNT) {
          roundChecked = true;
          updateUI();
        }
      } else {
        matchBusy = true;
        totalErrors++;
        errorBadge.textContent = `⚠️ ${totalErrors}次`;
        a.btn.classList.add('wrong-flash');
        b.btn.classList.add('wrong-flash');
        const kanaCard = ca.kind === 'kana' ? ca : cb;
        const k = roundKana[kanaCard.ki];
        recordWrongAnswer(currentLevel, kanaCard.label, k.showAs, k.romaji, '配错');
        matchTimer = setTimeout(() => {
          a.btn.classList.remove('flipped', 'wrong-flash');
          b.btn.classList.remove('flipped', 'wrong-flash');
          ca.flipped = cb.flipped = false;
          matchFlipped = [];
          matchBusy = false;
        }, 750);
      }
    }
  }

  // 上一关获得至少 1 星才能解锁下一关
  function isLevelUnlocked(levelId) {
    if (testMode) return true; // 测试模式全部解锁
    const lv = LEVELS[levelId - 1];
    if (!lv || lv.mode === 1) return true;
    const prevStars = loadStars()[levelId - 1] || 0;
    return prevStars >= 1;
  }

  // Drag & Drop
  function onDragStart(e, card, kanaIndex) {
    if (roundChecked) return;
    clearCheckStyles();

    e.preventDefault();
    setDragTouchLock(true);
    card.setPointerCapture(e.pointerId);

    const rect = card.getBoundingClientRect();

    let origin = 'pool';
    let fromZoneIndex = null;
    if (card.parentElement && card.parentElement.classList.contains('romaji-zone')) {
      origin = 'zone';
      fromZoneIndex = parseInt(card.parentElement.dataset.zoneIndex);
    }

    dragInfo = {
      el: card,
      kanaIndex,
      startRect: rect,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      origin,
      fromZoneIndex,
      startX: e.clientX,
      startY: e.clientY,
      hasMoved: false,
    };
  }

  function onDragMove(e) {
    if (!dragInfo) return;
    e.preventDefault();

    // Deadzone — don't detach card until real movement
    if (!dragInfo.hasMoved) {
      const dx = e.clientX - dragInfo.startX;
      const dy = e.clientY - dragInfo.startY;
      if (Math.abs(dx) < DRAG_DEADZONE && Math.abs(dy) < DRAG_DEADZONE) return;
      dragInfo.hasMoved = true;

      // Detach card from DOM and lift to body
      const card = dragInfo.el;
      const rect = dragInfo.startRect;
      if (dragInfo.origin === 'zone' && dragInfo.fromZoneIndex !== null) {
        const ki = reversePlacements[dragInfo.fromZoneIndex];
        if (ki !== undefined) {
          delete placements[ki];
          delete reversePlacements[dragInfo.fromZoneIndex];
        }
        card.parentElement && card.parentElement.classList.remove('filled');
        updateUI();
      }
      document.body.appendChild(card);
      updatePoolGhosts();
      card.classList.add('dragging');
      card.style.width = rect.width + 'px';
      card.style.height = rect.height + 'px';
    }

    // Follow pointer
    const card = dragInfo.el;
    card.style.left = (e.clientX - dragInfo.offsetX) + 'px';
    card.style.top = (e.clientY - dragInfo.offsetY) + 'px';
    // 用卡片中心判定目标框，所见即所得，移动端更精准
    const r = card.getBoundingClientRect();
    updateZoneHighlights(r.left + r.width / 2, r.top + r.height / 2);
  }

  function onDragEnd(e) {
    if (!dragInfo) return;
    setDragTouchLock(false);

    const card = dragInfo.el;
    clearZoneHighlights();

    if (!dragInfo.hasMoved) {
      // Just a tap — cancel drag, put card back if detached
      card.classList.remove('dragging');
      card.style.left = '';
      card.style.top = '';
      card.style.width = '';
      card.style.height = '';
      // If card was moved to body (shouldn't happen without movement, but be safe)
      if (card.parentElement && card.parentElement !== kanaPool && !card.parentElement.classList.contains('romaji-zone')) {
        card.remove();
        renderGame();
      }
      dragInfo = null;
      return;
    }

    // 关键：判定目标框时卡片必须保持 fixed 定位，布局才不会变。
    // 一旦移除 fixed 类，卡片会变成页面流里的普通元素，整个页面会瞬间移位，导致坐标全错。
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const bestZone = findTargetZone(cx, cy);

    if (bestZone) {
      // Snap to zone
      const zi = parseInt(bestZone.dataset.zoneIndex);
      const ki = dragInfo.kanaIndex;

      // If zone already occupied by another kana, return that one to pool
      const existingKi = reversePlacements[zi];
      if (existingKi !== undefined && existingKi !== ki) {
        delete placements[existingKi];
        delete reversePlacements[zi];
      }

      placements[ki] = zi;
      reversePlacements[zi] = ki;

      card.remove();
      renderGame();
      updateUI();
    } else if (dragInfo.origin === 'pool') {
      // 保持 fixed 定位飞回池子，动画结束后再移除重建
      card.classList.remove('dragging');
      card.classList.add('returning');
      card.style.left = dragInfo.startRect.left + 'px';
      card.style.top = dragInfo.startRect.top + 'px';

      setTimeout(() => {
        if (card.parentElement) card.remove();
        renderGame();
        updateUI();
      }, 360);
    } else {
      // From zone — re-render immediately
      card.remove();
      renderGame();
      updateUI();
    }

    dragInfo = null;
  }

  function zoneCenterDist(zone, cx, cy) {
    const r = zone.getBoundingClientRect();
    return Math.hypot(cx - (r.left + r.width / 2), cy - (r.top + r.height / 2));
  }

  function zoneContains(zone, cx, cy) {
    const r = zone.getBoundingClientRect();
    return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
  }

  // 目标框判定：卡片中心在框内或贴近框边缘时直接锁定该框；
  // 否则只在“离该框足够近”的范围内取最近者，避免误吸远处的框
  function findTargetZone(cx, cy) {
    const zones = romajiGrid.querySelectorAll('.romaji-zone');

    let best = null;
    let bestDist = Infinity;
    zones.forEach(zone => {
      const r = zone.getBoundingClientRect();
      const pad = Math.max(10, Math.min(r.width, r.height) * 0.2);
      if (cx >= r.left - pad && cx <= r.right + pad && cy >= r.top - pad && cy <= r.bottom + pad) {
        const d = zoneCenterDist(zone, cx, cy);
        if (d < bestDist) { bestDist = d; best = zone; }
      }
    });
    if (best) return best;

    let near = null;
    let nearDist = Infinity;
    zones.forEach(zone => {
      const r = zone.getBoundingClientRect();
      const threshold = Math.min(SNAP_THRESHOLD, Math.max(r.width, r.height) * 0.9);
      const d = zoneCenterDist(zone, cx, cy);
      if (d < threshold && d < nearDist) { nearDist = d; near = zone; }
    });
    return near;
  }

  function updateZoneHighlights(cx, cy) {
    const target = findTargetZone(cx, cy);
    romajiGrid.querySelectorAll('.romaji-zone').forEach(z => z.classList.remove('highlight'));
    if (target) target.classList.add('highlight');
  }

  function clearZoneHighlights() {
    romajiGrid.querySelectorAll('.romaji-zone').forEach(z => z.classList.remove('highlight'));
  }

  function clearCheckStyles() {
    if (roundChecked) return; // don't clear if already passed
    romajiGrid.querySelectorAll('.romaji-zone').forEach(z => {
      z.classList.remove('correct', 'wrong');
    });
    roundCheckedResult = {};
  }

  // Check answers
  function checkAnswers() {
    if (roundChecked) return;
    const placed = Object.keys(placements).length;
    if (placed < KANA_COUNT) return;

    let allCorrect = true;
    const zones = romajiGrid.querySelectorAll('.romaji-zone');
    roundCheckedResult = {};

    // Clear previous styles
    zones.forEach(z => z.classList.remove('correct', 'wrong'));

    for (const [kiStr, ziStr] of Object.entries(placements)) {
      const ki = parseInt(kiStr);
      const zi = parseInt(ziStr);
      const expected = roundKana[ki].romaji;
      const actual = romajiOptions[zi];
      const isCorrect = expected === actual;

      roundCheckedResult[zi] = isCorrect;

      if (isCorrect) {
        zones[zi].classList.add('correct');
      } else {
        zones[zi].classList.add('wrong');
        allCorrect = false;
        totalErrors++;

        // Record wrong answer
        const kanaChar = roundKana[ki].showAs === 'hiragana' ? roundKana[ki].hiragana : roundKana[ki].katakana;
        recordWrongAnswer(currentLevel, kanaChar, roundKana[ki].showAs, expected, actual);
      }
    }

    updateUI();

    if (allCorrect) {
      roundChecked = true;
      hintText.textContent = '✅ 正确！';
      btnCheck.style.display = 'none';
      btnRoundNext.style.display = 'inline-block';
      if (currentRound >= LEVELS[currentLevel - 1].rounds) {
        btnRoundNext.textContent = '🎉 查看结果';
      }
    } else {
      errorBadge.textContent = `⚠️ ${totalErrors}次`;
      hintText.textContent = '❌ 修正红色框后再试一次';
    }
  }

  function nextRound() {
    const lv = LEVELS[currentLevel - 1];
    if (!roundChecked && currentRound <= lv.rounds) return;

    if (currentRound >= lv.rounds) {
      showStarRating();
      return;
    }

    currentRound++;
    setupRound(currentLevel, currentRound);
    gamePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Star rating
  function showStarRating() {
    const lv = LEVELS[currentLevel - 1];
    let stars;
    if (totalErrors === 0) stars = 3;
    else if (totalErrors <= 2) stars = 2;
    else if (totalErrors <= 5) stars = 1;
    else stars = 0;

    saveStars(currentLevel, stars);

    starTitle.textContent = stars >= 2 ? '🎉 太棒了！' : stars === 1 ? '👍 做得很好' : '💪 再加把劲！';
    starLevelLabel.textContent = `第${currentLevel}关 · ${lv.groupName} · ${lv.modeName} 完成`;

    const msgs = [
      `${totalErrors}次错误 — 下次争取满分！`,
      `只有${totalErrors}次错误 — 离满分一步之遥！`,
      `仅${totalErrors}次错误 — 近乎完美！`,
      '完美！一次错误都没有！',
    ];
    starSummary.textContent = msgs[stars];

    const nextId = currentLevel + 1;
    const nextLv = nextId <= LEVELS.length ? LEVELS[nextId - 1] : null;
    const nextUnlocked = nextLv && isLevelUnlocked(nextId);
    btnStarNext.style.display = nextUnlocked ? 'inline-flex' : 'none';
    if (nextUnlocked) {
      btnStarNext.textContent = `下一关 · ${nextLv.groupName}·${nextLv.modeName} →`;
    }

    starOverlay.classList.add('show');

    // Animate stars one by one
    const starEls = starsRow.querySelectorAll('.star');
    starEls.forEach(s => s.classList.remove('earned'));
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (i < stars) starEls[i].classList.add('earned');
      }, 300 + i * 400);
    }
  }

  function closeStarOverlay() {
    starOverlay.classList.remove('show');
    // Reset and go home
    currentRound = 1;
    totalErrors = 0;
    setupRound(1, 1);
    showView('home');
    updateHomeProgress();
  }

  // Level select & home progress
  function startLevel(levelId) {
    if (!isLevelUnlocked(levelId)) {
      alert('需要上一关获得至少 1 星才能解锁本关');
      return;
    }
    clearTimeout(quizTimer);
    clearTimeout(matchTimer);
    currentLevel = levelId;
    currentRound = 1;
    totalErrors = 0;
    setupRound(levelId, 1);
    showView('game');
  }

  // 测试模式：返回全三星假数据；普通模式读取真实数据
  function getStars() {
    if (testMode) {
      const fake = {};
      LEVELS.forEach(l => { fake[l.id] = 3; });
      return fake;
    }
    return loadStars();
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  function toggleTestMode() {
    testMode = !testMode;
    showToast(testMode
      ? '🧪 测试模式已开启：全部关卡解锁，均为三星'
      : '🧪 测试模式已关闭：已恢复开启前的数据');
    if (currentView === 'home') updateHomeProgress();
    if (currentView === 'levels') renderLevelsList();
  }

  function renderLevelsList() {
    const stars = getStars();
    let html = '';
    GROUPS.forEach(g => {
      const gLevels = LEVELS.filter(l => l.groupId === g.id);
      const done = gLevels.filter(l => (stars[l.id] || 0) > 0).length;
      const sum = gLevels.reduce((s, l) => s + (stars[l.id] || 0), 0);
      html += `
        <div class="level-module" data-group="${g.id}">
          <div class="level-module-head" data-action="toggle">
            <span class="level-emoji">${g.emoji}</span>
            <span class="level-module-title">${g.name}</span>
            <span class="level-module-progress">${done}/5 关 · ★${sum}</span>
            <span class="arrow">▾</span>
          </div>
          <div class="level-module-body">
            <div class="level-list">
              ${gLevels.map(lv => {
                const s = stars[lv.id] || 0;
                const locked = !isLevelUnlocked(lv.id);
                const starHtml = locked
                  ? '<span class="lock-star">🔒</span>'
                  : [1, 2, 3].map(i => `<span class="${i <= s ? '' : 'empty'}">★</span>`).join('');
                return `
                  <div class="level-card ${locked ? 'locked' : ''}" data-level="${lv.id}">
                    <span class="level-emoji">${MODE_DEFS[lv.mode].emoji}</span>
                    <div class="level-info">
                      <div class="level-title">第${lv.id}关 · ${lv.modeName}</div>
                      <div class="level-desc">${lv.desc}</div>
                      ${locked ? '<div class="level-desc mem-seen">🔒 上一关获得 1 星后解锁</div>' : ''}
                    </div>
                    <div class="level-stars">${starHtml}</div>
                  </div>`;
              }).join('')}
            </div>
          </div>
        </div>`;
    });
    levelsList.innerHTML = html;

    // 展开 / 折叠：同时只展开一个模块
    levelsList.querySelectorAll('.level-module-head').forEach(head => {
      head.addEventListener('click', () => {
        const mod = head.parentElement;
        const isOpen = mod.classList.contains('open');
        levelsList.querySelectorAll('.level-module').forEach(m => m.classList.remove('open'));
        if (!isOpen) mod.classList.add('open');
      });
    });

    levelsList.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => startLevel(parseInt(card.dataset.level)));
    });
  }

  function updateHomeProgress() {
    const stars = getStars();
    const done = LEVELS.filter(l => (stars[l.id] || 0) > 0).length;
    const sum = Object.values(stars).reduce((s, v) => s + v, 0);
    homeProgress.textContent = done >= LEVELS.length
      ? `🎉 已通关全部关卡 · 累计 ★${sum}`
      : `通关进度：${done}/${LEVELS.length} · 累计 ★${sum}`;
  }

  // Chart view
  function chartTableHTML(rows, headers) {
    let html = '<div class="table-wrap"><table class="kana-table"><thead><tr><th></th>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    rows.forEach(([rowName, cells]) => {
      html += `<tr><td class="row-name">${rowName}</td>`;
      cells.forEach(c => {
        if (!c) { html += '<td class="cell-empty"></td>'; return; }
        html += `<td class="cell-speak" data-kana="${c[0]}" title="点击朗读"><div class="cell-kana"><span>${c[0]}</span><span class="kata">${c[1]}</span></div><div class="cell-roma">${c[2]}</div></td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  function renderChart() {
    let html = '';
    html += '<h3 class="chart-title">🌸 清音（基本五十音）</h3>';
    html += chartTableHTML(CHART_SEION, ['a','i','u','e','o']);
    html += '<h3 class="chart-title">🌊 浊音・半浊音</h3>';
    html += chartTableHTML(CHART_DAKUON, ['a','i','u','e','o']);
    html += '<h3 class="chart-title">🍡 拗音</h3>';
    html += chartTableHTML(CHART_YOUON, ['ya','yu','yo']);
    html += `
      <div class="tips">
        <h3>💡 记忆小贴士</h3>
        <ul>
          <li>平假名多由汉字草书演变而来（如「安」→ あ）；片假名多取自汉字偏旁（如「阿」→ ア）。</li>
          <li>五十音图横向为「段」（a・i・u・e・o），纵向为「行」（辅音）。</li>
          <li>ぢ・づ 的罗马音写作 di・du，实际发音与 じ・ず 相同。</li>
          <li>拗音由「い段假名」加上小写的 ゃ・ゅ・ょ 组合而成。</li>
        </ul>
      </div>`;
    chartContent.innerHTML = html;

    // 点击假名朗读
    chartContent.querySelectorAll('.cell-speak').forEach(td => {
      td.addEventListener('click', () => {
        const kana = td.dataset.kana;
        if (!kana) return;
        speakKana(kana);
        td.classList.remove('speaking');
        void td.offsetWidth;
        td.classList.add('speaking');
      });
    });
  }

  // Wrong answers view
  function renderWrongAnswers() {
    const data = loadWrongAnswers();
    const levelIds = Object.keys(data).map(Number).sort((a,b) => a-b);

    if (levelIds.length === 0) {
      waContent.innerHTML = '<div class="wa-empty">🎉 还没有错题<br>做得很好！</div>';
      return;
    }

    let html = '<div class="level-list">';
    levelIds.forEach(lvl => {
      const lv = LEVELS.find(l => l.id === lvl) || { groupName: '', modeName: '' };
      const items = Object.values(data[lvl]);
      const totalWrongs = items.reduce((s, it) => s + it.count, 0);
      html += `
        <div class="level-item" data-level="${lvl}">
          <div class="level-summary" data-action="toggle">
            <span class="level-name">🏯 第${lvl}关 · ${lv.groupName} · ${lv.modeName}</span>
            <span class="level-count">${items.length}种 / ${totalWrongs}次错误</span>
            <span class="arrow">▾</span>
          </div>
          <div class="level-detail">
            <div class="table-wrap"><table class="wa-table">
              <thead><tr><th>假名</th><th>类型</th><th>正确答案</th><th>错误次数</th></tr></thead>
              <tbody>
                ${items.sort((a,b) => b.count - a.count).map(it => `
                  <tr>
                    <td style="font-size:1.3rem;font-weight:700;">${it.kana}</td>
                    <td>${it.kanaType === 'hiragana' ? '平假名' : '片假名'}</td>
                    <td style="font-weight:600;color:#4a9c6c;">${it.romaji}</td>
                    <td class="wrong-count">${it.count}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table></div>
            <button class="btn-clear" data-level="${lvl}">🗑 清空本关记录</button>
          </div>
        </div>`;
    });
    html += '</div>';
    waContent.innerHTML = html;

    // Toggle level detail
    waContent.querySelectorAll('[data-action="toggle"]').forEach(el => {
      el.addEventListener('click', () => {
        el.parentElement.classList.toggle('open');
      });
    });

    // Clear buttons
    waContent.querySelectorAll('.btn-clear').forEach(btn => {
      btn.addEventListener('click', () => {
        const lvl = parseInt(btn.dataset.level);
        if (confirm(`确定清空第${lvl}关的错题记录吗？`)) {
          clearWrongAnswers(lvl);
          renderWrongAnswers();
        }
      });
    });
  }

  // Event bindings
  $('#btnStart').addEventListener('click', () => {
    renderLevelsList();
    showView('levels');
  });

  $('#btnChart').addEventListener('click', () => {
    renderChart();
    showView('chart');
  });

  $('#btnWrongList').addEventListener('click', () => {
    renderWrongAnswers();
    showView('wrongAnswers');
  });

  $('#btnLevelsBack').addEventListener('click', () => showView('home'));
  $('#btnChartBack').addEventListener('click', () => showView('home'));
  $('#btnWABack').addEventListener('click', () => showView('home'));

  $('#btnBackHome').addEventListener('click', () => {
    if (currentRound > 1 && !roundChecked) {
      if (!confirm('本关还未完成，确定要返回吗？')) return;
    }
    clearTimeout(quizTimer);
    clearTimeout(matchTimer);
    showView('home');
  });

  btnCheck.addEventListener('click', checkAnswers);
  btnRoundNext.addEventListener('click', nextRound);
  $('#btnStarHome').addEventListener('click', closeStarOverlay);
  btnStarNext.addEventListener('click', () => {
    const next = currentLevel + 1;
    closeStarOverlay();
    startLevel(next);
  });

  // Close overlay on backdrop click
  starOverlay.addEventListener('click', (e) => {
    if (e.target === starOverlay) closeStarOverlay();
  });

  // Global pointer events for drag
  document.addEventListener('pointermove', onDragMove, { passive: false });
  document.addEventListener('pointerup', onDragEnd);
  document.addEventListener('pointercancel', onDragEnd);
  // Prevent browser drag behaviors
  document.addEventListener('dragstart', (e) => { if (dragInfo) e.preventDefault(); });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (currentView !== 'game') return;
    if (e.key === 'Enter' && !roundChecked) { e.preventDefault(); checkAnswers(); }
    if (e.key === 'ArrowRight' && roundChecked) { e.preventDefault(); nextRound(); }
  });

  // 测试模式：在主页依次输入 saodm 开启 / 关闭（仅本次会话，刷新即恢复）
  document.addEventListener('keydown', (e) => {
    if (currentView !== 'home') return;
    if (e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      typedSeq = (typedSeq + e.key.toLowerCase()).slice(-5);
      if (typedSeq === 'saodm') {
        typedSeq = '';
        toggleTestMode();
      }
    }
  });

  // ═══════════════════════════════════════
  // Memory mode — 假名记忆
  // ═══════════════════════════════════════
  const SEION_ORIGINS = {
    a: { hira: '安', kata: '阿', hint: '草书「安」演变成 あ，读 a' },
    i: { hira: '以', kata: '伊', hint: '像草书「以」的一部分，读 i' },
    u: { hira: '宇', kata: '宇', hint: '像「宇」的宝盖头，读 u' },
    e: { hira: '衣', kata: '江', hint: '「衣」的连笔草书，读 e' },
    o: { hira: '於', kata: '於', hint: '「於」的草书，读 o' },
    ka: { hira: '加', kata: '加', hint: '「加」的草书，读 ka' },
    ki: { hira: '幾', kata: '幾', hint: '「幾」的一部分，读 ki' },
    ku: { hira: '久', kata: '久', hint: '「久」的一笔，读 ku' },
    ke: { hira: '計', kata: '介', hint: '「計」的草书，读 ke' },
    ko: { hira: '己', kata: '己', hint: '「己」的弯钩，读 ko' },
    sa: { hira: '左', kata: '散', hint: '「左」的草书，读 sa' },
    shi: { hira: '之', kata: '之', hint: '「之」的弯钩，读 shi' },
    su: { hira: '寸', kata: '須', hint: '「寸」的草书，读 su' },
    se: { hira: '世', kata: '世', hint: '「世」的草书，读 se' },
    so: { hira: '曽', kata: '曽', hint: '「曽」的草书，读 so' },
    ta: { hira: '太', kata: '多', hint: '「太」的草书，读 ta' },
    chi: { hira: '知', kata: '千', hint: '「知」的一部分，读 chi' },
    tsu: { hira: '川', kata: '川', hint: '「川」的一笔，读 tsu' },
    te: { hira: '天', kata: '天', hint: '「天」的草书，读 te' },
    to: { hira: '止', kata: '止', hint: '「止」的草书，读 to' },
    na: { hira: '奈', kata: '奈', hint: '「奈」的草书，读 na' },
    ni: { hira: '仁', kata: '二', hint: '「仁」的一部分，读 ni' },
    nu: { hira: '奴', kata: '奴', hint: '「奴」的草书，读 nu' },
    ne: { hira: '祢', kata: '祢', hint: '「祢」的草书，读 ne' },
    no: { hira: '乃', kata: '乃', hint: '「乃」的圆圈，读 no' },
    ha: { hira: '波', kata: '八', hint: '「波」的草书，读 ha' },
    hi: { hira: '比', kata: '比', hint: '「比」的草书，读 hi' },
    fu: { hira: '不', kata: '不', hint: '「不」的草书，读 fu' },
    he: { hira: '部', kata: '部', hint: '「部」的偏旁，读 he' },
    ho: { hira: '保', kata: '保', hint: '「保」的草书，读 ho' },
    ma: { hira: '末', kata: '末', hint: '「末」的草书，读 ma' },
    mi: { hira: '美', kata: '三', hint: '「美」的草书，读 mi' },
    mu: { hira: '武', kata: '牟', hint: '「武」的草书，读 mu' },
    me: { hira: '女', kata: '女', hint: '「女」的草书，读 me' },
    mo: { hira: '毛', kata: '毛', hint: '「毛」的草书，读 mo' },
    ya: { hira: '也', kata: '也', hint: '「也」的草书，读 ya' },
    yu: { hira: '由', kata: '由', hint: '「由」的草书，读 yu' },
    yo: { hira: '与', kata: '与', hint: '「与」的草书，读 yo' },
    ra: { hira: '良', kata: '良', hint: '「良」的草书，读 ra' },
    ri: { hira: '利', kata: '利', hint: '「利」的右半，读 ri' },
    ru: { hira: '留', kata: '流', hint: '「留」的草书，读 ru' },
    re: { hira: '礼', kata: '礼', hint: '「礼」的草书，读 re' },
    ro: { hira: '呂', kata: '呂', hint: '「呂」的草书，读 ro' },
    wa: { hira: '和', kata: '和', hint: '「和」的草书，读 wa' },
    wo: { hira: '遠', kata: '乎', hint: '「遠」的草书，读 wo' },
    n: { hira: '无', kata: '尔', hint: '「无」的草书，读 n' },
  };

  // 浊音・半浊音：基底清音 + 记号类型（daku=゛ 浊音 / handaku=゜ 半浊音）
  const DAKUON_BASE = {
    ga:['ka','daku'], gi:['ki','daku'], gu:['ku','daku'], ge:['ke','daku'], go:['ko','daku'],
    za:['sa','daku'], ji:['shi','daku'], zu:['su','daku'], ze:['se','daku'], zo:['so','daku'],
    da:['ta','daku'], di:['chi','daku'], du:['tsu','daku'], de:['te','daku'], do:['to','daku'],
    ba:['ha','daku'], bi:['hi','daku'], bu:['fu','daku'], be:['he','daku'], bo:['ho','daku'],
    pa:['ha','handaku'], pi:['hi','handaku'], pu:['fu','handaku'], pe:['he','handaku'], po:['ho','handaku'],
  };

  // 例词联想：每个假名配一个常见单词（多为片假名词，用于加强片假名记忆）
  const WORD_EXAMPLES = {
    a: ['アイス','冰淇淋'], i: ['イス','椅子'], u: ['ウインドー','窗户'], e: ['エレベーター','电梯'], o: ['オレンジ','橙子'],
    ka: ['カメラ','相机'], ki: ['キリン','长颈鹿'], ku: ['クッキー','曲奇饼干'], ke: ['ケーキ','蛋糕'], ko: ['コーヒー','咖啡'],
    sa: ['サッカー','足球'], shi: ['シャツ','衬衫'], su: ['スープ','汤'], se: ['セーター','毛衣'], so: ['ソファ','沙发'],
    ta: ['タクシー','出租车'], chi: ['チーズ','奶酪'], tsu: ['ツアー','旅行团'], te: ['テレビ','电视'], to: ['トマト','西红柿'],
    na: ['ナイフ','小刀'], ni: ['ニュース','新闻'], nu: ['ヌードル','面条'], ne: ['ネクタイ','领带'], no: ['ノート','笔记本'],
    ha: ['ハンバーガー','汉堡'], hi: ['ヒーター','取暖器'], fu: ['フォーク','叉子'], he: ['ヘリコプター','直升机'], ho: ['ホテル','酒店'],
    ma: ['マンゴー','芒果'], mi: ['ミルク','牛奶'], mu: ['ムービー','电影'], me: ['メニュー','菜单'], mo: ['モーター','马达'],
    ya: ['ヤード','码'], yu: ['ユーモア','幽默'], yo: ['ヨット','游艇'],
    ra: ['ラーメン','拉面'], ri: ['リンゴ','苹果'], ru: ['ルール','规则'], re: ['レモン','柠檬'], ro: ['ロボット','机器人'],
    wa: ['ワイン','葡萄酒'], wo: ['リンゴを食べる','吃苹果'], n: ['パン','面包'],
    ga: ['ガソリン','汽油'], gi: ['ギター','吉他'], gu: ['グループ','小组'], ge: ['ゲーム','游戏'], go: ['ゴリラ','大猩猩'],
    za: ['ざっし','杂志'], ji: ['ジーンズ','牛仔裤'], zu: ['ズボン','裤子'], ze: ['ゼリー','果冻'], zo: ['ゾウ','大象'],
    da: ['ダンス','舞蹈'], di: ['はなぢ','鼻血'], du: ['つづき','后续'], de: ['デパート','百货商店'], do: ['ドア','门'],
    ba: ['バナナ','香蕉'], bi: ['ビール','啤酒'], bu: ['ブルー','蓝色'], be: ['ベッド','床'], bo: ['ボール','球'],
    pa: ['パン','面包'], pi: ['ピアノ','钢琴'], pu: ['プレゼント','礼物'], pe: ['ペン','钢笔'], po: ['ポスト','邮筒'],
    kya: ['キャベツ','卷心菜'], kyu: ['キュウリ','黄瓜'], kyo: ['きょうりゅう','恐龙'],
    sha: ['シャツ','衬衫'], shu: ['シューズ','鞋子'], sho: ['ショップ','商店'],
    cha: ['チャンス','机会'], chu: ['チューブ','软管'], cho: ['チョコレート','巧克力'],
    nya: ['こんにゃく','魔芋'], nyu: ['ニューヨーク','纽约'], nyo: ['にょきにょき','冒出来'],
    hya: ['ひゃく','一百'], hyu: ['ひゅうひゅう','风声'], hyo: ['ひょう','表格'],
    mya: ['みゃく','脉搏'], myu: ['ミュージック','音乐'], myo: ['みょうじ','姓氏'],
    rya: ['りゃくご','略语'], ryu: ['りゅう','龙'], ryo: ['りょこう','旅行'],
    gya: ['ぎゃく','相反'], gyu: ['ぎゅうにく','牛肉'], gyo: ['ぎょぎょう','渔业'],
    ja: ['じゃがいも','土豆'], ju: ['じゅぎょう','上课'], jo: ['じょし','女子'],
    bya: ['さんびゃく','三百'], byu: ['びゅうびゅう','风声'], byo: ['びょうき','生病'],
    pya: ['ろっぴゃく','六百'], pyu: ['ぴゅー','哨声'], pyo: ['ぴょん','蹦跳'],
  };

  // 常用寒暄语（短语 / 中文意思 / 读音文本）
  // 读音联想：中文近似音，帮助记忆（只是助记，不是精确音标）
  const SOUND_HINTS = {
    a: '读「啊」', i: '读「衣」', u: '读「乌」', e: '读「诶」', o: '读「哦」',
    ka: '读「卡」', ki: '像 key', ku: '读「哭」', ke: '像「开」', ko: '读「扣」',
    sa: '读「撒」', shi: '读「西」', su: '读「苏」', se: '读「塞」', so: '读「搜」',
    ta: '读「他」', chi: '读「七」', tsu: '读「次」', te: '像「太」', to: '读「偷」',
    na: '读「那」', ni: '读「你」', nu: '读「奴」', ne: '读「内」', no: '读「诺」',
    ha: '读「哈」', hi: '读「嘿」', fu: '读「夫」', he: '读「嘿」', ho: '读「嚯」',
    ma: '读「妈」', mi: '读「咪」', mu: '读「木」', me: '读「妹」', mo: '读「摸」',
    ya: '读「呀」', yu: '读「优」', yo: '读「哟」',
    ra: '读「拉」', ri: '读「利」', ru: '读「路」', re: '读「来」', ro: '读「咯」',
    wa: '读「哇」', wo: '读「哦」', n: '读「嗯」',
    ga: '读「嘎」', gi: '读「给」', gu: '读「咕」', ge: '读「该」', go: '读「狗」',
    za: '读「咋」', ji: '读「叽」', zu: '读「租」', ze: '读「贼」', zo: '读「奏」',
    da: '读「搭」', di: '同 じ 读「叽」', du: '同 ず 读「租」', de: '读「呆」', do: '读「多」',
    ba: '读「巴」', bi: '读「逼」', bu: '读「不」', be: '读「呗」', bo: '读「波」',
    pa: '读「啪」', pi: '读「批」', pu: '读「噗」', pe: '读「胚」', po: '读「泼」',
    kya: 'ki+呀', kyu: 'ki+优', kyo: 'ki+哟',
    sha: '西+呀', shu: '西+优', sho: '西+哟',
    cha: '七+呀', chu: '七+优', cho: '七+哟',
    nya: 'ni+呀', nyu: 'ni+优', nyo: 'ni+哟',
    hya: '嘿+呀', hyu: '嘿+优', hyo: '嘿+哟',
    mya: '咪+呀', myu: '咪+优', myo: '咪+哟',
    rya: '利+呀', ryu: '利+优', ryo: '利+哟',
    gya: '给+呀', gyu: '给+优', gyo: '给+哟',
    ja: '鸡+呀', ju: '鸡+优', jo: '鸡+哟',
    bya: '逼+呀', byu: '逼+优', byo: '逼+哟',
    pya: '批+呀', pyu: '批+优', pyo: '批+哟',
  };

  // 日常用语与寒暄（100 句）
  const GREETINGS = [
    ['おはよう','早上好','おはよう'],
    ['おはようございます','早上好（礼貌）','おはようございます'],
    ['こんにちは','你好','こんにちは'],
    ['こんばんは','晚上好','こんばんは'],
    ['おやすみ','晚安（口语）','おやすみ'],
    ['おやすみなさい','晚安','おやすみなさい'],
    ['さようなら','再见','さようなら'],
    ['じゃあね','回头见','じゃあね'],
    ['また明日','明天见','またあした'],
    ['またね','再见（轻松）','またね'],
    ['はい','是','はい'],
    ['いいえ','不是','いいえ'],
    ['どうも','多谢／你好','どうも'],
    ['ありがとう','谢谢','ありがとう'],
    ['ありがとうございます','谢谢（礼貌）','ありがとうございます'],
    ['どうもありがとうございます','非常感谢','どうもありがとうございます'],
    ['ごめん','对不起（口语）','ごめん'],
    ['ごめんなさい','对不起','ごめんなさい'],
    ['すみません','对不起／劳驾','すみません'],
    ['申し訳ありません','非常抱歉','もうしわけありません'],
    ['失礼します','失陪／打扰了','しつれいします'],
    ['失礼しました','刚才失礼了','しつれいしました'],
    ['お願いします','拜托了','おねがいします'],
    ['よろしくお願いします','请多关照','よろしくおねがいします'],
    ['お願いできますか','能拜托你吗','おねがいできますか'],
    ['ちょっと待ってください','请稍等','ちょっとまってください'],
    ['もう一度お願いします','请再说一遍','もういちどおねがいします'],
    ['ゆっくり話してください','请慢点说','ゆっくりはなしてください'],
    ['英語がわかりますか','懂英语吗','えいごがわかりますか'],
    ['日本語がわかりますか','懂日语吗','にほんごがわかりますか'],
    ['いただきます','我开动了（饭前）','いただきます'],
    ['ごちそうさまでした','谢谢款待（饭后）','ごちそうさまでした'],
    ['おいしいです','很好吃','おいしいです'],
    ['水をください','请给我水','みずをください'],
    ['メニューをお願いします','请给我菜单','メニューをおねがいします'],
    ['お会計お願いします','请结账','おかいけいおねがいします'],
    ['乾杯','干杯','かんぱい'],
    ['いくらですか','多少钱','いくらですか'],
    ['これをください','请给我这个','これをください'],
    ['試着してもいいですか','可以试穿吗','しちゃくしてもいいですか'],
    ['安いですね','真便宜','やすいですね'],
    ['高いですね','真贵','たかいですね'],
    ['袋をください','请给我袋子','ふくろをください'],
    ['カードで払えますか','可以刷卡吗','カードではらえますか'],
    ['駅はどこですか','车站在哪里','えきはどこですか'],
    ['トイレはどこですか','厕所在哪里','トイレはどこですか'],
    ['ここ','这里','ここ'],
    ['そこ','那里','そこ'],
    ['あそこ','那边','あそこ'],
    ['まっすぐ行ってください','请直走','まっすぐいってください'],
    ['右に曲がってください','请右转','みぎにまがってください'],
    ['左に曲がってください','请左转','ひだりにまがってください'],
    ['地図をください','请给我地图','ちずをください'],
    ['タクシーを呼んでください','请叫出租车','タクシーをよんでください'],
    ['今何時ですか','现在几点','いまなんじですか'],
    ['今日','今天','きょう'],
    ['明日','明天','あした'],
    ['昨日','昨天','きのう'],
    ['今','现在','いま'],
    ['時間がありますか','有时间吗','じかんがありますか'],
    ['大丈夫です','没关系／没事','だいじょうぶです'],
    ['大丈夫ですか','你没事吧','だいじょうぶですか'],
    ['お元気ですか','你好吗','おげんきですか'],
    ['元気です','我很好','げんきです'],
    ['疲れました','我累了','つかれました'],
    ['お腹がすきました','我饿了','おなかがすきました'],
    ['喉が渇きました','我渴了','のどがかわきました'],
    ['眠いです','我困了','ねむいです'],
    ['暑いです','好热','あついです'],
    ['寒いです','好冷','さむいです'],
    ['嬉しいです','我很高兴','うれしいです'],
    ['楽しいです','很开心','たのしいです'],
    ['悲しいです','很难过','かなしいです'],
    ['心配しないでください','请不要担心','しんぱいしないでください'],
    ['わかりました','明白了','わかりました'],
    ['わかりません','不明白','わかりません'],
    ['いいです','好的／不用了','いいです'],
    ['だめです','不行','だめです'],
    ['もちろん','当然','もちろん'],
    ['そうですね','是啊','そうですね'],
    ['本当ですか','真的吗','ほんとうですか'],
    ['いいですね','真好','いいですね'],
    ['すごい','好厉害','すごい'],
    ['おめでとうございます','恭喜','おめでとうございます'],
    ['お久しぶりです','好久不见','おひさしぶりです'],
    ['初めまして','初次见面','はじめまして'],
    ['よろしく','请多关照（口语）','よろしく'],
    ['助けてください','请帮帮我','たすけてください'],
    ['気をつけてください','请小心','きをつけてください'],
    ['行ってきます','我出门了','いってきます'],
    ['行ってらっしゃい','慢走','いってらっしゃい'],
    ['ただいま','我回来了','ただいま'],
    ['おかえり','欢迎回来','おかえり'],
    ['お大事に','请保重','おだいじに'],
    ['頑張って','加油','がんばって'],
    ['お疲れ様でした','辛苦了','おつかれさまでした'],
    ['また会いましょう','下次再见','またあいましょう'],
    ['いい天気ですね','天气真好','いいてんきですね'],
    ['気をつけてね','路上小心','きをつけてね'],
    ['どうぞ','请（请用／请进）','どうぞ'],
  ];

  const MEMORY_SETS = [
    { id: 1, name: '清音', emoji: '🌸', desc: '从汉字演变认识基本五十音', data: GROUPS[0].data, kind: 'seion' },
    { id: 2, name: '浊音・半浊音', emoji: '🌊', desc: '清音加两点・圆圈变浊音半浊音', data: GROUPS[1].data, kind: 'dakuon' },
    { id: 3, name: '拗音', emoji: '🍡', desc: 'い段假名加小写 ゃ・ゅ・ょ', data: GROUPS[2].data, kind: 'youon' },
    { id: 4, name: '日常用语', emoji: '💬', desc: '日常高频用语与寒暄（100句）', data: GREETINGS, kind: 'greeting' },
  ];
  const MEMORY_STORAGE_KEY = 'kana_memory_progress';

  let memSetId = 1;
  let memOrder = [];
  let memIndex = 0;
  let memPhase = 'discover';
  let memStats = { seen: 0, correct: 0, wrong: 0 };
  let memAnswered = false;
  let memTaskQueue = [];
  let memTimer = null;
  let memLastMethod = '';   // 上一个假名用的记忆方法，避免连续重复

  const memorySetsView = $('#memorySetsView');
  const memoryView = $('#memoryView');
  const memorySetsList = $('#memorySetsList');
  const memorySetBadge = $('#memorySetBadge');
  const memoryProgressBadge = $('#memoryProgressBadge');
  const memoryProgressFill = $('#memoryProgressFill');
  const memoryPhaseBar = $('#memoryPhaseBar');
  const memoryCard = $('#memoryCard');
  const btnMemoryNext = $('#btnMemoryNext');
  const memoryDoneOverlay = $('#memoryDoneOverlay');
  const memoryDoneTitle = $('#memoryDoneTitle');
  const memoryDoneSummary = $('#memoryDoneSummary');
  const memoryDoneStars = $('#memoryDoneStars');

  // 朗读：优先使用网易有道日语发音接口（成熟稳定），失败时回退百度，最后用系统语音兜底
  function speakKana(text) {
    try {
      if (!text) return;
      playTtsUrl(text, [
        'https://dict.youdao.com/dictvoice?le=jap&type=3&audio=' + encodeURIComponent(text),
        'https://fanyi.baidu.com/gettts?lan=jp&spd=3&source=web&text=' + encodeURIComponent(text),
      ]);
    } catch (e) { /* ignore */ }
  }

  function playTtsUrl(text, urls) {
    let audio = document.getElementById('ttsAudio');
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = 'ttsAudio';
      audio.preload = 'auto';
      audio.volume = 1;
      document.body.appendChild(audio);
    }
    let i = 0;
    const next = () => {
      if (i >= urls.length) {
        // 在线接口都失败时用系统语音兜底
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'ja-JP';
          u.rate = 0.8;
          speechSynthesis.speak(u);
        }
        return;
      }
      const url = urls[i++];
      audio.onerror = next;
      audio.src = url;
      const p = audio.play();
      if (p && p.catch) p.catch(next);
    };
    next();
  }

  function loadMemProgress() {
    try { return JSON.parse(localStorage.getItem(MEMORY_STORAGE_KEY)) || {}; }
    catch { return {}; }
  }
  function saveMemProgress(setId, seen, stars) {
    const d = loadMemProgress();
    const cur = d[setId] || { seen: 0, stars: 0 };
    d[setId] = { seen: Math.max(cur.seen, seen), stars: Math.max(cur.stars, stars) };
    try { localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(d)); }
    catch { /* quota exceeded */ }
  }

  function renderMemorySets() {
    const prog = loadMemProgress();
    memorySetsList.innerHTML = MEMORY_SETS.map(s => {
      const p = prog[s.id] || { seen: 0, stars: 0 };
      const starHtml = [1, 2, 3].map(i => `<span class="${i <= p.stars ? '' : 'empty'}">★</span>`).join('');
      return `
        <div class="level-card" data-set="${s.id}">
          <span class="level-emoji">${s.emoji}</span>
          <div class="level-info">
            <div class="level-title">${s.name}</div>
            <div class="level-desc">${s.desc}</div>
            <div class="level-desc mem-seen">已学 ${p.seen}/${s.data.length} 个</div>
          </div>
          <div class="level-stars">${starHtml}</div>
        </div>`;
    }).join('');
    memorySetsList.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => startMemorySet(parseInt(card.dataset.set)));
    });
  }

  function startMemorySet(id) {
    memSetId = id;
    const s = MEMORY_SETS[id - 1];
    memOrder = shuffle(s.data.map((_, i) => i));
    memIndex = 0;
    memStats = { seen: 0, correct: 0, wrong: 0 };
    memTaskQueue = shuffle(['hira', 'kata', 'romaji', 'kanaFromRomaji']);
    showView('memory');
    showMemoryDiscover();
  }

  function setMemoryPhase(phase) {
    memPhase = phase;
    const order = ['discover', 'play', 'recall'];
    memoryPhaseBar.querySelectorAll('.phase-item').forEach(el => {
      const p = el.dataset.phase;
      el.classList.toggle('active', p === phase);
      el.classList.toggle('done', order.indexOf(p) < order.indexOf(phase));
    });
  }

  function updateMemoryHeader(s) {
    memorySetBadge.textContent = `${s.emoji} ${s.name}`;
    memoryProgressBadge.textContent = `${memIndex + 1}/${memOrder.length}`;
    memoryProgressFill.style.width = (memIndex / memOrder.length * 100) + '%';
  }

  function showMemoryDiscover() {
    setMemoryPhase('discover');
    memAnswered = false;
    btnMemoryNext.disabled = true;
    btnMemoryNext.textContent = '继续 →';
    const s = MEMORY_SETS[memSetId - 1];
    const k = s.data[memOrder[memIndex]];
    const [h, kata, romaji] = k;
    updateMemoryHeader(s);

    let inner = '';
    if (s.kind === 'greeting') {
      inner = `
        <div class="mem-discover">
          <div class="mem-phrase" id="memBig">${h}</div>
          <p class="mem-hint">${kata}</p>
          <div class="mem-roma"><button class="speaker-btn" id="btnSpeak">🔊 再听一遍</button></div>
        </div>`;
    } else {
      // 记忆方法随机混用：汉字来源 / 例词 / 读音联想 / 结构规则（连续不重复）
      const methodPool = s.kind === 'seion'
        ? ['origin', 'word', 'sound']
        : ['rule', 'word', 'sound'];
      let method = methodPool[Math.floor(Math.random() * methodPool.length)];
      if (method === memLastMethod) {
        method = methodPool[(methodPool.indexOf(method) + 1) % methodPool.length];
      }
      memLastMethod = method;

      // 例词：单词里的目标假名会高亮（多为片假名词，顺便强化片假名）
      const we = WORD_EXAMPLES[romaji];
      let wordHtml = '';
      if (we) {
        const [word, meaning] = we;
        const glyph = [h, kata].find(g => word.includes(g));
        const marked = glyph ? word.replace(glyph, `<mark class="word-mark">${glyph}</mark>`) : word;
        wordHtml = `<div class="mem-word">例词：${marked}<span class="mem-word-mean">${meaning}</span></div>`;
      }

      // 根据随机方法生成记忆提示块
      let methodBlock = '';
      if (method === 'word') {
        methodBlock = wordHtml;
      } else if (method === 'sound') {
        methodBlock = `<p class="mem-hint">读音联想：${SOUND_HINTS[romaji] || romaji}</p>`;
      } else if (method === 'origin' && s.kind === 'seion') {
        const o = SEION_ORIGINS[romaji];
        methodBlock = `
          <div class="mem-origin" id="memOrigin">
            <span class="origin-kanji">${o.hira}</span>
            <span class="origin-arrow">→</span>
            <span class="origin-kana">${h}</span>
            <span class="origin-divider">·</span>
            <span class="origin-kanji">${o.kata}</span>
            <span class="origin-arrow">→</span>
            <span class="origin-kana">${kata}</span>
          </div>
          <p class="mem-hint">${o.hint}</p>`;
      } else if (method === 'rule' && s.kind === 'dakuon') {
        const [baseRomaji, mark] = DAKUON_BASE[romaji];
        const base = LEVELS[0].data.find(d => d[2] === baseRomaji);
        const markLabel = mark === 'daku' ? '゛' : '゜';
        const markName = mark === 'daku' ? '浊点（゛）' : '半浊点（゜）';
        const finalName = mark === 'daku' ? '浊音' : '半浊音';
        methodBlock = `<p class="mem-hint">清音「${base[0]}」加上 ${markName}，变成${finalName}「${h}」，读「${romaji}」。</p>`;
      } else if (method === 'rule' && s.kind === 'youon') {
        const first = h[0], small = h[1];
        methodBlock = `<p class="mem-hint">「${first}」+ 小写「${small}」组合成拗音「${h}」，读「${romaji}」。</p>`;
      } else {
        // 兜底：退回该组最经典的方法
        if (s.kind === 'seion') {
          const o = SEION_ORIGINS[romaji];
          methodBlock = `
            <div class="mem-origin" id="memOrigin">
              <span class="origin-kanji">${o.hira}</span>
              <span class="origin-arrow">→</span>
              <span class="origin-kana">${h}</span>
              <span class="origin-divider">·</span>
              <span class="origin-kanji">${o.kata}</span>
              <span class="origin-arrow">→</span>
              <span class="origin-kana">${kata}</span>
            </div>
            <p class="mem-hint">${o.hint}</p>`;
        } else if (s.kind === 'dakuon') {
          const [baseRomaji, mark] = DAKUON_BASE[romaji];
          const base = LEVELS[0].data.find(d => d[2] === baseRomaji);
          const markLabel = mark === 'daku' ? '゛' : '゜';
          const markName = mark === 'daku' ? '浊点（゛）' : '半浊点（゜）';
          const finalName = mark === 'daku' ? '浊音' : '半浊音';
          methodBlock = `<p class="mem-hint">清音「${base[0]}」加上 ${markName}，变成${finalName}「${h}」，读「${romaji}」。</p>`;
        } else {
          const first = h[0], small = h[1];
          methodBlock = `<p class="mem-hint">「${first}」+ 小写「${small}」组合成拗音「${h}」，读「${romaji}」。</p>`;
        }
      }

      if (s.kind === 'seion') {
        inner = `
          <div class="mem-discover">
            <div class="mem-kana-row">
              <div class="kana-big" id="memBig">${h}<span class="kana-big-tag">平</span></div>
              <div class="kana-big kata" id="memBigKata">${kata}<span class="kana-big-tag">片</span></div>
            </div>
            <div class="mem-roma">${romaji} <button class="speaker-btn" id="btnSpeak">🔊 再听一遍</button></div>
            ${methodBlock}
          </div>`;
      } else if (s.kind === 'dakuon') {
        const [baseRomaji, mark] = DAKUON_BASE[romaji];
        const base = LEVELS[0].data.find(d => d[2] === baseRomaji);
        const markLabel = mark === 'daku' ? '゛' : '゜';
        inner = `
          <div class="mem-discover">
            <div class="mem-kana-row">
              <div class="kana-big" id="memBig">${base[0]}<sup class="daku-mark" id="dakuMark">${markLabel}</sup><span class="kana-big-tag">平</span></div>
              <div class="kana-big kata" id="memBigKata">${base[1]}<sup class="daku-mark" id="dakuMarkKata">${markLabel}</sup><span class="kana-big-tag">片</span></div>
            </div>
            <div class="mem-roma">${baseRomaji} → ${romaji} <button class="speaker-btn" id="btnSpeak">🔊 再听一遍</button></div>
            ${methodBlock}
          </div>`;
      } else {
        const first = h[0], small = h[1];
        const kataFirst = kata[0], kataSmall = kata[1];
        inner = `
          <div class="mem-discover">
            <div class="mem-kana-row">
              <div class="kana-big compound" id="memBig">${first}<small class="youon-small">${small}</small><span class="kana-big-tag">平</span></div>
              <div class="kana-big kata compound" id="memBigKata">${kataFirst}<small class="youon-small">${kataSmall}</small><span class="kana-big-tag">片</span></div>
            </div>
            <div class="mem-roma">${romaji} <button class="speaker-btn" id="btnSpeak">🔊 再听一遍</button></div>
            ${methodBlock}
          </div>`;
      }
    }
    memoryCard.innerHTML = inner;

    const btnSpeak = document.getElementById('btnSpeak');
    if (btnSpeak) btnSpeak.addEventListener('click', () => speakKana(h));

    // 动画：弹出、浊点落下、拗音合体、来源揭示
    const big = document.getElementById('memBig');
    if (big) {
      big.classList.add('anim-pop');
      const bigKata = document.getElementById('memBigKata');
      if (bigKata) setTimeout(() => bigKata.classList.add('anim-pop'), 120);
      if (s.kind === 'dakuon') {
        setTimeout(() => {
          document.querySelectorAll('.daku-mark').forEach(el => el.classList.add('dropped'));
        }, 380);
      }
      if (s.kind === 'youon') {
        setTimeout(() => {
          document.querySelectorAll('.youon-small').forEach(el => el.classList.add('join'));
        }, 420);
      }
    }
    const origin = document.getElementById('memOrigin');
    if (origin) setTimeout(() => origin.classList.add('show'), 320);

    speakKana(h);
    memTimer = setTimeout(() => { btnMemoryNext.disabled = false; }, 1200);
  }

  function pickDistractors(pool, correct, n, scoreFn) {
    const others = shuffle(pool.filter(x => x !== correct));
    if (scoreFn) others.sort((a, b) => scoreFn(b) - scoreFn(a));
    const picked = others.slice(0, n);
    return shuffle([correct, ...picked]);
  }

  function renderOptions(prompt, opts, optionClass, onAnswer) {
    memoryCard.innerHTML = `
      <div class="mem-play">
        <p class="mem-prompt">${prompt}</p>
        <div class="opt-grid">
          ${opts.map((o, i) => `<button class="opt-card ${optionClass}" data-opt="${i}">${o.label}</button>`).join('')}
        </div>
        <p class="mem-feedback" id="memFeedback"></p>
      </div>`;
    memoryCard.querySelectorAll('.opt-card').forEach(el => {
      el.addEventListener('click', () => {
        if (memAnswered) return;
        memAnswered = true;
        const idx = parseInt(el.dataset.opt);
        onAnswer(opts[idx], el);
      });
    });
  }

  function markFeedback(chosen, el, opts, correctLabel, okText) {
    const fb = document.getElementById('memFeedback');
    if (chosen.correct) {
      memStats.correct++;
      el.classList.add('correct');
      fb.textContent = okText;
      fb.className = 'mem-feedback ok';
    } else {
      memStats.wrong++;
      el.classList.add('wrong');
      fb.textContent = `正确答案是「${correctLabel}」`;
      fb.className = 'mem-feedback bad';
      memoryCard.querySelectorAll('.opt-card').forEach(cardEl => {
        const o = opts[parseInt(cardEl.dataset.opt)];
        if (o.correct) cardEl.classList.add('correct');
      });
    }
    btnMemoryNext.disabled = false;
  }

  function startPlayPhase() {
    setMemoryPhase('play');
    memAnswered = false;
    btnMemoryNext.disabled = true;
    btnMemoryNext.textContent = '继续 →';
    const s = MEMORY_SETS[memSetId - 1];
    const k = s.data[memOrder[memIndex]];
    const [h, kata, romaji] = k;

    const hPool = s.data.map(d => d[0]);
    const kPool = s.data.map(d => d[1]);
    const rPool = s.data.map(d => d[2]);

    let prompt = '', optionClass = 'kana', correctLabel = h, labels = [];

    if (s.kind === 'greeting') {
      // 寒暄语：意思 ↔ 日语
      const gType = Math.random() < 0.5 ? 'phrase' : 'meaning';
      if (gType === 'phrase') {
        prompt = `「${kata}」用日语怎么说？`;
        correctLabel = h;
        optionClass = 'roma';
        labels = pickDistractors(hPool, h, 3);
      } else {
        prompt = `「${h}」是什么意思？`;
        correctLabel = kata;
        optionClass = 'roma';
        labels = pickDistractors(kPool, kata, 3);
      }
    } else {
      // 片假名相关的题目出现频率更高，并加入单词填空，强化片假名记忆
      if (memTaskQueue.length === 0) memTaskQueue = shuffle(['kata', 'kata', 'kataWord', 'hira', 'romaji', 'kanaFromRomaji']);
      let type = memTaskQueue.pop();
      if (s.kind === 'dakuon' && Math.random() < 0.45) type = 'dakuten';
      if (s.kind === 'youon' && Math.random() < 0.45) type = 'youon';

      if (type === 'hira') {
        prompt = `找到「${kata}」对应的平假名`;
        correctLabel = h;
        labels = pickDistractors(hPool, h, 3, x => (x[0] === h[0] ? 1 : 0));
      } else if (type === 'kata') {
        prompt = `找到「${h}」对应的片假名`;
        correctLabel = kata;
        labels = pickDistractors(kPool, kata, 3, x => (x[0] === h[0] ? 1 : 0));
      } else if (type === 'kataWord') {
        // 单词填空：卡＿ラ = 相机 → 缺 メ
        const we = WORD_EXAMPLES[romaji];
        const word = we ? we[0] : '';
        const kGlyph = word && word.includes(kata) ? kata : null;
        if (kGlyph) {
          const idx = word.indexOf(kGlyph);
          prompt = `「${word.slice(0, idx)}＿${word.slice(idx + kGlyph.length)}」＝${we[1]}，缺哪个片假名？`;
          correctLabel = kata;
          labels = pickDistractors(kPool, kata, 3, x => (x[0] === h[0] ? 1 : 0));
        } else {
          prompt = `找到「${h}」对应的片假名`;
          correctLabel = kata;
          labels = pickDistractors(kPool, kata, 3, x => (x[0] === h[0] ? 1 : 0));
        }
      } else if (type === 'romaji') {
        prompt = `「${h} ${kata}」读什么？`;
        correctLabel = romaji;
        optionClass = 'roma';
        labels = pickDistractors(rPool, romaji, 3, x => (x[x.length - 1] === romaji[romaji.length - 1] ? 1 : 0));
      } else if (type === 'kanaFromRomaji') {
        prompt = `哪个假名读「${romaji}」？`;
        correctLabel = h;
        labels = pickDistractors(hPool, h, 3, x => (x[0] === h[0] ? 1 : 0));
      } else if (type === 'dakuten') {
        const [baseRomaji, mark] = DAKUON_BASE[romaji];
        const base = LEVELS[0].data.find(d => d[2] === baseRomaji);
        const markLabel = mark === 'daku' ? '゛' : '゜';
        prompt = `「${base[0]}」加上「${markLabel}」变成？`;
        correctLabel = h;
        labels = pickDistractors(hPool, h, 3, x => {
          const xr = s.data.find(d => d[0] === x);
          const xb = xr ? DAKUON_BASE[xr[2]] : null;
          return (xb && xb[0] === baseRomaji) ? 2 : (x[0] === base[0] ? 1 : 0);
        });
      } else if (type === 'youon') {
        const first = h[0], small = h[1];
        prompt = `「${first}」+ 小写「${small}」= ？`;
        correctLabel = h;
        labels = pickDistractors(hPool, h, 3, x => (x[0] === first ? 2 : (x[1] === small ? 1 : 0)));
      }
    }

    const opts = labels.map(label => ({ label, correct: label === correctLabel }));
    renderOptions(prompt, opts, optionClass, (chosen, el) => {
      markFeedback(chosen, el, opts, correctLabel, '✓ 正确！');
    });
  }

  function startRecallPhase() {
    setMemoryPhase('recall');
    memAnswered = false;
    btnMemoryNext.disabled = true;
    btnMemoryNext.textContent = '继续 →';
    const s = MEMORY_SETS[memSetId - 1];
    const k = s.data[memOrder[memIndex]];
    const [h, kata, romaji] = k;

    if (s.kind === 'greeting') {
      const recallType = Math.random() < 0.5 ? 'meaning' : 'phrase';
      memoryCard.innerHTML = `
        <div class="mem-recall">
          <p class="mem-prompt">${recallType === 'meaning' ? '记住这句话' : '记住这个意思'}</p>
          <div class="recall-flash phrase" id="recallFlash">${recallType === 'meaning' ? h : kata}</div>
        </div>`;
      document.getElementById('recallFlash').classList.add('flash');
      speakKana(h);
      memTimer = setTimeout(() => {
        const phrasePool = s.data.map(d => d[0]);
        const meaningPool = s.data.map(d => d[1]);
        let prompt, correctLabel, labels;
        if (recallType === 'meaning') {
          prompt = `「${h}」是什么意思？`;
          correctLabel = kata;
          labels = pickDistractors(meaningPool, kata, 3);
        } else {
          prompt = `「${kata}」用日语怎么说？`;
          correctLabel = h;
          labels = pickDistractors(phrasePool, h, 3);
        }
        const opts = labels.map(label => ({ label, correct: label === correctLabel }));
        renderOptions(prompt, opts, 'roma', (chosen, el) => {
          markFeedback(chosen, el, opts, correctLabel, '✓ 答对了，记得很牢！');
        });
      }, 1500);
      return;
    }

    // 片假名回忆频率更高，强化片假名记忆
    const useKata = Math.random() < 0.6;
    const glyph = useKata ? kata : h;
    const recallType = Math.random() < 0.5 ? 'glyph' : 'romaji';

    memoryCard.innerHTML = `
      <div class="mem-recall">
        <p class="mem-prompt">${recallType === 'glyph' ? '记住它的样子' : '记住它读什么'}</p>
        <div class="recall-flash ${s.kind === 'youon' ? 'compound' : ''}" id="recallFlash">${glyph}</div>
        ${recallType === 'glyph' ? `<p class="mem-recall-roma">${romaji}</p>` : ''}
      </div>`;
    document.getElementById('recallFlash').classList.add('flash');
    speakKana(h);

    memTimer = setTimeout(() => {
      const entries = s.data;
      let prompt, correctLabel, optionClass, labels;
      if (recallType === 'glyph') {
        prompt = '刚才闪过的假名是哪个？';
        correctLabel = glyph;
        optionClass = 'kana';
        labels = pickDistractors(entries.map(d => (useKata ? d[1] : d[0])), glyph, 3, x => {
          const e = entries.find(d => (useKata ? d[1] : d[0]) === x);
          return e && e[2][e[2].length - 1] === romaji[romaji.length - 1] ? 1 : 0;
        });
      } else {
        prompt = '刚才那个假名读什么？';
        correctLabel = romaji;
        optionClass = 'roma';
        labels = pickDistractors(entries.map(d => d[2]), romaji, 3, x => (x[0] === romaji[0] ? 1 : 0));
      }
      const opts = labels.map(label => ({ label, correct: label === correctLabel }));
      renderOptions(prompt, opts, optionClass, (chosen, el) => {
        markFeedback(chosen, el, opts, correctLabel, '✓ 答对了，记得很牢！');
      });
    }, 1500);
  }

  function nextMemoryStep() {
    clearTimeout(memTimer);
    if (memPhase === 'discover') { startPlayPhase(); return; }
    if (memPhase === 'play') { startRecallPhase(); return; }
    memStats.seen++;
    memIndex++;
    if (memIndex >= memOrder.length) {
      showMemoryDone();
      return;
    }
    showMemoryDiscover();
  }

  function showMemoryDone() {
    const s = MEMORY_SETS[memSetId - 1];
    memStats.seen = memOrder.length;
    const total = memStats.correct + memStats.wrong;
    const acc = total ? memStats.correct / total : 1;
    let stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.5 ? 1 : 0;
    saveMemProgress(memSetId, memStats.seen, stars);
    memoryDoneTitle.textContent = stars >= 2 ? '🎉 记得很棒！' : stars === 1 ? '👍 有进步！' : '💪 再来一遍！';
    const unit = s.kind === 'greeting' ? '句寒暄语' : '个假名';
    memoryDoneSummary.textContent = `正确 ${memStats.correct} 题 · 答错 ${memStats.wrong} 题 · 学会 ${memStats.seen} ${unit}`;
    memoryDoneOverlay.classList.add('show');
    const starEls = memoryDoneStars.querySelectorAll('.star');
    starEls.forEach(x => x.classList.remove('earned'));
    for (let i = 0; i < 3; i++) {
      setTimeout(() => { if (i < stars) starEls[i].classList.add('earned'); }, 300 + i * 400);
    }
  }

  function exitMemory() {
    clearTimeout(memTimer);
    saveMemProgress(memSetId, Math.min(memIndex, memOrder.length), 0);
    memoryDoneOverlay.classList.remove('show');
    showView('home');
  }

  $('#btnMemory').addEventListener('click', () => {
    renderMemorySets();
    showView('memorySets');
  });
  $('#btnMemorySetsBack').addEventListener('click', () => showView('home'));
  $('#btnMemoryBack').addEventListener('click', exitMemory);
  btnMemoryNext.addEventListener('click', nextMemoryStep);
  $('#btnMemoryRetry').addEventListener('click', () => {
    memoryDoneOverlay.classList.remove('show');
    startMemorySet(memSetId);
  });
  $('#btnMemoryDoneHome').addEventListener('click', () => {
    memoryDoneOverlay.classList.remove('show');
    showView('home');
  });
  memoryDoneOverlay.addEventListener('click', (e) => {
    if (e.target === memoryDoneOverlay) {
      memoryDoneOverlay.classList.remove('show');
      showView('home');
    }
  });

  // Init
  setupRound(1, 1);
  updateHomeProgress();
})();


















