import array from './array'
import number from './number'
import object from './object'
import string from './string'
import { RootFactory } from './RootFactory'

RootFactory.initialize(array, string, object, number)

export default RootFactory