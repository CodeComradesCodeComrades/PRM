// https://stackoverflow.com/a/74898678
export function DecorateAll(
    decorator: <T>(
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<T>,
    ) => TypedPropertyDescriptor<T> | void,
) {
    return (target: any) => {
        const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
        for (const [propName, descriptor] of Object.entries(descriptors)) {
            const isMethod = typeof descriptor.value == 'function' && propName !== 'constructor';
            if (!isMethod) {
                continue;
            }
            decorator(
                { ...target, constructor: { ...target.constructor, name: target.name } as any },
                propName,
                descriptor,
            );
            Object.defineProperty(target.prototype, propName, descriptor);
        }
    };
}
