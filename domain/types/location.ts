/**
 * LocationType
 * ------------
 * Define el ROL NARRATIVO de un lugar.
 *
 * NO describe geografía.
 * NO describe tamaño.
 * Describe QUÉ SIGNIFICA el lugar dentro de la historia.
 *
 * Un mismo lugar físico podría cambiar de tipo
 * dependiendo de la historia.
 */
export type LocationType =
  // Lugar donde nace o se consolida un conflicto histórico
  // (odio, ruptura social, memoria colectiva)
  | 'Origen de conflicto'

  // Lugar con peso espiritual, sagrado o trascendental
  // (batallas finales, grandes espíritus, sentido mayor)
  | 'Lugar sagrado'

  // Lugar de hogar, unión o pertenencia emocional
  // aunque sea caótico o imperfecto
  | 'Hogar'

  // Lugar que aparenta calma pero es opresivo o deshumanizante
  // (monotonía, control, falsa felicidad)
  | 'Falsa paz'

  // Lugar que incita al mal, a la crueldad o a lo inhumano
  // (guaridas, centros de tortura, símbolos del horror)
  | 'Nido del mal'

  // Lugar donde el personaje se rompe de forma destructiva
  // y cruza un punto sin retorno
  | 'Lugar de quiebre'

  // Lugar donde el personaje se rompe pero reflexiona
  // y puede reconstruirse o perdonar
  | 'Lugar de redención'

  // Lugar donde ocurren eventos épicos o decisivos
  // que cambian el rumbo de la historia
  | 'Escenario épico'

  // Lugar de descanso, comodidad o estancamiento
  // (zona de confort)
  | 'Zona de confort'

  // Lugar que impulsa crecimiento personal
  // físico, mental o emocional
  | 'Lugar de superación'

  // Lugar sin reglas claras
  // caos cotidiano, placer, peligro y vida cruda
  | 'Zona sin ley'
