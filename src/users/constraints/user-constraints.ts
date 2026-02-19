const today = new Date();

export const UserConstraints = {
  name: {
    minLength: 2,
    maxLength: 100,
  },

  dateOfBirth: {
    maxDate: today,
    minDate: new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()),
  },

  height: {
    min: 120,
    max: 230,
  },

  weight: {
    min: 30,
    max: 300,
  },

  targetWeight: {
    min: 30,
    max: 300,
  },

  goalDelta: {
    min: -600,
    max: 600,
  },
} as const;
