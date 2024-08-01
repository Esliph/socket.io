export type ClassConstructor<T = any> = new (...args: any[]) => T
export type GenericObject = { [x: string]: any }

export function getPropertiesMethodsFromClass(constructor: ClassConstructor) {
    const prototype = constructor.prototype
    return Object.getOwnPropertyNames(prototype).filter(name => typeof prototype[name] === 'function' && name !== 'constructor') as string[]
}