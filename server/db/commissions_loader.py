import random

FILE = "/home/addicted2salt/jyeh20/projects/lifeRPG/server/db/commissions.sql"

def get_creator():
  return random.randint(1, 5)

def get_name(index):
  return "commission" + str(index)

def get_description(index):
  return "This is the description for commission" + str(index)

def freq():
  return random.randint(0, 4)

def get_frequencies():
  week, month, year = freq(), 0, 0
  if week == 0:
    month = freq()
    if month == 0:
      year = freq()
  return { "week": week, "month": month, "year": year }

def difficulty():
  return random.randint(1, 4)

script = ["BEGIN;"]

for i in range(1, 40):
  freqs = get_frequencies()
  script.append(f"""
                INSERT INTO commissions (
                  creator_id, name, description, freq_week, freq_month, freq_year, difficulty, num_times_completed, completed) VALUES (
                    '{get_creator()}', '{get_name(i)}', '{get_description(i)}', '{freqs["week"]}', '{freqs["month"]}', '{freqs["year"]}', '{difficulty()}', '{random.randint(0, 100)}', '{random.randint(0, 1)}');
                """)

with open(FILE, "w") as f:
  f.writelines(script)
  f.write("\nCOMMIT;")
  f.close()