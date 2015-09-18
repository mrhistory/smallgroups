-- Drop portal db.
drop database smallgroups;

-- Create portal db and add dev@localhost as a user.
create database smallgroups;
use smallgroups;
grant all privileges on *.* to 'dev'@'localhost';
