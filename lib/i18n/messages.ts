import tr from '@/messages/tr.json';
import en from '@/messages/en.json';

export async function getMessages(locale: string) {
  switch (locale) {
    case "tr":
      return tr;
    case "en":
      return en;
    default:
      return null;
  }
}
