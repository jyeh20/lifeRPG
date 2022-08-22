class CommissionModel {
  constructor(input) {
    this.creatorId = input.creatorId;
    this.name = input.name;
    this.description = input.description;
    this.freqWeek = input.freqWeek;
    this.freqMonth = input.freqMonth;
    this.freqYear = input.freqYear;
    this.difficulty = input.difficulty;
    this.num_times_completed = input.num_times_completed;
    this.completed = input.completed;
  }

  getCommission() {
    return [
      this.creatorId,
      this.name,
      this.description,
      this.freqWeek,
      this.freqMonth,
      this.freqYear,
      this.difficulty,
      this.num_times_completed,
      this.completed,
    ];
  }
}

export default CommissionModel;
