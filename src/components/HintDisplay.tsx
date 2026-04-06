import React from "react";
import styles from "./HintDisplay.module.css";

interface HintDisplayProps {
  moveCount: number;
  minMoveCount: number;
  moveHistory: Array<{ from: number; to: number }>;
  onRequestHint: () => void;
}

export const HintDisplay: React.FC<HintDisplayProps> = ({
  moveCount,
  minMoveCount,
  moveHistory,
  onRequestHint,
}) => {
  const [showHint, setShowHint] = React.useState(false);

  const efficiency = minMoveCount > 0 ? Math.round((minMoveCount / moveCount) * 100) : 100;

  const lastMove = moveHistory[moveHistory.length - 1];

  return (
    <div className={styles['hintContainer']}>
      <div className={styles['stats']}>
        <div className={styles['statItem']}>
          <span className={styles['label']}>移動数</span>
          <span className={styles['value']}>{moveCount}</span>
        </div>
        <div className={styles['statItem']}>
          <span className={styles['label']}>理想</span>
          <span className={styles['value']}>{minMoveCount}</span>
        </div>
        <div className={styles['statItem']}>
          <span className={styles['label']}>効率度</span>
          <span
            className={`${styles['value']} ${
              efficiency >= 100
                ? styles['perfect']
                : efficiency >= 80
                  ? styles['good']
                  : styles['needsWork']
            }`}
          >
            {efficiency}%
          </span>
        </div>
      </div>

      <button
        className={styles['hintButton']}
        onClick={() => {
          setShowHint(!showHint);
          onRequestHint();
        }}
      >
        💡 {showHint ? 'ヒントを隠す' : 'ヒントをもらう'}
      </button>

      {showHint && (
        <div className={styles['hintBox']}>
          <p className={styles['hintText']}>
            {lastMove
              ? `最後は ${lastMove.to} から移動しました。次は、別のロッドへの移動を検討してみてください！`
              : '左のロッドから、一番上のリングを選んで、どれかのロッドに移してみましょう！'}
          </p>
        </div>
      )}
    </div>
  );
};
