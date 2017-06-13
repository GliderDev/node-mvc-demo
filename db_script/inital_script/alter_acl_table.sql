-- During load test it is observed that `value` column in `acl_meta` 
-- and `acl_roles` table is of VARCHAR(255). 
-- This is not enough to store large users roles.
-- This script will change data type of `value` column to TEXT so it can handle 
-- large users roles
ALTER TABLE `acl_meta` 
CHANGE COLUMN `value` `value` TEXT NULL DEFAULT NULL ;

ALTER TABLE `acl_roles` 
CHANGE COLUMN `value` `value` TEXT NULL DEFAULT NULL ;