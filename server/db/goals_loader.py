import random

FILE = "/home/addicted2salt/jyeh20/projects/lifeRPG/server/db/goals.sql"

def get_creator():
  return random.randint(1, 5)

def get_name(index):
  return "goal" + str(index)

def get_description(index):
  return "This is the description for goal" + str(index)

def get_reward():
  return random.randint(0, 20)

script = ["BEGIN;\n"]

for i in range(1, 20):
  script.append(f"""
                INSERT INTO goals (
                  creator_id, name, description, reward
                ) VALUES (
                  '{get_creator()}', '{get_name(i)}', '{get_description(i)}', '{get_reward()}'
                );
                """)

with open(FILE, 'w+') as f:
  f.writelines(script)
  f.write("\nCOMMIT;")
  f.close()