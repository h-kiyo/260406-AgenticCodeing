export interface MoveRecord {
  from: number;
  to: number;
}

export class HanoiGame {
  private rods: number[][];
  private discCount: number;
  private moveCount = 0;
  private moveHistory: MoveRecord[] = [];

  constructor(discCount: number) {
    this.discCount = discCount;
    this.rods = [
      Array.from({ length: discCount }, (_, i) => discCount - i),
      [],
      [],
    ];
  }

  getRods(): number[][] {
    return this.rods.map((rod) => [...rod]);
  }

  moveDisc(fromRod: number, toRod: number): boolean {
    const fromRodArray = this.rods[fromRod];
    const toRodArray = this.rods[toRod];

    if (!fromRodArray || !toRodArray) {
      return false;
    }

    if (fromRodArray.length === 0) {
      return false;
    }

    const disc = fromRodArray[fromRodArray.length - 1];

    if (disc === undefined) {
      return false;
    }

    const topOfToRod: number | undefined =
      toRodArray.length > 0 ? toRodArray[toRodArray.length - 1] : undefined;

    if (topOfToRod !== undefined && topOfToRod < disc) {
      return false;
    }

    fromRodArray.pop();
    toRodArray.push(disc);
    this.moveCount++;
    this.moveHistory.push({ from: fromRod, to: toRod });

    return true;
  }

  getMoveCount(): number {
    return this.moveCount;
  }

  getMoveHistory(): MoveRecord[] {
    return [...this.moveHistory];
  }

  getMinMoveCount(): number {
    return 2 ** this.discCount - 1;
  }

  isComplete(): boolean {
    const rod2 = this.rods[2];
    const rod0 = this.rods[0];
    const rod1 = this.rods[1];

    return (
      rod2 !== undefined &&
      rod0 !== undefined &&
      rod1 !== undefined &&
      rod2.length === this.discCount &&
      rod0.length === 0 &&
      rod1.length === 0
    );
  }
}
