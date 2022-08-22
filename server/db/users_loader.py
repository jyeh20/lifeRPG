import random

FILE = "/home/addicted2salt/jyeh20/projects/lifeRPG/server/db/users.sql"

first_names = [
  "'Alice'",
  "'Ben'",
  "'Chris'",
  "'Dennis'",
  "'Erin'"
]
last_names = [
  "'Fredrelein'",
  "'Gates'",
  "'Hines'","'Irwin'", "'Jansen'"
]

def username_generator(first_name, last_name):
  return last_name.lower().replace("'", "") + first_name.lower().replace("'","")

passwords = [
  "'pass'", "'chicken231'", "'sa0oqiwer0!!'", "'dkko2wid2'", "'8008135'"
]

def email_generator(first_name, last_name):
  return last_name.lower().replace("'", "") + "@" + first_name.lower().replace("'","") + ".com"

birthdays = [
  "'04/14/1990'", "NULL", "'01/01/1980'", "'09/28/2002'", "'01/01/1980'"
]

def get_reward():
  return random.randint(0, 100)

script = ["BEGIN;\n"]

for i in range(len(first_names)):
  first_name = first_names[i]
  last_name = last_names[i]
  username = username_generator(first_name, last_name)
  password = passwords[i]
  email = email_generator(first_name, last_name)
  birthday = birthdays[i]
  daily_reward = get_reward()
  weekly_reward = get_reward()
  monthly_reward = get_reward()
  yearly_reward = get_reward()
  max_commissions_day = get_reward()
  max_commissions_week = get_reward()
  max_commissions_month = get_reward()
  max_commissions_year = get_reward()
  points = get_reward() // 5

  script.append(f"""
    INSERT INTO users (
      first_name, last_name, username, password, email, birthday, daily_reward, weekly_reward, monthly_reward, yearly_reward, max_commissions_day, max_commissions_week, max_commissions_month, max_commissions_year, points
    ) VALUES (
      {first_name}, {last_name}, '{username}', {password}, '{email}', {birthday}, {daily_reward}, {weekly_reward}, {monthly_reward}, {yearly_reward}, {max_commissions_day}, {max_commissions_week}, {max_commissions_month}, {max_commissions_year},{points}
    );
                """)

with open(FILE, 'w+') as f:
  f.writelines(script)
  f.write("COMMIT;\n")
  f.close()
