-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2025 at 03:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ohjelmistoprojekti`
--

-- --------------------------------------------------------

--
-- Table structure for table `kurssikirjautumiset`
--

CREATE TABLE `kurssikirjautumiset` (
  `Tunnus` int(11) NOT NULL,
  `Opiskelija` int(11) NOT NULL,
  `Kurssi` int(11) NOT NULL,
  `Kirjautumispaiva_aika` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kurssikirjautumiset`
--

INSERT INTO `kurssikirjautumiset` (`Tunnus`, `Opiskelija`, `Kurssi`, `Kirjautumispaiva_aika`) VALUES
(1, 1, 1, '2025-08-05 18:07:18'),
(2, 2, 4, '2025-08-05 18:15:28'),
(12, 2, 1, '2025-08-21 16:35:55');

--
-- Triggers `kurssikirjautumiset`
--
DELIMITER $$
CREATE TRIGGER `Osallistujat ADD` AFTER INSERT ON `kurssikirjautumiset` FOR EACH ROW UPDATE kurssit
SET Osallistujat = Osallistujat + 1
WHERE kurssit.Tunnus = NEW.Kurssi
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `Osallistujat DELETE` AFTER DELETE ON `kurssikirjautumiset` FOR EACH ROW UPDATE kurssit
SET Osallistujat = Osallistujat - 1
WHERE kurssit.Tunnus = OLD.Kurssi
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `kurssit`
--

CREATE TABLE `kurssit` (
  `Tunnus` int(11) NOT NULL,
  `KurssiNimi` varchar(50) NOT NULL,
  `Kuvaus` varchar(200) NOT NULL,
  `Alkupaiva` date NOT NULL,
  `Loppupaiva` date NOT NULL,
  `Opettaja` int(11) NOT NULL,
  `Tila` int(11) NOT NULL,
  `Osallistujat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kurssit`
--

INSERT INTO `kurssit` (`Tunnus`, `KurssiNimi`, `Kuvaus`, `Alkupaiva`, `Loppupaiva`, `Opettaja`, `Tila`, `Osallistujat`) VALUES
(1, 'Koodauksen perusteet', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut a', '2025-08-05', '2025-08-06', 1, 3, 2),
(3, 'Kemian Perusteet', 'Opettaa kemian perusteet.', '2025-08-03', '2025-08-05', 2, 2, 0),
(4, 'Yhtälölaskentaa', 'Opettaa laskemaan ensimmäisen ja toisen asteen yhtälöitä.', '2025-08-01', '2025-08-03', 3, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `opettajat`
--

CREATE TABLE `opettajat` (
  `Tunnus` int(11) NOT NULL,
  `Etunimi` varchar(15) NOT NULL,
  `Sukunimi` varchar(15) NOT NULL,
  `Aine` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `opettajat`
--

INSERT INTO `opettajat` (`Tunnus`, `Etunimi`, `Sukunimi`, `Aine`) VALUES
(1, 'Jarkko', 'Maanpohja', 'Tietotekniikka'),
(2, 'Mikael', 'Bratwurst', 'Kemia'),
(3, 'Anna', 'Metwurst', 'Kotitalous');

-- --------------------------------------------------------

--
-- Table structure for table `opiskelijat`
--

CREATE TABLE `opiskelijat` (
  `Tunnus` int(11) NOT NULL,
  `Etunimi` varchar(15) NOT NULL,
  `Sukunimi` varchar(15) NOT NULL,
  `Syntymapaiva` date NOT NULL,
  `Vuosikurssi` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `opiskelijat`
--

INSERT INTO `opiskelijat` (`Tunnus`, `Etunimi`, `Sukunimi`, `Syntymapaiva`, `Vuosikurssi`) VALUES
(1, 'Lauri', 'Kokkala', '2006-07-14', 22),
(2, 'Jani', 'Virtanen', '2006-08-01', 22),
(3, 'Olli', 'Pohja', '2006-04-01', 22);

-- --------------------------------------------------------

--
-- Table structure for table `tilat`
--

CREATE TABLE `tilat` (
  `Tunnus` int(11) NOT NULL,
  `TilanNimi` varchar(15) NOT NULL,
  `Kapasiteetti` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tilat`
--

INSERT INTO `tilat` (`Tunnus`, `TilanNimi`, `Kapasiteetti`) VALUES
(1, 'A301', 20),
(2, 'A302', 20),
(3, 'Auditorio', 40);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kurssikirjautumiset`
--
ALTER TABLE `kurssikirjautumiset`
  ADD PRIMARY KEY (`Tunnus`),
  ADD KEY `Kurssi` (`Kurssi`),
  ADD KEY `Opiskelija` (`Opiskelija`);

--
-- Indexes for table `kurssit`
--
ALTER TABLE `kurssit`
  ADD PRIMARY KEY (`Tunnus`),
  ADD KEY `Opettaja` (`Opettaja`),
  ADD KEY `Tila` (`Tila`);

--
-- Indexes for table `opettajat`
--
ALTER TABLE `opettajat`
  ADD PRIMARY KEY (`Tunnus`);

--
-- Indexes for table `opiskelijat`
--
ALTER TABLE `opiskelijat`
  ADD PRIMARY KEY (`Tunnus`);

--
-- Indexes for table `tilat`
--
ALTER TABLE `tilat`
  ADD PRIMARY KEY (`Tunnus`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kurssikirjautumiset`
--
ALTER TABLE `kurssikirjautumiset`
  MODIFY `Tunnus` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `kurssit`
--
ALTER TABLE `kurssit`
  MODIFY `Tunnus` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `opettajat`
--
ALTER TABLE `opettajat`
  MODIFY `Tunnus` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `opiskelijat`
--
ALTER TABLE `opiskelijat`
  MODIFY `Tunnus` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tilat`
--
ALTER TABLE `tilat`
  MODIFY `Tunnus` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kurssikirjautumiset`
--
ALTER TABLE `kurssikirjautumiset`
  ADD CONSTRAINT `kurssikirjautumiset_ibfk_1` FOREIGN KEY (`Kurssi`) REFERENCES `kurssit` (`Tunnus`),
  ADD CONSTRAINT `kurssikirjautumiset_ibfk_2` FOREIGN KEY (`Opiskelija`) REFERENCES `opiskelijat` (`Tunnus`);

--
-- Constraints for table `kurssit`
--
ALTER TABLE `kurssit`
  ADD CONSTRAINT `kurssit_ibfk_1` FOREIGN KEY (`Opettaja`) REFERENCES `opettajat` (`Tunnus`),
  ADD CONSTRAINT `kurssit_ibfk_2` FOREIGN KEY (`Tila`) REFERENCES `tilat` (`Tunnus`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
