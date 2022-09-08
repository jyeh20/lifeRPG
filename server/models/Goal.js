class Goal {
  constructor(input) {
    this.id = input.id;
    this.name = input.name;
    this.description = input.description || null;
    this.reward = input.reward || 2;
    this.creator_id = input.creator_id;

    if (!this.creator_id || !this.name || !this.reward) {
      const e = new Error("Missing required fields");
      e.code = 403;
      throw e;
    }
    if (this.reward < 1) {
      const e = new Error("Reward must be at least 1");
      e.code = 403;
      throw e;
    }
  }

  getGoalAsArray() {
    return [
      this.id,
      this.name,
      this.description,
      this.reward,
      this.creator_id,
    ].filter((prop) => prop !== undefined);
  }
}

export default Goal;
