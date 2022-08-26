import random

FILE = "/home/addicted2salt/jyeh20/projects/lifeRPG/server/db/commissions.sql"

def get_creator():
  return random.randint(1, 5)

def get_name(index):
  return "commission" + str(index)

def get_description(index):
  return "This is the description for commission" + str(index)

def get_freq_type():
  return random.choice(["week", "month", "year"])

def freq():
  return random.randint(0, 4)

def difficulty():
  return random.randint(1, 4)

script = ["BEGIN;"]

for i in range(1, 40):
  script.append(f"""
                INSERT INTO commissions (
                  creator_id, name, description, freq_type, freq, difficulty, num_times_completed, completed) VALUES (
                    '{get_creator()}', '{get_name(i)}', '{get_description(i)}', '{get_freq_type()}', '{freq()}', '{difficulty()}', '{random.randint(0, 100)}', '{random.randint(0, 1)}');
                """)

with open(FILE, "w") as f:
  f.writelines(script)
  f.write("\nCOMMIT;")
  f.close()