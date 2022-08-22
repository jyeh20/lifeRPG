class Goal {
  constructor(input) {
    this.creatorId = input.creatorId;
    this.name = input.name;
    this.description = input.description;
    this.reward = input.reward;
  }

  getGoalAsArray() {
    return [this.creatorId, this.name, this.description, this.reward || 2];
  }
}

export default Goal;
