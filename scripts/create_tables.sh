printf "\nWhich Database do you want to create? [ lifeRPG, liferpg_test ] "
read db

printf "\nCreating tables...\n\n"
cat ../server/db/schema.sql | psql -d $db -U addicted2salt

printf "\nTables created! Would you like to load db? [y, n]\n"
read load
if [ $load = "y" ]; then
printf "\nWriting users SQL file...\n"
python3 ../server/db/users_loader.py
printf "Users script written!\n"

printf "\nWriting commissions SQL file...\n"
python3 ../server/db/commissions_loader.py
printf "Commissions script written!\n"

printf "\nWriting goals SQL file...\n"
python3 ../server/db/goals_loader.py
printf "Goals script written!\n"

printf "\nWriting items SQL file...\n"
python3 ../server/db/items_loader.py
printf "Items script written!\n"

printf "\nLoading mock data...\n"

printf "\nLoading users...\n"
cat ../server/db/users.sql | psql -d $db -U addicted2salt
printf "\nLoading commissions...\n"
cat ../server/db/commissions.sql | psql -d $db -U addicted2salt
printf "\nLoading goals...\n"
cat ../server/db/goals.sql | psql -d $db -U addicted2salt
printf "\nLoading items...\n"
cat ../server/db/items.sql | psql -d $db -U addicted2salt
fi