import { useState } from 'react';
import { Tutorial } from '@/components/Tutorial';
import { GameStart } from '@/components/GameStart';
import { HanoiGameComponent } from '@/components/HanoiGame';
import './App.css';

function App(): React.ReactElement {
  const [gameState, setGameState] = useState<'tutorial' | 'start' | 'playing'>('tutorial');
  const [discCount, setDiscCount] = useState(3);

  const minMovesMap: Record<number, number> = {
    3: 7,
    4: 15,
    5: 31,
  };

  const handleTutorialComplete = () => {
    setGameState('start');
  };

  const handleSelectDifficulty = (count: number) => {
    setDiscCount(count);
    setGameState('playing');
  };

  return (
    <>
      {gameState === 'tutorial' && (
        <Tutorial onComplete={handleTutorialComplete} />
      )}
      {gameState === 'start' && (
        <GameStart onSelectDifficulty={handleSelectDifficulty} />
      )}
      {gameState === 'playing' && (
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
