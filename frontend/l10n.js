import { FluentBundle } from 'fluent/compat';
import { negotiateLanguages } from 'fluent-langneg/compat';

const MESSAGES_ALL = {
    'fi': `
  title = Kirjaudu Sisään
  login = Kirjaudu Sisään
  logout = Kirjaudu Ulos
    `,
    'en-US': `
  title = Log in
  login = Log in
  logout = Log Out
    `,
  };
  
  export const languages = ['fi', 'en-US']
  
  export function* generateBundles(userLocales) {
    // Choose locales that are best for the user.
    const currentLocales = negotiateLanguages(
      userLocales,
      ['en-US', 'fi'],
      { defaultLocale: 'fi' }
    );
    for (const locale of currentLocales) {
        const bundle = new FluentBundle(locale);
        bundle.addMessages(MESSAGES_ALL[locale]);
        yield bundle;
      }
  }