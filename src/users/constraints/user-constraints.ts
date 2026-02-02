export const UserConstraints = {
  name: {
    minLength: 2,
    maxLength: 100,
  },

  age: {
    min: 10,
    max: 100,
  },

  height: {
    min: 120,
    max: 230,
  },

  weight: {
    min: 30,
    max: 300,
  },
} as const;
