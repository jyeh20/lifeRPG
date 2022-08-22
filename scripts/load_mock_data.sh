printf "\nDo you want to flush the database? (y/n) "
read flush
if [ $flush = "y" ]; then
  printf "\nFlushing the database...\n"
  bash ./create_tables.sh
fi

printf "\nWriting users SQL file...\n"
python3 ../server/db/users_loader.py
printf "Users script written!\n"

printf "\nWriting commissions SQL file...\n"
python3 ../server/db/commissions_loader.py
printf "Commissions script written!\n"

printf "\nWriting goals SQL file...\n"
python3 ../server/db/goals_loader.py
printf "Goals script written!\n"

printf "\nLoading mock data...\n"

printf "\nLoading users...\n"
cat ../server/db/users.sql | psql -d lifeRPG -U addicted2salt
printf "\nLoading commissions...\n"
cat ../server/db/commissions.sql | psql -d lifeRPG -U addicted2salt
printf "\nLoading goals...\n"
cat ../server/db/goals.sql | psql -d lifeRPG -U addicted2salt

printf "\nMock data loaded!\n"