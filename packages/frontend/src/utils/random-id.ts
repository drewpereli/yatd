function* createIdGenerator() {
  let id = 0;
  while (true) {
    yield id++;
  }
}

const idGenerator = createIdGenerator();

export function randomId(prefix?: string) {
  const val = idGenerator.next().value as number;

  return prefix ? `${prefix}-${val}` : `${val}`;
}
