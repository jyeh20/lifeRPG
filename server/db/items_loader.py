import random

FILE = "/home/addicted2salt/jyeh20/projects/lifeRPG/server/db/items.sql"

def get_creator():
  return random.randint(1, 5)

def get_name(index):
  return "item" + str(index)

def get_cost():
  return random.randint(1, 4000)

def get_item_url(index):
  return "item" + str(index) + ".com"

script = ["BEGIN;\n"]

for i in range(1, 20):
  script.append(f"""
                INSERT INTO items (
                  name, cost, item_url, creator_id
                ) VALUES (
                  '{get_name(i)}',
                  '{get_cost()}',
                  '{get_item_url(i)}',
                  '{get_creator()}'
                );
                """)

with open(FILE, 'w+') as f:
  f.writelines(script)
  f.write("\nCOMMIT;")
  f.close()