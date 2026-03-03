import { Language } from '@app/users/enums';

export const FOOD_REMINDER_MESSAGES: Record<
  Language,
  { emailSubject: string; emailBody: string; pushTitle: string; pushBody: string }
> = {
  [Language.EN]: {
    emailSubject: 'Intake – food reminder',
    emailBody: "Don't forget to log your food today in Intake.",
    pushTitle: 'Intake',
    pushBody: "Don't forget to log your food today.",
  },
  [Language.PL]: {
    emailSubject: 'Intake – przypomnienie o jedzeniu',
    emailBody: 'Nie zapomnij zapisać jedzenia na dziś w Intake.',
    pushTitle: 'Intake',
    pushBody: 'Nie zapomnij zapisać jedzenia na dziś.',
  },
  [Language.UK]: {
    emailSubject: 'Intake – нагадування про їжу',
    emailBody: 'Не забудь записати їжу сьогодні в Intake.',
    pushTitle: 'Intake',
    pushBody: 'Не забудь записати їжу сьогодні.',
  },
};

export function getFoodReminderContent(lang: Language) {
  return FOOD_REMINDER_MESSAGES[lang] ?? FOOD_REMINDER_MESSAGES[Language.EN];
}
