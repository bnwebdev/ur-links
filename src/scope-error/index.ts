export class ScopeError extends Error {
    constructor(scope: string, type: string, message: string) {
        super(`${scope}::${type}: ${message}`)
    }
    static Scope = (scope: string) => class ScopedError extends ScopeError {
        constructor(type: string, message: string) {
            super(scope, type, message)
        }
        static Type = (type: string) => class extends ScopedError {
            constructor(message: string) {
                super(type, message)
            }
        }
    }
}
