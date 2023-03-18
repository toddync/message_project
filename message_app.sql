-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 07-Fev-2023 às 01:21
-- Versão do servidor: 10.4.27-MariaDB
-- versão do PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `message_app`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `Name` varchar(60) NOT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `Email` varchar(80) DEFAULT NULL,
  `Password` text DEFAULT NULL,
  `Private_key` text NOT NULL,
  `Public_key` text NOT NULL,
  `Status` varchar(10) DEFAULT NULL,
  `Owner` int(11) DEFAULT NULL,
  `grp` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `chat`
--

INSERT INTO `chat` (`id`, `Name`, `Image`, `Email`, `Password`, `Private_key`, `Public_key`, `Status`, `Owner`, `grp`) VALUES
(0, '', NULL, '', '', '1', '1', 'offline', NULL, 'no'),
(1, 'Test User', 'images/profile_images/1.png', 'test@gmail.com', '36574622', '1', '1', 'online', NULL, 'no'),
(3, 'Miguel Cohen', NULL, 'cohen@gmail.com', '123qwe', '1', '1', 'online', NULL, 'no'),
(7, 'teste', NULL, 'teste@gmail.com', '12345678', '1', '1', 'offline', NULL, 'no');

-- --------------------------------------------------------

--
-- Estrutura da tabela `mensagens`
--

CREATE TABLE `mensagens` (
  `sender` varchar(60) NOT NULL,
  `message` longtext NOT NULL,
  `reciever` varchar(60) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `seen` tinyint(1) NOT NULL,
  `msg_id` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `mensagens`
--

INSERT INTO `mensagens` (`sender`, `message`, `reciever`, `date`, `seen`, `msg_id`) VALUES
('1', '1', '2', '2023-01-20 16:43:08', 0, 4),
('1', '2', '2', '2023-01-20 16:43:08', 0, 5),
('2', 'oi', '1', '2023-01-20 21:52:59', 0, 55),
('2', 'testando', '1', '2023-01-22 00:54:08', 0, 57),
('1', 'oi', '3', '2023-01-22 18:51:58', 0, 59),
('3', 'sim', '1', '2023-01-22 19:02:55', 0, 60),
('3', 'cara', '1', '2023-01-22 19:03:39', 0, 61),
('3', 'man', '1', '2023-01-22 19:04:13', 0, 62),
('7', 'jihi', '3', '2023-01-22 20:04:31', 0, 63),
('3', 'ihij', '7', '2023-01-22 20:24:45', 0, 64),
('3', 'oi', '7', '2023-01-22 21:04:42', 0, 65),
('1', 'Oi', '3', '2023-01-23 01:53:03', 0, 66),
('1', 'Como vai', '3', '2023-01-23 01:53:22', 0, 67),
('1', 'oi', '7', '2023-01-23 03:02:22', 0, 68),
('1', 'era uma vez uma criança muito pequena, seu nome era pequeno polegar, ou polgarzinho. Os irmãos de polegarzinho eram muito altos e chateavam ele falando que ele nunca seria tão alto quanto eles.', '3', '2023-01-23 03:06:04', 0, 69),
('1', 'teste', '3', '2023-01-23 03:35:24', 0, 71),
('1', 'teste', '7', '2023-01-23 19:25:56', 0, 72),
('1', 'oi', '3', '2023-01-23 20:17:58', 0, 77),
('1', '1', '3', '2023-01-23 20:19:07', 0, 78),
('1', 'oi', '3', '2023-01-23 21:24:23', 0, 79),
('3', 'dfgfdg', '1', '2023-01-24 01:44:48', 0, 81),
('1', 'rrty', '3', '2023-01-24 01:46:12', 0, 82),
('1', 'dfhgdh nhg', '3', '2023-01-24 01:46:20', 0, 83),
('3', 'oi', '1', '2023-01-24 02:07:41', 0, 84),
('1', 'tchau', '3', '2023-01-24 02:07:50', 0, 85),
('3', 'iii', '1', '2023-01-24 02:08:31', 0, 86),
('3', 'o', '1', '2023-01-24 02:09:33', 0, 87),
('1', 'e', '3', '2023-01-24 02:09:48', 0, 88),
('3', 's', '1', '2023-01-24 02:38:35', 0, 89),
('1', 't', '3', '2023-01-24 02:38:52', 0, 90),
('3', 'u', '1', '2023-01-24 02:38:59', 0, 91),
('1', 'v', '3', '2023-01-24 02:39:04', 0, 92),
('3', 'x', '1', '2023-01-24 02:39:09', 0, 93),
('1', 'y', '3', '2023-01-24 02:39:14', 0, 94),
('3', 'z', '1', '2023-01-24 02:39:18', 0, 95),
('1', 'a', '3', '2023-01-24 02:39:28', 0, 96),
('3', 'b', '1', '2023-01-24 02:39:32', 0, 97),
('1', 'c', '3', '2023-01-24 02:39:40', 0, 98),
('1', 'd', '3', '2023-01-24 16:06:46', 0, 99),
('1', 'oi', '3', '2023-01-24 23:04:36', 0, 106),
('3', 'oi', '1', '2023-01-24 23:04:43', 0, 107),
('1', 'i', '3', '2023-01-25 16:09:16', 0, 108),
('1', 'hfgh', '3', '2023-01-25 16:34:18', 0, 109),
('3', 'Oi', '1', '2023-01-25 16:43:49', 0, 110),
('3', 'Oi', '1', '2023-01-25 16:47:23', 0, 111),
('3', 'Teste', '1', '2023-01-25 16:48:20', 0, 112),
('1', 'oi', '3', '2023-01-25 16:48:42', 0, 113),
('3', 'Como vai ', '1', '2023-01-25 16:49:48', 0, 114),
('1', 'mmmm', '3', '2023-01-25 16:51:11', 0, 115),
('3', 'DJ ac', '1', '2023-01-25 16:51:20', 0, 116),
('3', 'Teste', '1', '2023-01-25 16:51:52', 0, 117),
('3', 'Teste', '1', '2023-01-25 16:52:01', 0, 118),
('3', 'Olá ', '1', '2023-01-25 16:52:48', 0, 119),
('1', 'olá', '3', '2023-01-25 16:53:34', 0, 120),
('1', 'como vai vc?', '3', '2023-01-25 16:53:49', 0, 121),
('3', 'Bem, e vc?', '1', '2023-01-25 17:03:20', 0, 122),
('1', 'bem tbm', '3', '2023-01-25 17:03:49', 0, 123),
('3', 'EAI ', '1', '2023-01-25 17:04:31', 0, 124),
('3', 'Vc é maneiro ', '1', '2023-01-25 17:05:23', 0, 125),
('3', 'Quantos anos vc tem', '1', '2023-01-25 17:05:34', 0, 126),
('1', '17, quase 18', '3', '2023-01-25 17:05:49', 0, 127),
('3', 'Eu tbm', '1', '2023-01-25 17:06:30', 0, 128),
('3', 'Oi', '1', '2023-01-25 17:07:10', 0, 129),
('1', 'oi', '3', '2023-01-25 17:07:18', 0, 130),
('3', 'Hola ', '1', '2023-01-25 17:17:46', 0, 131),
('1', 'jj', '3', '2023-01-25 17:20:39', 0, 132),
('3', 'Test', '1', '2023-01-25 17:20:47', 0, 133),
('1', 'Oi', '3', '2023-01-25 19:13:01', 0, 134),
('3', 'oi', '1', '2023-01-25 19:13:24', 0, 135),
('3', 'oi', '1', '2023-01-25 19:14:02', 0, 136),
('3', 'como vai', '1', '2023-01-25 19:14:41', 0, 137),
('1', 'Oi', '3', '2023-01-25 19:19:03', 0, 138),
('3', 'kj', '1', '2023-01-25 19:24:42', 0, 139),
('3', 'k', '1', '2023-01-25 19:25:06', 0, 140),
('1', 'Oi', '3', '2023-01-25 19:28:05', 0, 141),
('3', ',', '1', '2023-01-25 19:31:28', 0, 142),
('1', 'C', '3', '2023-01-25 19:31:56', 0, 143),
('1', 'd', '3', '2023-01-25 21:29:32', 0, 144),
('3', 'e', '1', '2023-01-25 21:29:43', 0, 145),
('1', 'f', '3', '2023-01-25 21:29:53', 0, 146),
('3', 'g', '1', '2023-01-25 21:30:10', 0, 147),
('1', 'h', '3', '2023-01-25 21:30:28', 0, 148),
('1', 'Olá ', '3', '2023-01-26 01:01:34', 0, 149),
('3', 'oi', '1', '2023-02-01 16:23:08', 0, 150),
('1', 'Oi', '3', '2023-02-01 20:54:52', 0, 151),
('3', 'oi', '1', '2023-02-01 22:34:23', 0, 152),
('1', 'Como está?', '3', '2023-02-01 22:59:39', 0, 153),
('3', 'bem, e vc?', '1', '2023-02-01 23:08:23', 0, 155),
('1', 'Muito bem ', '3', '2023-02-01 23:08:31', 0, 156),
('1', 'Como vai a vida?', '3', '2023-02-01 23:10:08', 0, 157),
('3', 'oi', '1', '2023-02-06 21:50:24', 0, 158),
('3', 'oi', '1', '2023-02-06 21:56:24', 0, 159),
('3', 'oi', '1', '2023-02-06 21:57:07', 0, 160),
('3', '5eu5yurgdjhrtyu', '1', '2023-02-06 21:58:43', 0, 161),
('3', 'como vai?', '1', '2023-02-06 21:59:36', 0, 162),
('3', 'erw', '1', '2023-02-06 22:21:52', 0, 163),
('3', 't', '1', '2023-02-06 22:28:04', 0, 164),
('3', 'd', '1', '2023-02-06 22:29:12', 0, 165),
('3', 'w', '1', '2023-02-06 22:31:33', 0, 166),
('3', 'f', '1', '2023-02-06 22:32:29', 0, 167),
('3', 's', '7', '2023-02-06 22:40:11', 0, 168),
('3', 'a', '7', '2023-02-06 22:40:39', 0, 169),
('3', 'w', '7', '2023-02-06 22:41:52', 0, 170),
('3', 'we', '7', '2023-02-06 22:43:05', 0, 171),
('3', 'ddd', '7', '2023-02-06 22:43:47', 0, 172),
('3', 'oi', '1', '2023-02-06 23:49:07', 0, 173),
('3', 'oi', '1', '2023-02-06 23:49:22', 0, 174),
('1', 'olá', '3', '2023-02-06 23:49:44', 0, 175),
('1', 'e', '3', '2023-02-06 23:50:00', 0, 176),
('3', 'io', '1', '2023-02-06 23:53:52', 0, 177),
('3', 'o', '1', '2023-02-07 00:12:40', 0, 178),
('3', 'ç', '7', '2023-02-07 00:13:42', 0, 179),
('1', 'oi', '3', '2023-02-07 00:15:31', 0, 180),
('1', 'd', '7', '2023-02-07 00:16:43', 0, 181),
('1', 'rrtretre', '3', '2023-02-07 00:17:02', 0, 182);

-- --------------------------------------------------------

--
-- Estrutura da tabela `users_relation`
--

CREATE TABLE `users_relation` (
  `usr1` int(11) NOT NULL,
  `usr2` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `users_relation`
--

INSERT INTO `users_relation` (`usr1`, `usr2`) VALUES
(3, 1),
(1, 3),
(3, 7),
(7, 3),
(1, 7),
(7, 1);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `mensagens`
--
ALTER TABLE `mensagens`
  ADD PRIMARY KEY (`msg_id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `mensagens`
--
ALTER TABLE `mensagens`
  MODIFY `msg_id` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
