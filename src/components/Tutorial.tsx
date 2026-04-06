import React from "react";
import styles from "./Tutorial.module.css";

interface TutorialProps {
  onComplete: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const steps = [
    {
      title: "ハノイの塔へようこそ！",
      description:
        "むかしむかし、インドのハノイという寺院に、3本の棒と64枚の金の円盤がありました。",
      image: "📖",
    },
    {
      title: "ルール 1️⃣：1度に1枚だけ",
      description: "必ず1枚ずつ円盤を移動させます。複数の円盤を一度に動かしてはいけません。",
      image: "1️⃣",
    },
    {
      title: "ルール 2️⃣：大きい円盤の上に小さい円盤",
      description: "どの円盤よりも小さい円盤を、その上に置いてはいけません。大きい円盤の上には、必ず同じサイズ以下の円盤を置きます。",
      image: "📏",
    },
    {
      title: "ルール 3️⃣：3本の棒を使う",
      description:
        "左（ロッド1）、中央（ロッド2）、右（ロッド3）の3本の棒があります。すべての円盤を右に移動させます。",
      image: "🔄",
    },
    {
      title: "目的：すべてを右に！",
      description: "左の棒にある全ての円盤を、右の棒に移動させたらクリア！なるべく少ない回数で達成できるかな？",
      image: "🎯",
    },
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];

  return (
    <div className={styles['tutorialContainer']}>
      <div className={styles['tutorialContent']}>
        <div className={styles['illustration']}>{step?.image}</div>

        <h2 className={styles['stepTitle']}>{step?.title}</h2>
        <p className={styles['description']}>{step?.description}</p>

        <div className={styles['progressBar']}>
          <div className={styles['progressFill']} style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>

        <p className={styles['stepIndicator']}>
          ステップ {currentStep + 1} / {steps.length}
        </p>

        <div className={styles['buttons']}>
          <button className={styles['skipButton']} onClick={handleSkip}>
            スキップ
          </button>
          <button className={styles['nextButton']} onClick={handleNext}>
            {currentStep === steps.length - 1 ? "ゲーム開始！" : "次へ"}
          </button>
        </div>
      </div>
    </div>
  );
};
