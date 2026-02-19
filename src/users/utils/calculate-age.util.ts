export const calculateAge = (dateOfBirth: string | Date): number => {
  const birthDate = new Date(dateOfBirth);

  if (isNaN(birthDate.getTime())) {
    throw new Error('Invalid date of birth');
  }

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};
