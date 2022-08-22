class Commission {
  constructor(input) {
    this.creatorId = input.creatorId;
    this.name = input.name;
    this.description = input.description;
    this.freqWeek = input.freqWeek;
    this.freqMonth = input.freqMonth;
    this.freqYear = input.freqYear;
    this.difficulty = input.difficulty;
    this.numTimesCompleted = input.numTimesCompleted;
    this.completed = input.completed;
  }

  getCommissionAsArray() {
    return [
      this.creatorId,
      this.name,
      this.description,
      this.freqWeek || 0,
      this.freqMonth || 0,
      this.freqYear || 0,
      this.difficulty || 1,
      this.numTimesCompleted,
      this.completed,
    ];
  }
}

export default Commission;
