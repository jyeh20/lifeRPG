import random

FILE = "/home/addicted2salt/jyeh20/projects/lifeRPG/server/db/items.sql"

def get_creator():
  return random.randint(1, 5)

def get_name(index):
  return "item" + str(index)

def get_cost():
  return random(1, 4000)

def get_item_url(index):
  return "item" + str(index) + ".com"

script = ["BEGIN;\n"]

for i in range(1, 20):
  script.append(f"""
                INSERT INTO goals (
                  creator_id, name, description, reward
                ) VALUES (
                  '{get_creator()}', '{get_name(i)}', '{get_cost()}', '{get_item_url(i)}'
                );
                """)

with open(FILE, 'w+') as f:
  f.writelines(script)
  f.write("\nCOMMIT;")
  f.close()