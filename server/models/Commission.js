class Commission {
  constructor(props) {
    this.id = props.id;
    this.creator_id = props.creator_id;
    this.name = props.name;
    this.description = props.description;
    this.freq_type = props.freq_type;
    this.freq = props.freq || 1;
    this.difficulty = props.difficulty || 1;
    this.num_times_completed = props.num_times_completed || 0;
    this.completed = props.completed || 0;

    if (!this.creator_id || !this.name || !this.freq_type) {
      const e = new Error("Missing required fields");
      e.code = 403;
      throw e;
    }

    if (
      this.freq < 0 ||
      this.difficulty < 0 ||
      this.num_times_completed < 0 ||
      this.completed < 0
    ) {
      const e = new Error("Fields cannot be negative");
      e.code = 403;
      throw e;
    }
  }

  getCommission() {
    return {
      id: this.id,
      creator_id: this.creator_id,
      name: this.name,
      description: this.description,
      freq_type: this.freq_type,
      freq: this.freq,
      difficulty: this.difficulty,
      num_times_completed: this.num_times_completed,
      completed: this.completed,
    };
  }

  getCommissionAsArray() {
    return [
      this.creator_id,
      this.name,
      this.description,
      this.freq_type,
      this.freq,
      this.difficulty,
      this.num_times_completed,
      this.completed,
    ];
  }
}

export default Commission;
