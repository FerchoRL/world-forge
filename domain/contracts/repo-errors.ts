//Tipos de error estandar para repositorios

export type RepoErrorCode =
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'VALIDATION'
    | 'UNKNOWN'


export interface RepoError {
    code: RepoErrorCode
    message: string
    // Optional: información adicional para debugging o contexto
    meta?: Record<string, unknown>
}

//“El resultado de un repositorio que, si sale bien, devuelve algo de tipo T”
//RepoResult puede ser UNA de estas dos formas, nunca ambas.

export type RepoResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: RepoError }