import { describe, it, expect, beforeEach } from 'vitest';
import { HanoiGame } from '@/game/HanoiGame';

describe('HanoiGame', () => {
  let game: HanoiGame;

  beforeEach(() => {
    game = new HanoiGame(3); // 3本のロッド、3枚のディスク
  });

  it('ゲームを初期化できる', () => {
    expect(game.getRods()).toHaveLength(3);
    expect(game.getRods()[0]).toEqual([3, 2, 1]); // ロッド0に3枚のディスク
    expect(game.getRods()[1]).toEqual([]); // ロッド1は空
    expect(game.getRods()[2]).toEqual([]); // ロッド2は空
  });

  it('ディスクを移動できる', () => {
    game.moveDisc(0, 1); // ロッド0からロッド1へ
    expect(game.getRods()[0]).toEqual([3, 2]);
    expect(game.getRods()[1]).toEqual([1]);
  });

  it('大きいディスクの上に小さいディスクを置ける', () => {
    game.moveDisc(0, 1); // ロッド0からロッド1へ（ディスク1）
    game.moveDisc(0, 2); // ロッド0からロッド2へ（ディスク2）
    game.moveDisc(1, 2); // ロッド1からロッド2へ（ディスク1）

    expect(game.getRods()[2]).toEqual([2, 1]);
  });

  it('小さいディスクの上に大きいディスクは置けない', () => {
    game.moveDisc(0, 1); // ロッド0からロッド1へ（ディスク1）
    const result = game.moveDisc(0, 1); // ロッド0からロッド1へ（ディスク2を1の上に置こうとする）

    expect(result).toBe(false);
    expect(game.getRods()[1]).toEqual([1]); // 変わっていない
  });

  it('ゲーム完了を判定できる', () => {
    expect(game.isComplete()).toBe(false);

    // すべてのディスクをロッド2に移動
    game.moveDisc(0, 2);
    game.moveDisc(0, 1);
    game.moveDisc(2, 1);
    game.moveDisc(0, 2);
    game.moveDisc(1, 0);
    game.moveDisc(1, 2);
    game.moveDisc(0, 2);

    expect(game.isComplete()).toBe(true);
  });

  it('移動回数を記録できる', () => {
    expect(game.getMoveCount()).toBe(0);

    game.moveDisc(0, 1);
    expect(game.getMoveCount()).toBe(1);

    game.moveDisc(0, 2);
    expect(game.getMoveCount()).toBe(2);
  });
});
