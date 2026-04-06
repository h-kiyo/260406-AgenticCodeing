// ゲーム状態
let gameState = {
    numDiscs: 3,
    moveCount: 0,
    columns: [[], [], []],
    minMoves: 0,
    gameWon: false,
    draggedDisc: null,
    draggedFrom: null
};

// ゲーム開始
function startGame(numDiscs) {
    gameState.numDiscs = numDiscs;
    gameState.moveCount = 0;
    gameState.minMoves = Math.pow(2, numDiscs) - 1;
    gameState.gameWon = false;
    gameState.columns = [[], [], []];

    // UI更新
    document.querySelector('.difficulty-section').style.display = 'none';
    document.getElementById('gameSection').style.display = 'block';
    
    // ゲーム盤を初期化
    initializeBoard();
    updateDisplay();
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
    
    if (gameState.gameWon || gameState.draggedDisc === null) return;
    
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
    
    updateDisplay();
    
    // クリア判定
    if (gameState.columns[2].length === gameState.numDiscs) {
        gameState.gameWon = true;
        showClearMessage();
    }
    
    reset();
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
            ring.draggable = true;
            ring.textContent = discValue + 1;
            ring.style.width = (120 - discValue * 20) + 'px';
            
            const colors = ['#FF6B6B', '#FFA500', '#4ECDC4', '#45B7D1', '#96CEB4'];
            ring.style.background = colors[discValue];
            ring.ondragstart = dragStart;
            
            container.appendChild(ring);
        }
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
    
    stats.innerHTML = `<div class="stats">
        <p>${evaluation}</p>
        <p>移動回数: <strong>${gameState.moveCount}</strong>回</p>
        <p>最小移動回数: <strong>${gameState.minMoves}</strong>回</p>
    </div>`;
    
    message.style.display = 'block';
}

// ゲームをリセット
function resetGame() {
    document.getElementById('gameSection').style.display = 'none';
    document.getElementById('clearMessage').style.display = 'none';
    document.querySelector('.difficulty-section').style.display = 'block';
    gameState.gameWon = false;
}

// 初期表示
document.addEventListener('DOMContentLoaded', function() {
    console.log('ハノイの塔へようこそ！');
});
