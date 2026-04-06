// ゲーム状態
let gameState = {
    numDiscs: 3,
    moveCount: 0,
    columns: [[], [], []],
    minMoves: 0,
    gameWon: false,
    draggedDisc: null,
    draggedFrom: null,
    mode: 'normal', // normal, auto, story, timeatack
    autoPlaying: false,
    autoMoves: [],
    autoMoveIndex: 0,
    storyPhase: 0,
    startTime: null,
    elapsedTime: 0,
    timerInterval: null
};

// ストーリーモード用のテキスト
const storyTexts = {
    start: "🧙‍♂️ 古い魔法使いが現れました。「ハノイの塔の謎を解くことができれば、秘密の宝を手に入れられるぞ！」",
    disc3: "🎯 の勇者！3つの魔法の玉を右の塔に移動させました。第1段階クリア！",
    disc4: "⚡ 難しくなってきたね。4つの玉を操る力を持つ者は少ない。頑張れ！",
    disc5: "🌟 5つの魔法の玉！これは伝説の謎だ。君なら絶対にできる！",
    clear: "🏆 やったぞ！秘密の宝を見つけた！君は真の魔法使いの勇者だ！"
};

// モード選択
function selectMode(mode) {
    gameState.mode = mode;
    
    // UI更新
    document.getElementById('modeSection').style.display = 'none';
    
    if (mode === 'timeatack') {
        // ランキング表示
        showRanking();
    } else {
        // 難易度選択を表示
        document.getElementById('difficultySection').style.display = 'block';
    }
}

// 難易度選択へ戻す
function backToModeSelect() {
    document.getElementById('modeSection').style.display = 'block';
    document.getElementById('difficultySection').style.display = 'none';
    document.getElementById('rankingSection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'none';
    gameState.gameWon = false;
}

// ゲーム開始
function startGame(numDiscs) {
    gameState.numDiscs = numDiscs;
    gameState.moveCount = 0;
    gameState.minMoves = Math.pow(2, numDiscs) - 1;
    gameState.gameWon = false;
    gameState.columns = [[], [], []];
    gameState.storyPhase = 0;
    gameState.autoMoveIndex = 0;
    gameState.autoMoves = [];
    gameState.autoPlaying = false;
    gameState.startTime = null;
    gameState.elapsedTime = 0;

    // UI更新
    document.getElementById('difficultySection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'block';
    
    // ゲームモード別の初期化
    if (gameState.mode === 'auto') {
        // Auto モードの初期化
        gameState.autoMoves = generateHanoiSolution(numDiscs, 0, 2, 1);
        document.getElementById('autoPlayBtn').style.display = 'inline-block';
        document.getElementById('timeDisplay').style.display = 'none';
    } else if (gameState.mode === 'story') {
        // ストーリーモード用の表示
        document.getElementById('storyNarration').style.display = 'block';
        updateStoryText();
        document.getElementById('autoPlayBtn').style.display = 'none';
        document.getElementById('timeDisplay').style.display = 'none';
    } else if (gameState.mode === 'timeatack') {
        // タイムアタック用の初期化
        gameState.startTime = Date.now();
        document.getElementById('timeDisplay').style.display = 'inline-block';
        startTimer();
        document.getElementById('autoPlayBtn').style.display = 'none';
        document.getElementById('storyNarration').style.display = 'none';
    } else {
        // ノーマルモード
        document.getElementById('autoPlayBtn').style.display = 'none';
        document.getElementById('timeDisplay').style.display = 'none';
    }
    
    // ゲーム盤を初期化
    initializeBoard();
    updateDisplay();
}

// ハノイの塔の解法を生成
function generateHanoiSolution(n, source, target, auxiliary) {
    const moves = [];
    
    function hanoi(n, source, target, auxiliary) {
        if (n === 1) {
            moves.push({ from: source, to: target });
        } else {
            hanoi(n - 1, source, auxiliary, target);
            moves.push({ from: source, to: target });
            hanoi(n - 1, auxiliary, target, source);
        }
    }
    
    hanoi(n, source, target, auxiliary);
    return moves;
}

// ゲーム盤を初期化
function initializeBoard() {
    // すべてのリングを左の柱に配置
    const container0 = document.getElementById('column0').querySelector('.rings-container');
    container0.innerHTML = '';

    // リング配列を初期化
    gameState.columns[0] = [];
    gameState.columns[1] = [];
    gameState.columns[2] = [];

    // リングをDOMに追加して、gameState.columns[0]に追加
    const colors = ['#FF6B6B', '#FFA500', '#4ECDC4', '#45B7D1', '#96CEB4'];
    
    for (let i = gameState.numDiscs - 1; i >= 0; i--) {
        const ring = document.createElement('div');
        ring.id = `disc-${i}`;
        ring.className = 'ring';
        ring.draggable = true;
        ring.textContent = i + 1;
        ring.style.width = (120 - i * 20) + 'px';
        ring.style.background = colors[i];
        ring.ondragstart = dragStart;
        
        container0.appendChild(ring);
        gameState.columns[0].push(i);
    }

    // 他のコンテナをクリア
    document.getElementById('column1').querySelector('.rings-container').innerHTML = '';
    document.getElementById('column2').querySelector('.rings-container').innerHTML = '';

    updateDisplay();
}

// ドラッグ開始
function dragStart(event) {
    if (gameState.gameWon) return;
    
    const discId = event.target.id;
    const discValue = parseInt(discId.split('-')[1]);
    
    // クリックされたリングが一番上にあるかチェック
    let fromColumn = -1;
    for (let i = 0; i < 3; i++) {
        if (gameState.columns[i].length > 0 && gameState.columns[i][gameState.columns[i].length - 1] === discValue) {
            fromColumn = i;
            break;
        }
    }
    
    if (fromColumn === -1) {
        event.preventDefault();
        return;
    }
    
    gameState.draggedDisc = discValue;
    gameState.draggedFrom = fromColumn;
    event.target.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
}

// ドラッグ許可
function allowDrop(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

// ドロップ
function dropRing(event) {
    event.preventDefault();
    
    if (gameState.gameWon || gameState.draggedDisc === null || gameState.autoPlaying) return;
    
    // どの柱にドロップされたかを判定
    const targetElement = event.target.closest('.rings-container');
    if (!targetElement) return;
    
    const targetColumn = Array.from(document.querySelectorAll('.rings-container')).indexOf(targetElement);
    
    if (targetColumn === -1) return;
    
    // ルール確認：動かしたリングが一番上にあるか
    if (gameState.columns[gameState.draggedFrom][gameState.columns[gameState.draggedFrom].length - 1] !== gameState.draggedDisc) {
        reset();
        return;
    }
    
    // ルール確認：移動先にあるリングより小さいか、空か
    if (gameState.columns[targetColumn].length > 0) {
        const topDisc = gameState.columns[targetColumn][gameState.columns[targetColumn].length - 1];
        if (gameState.draggedDisc < topDisc) {
            // ルール違反 - 小さいディスクの上に大きいディスクを置こうとしている
            alert('⚠️ 大きなリングは小さなリングの下に置けません！');
            reset();
            return;
        }
    }
    
    // リングを移動
    gameState.columns[gameState.draggedFrom].pop();
    gameState.columns[targetColumn].push(gameState.draggedDisc);
    gameState.moveCount++;
    
    // エフェクト実行
    createLandingEffect(event.clientX, event.clientY);
    
    updateDisplay();
    
    // ストーリーモード用の更新
    if (gameState.mode === 'story') {
        updateStoryText();
    }
    
    // クリア判定
    if (gameState.columns[2].length === gameState.numDiscs) {
        gameState.gameWon = true;
        showClearMessage();
    }
    
    reset();
}

// 円盤接地エフェクト
function createLandingEffect(x, y) {
    const container = document.getElementById('gameSection');
    
    // "BAM!"テキスト を複数表示
    const effects = ['💥', '🌟', '⭐', '✨', '★'];
    
    // メインのテキストエフェクト
    const mainEffect = document.createElement('div');
    mainEffect.className = 'bam-text';
    mainEffect.style.left = x + 'px';
    mainEffect.style.top = y + 'px';
    mainEffect.style.color = '#FF6B6B';
    mainEffect.style.zIndex = '1000';
    mainEffect.textContent = '✨ BAM! ✨';
    container.appendChild(mainEffect);
    
    // 周囲にスターバーストを表示
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50;
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        
        const star = document.createElement('div');
        star.className = 'star-burst';
        star.style.left = (x + offsetX) + 'px';
        star.style.top = (y + offsetY) + 'px';
        star.style.color = effects[i % effects.length];
        star.style.zIndex = '1000';
        star.textContent = '✨';
        container.appendChild(star);
    }
    
    // エフェクトを削除
    setTimeout(() => {
        mainEffect.remove();
    }, 600);
    
    setTimeout(() => {
        document.querySelectorAll('.star-burst').forEach(el => {
            if (el.parentElement === container) el.remove();
        });
    }, 800);
}

// 状態をリセット
function reset() {
    if (gameState.draggedDisc !== null) {
        const draggingElement = document.querySelector('.drag-overlay');
        if (draggingElement) {
            draggingElement.remove();
        }
        const ringElement = document.getElementById(`disc-${gameState.draggedDisc}`);
        if (ringElement) {
            ringElement.classList.remove('dragging');
        }
    }
    gameState.draggedDisc = null;
    gameState.draggedFrom = null;
}

// タイマー開始
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.elapsedTime += 1;
        document.getElementById('elapsedTime').textContent = formatTime(gameState.elapsedTime);
    }, 1000);
}

// 時間をフォーマット
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ランキングに保存
function saveToRanking(discs, time) {
    const rankings = JSON.parse(localStorage.getItem('hanoiRankings'));
    
    // プレイヤー名を入力（簡易版）
    const playerName = prompt('お名前を入力してください:', 'プレイヤー');
    if (!playerName) return;
    
    const entry = {
        name: playerName,
        time: time,
        datekey: new Date().toLocaleString('ja-JP')
    };
    
    rankings[discs].push(entry);
    
    // 時間でソート（昇順）
    rankings[discs].sort((a, b) => a.time - b.time);
    
    // トップ10のみ保存
    rankings[discs] = rankings[discs].slice(0, 10);
    
    localStorage.setItem('hanoiRankings', JSON.stringify(rankings));
}

// ランキング表示
function showRanking() {
    document.getElementById('difficultySection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'none';
    document.getElementById('rankingSection').style.display = 'block';
    
    const rankings = JSON.parse(localStorage.getItem('hanoiRankings'));
    
    // 各難易度のランキング表示
    for (const discs of ['3', '4', '5']) {
        const rankingList = document.getElementById(`ranking${discs}`);
        rankingList.innerHTML = '';
        
        if (rankings[discs].length === 0) {
            const li = document.createElement('li');
            li.textContent = 'まだランキングがありません';
            rankingList.appendChild(li);
        } else {
            rankings[discs].forEach((entry, index) => {
                const li = document.createElement('li');
                const medal = ['🥇', '🥈', '🥉'];
                const medalEmoji = medal[index] || '🎯';
                li.innerHTML = `
                    <span class="ranking-medal">${medalEmoji}</span>
                    <span class="ranking-name">${entry.name}</span>
                    <span class="ranking-time">${formatTime(entry.time)}</span>
                `;
                rankingList.appendChild(li);
            });
        }
    }
}

// 表示を更新
function updateDisplay() {
    // 移動回数を更新
    document.getElementById('moveCount').textContent = gameState.moveCount;
    
    // 最小移動回数を表示
    const minMovesElement = document.getElementById('minMoves');
    minMovesElement.textContent = `(最小: ${gameState.minMoves}回)`;
    
    // ボードの表示を更新
    for (let colIndex = 0; colIndex < 3; colIndex++) {
        const container = document.getElementById(`column${colIndex}`).querySelector('.rings-container');
        container.innerHTML = '';
        
        for (const discValue of gameState.columns[colIndex]) {
            const ring = document.createElement('div');
            ring.id = `disc-${discValue}`;
            ring.className = 'ring';
            ring.draggable = gameState.mode !== 'auto' && !gameState.autoPlaying; // Auto モード中はドラッグ不可
            ring.textContent = discValue + 1;
            ring.style.width = (120 - discValue * 20) + 'px';
            
            const colors = ['#FF6B6B', '#FFA500', '#4ECDC4', '#45B7D1', '#96CEB4'];
            ring.style.background = colors[discValue];
            ring.ondragstart = dragStart;
            
            container.appendChild(ring);
        }
    }
    
    // ストーリーモードではテキスト更新
    if (gameState.mode === 'story' && document.getElementById('storyNarration').style.display !== 'none') {
        updateStoryText();
    }
}

// クリア表示
function showClearMessage() {
    const message = document.getElementById('clearMessage');
    const stats = document.getElementById('clearStats');
    
    let evaluation = '素晴らしい！';
    if (gameState.moveCount === gameState.minMoves) {
        evaluation = '🌟 パーフェクト！完璧な解法です！';
    } else if (gameState.moveCount <= gameState.minMoves + 5) {
        evaluation = '⭐ 素晴らしい！';
    } else {
        evaluation = '✓ クリア！もっと少ない回数でできるかな？';
    }
    
    // タイムアタックモードの場合はランキングに追加
    if (gameState.mode === 'timeatack') {
        clearInterval(gameState.timerInterval);
        const time = gameState.elapsedTime;
        saveToRanking(gameState.numDiscs, time);
    }
    
    stats.innerHTML = `<div class="stats">
        <p>${evaluation}</p>
        <p>移動回数: <strong>${gameState.moveCount}</strong>回</p>
        <p>最小移動回数: <strong>${gameState.minMoves}</strong>回</p>
        ${gameState.mode === 'timeatack' ? `<p>クリア時間: <strong>${formatTime(gameState.elapsedTime)}</strong></p>` : ''}
    </div>`;
    
    message.style.display = 'block';
}

// ゲームをリセット
function resetGame() {
    clearInterval(gameState.timerInterval);
    document.getElementById('gameSection').style.display = 'none';
    document.getElementById('clearMessage').style.display = 'none';
    document.getElementById('storyNarration').style.display = 'none';
    document.getElementById('modeSection').style.display = 'block';
    document.getElementById('difficultySection').style.display = 'none';
    gameState.gameWon = false;
    gameState.autoPlaying = false;
}

// Auto モード - 自動再生
function toggleAutoPlay() {
    if (gameState.autoPlaying) {
        // 停止
        gameState.autoPlaying = false;
        document.getElementById('autoPlayBtn').textContent = '▶️ 再生';
    } else {
        // 再生
        gameState.autoPlaying = true;
        document.getElementById('autoPlayBtn').textContent = '⏸️ 停止';
        playAutoMode();
    }
}

// Auto モードの実行
function playAutoMode() {
    if (!gameState.autoPlaying || gameState.gameWon || gameState.autoMoveIndex >= gameState.autoMoves.length) {
        gameState.autoPlaying = false;
        document.getElementById('autoPlayBtn').textContent = '▶️ 再生';
        return;
    }
    
    const move = gameState.autoMoves[gameState.autoMoveIndex];
    
    // 塔から円盤を取り出す
    const discValue = gameState.columns[move.from][gameState.columns[move.from].length - 1];
    if (discValue !== undefined) {
        gameState.columns[move.from].pop();
        gameState.columns[move.to].push(discValue);
        gameState.moveCount++;
        gameState.autoMoveIndex++;
        
        updateDisplay();
        createAutoMoveEffect(move.to);
        
        // クリア判定
        if (gameState.columns[2].length === gameState.numDiscs) {
            gameState.gameWon = true;
            gameState.autoPlaying = false;
            document.getElementById('autoPlayBtn').textContent = '▶️ 再生';
            showClearMessage();
            return;
        }
        
        // 次の移動をスケジュール
        setTimeout(playAutoMode, 600);
    }
}

// Auto モード用のエフェクト
function createAutoMoveEffect(columnIndex) {
    const container = document.getElementById(`column${columnIndex}`).querySelector('.rings-container');
    const rect = container.getBoundingClientRect();
    createLandingEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

// ストーリーテキスト更新
function updateStoryText() {
    const storyElement = document.getElementById('storyText');
    
    if (gameState.moveCount === 0) {
        storyElement.textContent = storyTexts.start;
    } else if (gameState.numDiscs === 3) {
        storyElement.textContent = storyTexts.disc3;
    } else if (gameState.numDiscs === 4) {
        storyElement.textContent = storyTexts.disc4;
    } else if (gameState.numDiscs === 5) {
        storyElement.textContent = storyTexts.disc5;
    } else {
        storyElement.textContent = storyTexts.clear;
    }
}

// 初期表示
document.addEventListener('DOMContentLoaded', function() {
    console.log('ハノイの塔へようこそ！');
    
    // ランキングの初期化（必要な場合）
    const rankings = localStorage.getItem('hanoiRankings');
    if (!rankings) {
        localStorage.setItem('hanoiRankings', JSON.stringify({
            '3': [],
            '4': [],
            '5': []
        }));
    }
});
