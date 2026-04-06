import { useState } from 'react';
import { GameStart } from '@/components/GameStart';
import { HanoiGameComponent } from '@/components/HanoiGame';
import './App.css';

function App(): React.ReactElement {
  const [gameState, setGameState] = useState<'start' | 'playing'>('start');
  const [discCount, setDiscCount] = useState(3);

  const minMovesMap: Record<number, number> = {
    3: 7,
    4: 15,
    5: 31,
  };

  const handleSelectDifficulty = (count: number) => {
    setDiscCount(count);
    setGameState('playing');
  };

  return (
    <>
      {gameState === 'start' ? (
        <GameStart onSelectDifficulty={handleSelectDifficulty} />
      ) : (
        <div className="gameContainer">
          <button
            type="button"
            className="backButton"
            onClick={() => setGameState('start')}
          >
            ← 戻る
          </button>
          <HanoiGameComponent
            discCount={discCount}
            minMoves={minMovesMap[discCount] ?? 7}
          />
        </div>
      )}
    </>
  );
}

export default App;
