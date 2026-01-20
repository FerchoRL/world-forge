// src/types/category.ts

/**  IMPORTANTE:
 * - CategoryGroup es SOLO un tipo (no existe en runtime).
 * - Sirve para que TypeScript valide errores en tiempo de compilación.
 * - No es un objeto, no se puede indexar.
 */

export type CategoryGroup =
    | 'Narrativa'
    | 'Tono'
    | 'Concepto'

/**
 * CATEGORIES
 * - Cada key es el nombre de una categoría.
 * - Cada categoría declara explícitamente a qué grupo pertenece.
 * - Este objeto SÍ existe en runtime (JS real).
 *
 * Usamos `satisfies` para una cosa MUY específica:
 * 👉 asegurar que `group` SOLO pueda ser un CategoryGroup válido
 * 👉 sin perder los valores literales ('Narrativa', 'Tono', etc.)
 */

export const CATEGORIES = {
    // ===== Narrativa (arquetipo estable) =====
    PersonajeTrágico: { group: 'Narrativa' },
    Protector: { group: 'Narrativa' },
    Sobreviviente: { group: 'Narrativa' },
    Mentor: { group: 'Narrativa' },

    // ===== Tono (cómo se siente el personaje) =====
    Oscuro: { group: 'Tono' },
    Emocional: { group: 'Tono' },
    Tranquilo: { group: 'Tono' },
    Caótico: { group: 'Tono' },
    Melancólico: { group: 'Tono' },

    // ===== Concepto (idea central del personaje) =====
    LealtadAbsoluta: { group: 'Concepto' },
    Dualidad: { group: 'Concepto' },
    Resiliencia: { group: 'Concepto' },
    AmorComoMotor: { group: 'Concepto' },
    Caida: { group: 'Concepto' }
} satisfies Record<string, { group: CategoryGroup }>


// CategoryName: Esto evita usar strings libres en el resto del sistema.
export type CategoryName = keyof typeof CATEGORIES


// Category: Sirve para:
// - devolver categorías al frontend
// - trabajar con listas de categorías
// - documentar claramente la estructura
export type Category = {
    name: CategoryName
    group: typeof CATEGORIES[CategoryName]['group']
}
