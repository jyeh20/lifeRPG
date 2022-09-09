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
  "'$2b$05$YUYYR7/QOndk2/LDRuoXXOUkgB1IRJYGUqchMmKBkWrKNORyDzPFS'", "' $2b$05$mdaedJIJR97Oma5XA2Xhh.qjfYnQkkcuGMESSY6UQH0ig2FOKFy6W'", "'$2b$05$WK6HuWPo7MYPvz97wbX8sOGdto6QJz8slbn5l7mQjEGH4W1RYAtga'", "'$2b$05$PBU5Jhms6dSq9DTuLvB/H.5wuuCn15WLJqpd8nz5LHBpWBAazJTYy'", "'$2b$05$Ti2wh1nna1ekHm9ynU4q6.dAP7MI.CPExnAtG13lKOQ8UqAp0qiyq'"
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
  admin = "false"

  script.append(f"""
    INSERT INTO users (
      first_name,
      last_name,
      username,
      password,
      email,
      birthday,
      daily_reward,
      weekly_reward,
      monthly_reward,
      yearly_reward,
      max_commissions_day,
      max_commissions_week,
      max_commissions_month,
      max_commissions_year,
      points,
      admin
    ) VALUES (
      {first_name},
      {last_name},
      '{username}',
      {password},
      '{email}',
      {birthday},
      {daily_reward},
      {weekly_reward},
      {monthly_reward},
      {yearly_reward},
      {max_commissions_day},
      {max_commissions_week},
      {max_commissions_month},
      {max_commissions_year},
      {points},
      '{admin}'
    );""")

with open(FILE, 'w+') as f:
  f.writelines(script)
  f.write("COMMIT;\n")
  f.close()
