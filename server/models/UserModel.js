class UserModel {
  constructor(input) {
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
  }

  getUser() {
    return [
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
    ];
  }
}

export default UserModel;
