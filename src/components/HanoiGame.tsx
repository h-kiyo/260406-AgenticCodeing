import { useState, useCallback } from 'react';
import { HanoiGame as HanoiGameClass } from '@/game/HanoiGame';
import styles from './HanoiGame.module.css';

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F7DC6F'];

interface HanoiGameProps {
  discCount: number;
  minMoves: number;
}

const getCompletionMessage = (moveCount: number, minMoves: number): string => {
  const efficiency = Math.round((minMoves / moveCount) * 100);

  if (moveCount === minMoves) {
    return `🎉 パーフェクト！${moveCount}手で完成！すごいぞ！🌟`;
  }
  if (moveCount <= minMoves + 2) {
    return `🎉 すごい！${moveCount}手で完成！（最少${minMoves}手、達成度${efficiency}%）`;
  }
  if (moveCount <= minMoves + 5) {
    return `✨ 完成！${moveCount}手でした。（最少${minMoves}手、達成度${efficiency}%）`;
  }
  return `🎮 完成！${moveCount}手。(最少${minMoves}手、達成度${efficiency}%) 2^n-1を目指してね！`;
};

export const HanoiGameComponent: React.FC<HanoiGameProps> = ({
  discCount,
  minMoves,
}) => {
  const [game] = useState(() => new HanoiGameClass(discCount));
  const [rods, setRods] = useState(game.getRods());
  const [selectedDisc, setSelectedDisc] = useState<{
    rodIndex: number;
    discSize: number;
  } | null>(null);
  const [message, setMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const selectSourceDisc = useCallback(
    (rodIndex: number, discSize: number) => {
      const currentRod = rods[rodIndex];
      if (!currentRod || currentRod.length === 0) {
        setMessage('💭 ここにはリングがないよ');
        setSelectedDisc(null);
        return;
      }

      const topDisc = currentRod[currentRod.length - 1];
      if (topDisc !== discSize) {
        setMessage('😅 その上のリングを先に動かしてね！');
        setSelectedDisc(null);
        return;
      }

      setSelectedDisc({ rodIndex, discSize });
      setMessage('👉 移動先を選んでね！');
    },
    [rods]
  );

  const handleGameComplete = useCallback(() => {
    setIsComplete(true);
    const moveCount = game.getMoveCount();
    const completionMessage = getCompletionMessage(moveCount, minMoves);
    setMessage(completionMessage);
  }, [game, minMoves]);

  const moveDiscToTarget = useCallback(
    (targetRod: number) => {
      if (selectedDisc === null) {
        return;
      }

      const success = game.moveDisc(selectedDisc.rodIndex, targetRod);

      if (!success) {
        setMessage(
          '😅 あ、大きいリングは下に置けないんだった！もう一度やってみてね'
        );
        setSelectedDisc(null);
        return;
      }

      setRods(game.getRods());
      setSelectedDisc(null);
      setMessage('');

      if (game.isComplete()) {
        handleGameComplete();
      }
    },
    [selectedDisc, game, handleGameComplete]
  );

  const handleDiscClick = useCallback(
    (rodIndex: number, discSize: number) => {
      if (isComplete) return;

      if (selectedDisc === null) {
        selectSourceDisc(rodIndex, discSize);
      } else {
        moveDiscToTarget(rodIndex);
      }
    },
    [selectedDisc, isComplete, selectSourceDisc, moveDiscToTarget]
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
            className={styles.rod}
            onClick={() => {
              if (selectedDisc !== null) {
                moveDiscToTarget(rodIndex);
              }
            }}
            role="button"
            tabIndex={selectedDisc !== null ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && selectedDisc !== null) {
                e.preventDefault();
                moveDiscToTarget(rodIndex);
              }
            }}
          >
            <div className={styles.rodBase} />
            <div className={styles.discsContainer}>
              {rod.map((discSize, discIndex) => {
                const color = COLORS[discSize - 1];
                const discId = `disc-${rodIndex}-${discSize}`;
                const isSelected =
                  selectedDisc?.rodIndex === rodIndex &&
                  selectedDisc?.discSize === discSize;
                const isTopDisc = discIndex === rod.length - 1;
                return (
                  <div
                    key={discId}
                    className={`${styles.disc} ${isSelected ? styles.selected : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDiscClick(rodIndex, discSize);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDiscClick(rodIndex, discSize);
                      }
                    }}
                    role="button"
                    tabIndex={isTopDisc ? 0 : -1}
                    style={{
                      width: `${30 + discSize * 20}px`,
                      backgroundColor: color,
                      bottom: `${discIndex * 30}px`,
                      cursor: isTopDisc ? 'pointer' : 'not-allowed',
                      opacity: isTopDisc ? 1 : 0.7,
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
        <div
          className={`${styles.message} ${isComplete ? styles.celebration : ''}`}
        >
          {message}
        </div>
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
