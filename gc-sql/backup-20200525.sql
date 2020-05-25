/*
SQLyog Community v13.1.5  (64 bit)
MySQL - 5.7.25-google-log : Database - poc
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`poc` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `poc`;

/*Table structure for table `humidity_status` */

DROP TABLE IF EXISTS `humidity_status`;

CREATE TABLE `humidity_status` (
  `id` int(11) NOT NULL,
  `value` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `iot_data` */

DROP TABLE IF EXISTS `iot_data`;

CREATE TABLE `iot_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `raw_data` varchar(20480) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56023 DEFAULT CHARSET=utf8;

/*Table structure for table `iot_thermo` */

DROP TABLE IF EXISTS `iot_thermo`;

CREATE TABLE `iot_thermo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `device_id` char(12) DEFAULT NULL,
  `human_temperature` float DEFAULT NULL,
  `env_temperature` float DEFAULT NULL,
  `detected_range` int(11) DEFAULT NULL,
  `processed` smallint(6) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42513 DEFAULT CHARSET=utf8;

/*Table structure for table `seat_status` */

DROP TABLE IF EXISTS `seat_status`;

CREATE TABLE `seat_status` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `seat_id` int(11) NOT NULL,
  `seat_status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Table structure for table `turnstile_status` */

DROP TABLE IF EXISTS `turnstile_status`;

CREATE TABLE `turnstile_status` (
  `status` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
