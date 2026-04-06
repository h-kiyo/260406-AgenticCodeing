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
      explanation: '最少手数: 2³ - 1 = 7手',
    },
    {
      label: 'ふつう',
      discCount: 4,
      description: '4枚のディスク',
      minMoves: 15,
      explanation: '最少手数: 2⁴ - 1 = 15手',
    },
    {
      label: 'むずかしい',
      discCount: 5,
      description: '5枚のディスク',
      minMoves: 31,
      explanation: '最少手数: 2⁵ - 1 = 31手',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🗼 ハノイの塔</h1>
        <p className={styles.subtitle}>古い伝説のパズル</p>
      </div>

      <div className={styles.rules}>
        <h2>⭐ やることは？</h2>
        <ol>
          <li>📍 左から右へ、すべてのリングを動かそう</li>
          <li>
            <strong>ルール1:</strong> 1回に1個だけ動かせます
          </li>
          <li>
            <strong>ルール2:</strong> 大きいリングは小さいリングの下に置けません ❌
          </li>
          <li>ヒント💡 真ん中のロッドも使えますよ</li>
        </ol>
      </div>

      <div className={styles.story}>
        <h3>📖 むかしむかしの物語</h3>
        <p>
          インドの古いお寺では、3本の金の棒と64枚の金のディスクがありました。修行僧たちは毎日1枚のディスクを動かしています。
          <strong>すべてのディスクが別の棒に移った時、世界が終わるんだそうです...</strong>
        </p>
        <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
          🔢 <strong>最少手数の秘密:</strong> n枚のディスクを動かすのに必要な最少手数は <strong>2<sup>n</sup> - 1</strong> 手です。
          64枚の場合は約184京手! 毎秒1手でも1000年以上かかる計算です...
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
              <div className={styles.moves}>{diff.explanation}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
