/* @flow */

const entries: <K, V>({ [K]: V }) => Array<[K, V]> = (Object.entries: any)

type ConfigSource = { [name: string]: [string, number, any] }
type Definition = {
  type: string,
  config: any
}

export default function toRootDefinition(source: ConfigSource): Definition {
  const rules = entries(
    source
  ).reduce((acc, [name, [type, priority, opts]]) => {
    const definition =
      type === 'group'
        ? toRootDefinition(opts)
        : {
            type,
            config: opts
          }

    return acc.concat([{ name, priority, definition }])
  }, [])
  return {
    type: 'group',
    config: { rules }
  }
}
