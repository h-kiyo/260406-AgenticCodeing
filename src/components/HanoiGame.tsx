import { useState, useCallback } from 'react';
import { HanoiGame as HanoiGameClass } from '@/game/HanoiGame';
import styles from './HanoiGame.module.css';

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F7DC6F'];

interface HanoiGameProps {
  discCount: number;
  minMoves: number;
}

const getCompletionMessage = (moveCount: number, minMoves: number): string => {
  if (moveCount === minMoves) {
    return `🎉 パーフェクト！${moveCount}手で完成しました！`;
  }
  if (moveCount <= minMoves + 2) {
    return `🎉 すごい！${moveCount}手で完成しました！（最少は${minMoves}手）`;
  }
  return `✨ 完成！${moveCount}手でした。（最少は${minMoves}手）`;
};

export const HanoiGameComponent: React.FC<HanoiGameProps> = ({
  discCount,
  minMoves,
}) => {
  const [game] = useState(() => new HanoiGameClass(discCount));
  const [rods, setRods] = useState(game.getRods());
  const [selectedRod, setSelectedRod] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const selectSourceRod = useCallback((rodIndex: number) => {
    const currentRod = rods[rodIndex];
    if (currentRod && currentRod.length > 0) {
      setSelectedRod(rodIndex);
      setMessage('移動先のロッドをタップ！');
    } else {
      setMessage('ここにはディスクがありません');
    }
  }, [rods]);

  const handleGameComplete = useCallback(() => {
    setIsComplete(true);
    const moveCount = game.getMoveCount();
    const completionMessage = getCompletionMessage(moveCount, minMoves);
    setMessage(completionMessage);
  }, [game, minMoves]);

  const moveDiscToTarget = useCallback(
    (targetRod: number) => {
      if (selectedRod === null) {
        return;
      }

      const success = game.moveDisc(selectedRod, targetRod);

      if (!success) {
        setMessage(
          '❌ そこには置けません！大きいディスクを選んでください'
        );
        setSelectedRod(null);
        return;
      }

      setRods(game.getRods());
      setSelectedRod(null);
      setMessage('');

      if (game.isComplete()) {
        handleGameComplete();
      }
    },
    [selectedRod, game, handleGameComplete]
  );

  const handleRodClick = useCallback(
    (rodIndex: number) => {
      if (isComplete) return;

      if (selectedRod === null) {
        selectSourceRod(rodIndex);
      } else {
        moveDiscToTarget(rodIndex);
      }
    },
    [selectedRod, isComplete, selectSourceRod, moveDiscToTarget]
  );

  const handleKeyDown = useCallback(
    (rodIndex: number, event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleRodClick(rodIndex);
      }
    },
    [handleRodClick]
  );

  const handleReset = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.gameBoard}>
        {rods.map((rod, rodIndex) => (
          <div
            key={rodIndex}
            className={`${styles.rod} ${selectedRod === rodIndex ? styles.selected : ''}`}
            onClick={() => handleRodClick(rodIndex)}
            onKeyDown={(e) => handleKeyDown(rodIndex, e)}
            role="button"
            tabIndex={0}
          >
            <div className={styles.rodBase} />
            <div className={styles.discsContainer}>
              {rod.map((discSize, discIndex) => {
                const color = COLORS[discSize - 1];
                const discId = `disc-${rodIndex}-${discSize}`;
                return (
                  <div
                    key={discId}
                    className={styles.disc}
                    style={{
                      width: `${30 + discSize * 20}px`,
                      backgroundColor: color,
                      bottom: `${discIndex * 30}px`,
                    }}
                  >
                    {discSize}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.info}>
        <div className={styles.moveCount}>
          移動回数: <span>{game.getMoveCount()}</span> 回
        </div>
        <div className={styles.message}>{message}</div>
      </div>

      {isComplete && (
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}
        >
          もう一度プレイ
        </button>
      )}
    </div>
  );
};
