import e from "express";

class User {
  constructor(input) {
    this.id = input.id;
    this.first_name = input.first_name;
    this.last_name = input.last_name;
    this.username = input.username;
    this.birthday = input.birthday || null;
    this.email = input.email;
    this.password = input.password;
    this.daily_reward = input.daily_reward || 5;
    this.weekly_reward = input.weekly_reward || 5;
    this.monthly_reward = input.monthly_reward || 5;
    this.yearly_reward = input.yearly_reward || 5;
    this.max_commissions_day = input.max_commissions_day || 5;
    this.max_commissions_week = input.max_commissions_week || 5;
    this.max_commissions_month = input.max_commissions_month || 3;
    this.max_commissions_year = input.max_commissions_year || 3;
    this.points = input.points || 0;
    this.admin = input.admin || false;

    if (
      !this.first_name ||
      !this.last_name ||
      !this.username ||
      !this.email ||
      !this.password
    ) {
      const e = new Error("Missing required fields");
      e.code = 403;
      throw e;
    }

    if (
      this.daily_reward < 0 ||
      this.weekly_reward < 0 ||
      this.monthly_reward < 0 ||
      this.yearly_reward < 0 ||
      this.max_commissions_day < 0 ||
      this.max_commissions_week < 0 ||
      this.max_commissions_month < 0 ||
      this.max_commissions_year < 0
    ) {
      const e = new Error("Reward cannot be negative");
      e.code = 403;
      throw e;
    }
  }

  getUser() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
      birthday: this.birthday,
      email: this.email,
      password: this.password,
      daily_reward: this.daily_reward,
      weekly_reward: this.weekly_reward,
      monthly_reward: this.monthly_reward,
      yearly_reward: this.yearly_reward,
      max_commissions_day: this.max_commissions_day,
      max_commissions_week: this.max_commissions_week,
      max_commissions_month: this.max_commissions_month,
      max_commissions_year: this.max_commissions_year,
      points: this.points,
      admin: this.admin,
    };
  }

  getUserAsArray() {
    return [
      this.id,
      this.first_name,
      this.last_name,
      this.username,
      this.birthday,
      this.email,
      this.password,
      this.daily_reward,
      this.weekly_reward,
      this.monthly_reward,
      this.yearly_reward,
      this.max_commissions_day,
      this.max_commissions_week,
      this.max_commissions_month,
      this.max_commissions_year,
      this.points,
      this.admin,
    ].filter((prop) => prop !== undefined);
  }
}

export default User;
