printf "\nCreating tables...\n\n"
cat ../server/db/schema.sql | psql -d lifeRPG -U addicted2salt
