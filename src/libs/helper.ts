import langs from 'src/libs/languages.json'; // Adjust the path if necessary

// Define the structure of your translations
type LanguageKey = 'en' | 'id'; // Define allowed language keys

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Assuming langs is of type Translations
const translations = langs as unknown as Translations;

export const setLang = (text: string, currlang?: string): string => {
  const currentLang: LanguageKey =
    (localStorage.getItem('currentLanguage') as LanguageKey) ?? 'en';

  console.log('🚀 ~ setLang ~ currentLang:', currentLang);

  // Use the typed structure to index safely
  const translation = translations[currlang ?? currentLang]?.[text];

  if (!translation) {
    console.warn(
      'Warning: The requested translation for the key "' +
        text +
        '" is not available. Please ensure that all necessary translations are provided.'
    );
  }

  return translation || text; // Return the original text if the translation is not found
};
