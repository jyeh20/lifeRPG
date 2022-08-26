DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS commissions;
DROP TABLE IF EXISTS goals;

CREATE TABLE users (
  id SERIAL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(25) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  birthday DATE,
  daily_reward SMALLINT NOT NULL,
  weekly_reward SMALLINT NOT NULL,
  monthly_reward SMALLINT NOT NULL,
  yearly_reward SMALLINT NOT NULL,
  max_commissions_day SMALLINT NOT NULL,
  max_commissions_week SMALLINT NOT NULL,
  max_commissions_month SMALLINT NOT NULL,
  max_commissions_year SMALLINT NOT NULL,
  points INTEGER NOT NULL,
  admin BOOLEAN NOT NULL,
  UNIQUE (username),
  UNIQUE (id),
  UNIQUE (email),
  PRIMARY KEY (id, username)
);

CREATE TABLE commissions (
  id SERIAL,
  creator_id INTEGER NOT NULL,
  name VARCHAR(35) NOT NULL,
  description VARCHAR(255),
  freq_type VARCHAR(25) NOT NULL,
  freq SMALLINT NOT NULL,
  difficulty SMALLINT NOT NULL,
  num_times_completed INTEGER,
  completed BOOLEAN,
  UNIQUE(id),
  UNIQUE(name, creator_id),
  PRIMARY KEY (id, name),
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE goals (
  id SERIAL,
  creator_id INTEGER NOT NULL,
  name VARCHAR(35) NOT NULL,
  description VARCHAR(255),
  reward SMALLINT NOT NULL,
  UNIQUE(id),
  UNIQUE(name, creator_id),
  PRIMARY KEY (id, name),
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE items (
  id SERIAL,
  creator_id INTEGER NOT NULL,
  name VARCHAR(35) NOT NULL,
  cost INTEGER NOT NULL,
  item_url VARCHAR(255),
  PRIMARY KEY (id, link),
  UNIQUE(id),
  UNIQUE(link, creator_id)
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);