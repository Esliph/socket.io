import { Metadata } from '@esliph/metadata'
import { isString } from '@esliph/common/util'
import { Decorator } from '@esliph/decorator'
import { ClassConstructor } from '../util/types'

export type EventOptions = {
    event: string
}

const METADATA_KEY_SOCKET_CLIENT_EVENT = 'metadata_key.socket.client.event'

export function OnEvent(options: string | EventOptions) {
    function handle(target: any, key: string) {
        if (isString(options))
            options = { event: options }

        const events = getOptionsEvent(target.constructor, key) || []

        events.push(options)

        Metadata.Create.Method({ key: METADATA_KEY_SOCKET_CLIENT_EVENT, value: events }, target, key)
    }

    return Decorator.Create.Method(handle)
}

export function isEvent(constructor: ClassConstructor, keyProperty: string) {
    return !!getOptionsEvent(constructor, keyProperty)
}

export function getOptionsEvent(constructor: ClassConstructor, keyProperty: string) {
    return Metadata.Get.Method<EventOptions[]>(METADATA_KEY_SOCKET_CLIENT_EVENT, constructor, keyProperty)
}