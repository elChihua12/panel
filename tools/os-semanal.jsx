const { useState, useEffect, useCallback } = React;

// ══════════════════════════════════════════════════════════════
// DATA FROM PDFS — Comida, Guagua_Melin, Mias
// Format: [title, instagram_url] — compact for performance
// ══════════════════════════════════════════════════════════════

const D = {
  // ─── COMIDA: Recetas principales ───
  recetas: [
    ["Beef Pie Lollipops","CmmfS5rhJSJ"],["Sandwich Pollo Picante","ClFDz6-jrlA"],["Atun Poke","CmsBEWjhjbP"],
    ["Churrasco Cuadrado","Cmwxk8FBOIL"],["Hummus Betarraga","CoIOv5IKZk5"],["Cebolla Asada Rellena","CoxiF3mJsVd"],
    ["Burrito Sano","CpLLXOajeZz"],["Strogonoff Pollo","1084517451635421"],["Hamburguesa de Sushi","1844765205815409"],
    ["Lomo Salsa Champinon","1839667672991829"],["Phily Cheesesteak","2011328975804551"],["Pollo Naranja","2250178395234797"],
    ["Torta Birria","Cp2wPB3ucLO"],["Pan de Ajo","CpHtP5ruXJK"],["Lomo a la Pimienta","CpbKM8XAFPr"],
    ["BBQ Pollo Tenders","CpP7AT3D4dw"],["Crispy Bang Bang Pollo","Cp2cqRBjTby"],["Sushi Pocket","Crb5WY7ujsP"],
    ["French Dip","CsYChbQgIp5"],["Maruchan Modificado","CcUjpk2gEAd"],["Arroz Frito","CeeN_eYo42v"],
    ["Birria Queso Grillado","CrbgUCvtswl"],["Pollo Crema de Ajo","CsqXauWMd21"],["Pollo Teriyaki Arroz Frito","CslREWkLt1C"],
    ["Dumplings Papel Arroz","CsRg4dzrnNW"],["Chicharron Hongos Hummus","CrjzjxSgkzn"],["Salmon Nueces Mantequilla","CsU3Ne-u96x"],
    ["Ensalada Pollo Jengibre","Ctb5NxAJjiz"],["Salmon Ajo Sticky","Csj5An9qirX"],["Sopa Pollo Thai","Cq3MLrYsyBf"],
    ["Kebab","CtyQiFatWfQ"],["Brochetas Pollo Parmesano","CucYPaHNfcK"],["Gyozas Cerdo","CuWvWktvFOf"],
    ["Huevos Turcos","CuzrUKcvAD8"],["Pad Krapow","Cvppqg_Kux0"],["Ceviche Peruano","CuC2CASJwu7"],
    ["BBQ Salmon Palta Mango","CwES1WONLl_"],["Pollo Naranja x2","Cwyivi0LSFc"],["Chorripan Chimichurri","CxF-MTYuoWt"],
    ["Muffins Salmon","CxETtFxLAgN"],["Causa Limeña","CxETtFxLAgN"],["Pasta Queso Feta","CxmKW2kPfdj"],
    ["Pastel Papa Pimenton","CyJ5BD5skqZ"],["Churrasco Italiano","CyhDzQDRuHX"],["Palomitas Pollo","Cy9G1lAtSuI"],
    ["Coq Au Vin","CzO3MzmOlyy"],["Doner Champiñon","CzeEXb1qWWP"],["Champinones al Curry","CzjdLzgNgGN"],
    ["Salmon Maracuya Gnocchi","Cz2Mx4UrINY"],["Ramen Coco Cremoso","Cz_M3gxJPvV"],["Pollo Crispi Papas","C0NNWanN03Q"],
    ["Quesadilla Filete","C1Ko17FOWdN"],["Pollo Dulce Picante","C1KNqiQMAOe"],["Tartaro Salmon","C0SMpXdRHdr"],
    ["Churrasco Gordon Ramsey","C1HuxorOz3i"],["Huevos Picantes","C1ufHRyJTaG"],["Chupe Champiñon","C12_nLrRhE4"],
    ["Panceta Cerdo Shanghai","C14762JNZn_"],["ShakShuka","C15FwXQSDmY"],["Pad Thai Pollo","C2967yzv8sS"],
    ["Dumplings","C3OAG1zgmBj"],["Burrito","C256XZtxRb_"],["Pollo Shawarma","C2yTnDMuaRk"],
    ["Ñoquis","C1LIHKEukL0"],["Char Siu","C3QuNVevHU4"],["Marmitako","C3fxwq9IYXp"],
    ["Pollo Frito","C2SJ5LVPAzN"],["Lahmacun","C1xEKeSL-lg"],["Pizza Nueva York","C30sgicN1cF"],
    ["Filete Chimichurri Frijoles","C30qO1Dy1rt"],["Gyoza Pollo Fit","C3p9keHPMVR"],["Temaki Frito","C4QcHbLOtVl"],
    ["Curry de Pollo","C2zQvmRsgH-"],["Papillote Salmon","C5OUwYVuGw9"],["Cazuela Tapapecho","C7o_f_NuX84"],
    ["Osobuco","C7ph72qvUV5"],["Cerdo Tonteki","C8Mkmv-yBaA"],["Wantan Pollo","C8icwAKNDwf"],
    ["Arroz Chaufa Pollo","C9BTgSxJBHG"],["Curry Verde Lentejas","C8VdxqLxpDh"],["Butter Chicken","C-aXC6DORvk"],
    ["Chicken Tikka Masala","DAyaibWO4ru"],["Korean BBQ","DBHb4H-t6Xy"],["Pad Kra Pao","DBT2OpnKNAN"],
    ["Pasta Alfredo Camarones","DBUGzl0OUWh"],["Carbonara","DJ9ekD4NX5L"],["Pantrucas","DJwcRdjtdqy"],
    ["Lasaña","DFJeWZONdJG"],["Porotos con Riendas","DF8Mxi6sa6m"],["Arayes","DLps01Bowc_"],
    ["Shawarma","DLs5e2KSEtj"],["Doro Wat","DLDCexTsqbW"],["Pollo Marry Me","DMvABEFsC4F"],
    ["Kofta Wrap","DR5UgubEjec"],["Osobuco con Pure","DSaU6HakS60"],["Empanada Carne Queso","DRx6sdrEQsy"],
  ],

  // ─── COMIDA: Cocktails ───
  cocktails: [
    ["Merlot Sour","CnppQfztgf4"],["Clementine Vodka Smash","Cq-4OU3NYgK"],["4 con Gin","CrRWtadPQ9p"],
    ["Copete Mandarina Casero","CzJ7nALvX_2"],["Mojito Navidad","Czld5l0NhPf"],["Baileys Casero","C0Fk3tHRG7C"],
    ["Sub Zero","C6MHhaUuF67"],["Marakiwi Stone","C67HnP2xVDB"],["Ginzzotti","C7xSQ0bRz1V"],
    ["Jarra Stone Tropical","C9vWgpgREwg"],["Dark Choco Peanut Butter","DBfBLulyVed"],["Espresso Martini","DED5T92Rn2z"],
    ["Sangria Bossa Nova","DDInVDAx04P"],["Bitter Italian","DDo3h9VzZ0a"],["Sangria Rica","DDr6VYSuFNz"],
    ["Fernet con Agua Gas","DFWF81MxAcr"],["Negroni Modificado","DFwG2QrzP6N"],["New York Sour","DHL5r3LRj16"],
    ["Carajillo","DLJBqnHy-2l"],["Palomazo","DLtC3L9RC-E"],["Tzatziki Martini","DQFFWCADNPo"],
    ["Tropical Gin Facil","DRaZiGykfmZ"],["Michelada Brigida","DHpTdhsN29Y"],["Hidromiel Casera","DHZRY2svgSj"],
  ],

  // ─── COMIDA: Dulce ───
  dulce: [
    ["Helado Cheesecake","CpoHC52pj4G"],["Tarta Manzana","Cr0hq5nJd1E"],["Rolls Limon","Cr3awvQIZaq"],
    ["Kuchen Sureño","Cr_AOJVtxTY"],["Carrot Cake","CttQF3qpgm9"],["Cheesecake Limon","CoAOeGXD18J"],
    ["Baklava","CpxPBMwIazZ"],["Rolls Canela Arandano","Ct9YCFQuVr2"],["Limonada Brasileña","CrOuU9Frgc2"],
    ["Te Chai","C42AaMthoy7"],["Mousse Maracuya","DCcIwELPWYM"],["Brownie Pepino","DD5YjSSx4TP"],
    ["Cheesecake Mango","DGVy9IzOBIf"],["Tiramisu Mango","DQPLnnFjUok"],["Pudin Chocolate Huevo","DK9Ez8gsXEF"],
    ["Blondie Saludable","C-508GDqwpt"],["Peras al Malbec","C8zU47TMyms"],["Masala Chai","C-fNCCHhNtT"],
  ],

  // ─── COMIDA: Tips cocina ───
  cocina_tips: [
    ["Cocinar sano sin olvidar ideas","c1EpTfvPc84"],["Como Meal Prep","ZJe3yL7NHdA"],["50 Errores Evitar","9msDfJR-ct4"],
    ["100 Food Hacks","H_erG7HSK0A"],["Elegir Sarten","C1z5AR8rIUp"],["Cortes de Cebolla","C3JCE6vPPp-"],
    ["Entender Salsa Soya","C3Q1PTws6u-"],["Acelerar Caramelizacion","C2ptQugMv1X"],["Hacer Pure","C6B4oPuyMqG"],
    ["Filete Perfecto","ZJ9Z-HZjmY8"],["Especias novato a chef","KcW-Dip4O4I"],["Elegir Fruta Madura","6ifgQ7B8DoQ"],
    ["Calcular Asado","C0KRL8IvMH9"],["Cocinar Pescado","C0zJRfStQ_G"],["Freir Pollo","C6KWdqor_x4"],
    ["Food Prep Ingredientes","C6FPhDAvYCy"],["Cortes de Carne","C4Vnyi4My_6"],["Metodo 4x3","CosbBdgINI7"],
  ],

  // ─── GUAGUA: Eventos y Panoramas ───
  eventos: [
    ["Spartan Race Kids","CtKG9yKsFRy"],["Build a Bear","CumytkLg5QB"],["Piknics Electronica Niños","CwV6B0zghaP"],
    ["Natación MiniSwimmer","C_dl93vMIGl"],["Escuela Escalada Sur","DGipU2QOnMt"],["Taller Insectos Bioinsecta","DP4GBuwDD6h"],
    ["App de Parques","DGowLeDRuB_"],["Panoramas Verano","DEV6vCmv7vN"],["Panoramas con Niños","C7txvgxuTdc"],
    ["Clases Natación","C75P1B3Mfd7"],["Regalos Personalizados","C7trGqMAdLF"],["Panoramas con Niños x2","C8N2qVzRgk6"],
  ],

  // ─── GUAGUA: Actividades en casa ───
  actividades_casa: [
    ["Circuito Brigido","C0QDY8hgntH"],["Juegos Control Impulsos","C01n9MHsfRy"],["Bolsa 0 Pantallas","Cu50igIthBS"],
    ["Actividades Paleontología","CvDLo_hACTx"],["Cine en Casa","C4KbgxZvt9U"],["Arena Sensorial","C3DlTEkNYbe"],
    ["Masa Playdough","C1I7WAisa8r"],["Hielo y Agua","C1egpGgrk67"],["Cocinar con Niños","C1V7oD6LrN2"],
    ["Games for Night","C2pv7dQo_3D"],["Actividades Cientificas","C3iouw9vKUh"],["Juegos sin Pantallas","C8Fq1yfu19o"],
    ["60 Actividades","C8cwN5CP-0x"],["Juegos Flojos","C6J8HuML_HE"],["Actividades Minimo Esfuerzo","C6amrw4yCiG"],
    ["Juego NO copiar","C6_7RYqvudb"],["Smart Games","Cv0LpNQtbP6"],["Juegos para Restaurant","DHBVwnHo8Xz"],
    ["Entrenamiento disfrazado juegos","DNQe5oUsS1M"],["Laser que Baila","DR-RqL0AMhT"],["Dorodango","DSU2fsEjs3a"],
    ["Actividades Imprimibles NASA","DGNxMI5PZET"],["Sable Laser","C-DVT2HuVAC"],["Arena Cinetica","C_ogyTMNl00"],
    ["Hacer Stickers","DA_hEwnvQU0"],["Burbujas Congeladas","DBC7wnkSPzy"],["Kebab Casero","DCmX-c2oQMO"],
    ["App Lego","DCE0YHNvYpB"],["Ciencia para Niños","DB_vgw7uz_V"],["Globos de Harina Jabon","DITrA92sLZ6"],
  ],

  // ─── GUAGUA: Crianza tips ───
  crianza: [
    ["9 min mas importantes","CqS6HMtgshh"],["Incentivar Juego Independiente","CsEDgR_os-t"],["Rituales para Conectar","CmQ7h6iL-Xp"],
    ["Acuerdos en la Crianza","CtXHfRJrPGz"],["Prevenir Abuso","Cq_8yG7rt0b"],["Conversaciones para Cena","CwDja2qp550"],
    ["Poner Limites","CxWs_ZoJUOq"],["Reglas de la Casa","CxrSklrtwW5"],["Cozy Time","CxCQu_5uwYe"],
    ["Lenguaje del Amor","C1aMRLorpGZ"],["Juego Rudo Beneficios","C59uOWLsghA"],["Educacion Financiera","C5a3A1VpiUY"],
    ["Growth Mindset","C5gUtuUMJ84"],["Preguntas para Conectar","C4qPVZfuaaG"],["Rutina Nocturna","Cz_Q6O4Id8u"],
    ["Fortaleza Mental","DCCUS1oOqHV"],["Aprender a Perder","DBxkPXyCREY"],["Inteligencia Emocional","DAY5Y3aCzYi"],
    ["Creencias para Niños","DP0BGsZD8Wm"],["Frustracion","DQCdIf-jdD_"],["Situaciones Peligrosas","DLGnw3zNt2b"],
  ],

  // ─── GUAGUA: Shows y contenido ───
  shows: [
    ["Daniel Tigre — Habilidades emocionales",""],["Bluey — Familia",""],["Miss Rachel — Lenguaje",""],
    ["Sid el Niño Cientifico — Curiosidad",""],["Paw Patrol — Trabajo equipo",""],["Number Blocks — Matemáticas",""],
    ["Tumble Leaf — Exploración",""],["Khan Academy Kids — Aprendizaje",""],["SciShow Kids — Ciencia",""],
    ["Art for Kids Hub — Arte",""],["Trash Truck — Amistad",""],["Puffin Rock — Naturaleza",""],
    ["15 Teles no estimulantes","C7WDYeSqdmq"],["Que no ver y alternativas","CzeOjryJU0_"],
    ["Podcast para Niños","C2C6-Obr4xd"],["Canales Youtube","C2t_kCRJcUy"],["Youtube sin Culpas","DLQmrzlRnUR"],
  ],

  // ─── GUAGUA: Juguetes/Compras ───
  juguetes: [
    ["Triangulo Pikler","CzEX1e4uO0b"],["Tabla Curva","Cs7id-FgHaj"],["Bici de Madera","Czbnu36uNAt"],
    ["Muro Escalada","Cz6V-WsrS6Y"],["Mesa Sensorial Evolutiva","Cu7nXOjp_BQ"],["Cocina Funcional Ikea","CrbQFhIuY6V"],
    ["Domo Escalada","Cv2kA90AIox"],["Juguetes STEM","Cr9psL5g6_5"],["Torre Aprendizaje","C7W3Gu7sGCA"],
    ["Bici Strider","C-DBOByROZm"],["Gokart","C-DqiwvJPyQ"],["Consola Brigida","DCZTseGRjoD"],
    ["Modular Espuma","DCn8-5hgwdf"],["Barra Regulable","DGxVAMssDYl"],["Camara pa Pequeño","DHJS6y_OHbF"],
    ["Silla para Bici","DKdM9NvpNxh"],["Dinosaurios de Papel","DPKi8HuDOhw"],["Magneticos Pulentos","C9LjgeYOU2a"],
  ],

  // ─── MIAS: Ejercicio ───
  ejercicio: [
    ["Progresion Dominada","CrV_hYrgnjI"],["Hombros Rigidos","Cxcb5tKoX7F"],["Arreglar Postura","CyFon4UCcVM"],
    ["Colgarse","CyobE1wsh_Q"],["Movilidad","C0bKov_okna"],["Sentadilla","C1jLvGIMsl-"],
    ["Arreglar Pies","C2U2GEQvXu1"],["Movilidad Espalda","C22XqoeoNDr"],["Evitar Tunel Carpeano","C0FD43HLMti"],
    ["Estirarse","C5Y0q60J5Cr"],["Aliviar Rodilla","C5leHosOrhD"],["Aumentar Años Vida","C30wZKcJ9HQ"],
    ["Postura y Espalda","C9XeIv5o51e"],["Ejercicio con Guagua","C-KD0A_MG7Y"],["Voltereta","C_BNHdmtS0U"],
    ["Pararse de Manos","DBmg1dky0wQ"],["Rutina Kettlebell","DAGfEdRxYeM"],["Cortita en la Mañana","C9z3TCaxvCQ"],
    ["Pliometria","DCUKPzWK6lo"],["Hombro Sano","DCCWjm0Owo-"],["Flexibilidad","DEc6MG5R6YW"],
    ["Basicos Boxeo","DGljhcdxbMm"],["Movilidad para Viejo","DGRn-b9SBnG"],["Rutina Movilidad","DIHTADaOx-6"],
    ["Keggel","DIWK9bCIwS_"],["Ejercicio con Guagua x2","DLbIiOFuUxM"],["Calentamiento","DL7mtmuhM6t"],
    ["Deficit Calorico 8sem","DQXSHpWCXQk"],["Postura Aliviar Rodillas","DSq6QN_DDDE"],
  ],

  // ─── MIAS: Comprar ───
  comprar: [
    ["Corbata Yoshikage Kira","CsfEfNMAhBJ"],["Puzzle Miss Cuber","CnSQ48MqnPr"],["Cooler Paseo","CzpDKN_yNOA"],
    ["Libreta Piedra Rocketbook",""],["Parrilla Portatil","CzrcImCOgEP"],["Grabadora con IA","C69RbEVIbDz"],
    ["Libro Flores Nativas","C8F4d3oOWxu"],["Libro Pixel Art","C7sMfUQPshs"],["SSD Portatil","C9jypuvywKD"],
    ["Syrope Cocktails","C95jNJmtkcX"],["Pesas Piolas","DA9G3jToS6v"],["Set Pesas","DAlySPCo5PX"],
    ["Kindle","DDaXjBjJIb-"],["Productos Cocteleria",""],["Hacer Cerveza","DEGdmwcv0XV"],
    ["Panel Solar","DRNkOvlEbc6"],["Gopro Pulenta","DKaq6smO9hf"],["Maquina Pump it Up","DKsVp4XSirX"],
    ["Cuchillos Finos Rauka","DJRyK-ZhhBa"],["Audifonos Wenos","DJeiG3uuKSu"],["Maquina Helados","DPW__MPCoTE"],
  ],

  // ─── MIAS: Aprender ───
  aprender: [
    ["5 Claves Memorizar",""],["Paralisis de Analisis",""],["Tecnicas Estudio","Cy0wqb3Oj3d"],
    ["Flexibilidad Cognitiva","Cg6zdV7jvjS"],["Aprender Piano","CvshY2tgs88"],["Aprender Japones","DCmH80ENUgY"],
    ["Vestirse Bien","XSF9AOx7sdU"],["Encontrar mi Pasion","C7DMkI_PAH8"],["Ecolocalizacion","DCosCLOvEf0"],
    ["Malabares","C3_yr3ryqyb"],["Poker","C6odAbqR4Pn"],["Baile Salsa","C_LXYd1RcFx"],
    ["Beat Box","DSpnQEiDqr3"],["Dibujar","M6NsEDwHHiE"],["Crochet","C6rhUTyOBX_"],
    ["Aprender Circuitos","DL0J5Oqti3U"],["Brain Rules","DLCzYngzqKW"],["Notas Inteligentes","DREDuIlEQsf"],
    ["Small Talk","C1LLySnOC3i"],["Usar IA efectivamente","CZPXsQdudV6"],["Mapas Mentales con IA","C61te5UN5G3"],
  ],

  // ─── MIAS: Relación ───
  relacion: [
    ["Pedir Disculpas","CbDZtI4sW9P"],["Discutir Sano","Ch51-OcuvfB"],["Compartir Gastos","CtjVS7gNOny"],
    ["Conectar en Pareja","CvdrT_btb_f"],["Tiempo en Pareja","Cwf1fV9q6l2"],["Discusiones en Pareja","Cw8kZOdRQPm"],
    ["Apego Seguro","CxQn3-NMiiG"],["Compartir Tareas","Cy3a3-4rd9N"],["Salir en Pareja","C0iHHC1RFXO"],
    ["Preguntas Dificiles Parejas","C5WhODlsSOG"],["Ideas Romanticas","CyYaG4pSNsr"],["Habitos Pareja Feliz","C7HFFVEr1rX"],
    ["Ideas para Citas","C8Ux80nIijm"],["Carga Mental","DFBcZuGxMOv"],["42 Ideas de Cita","C6gkag3Ld0C"],
    ["Habitos Pareja Conectada","DDLlNNfu9or"],["Noche de Pareja","DHTwGBNsdbE"],["Conectar con Pareja","DDH6_eUgni2"],
    ["Conversaciones antes de Casarse","DDFkFvKxlMO"],["Citas en Casa","DOOOS1-kjGR"],["Weas de Pareja","DMvfADSRPQf"],
  ],

  // ─── MIAS: Inversiones ───
  invertir: [
    ["Uso Tarjeta Credito","CzkCYddL1rZ"],["Ideas Inversion","C1dPHfgx3wZ"],["Ahorrar","C1jQbFgKe2i"],
    ["Dividendos","C59o0IpR5AD"],["Donde Invertir","C6UxD7wxvRf"],["Tipos Stock","C6gjIjRS9u1"],
    ["Herramientas Inversion","C7bwy3fyj2y"],["Cripto","C72VvKjRdVs"],["ETF","C9ebOADvplB"],
    ["Libros Intermedios","C_j0Mt5NjtX"],["3 ETF","DCTyCWStZpF"],["How to Budget","DCrBrvvIoa6"],
    ["Beneficios Tributarios","DETODulxOPR"],["Concejos Finanzas","DJ-rBxdMAdy"],["Negocio Farmacia","DA_jwY7ubm6"],
    ["Comprar Propiedades","DMK124VvAEk"],["Que hacer con Plata","DOwpsdVD_Rf"],["Trucos Tributarios","DRS8B6GEs7U"],
  ],

  // ─── MIAS: Farmacia ───
  farma: [
    ["Bioequivalentes",""],["Salbutamol + Budesonida",""],["Levotiroxina Tips",""],
    ["Dosis AINES",""],["Interaccion Medicamentosa",""],["Olvido Anticonceptivo",""],
    ["Dermatofitosis",""],["Infeccion Picadura",""],["Hiponatremia",""],
    ["Clasificacion ATB",""],["Meta Presion ERC",""],["Metformina Prediabetes",""],
  ],
};

// ─── URL HELPER ───
const IG = id => id ? (id.length > 20 ? id : `https://www.instagram.com/p/${id}/`) : null;

// ─── SHUFFLE ───
const shuffle = arr => {
  const a = [...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;
};
const pick = (arr, n=3) => shuffle(arr).slice(0, n);

// ─── SHEETS CONFIG ───
const SHEETS = {
  lugares:{id:"16xzuFrfKufHYA9RfbRx1inZIjTSQK1WUCLIINcCSbvQ",icon:"📍",name:"Lugares",tabs:"Restaurantes · Naturaleza · Extranjero"},
  comida:{id:"182DPYCVjdDSJYeN70aJ0mpfb9kJOlFgnfq8N7yAbzY4",icon:"🍳",name:"Comida",tabs:"Recetas · Ideas · Cocktail · Dulce"},
  ocio:{id:"1ptA9I2NVxmME0SqGnvotA1ZoBhNj20STUXf7sixLVfI",icon:"🎮",name:"Ocio",tabs:"Juegos · Pelis · Series · Anime · Libros"},
  casa:{id:"1EQYhwqCxEY_II7tWy0kfpyEQhw73eNV31yZPUTZ9jNc",icon:"🏠",name:"Casa",tabs:"Mejoras · Organización"},
  mias:{id:"1aooZy5gy-q67CGy7Z1JRtC8Xqz-23BwvOVSvFa3Nglw",icon:"🧠",name:"Mías",tabs:"Comprar · Aprender · Ejercicio · Invertir"},
  guagua:{id:"1zwMqwacLOXSjqyw2gTm8a-Y0_jAeyHr-9AfJ_MC-06A",icon:"👶",name:"Guagua",tabs:"Eventos · Actividades · Crianza · Juguetes"},
  mente:{id:"1bwIF2NWBPCeDuCk4NJFgyTL0xcKd3VIEYOpdnY0iBHY",icon:"🧘",name:"Mente",tabs:"Resúmenes de videos"},
};

// ─── WEEK CONFIG ───
const WEEK = [
  {day:"LUN",icon:"🎮",focus:"Recarga Personal",type:"personal",desc:"Tu noche. Juegos, serie, ejercicio.",time:"21:20+",pools:["ejercicio","aprender"]},
  {day:"MAR",icon:"💬",focus:"Micro-Conexión",type:"couple",desc:"20 min intencionales. Sin pantallas, sin finanzas.",time:"21:20+",pools:["relacion"]},
  {day:"MIÉ",icon:"💑",focus:"Noche de Pareja",type:"couple",desc:"Cocinar algo nuevo, serie compartida, cocktail.",time:"21:20+",pools:["recetas","cocktails"]},
  {day:"JUE",icon:"📋",focus:"Protocolo Jueves",type:"planning",desc:"15 min → fin de semana decidido.",time:"21:20+",pools:[]},
  {day:"VIE",icon:"🎲",focus:"Flex",type:"flex",desc:"Lo que surja o lo que quedó pendiente.",time:"21:20+",pools:["recetas","relacion"]},
  {day:"SÁB",icon:"👨‍👩‍👧",focus:"Familia",type:"family",desc:"Actividad pre-decidida el jueves.",time:"18:30+",pools:["actividades_casa","eventos"]},
  {day:"DOM",icon:"👨‍👩‍👧",focus:"Familia",type:"family",desc:"Paseo o actividad con Melin y Zayd.",time:"18:30+",pools:["actividades_casa","eventos"]},
];

const TC = {
  personal:{bg:"rgba(99,102,241,0.08)",b:"rgba(99,102,241,0.6)",t:"#818cf8",dot:"#6366f1"},
  couple:{bg:"rgba(236,72,153,0.08)",b:"rgba(236,72,153,0.6)",t:"#f472b6",dot:"#ec4899"},
  planning:{bg:"rgba(245,158,11,0.08)",b:"rgba(245,158,11,0.6)",t:"#fbbf24",dot:"#f59e0b"},
  flex:{bg:"rgba(34,197,94,0.08)",b:"rgba(34,197,94,0.6)",t:"#4ade80",dot:"#22c55e"},
  family:{bg:"rgba(59,130,246,0.08)",b:"rgba(59,130,246,0.6)",t:"#60a5fa",dot:"#3b82f6"},
};

// ─── DISCOVER CATEGORIES ───
const CATS = [
  {id:"recetas",icon:"🍳",label:"Receta",pool:"recetas"},
  {id:"cocktails",icon:"🍸",label:"Cocktail",pool:"cocktails"},
  {id:"dulce",icon:"🍰",label:"Dulce",pool:"dulce"},
  {id:"actividades_casa",icon:"🧒",label:"Con Melin",pool:"actividades_casa"},
  {id:"ejercicio",icon:"💪",label:"Ejercicio",pool:"ejercicio"},
  {id:"aprender",icon:"📚",label:"Aprender",pool:"aprender"},
  {id:"relacion",icon:"💑",label:"Pareja",pool:"relacion"},
  {id:"comprar",icon:"🛒",label:"Comprar",pool:"comprar"},
  {id:"invertir",icon:"📈",label:"Invertir",pool:"invertir"},
  {id:"crianza",icon:"🧒",label:"Crianza",pool:"crianza"},
  {id:"cocina_tips",icon:"👨‍🍳",label:"Tips Cocina",pool:"cocina_tips"},
  {id:"juguetes",icon:"🧸",label:"Juguetes",pool:"juguetes"},
];

// ─── PROTOCOL STEPS ───
const PROTO = [
  {id:"p1",label:"🎯 Actividad Sábado",desc:"¿Qué hacemos?",pool:"actividades_casa"},
  {id:"p2",label:"🍳 Comida Fin de Semana",desc:"¿Qué cocinamos?",pool:"recetas"},
  {id:"p3",label:"🧒 Actividad Melin",desc:"¿Qué hace ella?",pool:"actividades_casa"},
  {id:"p4",label:"📱 Notificar Pareja",desc:"Mandar el plan armado",pool:null},
  {id:"p5",label:"📅 Bloquear Calendario",desc:"Reservar los slots",pool:null},
];

// ─── RELACION QUESTIONS ───
const REL_Q = [
  "¿Qué fue lo mejor de tu semana?","¿Hay algo que te esté preocupando?",
  "¿Qué necesitas de mí esta semana?","¿Hay algo que quieras que hagamos juntos pronto?",
  "¿Cómo te sentiste hoy?","¿Qué es algo que agradeces de nuestra relación?",
  "¿Hay algo que te gustaría cambiar de nuestra rutina?","¿Qué te hizo reír esta semana?",
  "¿Necesitas espacio o compañía?","¿Qué es algo que no te he preguntado y debería?",
];

// ═══════════════════ COMPONENT ═══════════════════
function App(){
  const [tab,setTab]=useState("week");
  const [sel,setSel]=useState(null);
  const [checks,setChecks]=useState({});
  const [notes,setNotes]=useState({});
  const [cat,setCat]=useState(null);
  const [results,setResults]=useState([]);
  const [relQ,setRelQ]=useState(()=>pick(REL_Q,1)[0]);

  // Persist
  useEffect(()=>{(async()=>{try{const s=await window.storage.get("os-v7");if(s){const d=JSON.parse(s.value);setChecks(d.c||{});setNotes(d.n||{})}}catch{}})()},[]);
  const save=useCallback(async(c,n)=>{try{await window.storage.set("os-v7",JSON.stringify({c,n}))}catch{}},[]);
  const tog=id=>{const x={...checks,[id]:!checks[id]};setChecks(x);save(x,notes)};
  const upN=(id,v)=>{const x={...notes,[id]:v};setNotes(x);save(checks,x)};
  const resetWeek=()=>{setChecks({});setNotes({});save({},{})};

  const today=new Date().getDay();
  const di=today===0?6:today-1;
  const wk=`S${Math.ceil((new Date()-new Date(new Date().getFullYear(),0,1))/604800000)}`;

  // Discover
  const doDiscover=(catId)=>{
    setCat(catId);
    const pool=D[catId]||[];
    setResults(pick(pool,3));
  };

  // Styles
  const s={
    wrap:{minHeight:"100vh",background:"#0a0e14",color:"#d4d4d8",fontFamily:"'DM Sans','Segoe UI',sans-serif",padding:"14px",maxWidth:"860px",margin:"0 auto"},
    h1:{fontSize:"22px",fontWeight:800,color:"#f59e0b",margin:0,fontFamily:"'Space Mono','JetBrains Mono',monospace",letterSpacing:"-1px"},
    tag:{fontSize:"10px",color:"#78716c",fontFamily:"'Space Mono',monospace",background:"rgba(245,158,11,0.08)",padding:"2px 7px",borderRadius:"3px"},
    sub:{margin:0,color:"#57534e",fontSize:"11px",fontFamily:"'Space Mono',monospace",marginTop:"4px"},
    tabRow:{display:"flex",gap:"1px",borderBottom:"1px solid rgba(255,255,255,0.06)",marginBottom:"16px",overflowX:"auto",WebkitOverflowScrolling:"touch"},
    card:{background:"#141820",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"10px",padding:"12px",marginBottom:"6px",cursor:"pointer",transition:"all 0.15s"},
    pill:{display:"inline-flex",alignItems:"center",gap:"3px",padding:"4px 8px",borderRadius:"6px",fontSize:"10px",fontWeight:600,fontFamily:"'Space Mono',monospace",cursor:"pointer",border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)",color:"#a8a29e",transition:"all 0.15s"},
    link:{display:"inline-flex",alignItems:"center",gap:"4px",padding:"4px 10px",borderRadius:"6px",background:"rgba(245,158,11,0.08)",color:"#f59e0b",textDecoration:"none",fontSize:"11px",fontFamily:"'Space Mono',monospace",fontWeight:600,border:"1px solid rgba(245,158,11,0.15)"},
  };

  const TabBtn=({id,label,icon})=>(
    <button onClick={()=>{setTab(id);setSel(null);setCat(null)}} style={{
      padding:"8px 10px",border:"none",borderBottom:tab===id?"2px solid #f59e0b":"2px solid transparent",
      background:"transparent",color:tab===id?"#f59e0b":"#78716c",cursor:"pointer",fontSize:"11px",
      fontFamily:"'Space Mono',monospace",fontWeight:tab===id?700:400,display:"flex",alignItems:"center",
      gap:"4px",whiteSpace:"nowrap"
    }}><span style={{fontSize:"13px"}}>{icon}</span>{label}</button>
  );

  const ResultCard=({item,i})=>{
    const [name,igId]=item;
    const url=IG(igId);
    return(
      <div style={{...s.card,cursor:"default",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{fontSize:"16px",opacity:0.4}}>{i+1}</span>
          <span style={{fontSize:"13px",fontWeight:600}}>{name}</span>
        </div>
        {url&&<a href={url} target="_blank" rel="noopener noreferrer" style={s.link}>Ver →</a>}
      </div>
    );
  };

  const pDone=PROTO.filter(p=>checks[p.id]).length;

  return(
    <div style={s.wrap}>
      {/* HEADER */}
      <div style={{marginBottom:"16px"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:"10px",flexWrap:"wrap"}}>
          <h1 style={s.h1}>OS SEMANAL</h1>
          <span style={s.tag}>{wk} · {new Date().toLocaleDateString("es-CL",{day:"numeric",month:"short"})}</span>
        </div>
        <p style={s.sub}>Decisiones pre-hechas → Tiempo intencional · Melin 5a · Zayd ~1m</p>
      </div>

      {/* TABS */}
      <div style={s.tabRow}>
        <TabBtn id="week" label="SEMANA" icon="📅"/>
        <TabBtn id="jueves" label="JUEVES" icon="📋"/>
        <TabBtn id="discover" label="¿QUÉ HAGO?" icon="🎯"/>
        <TabBtn id="rel" label="RELACIÓN" icon="🫂"/>
        <TabBtn id="dias" label="DÍAS" icon="📌"/>
        <TabBtn id="sheets" label="SHEETS" icon="📊"/>
      </div>

      {/* ═══ TAB: SEMANA ═══ */}
      {tab==="week"&&<div>
        <div style={{display:"flex",gap:"2px",height:"4px",borderRadius:"2px",overflow:"hidden",marginBottom:"12px"}}>
          {WEEK.map((d,i)=><div key={i} style={{flex:1,background:TC[d.type].b,opacity:i===di?1:0.25}}/>)}
        </div>
        {WEEK.map((d,i)=>{
          const c=TC[d.type],isT=i===di,isE=sel===i;
          return(
            <div key={i} onClick={()=>setSel(isE?null:i)} style={{
              ...s.card,background:isE?c.bg:isT?"rgba(255,255,255,0.04)":"#141820",
              borderColor:isT?c.b:"rgba(255,255,255,0.06)",
              ...(isT&&{boxShadow:`inset 3px 0 0 ${c.dot}`})
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <span style={{fontSize:"14px"}}>{d.icon}</span>
                  <div>
                    <div style={{fontSize:"12px",fontWeight:700,color:isT?c.t:"#d4d4d8",fontFamily:"'Space Mono',monospace"}}>
                      {d.day} <span style={{fontWeight:400,color:"#78716c",fontSize:"10px"}}>{d.time}</span>
                    </div>
                    <div style={{fontSize:"11px",color:c.t,fontWeight:600}}>{d.focus}</div>
                  </div>
                </div>
                {isT&&<span style={{fontSize:"8px",background:c.bg,color:c.t,padding:"2px 6px",borderRadius:"3px",fontFamily:"'Space Mono',monospace",fontWeight:700}}>HOY</span>}
              </div>
              {isE&&<div style={{marginTop:"10px",paddingTop:"8px",borderTop:`1px solid ${c.b}22`}}>
                <p style={{margin:"0 0 8px",fontSize:"12px",color:"#a8a29e"}}>{d.desc}</p>
                {d.pools.length>0&&<div>
                  <div style={{fontSize:"10px",color:"#78716c",marginBottom:"4px",fontFamily:"'Space Mono',monospace"}}>💡 Sugerencia rápida:</div>
                  {pick(D[d.pools[0]]||[],2).map(([name,igId],j)=>{
                    const url=IG(igId);
                    return <div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
                      <span style={{fontSize:"12px"}}>{name}</span>
                      {url&&<a href={url} target="_blank" rel="noopener noreferrer" style={{...s.link,fontSize:"9px",padding:"2px 6px"}} onClick={e=>e.stopPropagation()}>↗</a>}
                    </div>
                  })}
                </div>}
              </div>}
            </div>
          );
        })}
      </div>}

      {/* ═══ TAB: JUEVES ═══ */}
      {tab==="jueves"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
          <div>
            <div style={{fontSize:"14px",fontWeight:700,color:"#fbbf24",fontFamily:"'Space Mono',monospace"}}>Protocolo Jueves</div>
            <div style={{fontSize:"11px",color:"#78716c"}}>15 min → fin de semana decidido</div>
          </div>
          <div style={{fontSize:"11px",color:"#fbbf24",fontFamily:"'Space Mono',monospace",fontWeight:700}}>{pDone}/{PROTO.length}</div>
        </div>
        <div style={{height:"4px",background:"rgba(255,255,255,0.05)",borderRadius:"2px",marginBottom:"14px",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(pDone/PROTO.length)*100}%`,background:"#f59e0b",borderRadius:"2px",transition:"width 0.3s"}}/>
        </div>
        {PROTO.map((p,i)=>(
          <div key={p.id} style={{...s.card,borderColor:checks[p.id]?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.06)",background:checks[p.id]?"rgba(34,197,94,0.04)":"#141820"}}>
            <div style={{display:"flex",gap:"8px",alignItems:"flex-start"}}>
              <button onClick={()=>tog(p.id)} style={{
                width:"20px",height:"20px",borderRadius:"5px",border:`1.5px solid ${checks[p.id]?"#22c55e":"#44403c"}`,
                background:checks[p.id]?"#22c55e":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                color:"white",fontSize:"12px",flexShrink:0,marginTop:"1px"
              }}>{checks[p.id]?"✓":""}</button>
              <div style={{flex:1}}>
                <div style={{fontSize:"13px",fontWeight:700,color:checks[p.id]?"#4ade80":"#d4d4d8"}}>{p.label}</div>
                <div style={{fontSize:"11px",color:"#78716c"}}>{p.desc}</div>
                {p.pool&&<div style={{marginTop:"6px"}}>
                  <div style={{fontSize:"10px",color:"#57534e",marginBottom:"3px",fontFamily:"'Space Mono',monospace"}}>Sugerencia 🎲:</div>
                  {pick(D[p.pool]||[],2).map(([name,igId],j)=>{
                    const url=IG(igId);
                    return <div key={j} style={{display:"inline-flex",alignItems:"center",gap:"4px",marginRight:"8px"}}>
                      <span style={{fontSize:"11px",color:"#a8a29e"}}>{name}</span>
                      {url&&<a href={url} target="_blank" rel="noopener noreferrer" style={{fontSize:"10px",color:"#f59e0b",textDecoration:"none"}} onClick={e=>e.stopPropagation()}>↗</a>}
                    </div>
                  })}
                </div>}
                <textarea
                  value={notes[p.id]||""}
                  onChange={e=>upN(p.id,e.target.value)}
                  placeholder="Nota..."
                  style={{width:"100%",marginTop:"6px",padding:"6px 8px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"6px",color:"#d4d4d8",fontSize:"12px",fontFamily:"inherit",resize:"vertical",minHeight:"28px",outline:"none"}}
                  onClick={e=>e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        ))}
        <button onClick={resetWeek} style={{marginTop:"8px",padding:"6px 12px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"6px",color:"#ef4444",fontSize:"10px",fontFamily:"'Space Mono',monospace",cursor:"pointer"}}>↻ Reset semana</button>
      </div>}

      {/* ═══ TAB: ¿QUÉ HAGO? ═══ */}
      {tab==="discover"&&<div>
        <div style={{fontSize:"14px",fontWeight:700,color:"#f59e0b",fontFamily:"'Space Mono',monospace",marginBottom:"4px"}}>¿Qué Hago?</div>
        <div style={{fontSize:"11px",color:"#78716c",marginBottom:"12px"}}>Elige categoría → 3 sugerencias random de tu data · {Object.values(D).reduce((a,b)=>a+b.length,0)} items cargados</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"14px"}}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>doDiscover(c.pool)} style={{
              ...s.pill,
              background:cat===c.pool?"rgba(245,158,11,0.15)":"rgba(255,255,255,0.03)",
              color:cat===c.pool?"#f59e0b":"#a8a29e",
              borderColor:cat===c.pool?"rgba(245,158,11,0.3)":"rgba(255,255,255,0.08)"
            }}>
              <span>{c.icon}</span>{c.label}
              <span style={{fontSize:"8px",opacity:0.5}}>({(D[c.pool]||[]).length})</span>
            </button>
          ))}
        </div>
        {cat&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
            <span style={{fontSize:"12px",color:"#78716c",fontFamily:"'Space Mono',monospace"}}>Resultados:</span>
            <button onClick={()=>doDiscover(cat)} style={{...s.pill,color:"#f59e0b",borderColor:"rgba(245,158,11,0.3)",background:"rgba(245,158,11,0.08)"}}>🎲 Otra vez</button>
          </div>
          {results.map((item,i)=><ResultCard key={`${item[0]}-${i}`} item={item} i={i}/>)}
        </div>}
        {!cat&&<div style={{textAlign:"center",padding:"30px 0",color:"#44403c",fontSize:"12px"}}>
          ☝️ Elige una categoría para empezar
        </div>}
      </div>}

      {/* ═══ TAB: RELACIÓN ═══ */}
      {tab==="rel"&&<div>
        <div style={{fontSize:"14px",fontWeight:700,color:"#ec4899",fontFamily:"'Space Mono',monospace",marginBottom:"12px"}}>Arquitectura de Relación</div>

        {/* Conversacion Mapa */}
        <div style={{...s.card,borderColor:"rgba(236,72,153,0.2)"}}>
          <div style={{fontSize:"13px",fontWeight:700,color:"#f472b6",marginBottom:"4px"}}>💬 Conversación Mapa</div>
          <div style={{fontSize:"11px",color:"#78716c",marginBottom:"8px"}}>Pregunta semanal para conectar sin presión</div>
          <div style={{padding:"10px",background:"rgba(236,72,153,0.06)",borderRadius:"8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:"13px",fontStyle:"italic",color:"#f9a8d4"}}>"{relQ}"</span>
            <button onClick={()=>setRelQ(pick(REL_Q,1)[0])} style={{...s.pill,fontSize:"9px",color:"#ec4899",borderColor:"rgba(236,72,153,0.3)"}}>🎲</button>
          </div>
        </div>

        {/* Check-in */}
        <div style={{...s.card,borderColor:"rgba(236,72,153,0.2)"}}>
          <div style={{fontSize:"13px",fontWeight:700,color:"#f472b6",marginBottom:"4px"}}>📊 Check-in Semanal</div>
          <div style={{fontSize:"11px",color:"#78716c",marginBottom:"6px"}}>Martes de micro-conexión — usar la pregunta de arriba</div>
          <textarea value={notes.rel_checkin||""} onChange={e=>upN("rel_checkin",e.target.value)}
            placeholder="¿Cómo estuvo? Notas del check-in..."
            style={{width:"100%",padding:"8px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"6px",color:"#d4d4d8",fontSize:"12px",fontFamily:"inherit",resize:"vertical",minHeight:"50px",outline:"none"}}
          />
        </div>

        {/* Slot Financiero */}
        <div style={{...s.card,borderColor:"rgba(245,158,11,0.2)"}}>
          <div style={{fontSize:"13px",fontWeight:700,color:"#fbbf24",marginBottom:"4px"}}>💰 Slot Financiero</div>
          <div style={{fontSize:"11px",color:"#78716c",marginBottom:"6px"}}>1 domingo al mes · Único momento para hablar de plata</div>
          <div style={{padding:"8px",background:"rgba(245,158,11,0.06)",borderRadius:"6px",fontSize:"11px",color:"#fcd34d"}}>
            ⚠️ Regla: fuera de este slot, temas financieros NO se tocan. Protege la conexión emocional.
          </div>
        </div>

        {/* Ideas de cita */}
        <div style={{...s.card,borderColor:"rgba(236,72,153,0.15)"}}>
          <div style={{fontSize:"13px",fontWeight:700,color:"#f472b6",marginBottom:"6px"}}>🎯 Ideas de tu Sheet</div>
          {pick(D.relacion,3).map(([name,igId],i)=>{
            const url=IG(igId);
            return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:i<2?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <span style={{fontSize:"12px"}}>{name}</span>
              {url&&<a href={url} target="_blank" rel="noopener noreferrer" style={{...s.link,fontSize:"9px",padding:"2px 6px"}}>↗</a>}
            </div>
          })}
        </div>
      </div>}

      {/* ═══ TAB: DÍAS ═══ */}
      {tab==="dias"&&<div>
        <div style={{fontSize:"14px",fontWeight:700,color:"#f59e0b",fontFamily:"'Space Mono',monospace",marginBottom:"4px"}}>Días Estratégicos</div>
        <div style={{fontSize:"11px",color:"#78716c",marginBottom:"12px"}}>5 medias jornadas administrativas + 3 días vacaciones</div>

        <div style={{...s.card}}>
          <div style={{fontSize:"12px",fontWeight:700,color:"#60a5fa",marginBottom:"8px"}}>📋 5 Medias Jornadas (AM 8:00-17:00)</div>
          {["🏫 Acto escolar Melin","💑 Medio día en pareja","🧘 Recarga personal (dormir, ejercicio, nada)","🏥 Trámites/médico acumulados","🎲 Comodín — lo que más urja"].map((d,i)=>(
            <div key={i} style={{display:"flex",gap:"8px",alignItems:"center",padding:"5px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <button onClick={()=>tog(`dia_${i}`)} style={{
                width:"18px",height:"18px",borderRadius:"4px",border:`1.5px solid ${checks[`dia_${i}`]?"#22c55e":"#44403c"}`,
                background:checks[`dia_${i}`]?"#22c55e":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                color:"white",fontSize:"10px",flexShrink:0
              }}>{checks[`dia_${i}`]?"✓":""}</button>
              <span style={{fontSize:"12px",color:checks[`dia_${i}`]?"#6b7280":"#d4d4d8",textDecoration:checks[`dia_${i}`]?"line-through":"none"}}>{d}</span>
            </div>
          ))}
        </div>

        <div style={{...s.card}}>
          <div style={{fontSize:"12px",fontWeight:700,color:"#f59e0b",marginBottom:"8px"}}>🏖️ 3 Días Vacaciones</div>
          {["👨‍👩‍👧 Paseo familiar completo (desde temprano)","💑 Día de pareja — sin niños si es posible","🎮 Día personal absoluto — sin culpa"].map((d,i)=>(
            <div key={i} style={{display:"flex",gap:"8px",alignItems:"center",padding:"5px 0",borderBottom:i<2?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <button onClick={()=>tog(`vac_${i}`)} style={{
                width:"18px",height:"18px",borderRadius:"4px",border:`1.5px solid ${checks[`vac_${i}`]?"#22c55e":"#44403c"}`,
                background:checks[`vac_${i}`]?"#22c55e":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                color:"white",fontSize:"10px",flexShrink:0
              }}>{checks[`vac_${i}`]?"✓":""}</button>
              <span style={{fontSize:"12px",color:checks[`vac_${i}`]?"#6b7280":"#d4d4d8",textDecoration:checks[`vac_${i}`]?"line-through":"none"}}>{d}</span>
            </div>
          ))}
        </div>
      </div>}

      {/* ═══ TAB: SHEETS ═══ */}
      {tab==="sheets"&&<div>
        <div style={{fontSize:"14px",fontWeight:700,color:"#f59e0b",fontFamily:"'Space Mono',monospace",marginBottom:"4px"}}>Mis 7 Sheets</div>
        <div style={{fontSize:"11px",color:"#78716c",marginBottom:"12px"}}>Hub de tu base de conocimiento personal</div>
        {Object.entries(SHEETS).map(([id,sh])=>{
          const isE=sel===id;
          // Count embedded data for this sheet
          const dataCounts = {
            comida: D.recetas.length+D.cocktails.length+D.dulce.length+D.cocina_tips.length,
            guagua: D.eventos.length+D.actividades_casa.length+D.crianza.length+D.juguetes.length+D.shows.length,
            mias: D.ejercicio.length+D.comprar.length+D.aprender.length+D.invertir.length+D.relacion.length+D.farma.length,
            ocio: 0, casa: 0, lugares: 0, mente: 0,
          };
          const cnt=dataCounts[id]||0;
          return(
            <div key={id} onClick={()=>setSel(isE?null:id)} style={{...s.card}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <span style={{fontSize:"16px"}}>{sh.icon}</span>
                  <div>
                    <div style={{fontSize:"13px",fontWeight:700}}>{sh.name}</div>
                    <div style={{fontSize:"10px",color:"#57534e"}}>{sh.tabs}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  {cnt>0&&<span style={{fontSize:"9px",color:"#22c55e",fontFamily:"'Space Mono',monospace"}}>● {cnt} items</span>}
                  {cnt===0&&<span style={{fontSize:"9px",color:"#78716c",fontFamily:"'Space Mono',monospace"}}>○ pendiente</span>}
                  <span style={{fontSize:"12px",color:"#44403c",transform:isE?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
                </div>
              </div>
              {isE&&<div style={{marginTop:"8px",paddingTop:"8px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                <a href={`https://docs.google.com/spreadsheets/d/${sh.id}/edit`} target="_blank" rel="noopener noreferrer" style={s.link} onClick={e=>e.stopPropagation()}>📎 Abrir Sheet →</a>
              </div>}
            </div>
          );
        })}
      </div>}

      {/* FOOTER */}
      <div style={{marginTop:"20px",paddingTop:"10px",borderTop:"1px solid rgba(255,255,255,0.04)",fontSize:"9px",color:"#44403c",fontFamily:"'Space Mono',monospace",textAlign:"center"}}>
        OS Semanal v7 · {Object.values(D).reduce((a,b)=>a+b.length,0)} items embebidos · Melin 5a + Zayd ~1m · Sync: 29 mar 2026
      </div>
    </div>
  );
}

const _rootEl = document.getElementById('root');
if (_rootEl) ReactDOM.createRoot(_rootEl).render(<App />);
