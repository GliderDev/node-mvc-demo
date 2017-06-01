CREATE TABLE `user_meta` (
  `user_meta_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `meta_key` varchar(45) NOT NULL,
  `meta_val` text,
  PRIMARY KEY (`user_meta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
