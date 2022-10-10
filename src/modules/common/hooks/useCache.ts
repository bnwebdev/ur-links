import { useState } from "react"
import { useInitializedEffect } from "./useInitializedEffect"

type UseCacheOptions<T> = {
    parse?: (code: string) => T
    stringify?: (elem: T) => string
}

const defaultParse = (value: string) => value && JSON.parse(value)
const defaultStringify = <T>(value: T) => JSON.stringify(value)

export const useCache = <T>(id: string, options: UseCacheOptions<T> = {}) => {
  const parse = options.parse || defaultParse
  const stringify = options.stringify || defaultStringify

  const [serializedValue, setSerializedValue] = useState(() => localStorage.getItem(id) || '')
  const [value, setValue] = useState<T>(() => parse(serializedValue))

  useInitializedEffect(() => {
    setSerializedValue(stringify(value))
  }, [value])

  useInitializedEffect(() => {
    localStorage.setItem(id, serializedValue)
  }, [serializedValue])

  return [value, setValue]
}