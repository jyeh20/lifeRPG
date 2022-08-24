class Goal {
  constructor(input) {
    this.creator_id = input.creator_id;
    this.name = input.name;
    this.description = input.description;
    this.reward = input.reward;
  }

  getGoalAsArray() {
    return [this.creator_id, this.name, this.description, this.reward || 2];
  }
}

export default Goal;
