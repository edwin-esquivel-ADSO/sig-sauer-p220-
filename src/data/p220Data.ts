export interface PartDetail {
  id: string;
  name: string;
  germanName: string;
  category: 'corredera' | 'canon' | 'recuperador' | 'armazon' | 'disparo' | 'alimentacion';
  material: string;
  weight: string;
  description: string;
  engineeringFact: string;
  maintenanceNote: string;
  specs: { label: string; value: string }[];
}

export interface ScrollStep {
  step: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlightPart: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  explosionFactor: number;
  tags: string[];
}

export interface VariantInfo {
  id: string;
  name: string;
  year: string;
  finish: string;
  caliber: string;
  capacity: string;
  rail: string;
  description: string;
  features: string[];
  imageBadge: string;
}

export const SCROLL_STEPS: ScrollStep[] = [
  {
    step: 0,
    badge: 'ESTADO: LISTA PARA DISPARO (IN BATTERY)',
    title: 'SIG SAUER P220 .45 ACP',
    subtitle: 'El Génesis de la Línea Clásica y la Pistole 75',
    description: 'Diseñada originalmente en 1975 para sustituir a la costosa SIG P210 en el ejército suizo. La P220 sentó las bases de la ingeniería armamentística moderna al prescindir del seguro manual en favor del desamartillador táctico.',
    highlightPart: 'all',
    cameraPos: [0, 0.3, 6.4],
    cameraTarget: [0, 0, 0],
    explosionFactor: 0.0,
    tags: ['Calibre .45 ACP', 'DA/SA Tradicional', 'Suiza / Alemania', '8+1 Disparos'],
  },
  {
    step: 1,
    badge: 'FASE 1: ACERROJADO REVOLUCIONARIO',
    title: 'Corredera y Acerrojado Browning-Petter-SIG',
    subtitle: 'El bloque rectangular en la ventana de expulsión',
    description: 'En lugar de los tradicionales tetones de bloqueo radiales estilo M1911, la P220 introdujo la recámara prismática que bloquea directamente sobre el borde anterior de la ventana de expulsión. Este diseño revolucionó el mundo y fue adoptado por Glock, HK USP y Walther.',
    highlightPart: 'slide',
    cameraPos: [0.8, 0.8, 6.2],
    cameraTarget: [0.2, 0.2, 0],
    explosionFactor: 0.28,
    tags: ['Acero Inoxidable Nitron', 'Sin cadeneta basculante', 'Ventana sobredimensionada'],
  },
  {
    step: 2,
    badge: 'FASE 2: DISIPACIÓN Y CINEMÁTICA',
    title: 'Cañón 4.4" y Muelle Recuperador Trenzado',
    subtitle: 'Resistencia armónica tri-hebra exclusiva de SIG',
    description: 'El cañón de 112 mm con rampa de alimentación pulida a espejo trabaja junto al característico muelle recuperador de 3 alambres de cuerda de piano trenzados en cable. Multiplica por cuatro la vida útil y amortigua la violenta patada del .45 ACP.',
    highlightPart: 'barrel_spring',
    cameraPos: [0.6, 0.6, 6.2],
    cameraTarget: [0, 0.1, 0],
    explosionFactor: 0.52,
    tags: ['Paso 1:16" Dextrógiro', 'Muelle Verde 15-16 lbs', 'Acero 416R'],
  },
  {
    step: 3,
    badge: 'FASE 3: CONTROL DE FUEGO Y SEGURIDAD',
    title: 'Armazón y Palanca Entspannhebel',
    subtitle: 'Seguridad pasiva de 4 puntos sin seguro manual',
    description: 'La palanca de desamartillado permite bajar el martillo de forma amortiguada y controlada hasta el escalón de seguridad (Fangraste). Junto con el fiador y el bloqueador automático de aguja percutora, hace que el arma nunca se dispare por caídas accidentales.',
    highlightPart: 'frame_controls',
    cameraPos: [0.9, -0.2, 6.0],
    cameraTarget: [0.1, -0.2, 0],
    explosionFactor: 0.76,
    tags: ['Aleación 7075-T6', 'Entspannhebel', 'Doble Acción 10 lbs', 'Simple Acción 4.4 lbs'],
  },
  {
    step: 4,
    badge: 'FASE 4: ALIMENTACIÓN Y BALÍSTICA',
    title: 'Cargador Monohilera y Munición .45 ACP',
    subtitle: '8 proyectiles de máxima potencia de parada',
    description: 'El diseño monohilera otorga una ergonomía delgada insuperable frente a las pistolas de doble columna de gran calibre. Alimenta proyectiles pesados de 230 grains FMJ a 850 fps, entregando más de 500 Joules de energía cinética en boca.',
    highlightPart: 'mag_ammo',
    cameraPos: [0.4, -0.6, 6.3],
    cameraTarget: [0, -0.3, 0],
    explosionFactor: 0.94,
    tags: ['8 Cartuchos .45 ACP', '230 gr FMJ', '500+ Joules', 'Cuerpo Acero Fosfatado'],
  },
  {
    step: 5,
    badge: 'FASE 5: DESPIECE COMPLETO ISOMÉTRICO',
    title: 'Arquitectura Despiezada Integral',
    subtitle: 'Exploración espacial de todos los subconjuntos',
    description: 'Todas las piezas en suspensión cinemática con separación total. Puedes continuar desplazándote o pasar al Banco de Armería para manipular libremente el modelo 3D, rotarlo 360°, activar el modo Rayos-X o escuchar el ciclo de disparo.',
    highlightPart: 'all',
    cameraPos: [1.4, 1.1, 6.8],
    cameraTarget: [0, 0, 0],
    explosionFactor: 1.0,
    tags: ['Despiece Total', 'Tolerancias Suizas', 'Modo Interactivo'],
  },
];

export const PARTS_CATALOG: PartDetail[] = [
  {
    id: 'slide',
    name: 'Corredera Mecanizada Nitron',
    germanName: 'Schlitten / Verschluss',
    category: 'corredera',
    material: 'Acero inoxidable 400 CNC con acabado PVD Nitron (Dureza > 70 HRC)',
    weight: '395 g',
    description: 'Bloque superior monolítico que aloja la aguja percutora, el extractor pivotante exterior, las miras X-RAY3 de tritio y la ventana de expulsión rectificada.',
    engineeringFact: 'Originalmente en 1975 se fabricaba en chapa de acero estampada con culata postiza (breechblock) retenida por pasadores elásticos concéntricos. Posteriormente se evolucionó a fresado monolítico.',
    maintenanceNote: 'Lubricar los carriles interiores de deslizamiento con grasa sintética para armas de alta presión (TW25B).',
    specs: [
      { label: 'Longitud', value: '196 mm' },
      { label: 'Acabado', value: 'Nitron PVD Mate Antirreflejo' },
      { label: 'Estrías de agarre', value: 'Traseras fresadas a 90°' },
    ],
  },
  {
    id: 'barrel',
    name: 'Cañón 4.4" con Bloque de Recámara',
    germanName: 'Lauf mit Patronenlager',
    category: 'canon',
    material: 'Acero forjado de alta resistencia 416R grado armería',
    weight: '118 g',
    description: 'Cañón estriado por botón de 112 mm con bloque prismático integral. La rampa de alimentación está pulida mecánicamente a espejo para garantizar el ciclo fluido de ojivas huecas JHP.',
    engineeringFact: 'Prescinde totalmente de la cadeneta basculante de Browning 1911. La leva inferior cerrada golpea el bloque de inserción del armazón forzando el descenso de la recámara tras 3 mm de retroceso compartido.',
    maintenanceNote: 'Limpiar con grata de bronce en sentido de la recámara a la boca. Mantener el bloque de acerrojado ligeramente engrasado.',
    specs: [
      { label: 'Longitud', value: '112 mm (4.4 pulgadas)' },
      { label: 'Paso de estría', value: '1:16" a derechas (6 estrías)' },
      { label: 'Calibre nominal', value: '11.43 × 23 mm (.45 ACP)' },
    ],
  },
  {
    id: 'recoil',
    name: 'Conjunto Amortiguador y Muelle Trenzado',
    germanName: 'Schließfeder & Führungsstange',
    category: 'recuperador',
    material: 'Alambre de cuerda de piano trenzado tri-hebra y vástago de acero rectificado',
    weight: '44 g',
    description: 'El característico muelle recuperador de 3 filamentos entrelazados de SIG Sauer absorbe las ondas armónicas de choque del .45 ACP y elimina el riesgo de deformación plástica.',
    engineeringFact: 'El color verde en el extremo del muelle indica la calibración de fábrica de 15-16 libras para munición .45 ACP estándar y +P.',
    maintenanceNote: 'Reemplazo recomendado cada 5,000 disparos para preservar la integridad del armazón de aleación.',
    specs: [
      { label: 'Constante elástica', value: '15.5 lbs (~68 N)' },
      { label: 'Configuración', value: 'Multi-hebra trenzada (Tri-strand)' },
      { label: 'Código de color', value: 'Verde militar SIG' },
    ],
  },
  {
    id: 'frame',
    name: 'Armazón con Bloque de Acero Perno',
    germanName: 'Griffstück mit Verriegelungsblock',
    category: 'armazon',
    material: 'Aleación aeroespacial de aluminio 7075-T6 forjado, anodizado duro Tipo III',
    weight: '298 g',
    description: 'Estructura principal ligera que aloja los mandos de desamartillado, retenida de corredera y pasador de despiece. En su interior lleva embutido el bloque de acerrojado de acero templado.',
    engineeringFact: 'El bloque de acero (locking insert) soporta todo el impacto mecánico del retroceso del cañón, evitando que el aluminio del armazón sufra fatiga estructural.',
    maintenanceNote: 'Nunca usar disolventes con base de amoníaco que puedan deteriorar la capa de anodizado duro.',
    specs: [
      { label: 'Material', value: 'Aluminio 7075-T6 anodizado' },
      { label: 'Raíl táctico', value: 'SIG Rail / MIL-STD-1913 Picatinny' },
      { label: 'Cola de castor', value: 'Perfil anatómico extendido' },
    ],
  },
  {
    id: 'decocker',
    name: 'Palanca de Desamartillado (Entspannhebel)',
    germanName: 'Entspannhebel',
    category: 'disparo',
    material: 'Acero cementado estampado y templado',
    weight: '16 g',
    description: 'El mando más emblemático de la arquitectura SIG Sauer. Permite destensar el martillo montado en Simple Acción sin tocar jamás el disparador y sin riesgo de percusión accidental.',
    engineeringFact: 'Baja el martillo suavemente mientras el fiador salta al escalón de retención de seguridad (Fangraste), dejando el martillo a 1.5 mm de distancia de la aguja percutora.',
    maintenanceNote: 'Verificar la tensión del resorte de retorno de la palanca durante las inspecciones de armería.',
    specs: [
      { label: 'Ubicación', value: 'Lateral izquierdo, operable con pulgar' },
      { label: 'Distancia de reposo martillo', value: '1.5 mm de la aguja' },
      { label: 'Función', value: 'Desarmado seguro sin seguro manual' },
    ],
  },
  {
    id: 'trigger',
    name: 'Grupo de Disparo DA/SA y Fiador',
    germanName: 'Abzugsgruppe & Abzugsstange',
    category: 'disparo',
    material: 'Acero al cromo mecanizado y barra de transferencia pulida',
    weight: '52 g',
    description: 'Mecanismo de Doble Acción para el primer tiro (recorrido largo y deliberado de 44 N) y Simple Acción ultranítida de 20 N con rotura tipo varilla de cristal para disparos subsiguientes.',
    engineeringFact: 'La versión Legion incluye el sistema Short Reset Trigger (SRT) de Grayguns que reduce el rearme del disparador en un 60% (a solo 2.5 mm).',
    maintenanceNote: 'Mantener limpia la muesca de desconexión en la barra de disparo para evitar fallos de rearme.',
    specs: [
      { label: 'Peso Doble Acción', value: '44 N (10.0 lbs)' },
      { label: 'Peso Simple Acción', value: '20 N (4.4 lbs)' },
      { label: 'Reset (SRT)', value: '~2.5 mm de recorrido' },
    ],
  },
  {
    id: 'magazine',
    name: 'Cargador Monohilera 8 Disparos',
    germanName: 'Einreihiges Magazin 8 Schuss',
    category: 'alimentacion',
    material: 'Chapa de acero al carbono tratado térmicamente con acabado antifricción',
    weight: '88 g (vacío)',
    description: 'Cargador monohilera con orificios testigo numerados del 2 al 8. La teja elevadora de perfil guiado activa mecánicamente la palanca de retenida de corredera en el último disparo.',
    engineeringFact: 'La configuración monohilera permitió mantener el grosor de empuñadura en solo 38 mm, ofreciendo el mejor encare anatómico para tiradores de cualquier tamaño de mano.',
    maintenanceNote: 'No aceitar el interior del cargador para evitar acumulación de pólvora y residuos arenosos.',
    specs: [
      { label: 'Capacidad', value: '8 cartuchos .45 ACP' },
      { label: 'Base', value: 'Polímero reforzado desmontable' },
      { label: 'Resorte', value: 'Alambre siliconado de alta resiliencia' },
    ],
  },
  {
    id: 'cartridge',
    name: 'Cartucho .45 ACP (11.43×23 mm)',
    germanName: 'Patrone .45 ACP (230 gr FMJ)',
    category: 'alimentacion',
    material: 'Vaina de latón 70/30, fulminante Boxer y proyectil de plomo con envuelta de cobre',
    weight: '21.5 g por cartucho',
    description: 'Diseñado por John Moses Browning en 1904. Su masa pesada de 230 grains genera una extraordinaria transferencia de momento lineal y cavidad temporal efectiva.',
    engineeringFact: 'Su velocidad subsónica estándar (~850 fps / 260 m/s) lo hace ideal para el empleo de silenciadores sónicos sin estampido supersónico adicional.',
    maintenanceNote: 'Verificar el engarce (crimp) de la vaina para prevenir que la bala se hunda durante el ciclo de alimentación.',
    specs: [
      { label: 'Peso de punta', value: '230 gr (14.9 g)' },
      { label: 'Velocidad en boca', value: '850 fps (259 m/s)' },
      { label: 'Energía cinética', value: '500 Joules (370 ft-lbs)' },
    ],
  },
];

export const VARIANTS_LIST: VariantInfo[] = [
  {
    id: 'legion',
    name: 'P220 Legion .45 ACP',
    year: '2016–Presente',
    finish: 'Recubrimiento PVD Cerakote Legion Gray',
    caliber: '.45 ACP / 10mm Auto',
    capacity: '8+1 Rondas',
    rail: 'Raíl contorneado integral',
    description: 'La cumbre de refinamiento de la P220. Equipada con disparador P-SAIT de Grayguns, sistema de rearme corto SRT, cachas de compuesto G10 con medallón de la Legión y alzas X-RAY3 de tritio.',
    features: ['Gatillo Grayguns SRT corto', 'Cachas G10 ultragrip', 'Corte anatómico X-Five en guardamonte', 'Miras día/noche X-RAY3'],
    imageBadge: 'LEGION SERIES',
  },
  {
    id: 'combat',
    name: 'P220 Combat SOCOM',
    year: '2005–Presente',
    finish: 'Armazón Flat Dark Earth (FDE) & Corredera Nitron',
    caliber: '.45 ACP',
    capacity: '8+1 o 10+1 Rondas extendidas',
    rail: 'MIL-STD-1913 Picatinny auténtico',
    description: 'Desarrollada para los programas de Fuerzas Especiales estadounidenses (JCP). Todas las piezas internas metálicas están fosfatadas para resistir inmersión en agua salada marítima.',
    features: ['Cañón con rosca para supresor (0.578"×28)', 'Mecanismos interiores fosfatados anticorrosión', 'Raíl Picatinny plano estándar OTAN', 'Recámara cromada dura'],
    imageBadge: 'MIL-SPEC SOCOM',
  },
  {
    id: 'bda',
    name: 'Browning BDA (P220 Import)',
    year: '1977–1980',
    finish: 'Pavonado azul intenso espejo / Armazón anodizado',
    caliber: '.45 ACP, 9×19mm, .38 Super',
    capacity: '7+1 Rondas',
    rail: 'Sin raíl táctico (líneas clásicas limpias)',
    description: 'La primera incursión de la P220 en los Estados Unidos antes de la creación de SIGARMS. Comercializada por Browning con cachas de nogal pulido y retenida de cargador europea en el talón.',
    features: ['Retenida de talón (Heel release)', 'Cachas de madera de nogal selecto', 'Marcajes SIG Sauer System W. Germany', 'Pavón artesanal de alto brillo'],
    imageBadge: 'HISTORICAL HERITAGE',
  },
  {
    id: 'hunter',
    name: 'P220 Hunter 10mm Auto',
    year: '2015–Presente',
    finish: 'Camuflaje Kryptek Highlander PVD',
    caliber: '10mm Auto (Alta Potencia)',
    capacity: '8+1 Rondas',
    rail: 'Raíl Picatinny de longitud completa',
    description: 'Diseñada para caza mayor y defensa contra depredadores en Alaska. Construida con armazón de acero inoxidable integral macizo para soportar los 950 Joules del 10mm Auto.',
    features: ['Cañón extendido de 5.0" (127 mm)', 'Chasis 100% acero inoxidable pesado', 'Disparador SAO (Single-Action Only)', 'Miras ajustables micrométricas'],
    imageBadge: 'HIGH VELOCITY 10MM',
  },
];

export const TECHNICAL_SPECS = [
  { label: 'Calibre Principal', value: '.45 ACP (11.43 × 23 mm)', category: 'Balística' },
  { label: 'Sistema de Operación', value: 'Retroceso corto, acerrojado Browning-Petter-SIG', category: 'Mecánica' },
  { label: 'Capacidad del Cargador', value: '8 cartuchos (monohilera desmontable)', category: 'Alimentación' },
  { label: 'Longitud del Cañón', value: '112 mm (4.40 pulgadas)', category: 'Dimensiones' },
  { label: 'Longitud Total (OAL)', value: '196 mm (7.70 pulgadas)', category: 'Dimensiones' },
  { label: 'Altura Total', value: '140 mm (5.50 pulgadas)', category: 'Dimensiones' },
  { label: 'Anchura de Empuñadura', value: '38 mm (1.50 pulgadas)', category: 'Dimensiones' },
  { label: 'Peso en Vacío (Armazón Aleación)', value: '862 g (30.4 oz)', category: 'Peso' },
  { label: 'Peso en Vacío (Armazón Acero)', value: '1,134 g (40.0 oz)', category: 'Peso' },
  { label: 'Fuerza Disparador Doble Acción', value: '44 N (10.0 lbs)', category: 'Control' },
  { label: 'Fuerza Disparador Simple Acción', value: '20 N (4.4 lbs)', category: 'Control' },
  { label: 'Recorrido de Rearme (Reset SRT)', value: '~2.5 mm (~0.1 in)', category: 'Control' },
  { label: 'Velocidad de Salida (230 gr FMJ)', value: '259 m/s (850 fps)', category: 'Balística' },
  { label: 'Energía Cinética en Boca', value: '500 – 540 Joules (370 – 400 ft-lbs)', category: 'Balística' },
  { label: 'Paso de Estría', value: '1 en 16 pulgadas (406 mm), 6 estrías RH', category: 'Balística' },
  { label: 'Sistemas de Seguridad Pasiva', value: 'Desamartillador + Intercept Notch + Bloqueo de aguja', category: 'Seguridad' },
];

export const HISTORICAL_MILESTONES = [
  {
    year: '1975',
    title: 'Adopción Suiza: La Pistole 75 (P75)',
    description: 'El ejército de Suiza busca reemplazar la SIG P210 por un modelo más rápido de disparar, más ligero y más económico de producir. Nace la SIG P220 con armazón de aleación y palanca de desamartillado.',
  },
  {
    year: '1974–1975',
    title: 'Alianza Estratégica con J.P. Sauer & Sohn',
    description: 'Para eludir las restrictivas leyes suizas de exportación bélica (Kriegsmaterialgesetz), SIG se asocia con Sauer & Sohn en Eckernförde, Alemania Occidental, creando la legendaria marca combinada SIG SAUER.',
  },
  {
    year: '1977',
    title: 'Llegada a América: El Browning BDA',
    description: 'Browning Arms Company importa la P220 a Estados Unidos en calibres .45 ACP, 9mm y .38 Super, demostrando la impecable fiabilidad de la pistola para disparar munición expansiva.',
  },
  {
    year: '1985',
    title: 'Nacimiento de SIGARMS y la P226',
    description: 'El éxito fulgurante de la arquitectura P220 engendra la P226 para las pruebas XM9 del ejército estadounidense, estableciendo el estándar que adoptarían los Navy SEALs y agencias policiales globales.',
  },
  {
    year: '2005',
    title: 'P220 Combat para Operaciones Especiales',
    description: 'El Departamento de Defensa evalúa la P220 Combat con mecanismos fosfatados resistentes a la corrosión salina y raíl Picatinny real para los mandos de operaciones especiales.',
  },
  {
    year: '2016–Hoy',
    title: 'P220 Legion y 10mm Hunter',
    description: 'La P220 se consolida como una pieza de culto y precisión, incorporando la serie Legion con disparador Grayguns y recamarados masivos en 10mm Auto para caza.',
  },
];
