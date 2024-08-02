export type ClassConstructor<T = any> = new (...args: any[]) => T
export type GenericObject = { [x: string]: any }

export function isInstance<T = any>(obj: any): obj is ClassConstructor<T> {
    return !isObjectLiteral(obj)
}

export function isObjectLiteral(obj: any): obj is Object {
    return obj !== null && typeof obj === 'object' && obj.constructor === Object
}

export function isTruthy<T = any>(value?: T): value is NonNullable<T> {
    return !isFalsy(value)
}

export function isFalsy(value?: any) {
    if (isNull(value) || isUndefined(value))
        return true

    if (isArray(value))
        return !value.length

    if (isObject(value))
        return !Object.keys(value).length

    return !value
}

export function isArray<T = any>(value: any): value is T[] {
    return Array.isArray(value) || (isObject(value) && value instanceof Array)
}

export function isDate(value: any): value is Date {
    return value instanceof Date
}

export function isBoolean(value: any): value is boolean {
    return getNativeType(value) == 'boolean'
}

export function isFunction(value: any): value is (...args: any[]) => any | void {
    return getNativeType(value) == 'function'
}

const AsyncFunction = (async () => { }).constructor
export function isAsyncFunction(value: any): value is (...args: any[]) => Promise<any | void> {
    return value instanceof AsyncFunction
}

export function isNumber(value: any, coerce = false): value is number {
    if (coerce)
        return !isNaN(Number(value))

    return getNativeType(value) == 'number'
}

export function isObject(value: any): value is object {
    return getNativeType(value) == 'object'
}

export function isString(value: any): value is string {
    return getNativeType(value) == 'string'
}

export function isClass(value: any): value is ClassConstructor {
    return Object.getPrototypeOf(value) !== Object.prototype
}

export function isUndefined(value: any): value is undefined {
    return getNativeType(value) == 'undefined'
}

export function isNull(value: any): value is null {
    return value == null
}

export function getNativeType(value: any) {
    return typeof value
}

export function toCapitalise(text: string, firstOccurrenceOnly = true): string {
    if (firstOccurrenceOnly) {
        return text[0].toUpperCase() + text.substring(1)
    }

    return text
        .split(' ')
        .map(word => toCapitalise(word))
        .join(' ')
}

export function clearObject<T = any>(obj: T, isParent = true) {
    const newObj: T = {} as any

    if (!isObject(obj)) {
        if (isArray(obj))
            return (obj as any).length ? obj as T : undefined as T

        return obj as T
    }

    if (isArray(obj))
        return (obj as any).length ? obj as T : undefined as T

    if (isDate(obj)) {
        return obj as T
    }

    for (const propName in obj) {
        const value = obj[propName]

        const newValue = clearObject(value, false)

        if (!isUndefined(newValue))
            newObj[propName] = newValue
    }

    return (isParent ? newObj : Object.keys(newObj as any).length ? newObj : undefined) as T
}

export function createObjectByStringPath(path: string, parent: GenericObject = {}) {
    const routers = path.split('.')
    let currentObj: GenericObject = parent

    for (const router of routers) {
        if (isUndefined(currentObj[router])) {
            currentObj[router] = {}
        }
        currentObj = currentObj[router]
    }

    return { ...parent }
}

export function getObjectPathByIndex(obj: GenericObject, index: number) {
    let currentObj: GenericObject = { ...obj }

    for (let i = 0; i < index; i++) {
        currentObj = currentObj[Object.keys(currentObj)[0]]
    }

    return { ...currentObj }
}

export function getObjectPathByPath(obj: GenericObject, path: string) {
    let currentObj: GenericObject = obj

    const routers = path.split('.')

    for (let i = 0; i < routers.length; i++) {
        if (isUndefined(currentObj[routers[i]])) {
            continue
        }
        currentObj = currentObj[routers[i]]
    }

    return isArray(currentObj) ? [...currentObj as any] : isObjectLiteral(currentObj) ? { ...currentObj } : currentObj
}

export function insertValueInObjectByPath(obj: GenericObject, value: any, path: string) {
    let currentObj: GenericObject = obj

    const routers = path.split('.')

    for (let i = 0; i < routers.length; i++) {
        if (i < routers.length - 1) {
            currentObj = currentObj[routers[i]]
            continue
        }

        if (isArray(currentObj[routers[i]]))
            currentObj[routers[i]].push(value)
        else
            currentObj[routers[i]] = value
    }

    return { ...obj }
}

export function arrayToObject<T extends object = any>(arr: GenericObject[]) {
    return arr.reduce((fullObject, currentObject) => {
        for (const key in currentObject) {
            fullObject[key] = currentObject[key]
        }
        return fullObject
    }, {}) as T
}

export function getPropertiesMethodsFromClass(constructor: ClassConstructor) {
    const prototype = constructor.prototype
    return Object.getOwnPropertyNames(prototype).filter(name => typeof prototype[name] === 'function' && name !== 'constructor') as string[]
}

export function extractDigits(text: string) {
    return text.replace(/[^\d]+/g, '')
}

export function isEmptyValue(value: any) {
    if (isUndefined(value))
        return true

    if (isObject(value))
        for (const key in value)
            //@ts-expect-error
            if (isUndefined(value[key]))
                return true

    if (isArray(value))
        return value.length == 0

    return false
}