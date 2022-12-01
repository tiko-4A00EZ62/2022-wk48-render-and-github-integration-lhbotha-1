-- Active: 1665777944699@@127.0.0.1@3306@cities_d
/*
DROP TABLE `cities`;
*/
/*
CREATE TABLE IF NOT EXISTS `cities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `country` varchar(60) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)
*/


INSERT INTO `cities`(`name`, `country`) VALUES ('Oslo', 'Norway');
INSERT INTO `cities` (`name`, `country`) VALUES ('Pretoria', 'South Africa');
INSERT INTO `cities` (`name`, `country`) VALUES ('Helsinki', 'Finland');
