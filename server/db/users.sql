BEGIN;

    INSERT INTO users (
      first_name, last_name, username, password, email, birthday, daily_reward, weekly_reward, monthly_reward, yearly_reward, max_commissions_day, max_commissions_week, max_commissions_month, max_commissions_year, points
    ) VALUES (
      'Alice', 'Fredrelein', 'fredreleinalice', 'pass', 'fredrelein@alice.com', '04/14/1990', 41, 52, 73, 99, 4, 20, 12, 18,16
    );
                
    INSERT INTO users (
      first_name, last_name, username, password, email, birthday, daily_reward, weekly_reward, monthly_reward, yearly_reward, max_commissions_day, max_commissions_week, max_commissions_month, max_commissions_year, points
    ) VALUES (
      'Ben', 'Gates', 'gatesben', 'chicken231', 'gates@ben.com', NULL, 65, 45, 83, 11, 98, 100, 93, 91,10
    );
                
    INSERT INTO users (
      first_name, last_name, username, password, email, birthday, daily_reward, weekly_reward, monthly_reward, yearly_reward, max_commissions_day, max_commissions_week, max_commissions_month, max_commissions_year, points
    ) VALUES (
      'Chris', 'Hines', 'hineschris', 'sa0oqiwer0!!', 'hines@chris.com', '01/01/1980', 70, 5, 23, 50, 15, 35, 8, 91,1
    );
                
    INSERT INTO users (
      first_name, last_name, username, password, email, birthday, daily_reward, weekly_reward, monthly_reward, yearly_reward, max_commissions_day, max_commissions_week, max_commissions_month, max_commissions_year, points
    ) VALUES (
      'Dennis', 'Irwin', 'irwindennis', 'dkko2wid2', 'irwin@dennis.com', '09/28/2002', 31, 5, 66, 47, 13, 82, 24, 31,10
    );
                
    INSERT INTO users (
      first_name, last_name, username, password, email, birthday, daily_reward, weekly_reward, monthly_reward, yearly_reward, max_commissions_day, max_commissions_week, max_commissions_month, max_commissions_year, points
    ) VALUES (
      'Erin', 'Jansen', 'jansenerin', '8008135', 'jansen@erin.com', '01/01/1980', 95, 30, 43, 72, 4, 41, 98, 92,16
    );
                COMMIT;
