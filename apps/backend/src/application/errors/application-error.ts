export abstract class ApplicationError extends Error {
    readonly name: string

    /**
     * Esto permite:
     * agrupar errores de application
     * distinguirlos de errores técnicos
     * extenderlos limpiamente
     */

    protected constructor(message: string) {
        super(message)
        this.name = this.constructor.name
    }
}