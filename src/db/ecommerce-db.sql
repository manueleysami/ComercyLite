-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 24-11-2021 a las 21:09:00
-- Versión de PHP: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id` int NOT NULL,
  `cliente_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `usuario` varchar(200) NOT NULL,
  `clave` varchar(200) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `usuario`, `clave`, `fecha`) VALUES
(1, 'Luiyeli', 'luiyeli@email.com', '$2a$10$0nkaadsXreW0iQbC8cXxh.uOsL4NnMvdJZCdS2.bg8JYLa4klzjc2', '2021-11-12 13:35:31'),
(2, 'Manuel', 'manuel@email.com', '$2b$10$EYiN5CNbLpeDhZK.tE.Hg.dzRvP4pT2VmuqPAZZ1MhLRqz5WtELHW', '2021-11-12 13:35:31'),
(7, 'Jose', 'jose@email.com', '$2b$10$QgipZnY10ryuTXumcnuP1.jFSM.m6wfn52ztRVdObuU.Y6ZYkSA.y', '2021-11-18 15:20:13'),
(8, 'Miriam', 'miriam@email.com', '$2b$10$H/g3jGTNDrFsTgfy3T6mheb/FFRcByQ.a785bKlDt3UZJs9voxjAa', '2021-11-19 02:35:12'),
(9, 'Mari', 'mari@email.com', '$2b$10$VIjPauLd3xmhsUGqMNLjl..r5dyVwhpRaVxf8MjY9yG4fZQhgC6Sa', '2021-11-24 19:48:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int NOT NULL,
  `cliente_id` int NOT NULL,
  `precio` varchar(222) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `producto_id` int NOT NULL,
  `tipo_pago` varchar(200) NOT NULL,
  `comprobante` varchar(200) DEFAULT NULL,
  `fecha_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ciudad` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `estado` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `persona_recibe` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `telefono_persona` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `direccion` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `referencia` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int NOT NULL,
  `nombre` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `precio` int NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `descripcion` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `imagen` varchar(600) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `precio`, `categoria`, `descripcion`, `imagen`) VALUES
(1, 'Apple AirPods Pro', 150, 'Electronica', 'AirPods con estuche de carga inalámbrica: más de 24 horas de reproducción de audio y hasta 18 horas de conversación', 'https://m.media-amazon.com/images/I/71zny7BTRlL._AC_SL1500_.jpg'),
(4, 'Monitor LG 32 Pulgadas 4k Uhd', 250, 'Electronica', 'Monitor LG 32\" 4K UHD 3840 x 2160\r\n\r\nAspect Ratio: 16:9\r\nVideo Inputs: DisplayPort\r\nMaximum Resolution: 3840 x 2160\r\nMost Suitable For: Graphic Design\r\nModel: 32 UK 550 -B Display Type: VA LCD\r\nMPN: 32UK550-B\r\nItem Height: 30 to 39.9', 'https://http2.mlstatic.com/D_NQ_NP_919422-MLV45929401280_052021-O.webp'),
(8, 'Alcatel 1b 2020 16gb + 2gb Ram Android 10 4g 5.5 Hd+ 3000mah', 70, 'Electronica', '- Pantalla: HD+ 5.5\" 18:9 Full View 2D Dragontrail™ Glass\r\n- Cámara: 5MP Trasera, HD Video, y 2MP Selfie Cámara.\r\n- Procesador: Qualcomm QM215 Quad-Core 4xA53\r\n- Sistema Operativo: Android 10 (Go edition).\r\n- Memoria ROM: 16GB (Soporta microSD™ expandible a 128GB).\r\n- Batería: 3.000mAh Capacidad Eficiente.\r\n', 'https://http2.mlstatic.com/D_NQ_NP_853866-MLV47758082265_102021-O.webp'),
(9, 'Maquina De Afeitar Wahl Barba Nariz', 22, 'Ropa y ccesorios', 'Cable inalámbrico Wahl 5606-5601 le permitirá golpear cualquier ángulo, ya sea que esté limpiando su barba o buscando un corte más completo.\r\n*Su diseño ergonómico de contorno mejora la usabilidad, ya que se ajusta perfectamente a la mano del usuario, mientras que los elementos táctiles suaves permiten un agarre fácil.', 'https://http2.mlstatic.com/D_NQ_NP_852419-MLV43608636847_092020-O.webp'),
(10, 'Cable Bujia Racing 305 / 350 Yukkazo Ref Yr009', 142, 'Vehiculos', '\r\nMaterial del aislante: Fibra de vidrio\r\nEs resistivo: Sí\r\nMaterial del núcleo: Carbón\r\nOEM: YRE3053508', 'https://http2.mlstatic.com/D_NQ_NP_755288-MLV31909161794_082019-O.webp'),
(11, 'Aceite 15w40 Semi Sintetico Valvoline', 7, 'Vehiculos', 'NOVEDOSO LUBRICANTE PARA MOTOR MARCA VALVOLINE TIPO SEMI-SINTETICO (MARCA DE RENOMBRE MUNDIAL VALVOLINE OIL ENGINE).\r\n', 'https://http2.mlstatic.com/D_NQ_NP_830223-MLV47603982590_092021-O.webp'),
(12, 'Inyector Para Ford Fiesta Power 1.6 Del 2003 Al 2009 Iwp 127', 13, 'Vehiculos', 'Inyector de Ford Fiesta 1.6 del 2003 al 2009 y Ecosport motor 1.6 aro naranja de 4 huecos.  Los inyectores son Totalmente nuevos de excelente calidad\r\n', 'https://http2.mlstatic.com/D_NQ_NP_623592-MLV31251810617_062019-O.webp'),
(13, 'Los inyectores son Totalmente nuevos de excelente calidad', 4, 'Vehiculos', 'Marca	Renault\r\nNúmero de pieza	7700101968\r\nModelo	TWINGO LOGAN CLIO SANDERO SYMBOL MEGANE SCENIC LOGAN KANGOO 1.6 16V 2000 2001 2002 2003 2004 2005 2006 2007 2008 2009 2010 2011 2012 2013 2014 2015', 'https://http2.mlstatic.com/D_NQ_NP_833264-MLV45134069863_032021-O.webp'),
(14, 'Laptop Dell Vostro 14-3480 14 I3 8gb Ram 1tb Dd W10pro Nueva', 930, 'Electronica', 'La laptop Dell Vostro 3480 con pantalla de 14” está dirigida al empresario moderno que requiere una computadora más delgada y ligera, con múltiples opciones de conectividad, características de seguridad esenciales y los procesadores Intel más recientes.\r\n', 'https://http2.mlstatic.com/D_NQ_NP_979836-MLV46897806294_072021-O.webp'),
(15, 'Bujia Denso Toyota Corolla Yaris Terios Camry Celica', 2, 'Vehiculos', 'Marca	Denso\r\nNúmero de pieza	042511031302', 'https://http2.mlstatic.com/D_NQ_NP_932489-MLV27962738414_082018-O.webp'),
(16, 'Juegos De Muebles', 500, 'Muebles', 'Hermosos y lujosos muebles de recibo ergonómicos tipo modular modelo Victoria, con posa brazo, elaborados en Semicuero. Fácil de limpiar.\r\n', 'https://http2.mlstatic.com/D_NQ_NP_638498-MLV41580989880_042020-O.webp'),
(17, 'Juego de muebles en forma L', 389, 'Muebles', 'Cantidad de sillones: 4\r\nMaterial de la estructura de los sillones: Madera de Pino\r\nMaterial del tapizado: Chenille\r\nCantidad total de cuerpos: 3', 'https://http2.mlstatic.com/D_NQ_NP_951822-MLV42193559668_062020-O.webp'),
(18, 'Sweter Caballero Unicolor Capucha Slim Fit By Plutonio', 14, 'Ropa y accesorios', '\r\nGénero: Hombre\r\nTipo de abrigo: buzo\r\nMaterial principal: terry\r\nTemporada de lanzamiento: Primavera/Verano\r\nEs impermeable: No\r\nCon capucha: Sí', 'https://http2.mlstatic.com/D_NQ_NP_793571-MLV44539638847_012021-O.webp'),
(19, 'Conjuntos Deportivos Dama', 20, 'Ropa y accesorios', '\r\nConjuntos deportivos, dama\r\nFábricados en algodón', 'https://http2.mlstatic.com/D_NQ_NP_908710-MLV43959422497_102020-O.webp'),
(20, 'Conjunto Deportivo De Damas', 5, 'Ropa y accesorios', 'Género: Mujer\r\nCantidad de piezas: 2\r\nMaterial principal: Licra', 'https://http2.mlstatic.com/D_NQ_NP_911568-MLV46713349194_072021-O.webp'),
(21, 'Zapatos Nike Vapormax Moda Colombiana Unisex', 23, 'Ropa y accesorios', 'Zapatos Nike vapormax\r\nDe talla 35 a la 43', 'https://http2.mlstatic.com/D_NQ_NP_759546-MLV42049103328_062020-O.webp'),
(22, 'Zapatos Nike Air Max', 23, 'Ropa y accesorios', '\r\nZapatos Nike Air Max\r\nDe talla 35 a la 43', 'https://http2.mlstatic.com/D_NQ_NP_851279-MLV46457951916_062021-O.webp'),
(23, 'Botas Caterpillar', 30, 'Ropa y accesorios', 'Botas CATERPILLAR para Damas y Caballeros ', 'https://http2.mlstatic.com/D_NQ_NP_872635-MLV47857789840_102021-O.webp'),
(24, 'Zapatos Deportivos Nike De Dama', 23, 'Ropa y accesorios', 'Zapatos Nike para Damas y Caballeros\r\n', 'https://http2.mlstatic.com/D_NQ_NP_611934-MLV44325148063_122020-O.webp'),
(25, 'Zapatos Deportivos Nike De Dama', 21, 'Ropa y accesorios', 'Zapatos deportivos Nike de Dama', 'https://http2.mlstatic.com/D_NQ_NP_898123-MLV43872236744_102020-O.webp'),
(26, 'Ensure Original Sabor A Vainilla 400 Grs', 17, 'Alimentos', 'Fabricante	Abbott\r\nMarca	Ensure\r\nFormato de venta	Unidad', 'https://http2.mlstatic.com/D_NQ_NP_676244-MLV44182523668_112020-O.webp'),
(27, 'Whisky Old Trafford 0,70l 39,5° Lf', 4, 'Alimentos', 'Marca	Old Trafford\r\nNombre del whisky	Old Trafford\r\nTipo de whisky	BLEND\r\nVolumen de la unidad	0.75 L', 'https://http2.mlstatic.com/D_NQ_NP_639702-MLV31546074693_072019-O.webp'),
(28, 'Chocolate Prestigio® - Caja De 30 Unidades De 33g', 20, 'Alimentos', 'Chocolate Prestigio® para los amantes del coco, este es su chocolate ideal: barra de chocolate rellena de coco.\r\n', 'https://http2.mlstatic.com/D_NQ_NP_755186-MLV44737619408_012021-O.webp'),
(29, 'Pimenton Ahumado Badia Especies Paprika Empresa Numero 1', 15, 'Alimentos', ' PIMENTÓN AHUMADO SMOKED PAPRIKA EL MEJOR PARA TU COCINA MARCA BADIA LIDERES MUNDIALES EN ESPECIAS POTE DE 453.6 KILO GRAMOS LO MEJOR PARA SAZONAR TUS COMIDAS DARLE ESE SABOR AHUMADO INOLVIDABLE', 'https://http2.mlstatic.com/D_NQ_NP_785170-MLV43412355370_092020-O.webp'),
(30, 'Pirulin Chocolate Lata/envase 300g', 5, 'Alimentos', 'Disfruta de nuestro sabor tradicional, tu PIRULIN de siempre, relleno con una exquisita crema de cacao venezolano con pasta de avellana, probarlo es darte un momento de felicidad.\r\n', 'https://http2.mlstatic.com/D_NQ_NP_867805-MLV41767341579_052020-O.webp'),
(31, 'Savoy® Bebida Achocolatada 1.6kg', 35, 'Alimentos', 'Prueba ahora la bebida achocolatada Savoy®, ideal para preparar una bebida caliente o fría en cualquier momento. Su preparación es realmente fácil. Solo agrega agua en tu taza, mezcla con 2 cucharadas del producto y, ¡Listo!\r\n', 'https://http2.mlstatic.com/D_NQ_NP_903451-MLV44350917190_122020-O.webp'),
(32, 'Whisky Buchanan\'s Deluxe 12 Años 375ml', 15, 'Alimentos', 'Un clásico por más de 130 años, el whisky de 12 años de Buchanan, una de las marcas de whisky escocés de lujo más icónicas y premiadas del mundo. Tiene un sabor suave y afrutado, con notas de naranja y chocolate que permiten servirlo en las rocas o con refrescos, adornado con una tira de cáscara de naranja.', 'https://http2.mlstatic.com/D_NQ_NP_643687-MLV41976593915_052020-O.webp'),
(33, 'Soda Evervess® - 24 Unidades De 355ml', 20, 'Alimentos', 'Soda Evervess® 355ml - Bebida gaseosa refrescante y burbujeante, ideal para degustar sola o agregarla a tus cócteles otorgándoles un toque delicioso y atractivo.\r\n', 'https://http2.mlstatic.com/D_NQ_NP_831700-MLV44869388250_022021-O.webp'),
(34, 'Tester Multimetro Digital Mt-87 Incluye Bateria Y Probador', 10, 'Industrial', 'Tester Multimetro Digital Mt-87 ', 'https://http2.mlstatic.com/D_NQ_NP_604337-MLV32945489503_112019-O.webp'),
(35, 'Esmeril Angular 4 1/2 Black And Decker Bdeg400', 48, 'Industrial', '. Llave para cambio de disco\r\n. Disco de debaste Black&Decker 4 1/2\r\n. Asa o mango de apoyo', 'https://http2.mlstatic.com/D_NQ_NP_696920-MLV46267999332_062021-O.webp'),
(36, 'Termometro Digital Infrarrojo -50ºc Hasta 360ºc', 25, 'Industrial', 'RANGO DE TEMPERATURA: -50ºC HASTA 360ºC\r\nAPAGADO AUTOMÁTICO\r\nPANTALLA DIGITAL ILUMINADA\r\nAPUNTADOR LASER\r\nBATERÍAS: 2X AAA (NO INCLUIDAS)\r\nMODO DE MEDICIÓN: GRADOS ºC / ºF SELECCIONABLE', 'https://http2.mlstatic.com/D_NQ_NP_872242-MLV45564826777_042021-O.webp'),
(37, 'Plato Mandril Copa Para Torno Fresa 160 Mm Nuevo', 310, 'Industrial', 'PLATO PARA TORNO DE 160 MM TOTALMENTE NUEVO, 3 GARRAS AUTOCENTRANTE , INCLUYE 3 GARRAS REVERSIBLES LLAVES Y TORNILLOS.\r\n', 'https://http2.mlstatic.com/D_NQ_NP_825300-MLV48206152808_112021-O.webp'),
(38, 'Aceite Ultra Coolant Para Compresor Ingersoll Rand', 560, 'Industrial', '\r\nAceite Sintético\r\nMarca: Masia Compressors / Keltec Technolab\r\nNúmero de parte: KOPGRI-05\r\nOEM: Ingersoll Rand\r\nDuración: 8000 Horas\r\nPaila de 5 galones', 'https://http2.mlstatic.com/D_NQ_NP_820723-MLA48214386074_112021-O.webp'),
(39, 'Sierra Cinta Templada Para Carpinteria Soldada A La Medida', 5, 'Industrial', 'Sierra Cinta Templada soldada a la medida\r\n- MARCA:\r\nDakin-Flathers\r\n- MODELO:\r\nTemplada', 'https://http2.mlstatic.com/D_NQ_NP_673511-MLV20568511653_012016-O.webp'),
(40, 'Ojos De Gato 3m', 100, 'Industrial', 'OJOS DE GATO RETRORREFLECTANTE EN SECO Y MOJADO, RESISTENTE AL IMPACTO IMPORTADOS MARCA 3M . CADA CAJA CONTINE 100 UNIDADES\r\n\r\n', 'https://http2.mlstatic.com/D_NQ_NP_753991-MLV45141485414_032021-O.webp'),
(41, 'Estoperas Milimetricas Y Pulgadas Al Mayor - National - Tc', 2, 'Alimentos', 'Estoperas en milímetros y Pulgadas de las mejores marcas y diferentes dimensiones\r\n', 'https://http2.mlstatic.com/D_NQ_NP_905837-MLV45746133209_042021-O.webp'),
(42, 'Reflector Led Panel Solar 20w Recargable', 6, 'Industrial', 'Alimentación\r\nSolar\r\nPotencia\r\n20 W\r\nAmbientes\r\nInterior/Exterior', 'https://http2.mlstatic.com/D_NQ_NP_809937-MLV44817585051_022021-O.webp'),
(43, 'Llave Grupo Ducha Man Over Cromado 1/4 V. *belt-g Gs', 40, 'Industrial', 'Grupo: Totalmente de bronce\r\nPomo: Abs Cromado\r\nConexiones: 1/2\r\n', 'https://http2.mlstatic.com/D_NQ_NP_848901-MLV43764461700_102020-O.webp'),
(44, 'Llave De Fregadero Boxer Monomando Cuello Cisne Lavaplatos', 30, 'Industrial', '*MARCA: BOXER TOOLS\r\n* LLAVE AGUA FRIA Y CALIENTE\r\nMATERIAL DE FABRICACIÓN: UNA ALEACIÓN DE COBRE/ZINC CON ALGO DE ESTAÑO PARA MEJORAR SUS CUALIDADES DE DUREZA', 'https://http2.mlstatic.com/D_NQ_NP_982079-MLV32041114037_092019-O.webp'),
(45, 'Multimetro Digital Tester Lcd Nuevo Dt830b', 5, 'Industrial', 'Multímetro digital serie 830\r\n-Multímetro serie DT-830D\r\n-LCD de 3 1/2 dígitos, lectura máxima 1999.\r\n-Interruptor rotativo simple de 19 rangos.\r\n-Indicación de batería baja.', 'https://http2.mlstatic.com/D_NQ_NP_990618-MLV31250075537_062019-O.webp'),
(46, 'Impresora Fotocopiadora Canon Mf445dw Wifi Duplex', 550, 'Industrial', 'Especificaciones de la impresora\r\nTipo de impresora Láser en blanco y negro\r\nVelocidad de impresión Hasta 40 ppm (Carta); hasta 32 ppm (Legal) 3\r\nTiempo de Entrega de la primera impresión Aprox. 5.3 segundos\r\nLenguaje de la impresora UFR II, PCL®6, PCL®5, Adobe PostScript 3®\r\nResolución de impresión 600 x 600 (ppp)', 'https://http2.mlstatic.com/D_NQ_NP_708101-MLV44765927974_012021-O.webp'),
(48, 'Pintura De Uñas Xtreme Color Valmy Al Mayor Y Detal', 3, 'Ropa y accesorios', 'CUPCAKE #104\r\n- CRAZY IN LOVE #98\r\n- EMPIRE #96\r\n- CREPÚSCULO #15\r\n- LIME POP #116\r\n- BANANA SPLIT #117\r\n- YUMMY GUMMY #115\r\n- GRAPE GUM #114\r\n- COTTON CANDY #113\r\n- SUGAR RUSH #112', 'https://http2.mlstatic.com/D_NQ_NP_750794-MLV45012604591_022021-O.webp'),
(49, 'Consola Sony Ps5 825gb Nuevas Selladas', 1099, 'Electronica', 'Marca\r\nSony\r\nLínea\r\nPlayStation\r\nModelo\r\nPS5\r\nEdición\r\n4K BLU-RAY EDICIÓN', 'https://http2.mlstatic.com/D_NQ_NP_868512-MLV44752065850_012021-O.webp'),
(50, 'Consola PS4 Slim Blanco', 200, 'Electronica', 'Marca\r\nSony\r\nLínea\r\nPlayStation\r\nModelo\r\nPlayStation 4\r\nSub modelo\r\nSlim', 'https://http2.mlstatic.com/D_NQ_NP_873593-MLV46420044549_062021-O.webp'),
(51, 'Mouse Gamer Usb Imexx Alambrico', 10, 'Electronica', '• Tamaño: 130 * 70 * 40 mm\r\n• Tipo de interfaz: USB\r\n• Número de llaves: 6\r\n• Velocidad de procesamiento de imagen: 3000 FPS\r\n• Resolución: 800, 1200, 1600, 2400 DPI\r\n• Vida clave: 3,000,000\r\n', 'https://http2.mlstatic.com/D_NQ_NP_908991-MLV41476778723_042020-O.webp'),
(53, 'Secador De Cabello 3 Velocidades Premier', 17, 'Ropa y accesorios', '- Secador de Cabello\r\n- Marca: Premier\r\n- SKU: SE-4044-1\r\n- Tres niveles de potencia\r\n- Dos niveles de Temperatura', 'https://http2.mlstatic.com/D_NQ_NP_979640-MLV45717295598_042021-O.webp'),
(54, 'Zapatos Deportivos Para Niñas Running', 20, 'Ropa y accesorios', 'El diseño del calzado para la disciplina Running, está enfocado en la estabilidad y ligereza, que permite un recorrido más rápido y eficiente.\r\n\r\n- Confeccionados en material sintético.\r\n- Acolchado interno.\r\n- Ajustado al contorno del pie.\r\n- Suela de goma', 'https://http2.mlstatic.com/D_NQ_NP_908618-MLV32870702304_112019-O.webp'),
(55, 'Etiquetadora Letratag Dymo Rotuladora ', 110, 'Otros', '- ETIQUETA DORA PARA SACAR ANUNCIOS O SEÑALACIONES - INCLUYE SU ROLLO DE PAPEL PARA ETIQUETAS - TECLADO TIPO COMPUTADORA - FUNCIONA SOLO CON BATERÍAS', 'https://http2.mlstatic.com/D_NQ_NP_937326-MLV32709059936_102019-O.webp');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `usuario` varchar(200) NOT NULL,
  `clave` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `clave`) VALUES
(1, 'admin@email.com', '$2a$10$dw77w9JA7zTmU7mAyA6wxuXJpm99hQx4cnQUDxgUWoOjghUwIKeia');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`,`producto_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
