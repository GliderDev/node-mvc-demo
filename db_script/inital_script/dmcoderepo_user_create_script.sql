USE `dmcoderepo`;
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `emp_code` varchar(8) NOT NULL,
  `doj` date DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `auth_key` varchar(32) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `user`(
  `first_name`,
  `last_name`,
  `email`,
  `password`,
  `password_reset_token`,
  `dob`,
  `phone`,
  `emp_code`,
  `doj`,
  `status`,
  `auth_key`,
  `profile_pic`

) 
VALUES 
('Riju','R','riju@dmail.com','$2a$10$4Lw6HcUELWpLRCMDifXFoewpEv7jr1HXz7DoNoJQhuhBEPnpVxWqW',NULL,'0000-00-00','1234567890','123',NULL,1,NULL,''),
('Tyson','Paul','tyson@dmail.com','$2a$10$dPDCCqF0B/Zo/7N5RL3lauDj1FCNHpEQHw.lf4S4o0caJhdtX5Kia',NULL,'1989-07-20','1234567890','dme464',NULL,1,NULL,'bridge.jpg'),
('Srikanth','Kamath','srikanth@dmail.com','$2a$10$LIC0CxnmZ5OCWTpR8JjkTu4McTsLiff0YX5PIXPTL1VwujZ5/BCce',NULL,'0000-00-00','1234567890','dme007',NULL,1,NULL,'Selection_012.png');