import styles from './GameStart.module.css';

interface GameStartProps {
  onSelectDifficulty: (discCount: number) => void;
}

export const GameStart: React.FC<GameStartProps> = ({ onSelectDifficulty }) => {
  const difficulties = [
    {
      label: 'かんたん',
      discCount: 3,
      description: '3枚のディスク',
      minMoves: 7,
    },
    {
      label: 'ふつう',
      discCount: 4,
      description: '4枚のディスク',
      minMoves: 15,
    },
    {
      label: 'むずかしい',
      discCount: 5,
      description: '5枚のディスク',
      minMoves: 31,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🗼 ハノイの塔</h1>
        <p className={styles.subtitle}>古い伝説のパズル</p>
      </div>

      <div className={styles.rules}>
        <h2>ルール</h2>
        <ol>
          <li>左のロッドにある色付きディスク（輪）をすべて右のロッドに移動します</li>
          <li>
            <strong>ルール1:</strong> 1回に1枚のディスクだけ移動できます
          </li>
          <li>
            <strong>ルール2:</strong>
            大きいディスクは小さいディスクの下に置けません（小さいディスクの上には大きいディスクは置けません！）
          </li>
          <li>中央のロッド使ってもいいですよ</li>
        </ol>
      </div>

      <div className={styles.story}>
        <h3>📖 むかしむかしの物語</h3>
        <p>
          インドの古いお寺では、3本の金の棒と64枚の金のディスクがありました。修行僧たちは、毎日1枚のディスクを移動させます。
          すべてのディスクが別の棒に移った時、世界が終わるんだそうです...
        </p>
      </div>

      <div className={styles.difficultySection}>
        <h2>難易度を選んでね</h2>
        <div className={styles.difficultyGrid}>
          {difficulties.map((diff) => (
            <button
              key={diff.discCount}
              type="button"
              className={styles.difficultyButton}
              onClick={() => onSelectDifficulty(diff.discCount)}
            >
              <div className={styles.label}>{diff.label}</div>
              <div className={styles.description}>{diff.description}</div>
              <div className={styles.moves}>
                最少{diff.minMoves}手
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
