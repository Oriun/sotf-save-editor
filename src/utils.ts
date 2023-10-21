export type ValueOfMap<T extends Map<any, any>> = T extends Map<any, infer I>  ? I : never
