// this is used to force serveral graphiql instances to not save the docs state
export const dummyStorage = {
  clearItem: () => null,
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null,
}
