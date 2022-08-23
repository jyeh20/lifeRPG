class User {
  constructor(input) {
    this.id = input.id;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.username = input.username;
    this.birthday = input.birthday;
    this.email = input.email;
    this.password = input.password;
    this.dailyReward = input.dailyReward;
    this.weeklyReward = input.weeklyReward;
    this.monthlyReward = input.monthlyReward;
    this.yearlyReward = input.yearlyReward;
    this.maxCommissionsDay = input.maxCommissionsDay;
    this.maxCommissionsWeek = input.maxCommissionsWeek;
    this.maxCommissionsMonth = input.maxCommissionsMonth;
    this.maxCommissionsYear = input.maxCommissionsYear;
    this.points = input.points;
    this.admin = input.admin;
  }

  getUser() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      birthday: this.birthday || null,
      email: this.email,
      password: this.password,
      dailyReward: this.dailyReward || 5,
      weeklyReward: this.weeklyReward || 5,
      monthlyReward: this.monthlyReward || 5,
      yearlyReward: this.yearlyReward || 5,
      maxCommissionsDay: this.maxCommissionsDay || 5,
      maxCommissionsWeek: this.maxCommissionsWeek || 3,
      maxCommissionsMonth: this.maxCommissionsMonth || 3,
      maxCommissionsYear: this.maxCommissionsYear || 3,
      points: this.points || 0,
      admin: this.admin,
    };
  }

  getUserAsArray() {
    return [
      this.id,
      this.firstName,
      this.lastName,
      this.username,
      this.birthday || null,
      this.email,
      this.password,
      this.dailyReward || 5,
      this.weeklyReward || 5,
      this.monthlyReward || 5,
      this.yearlyReward || 5,
      this.maxCommissionsDay || 5,
      this.maxCommissionsWeek || 3,
      this.maxCommissionsMonth || 3,
      this.maxCommissionsYear || 3,
      this.points || 0,
      this.admin,
    ].filter((prop) => prop !== undefined);
  }

  isAdmin() {
    return this.admin;
  }
}

export default User;
