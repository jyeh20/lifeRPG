class Commission {
  constructor(input) {
    this.creator_id = input.creator_id;
    this.name = input.name;
    this.description = input.description;
    this.freq_week = input.freq_week;
    this.freq_month = input.freq_month;
    this.freq_year = input.freq_year;
    this.difficulty = input.difficulty;
    this.num_times_completed = input.num_times_completed;
    this.completed = input.completed;
  }

  getCommissionAsArray() {
    return [
      this.creator_id,
      this.name,
      this.description,
      this.freq_week || 0,
      this.freq_month || 0,
      this.freq_year || 0,
      this.difficulty || 1,
      this.num_times_completed || 0,
      this.completed || 0,
    ];
  }
}

export default Commission;
