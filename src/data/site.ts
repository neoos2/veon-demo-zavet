// Facts only from veon/client.json (ids in comments). No prices (UX-R004), no invented numbers.
import images from "./images.json";

export type ImgKey = keyof typeof images;
export const img = images;

export interface Phone { tel: string; label: string; }
const fmt = (tel: string) => `+38 ${tel.slice(3, 6)} ${tel.slice(6, 9)}-${tel.slice(9, 11)}-${tel.slice(11, 13)}`;
export const phone = (tel: string): Phone => ({ tel, label: fmt(tel) });

export const contacts = {
  sales: phone("+380443344337"),            // company.contacts.phones[0]
  service: [phone("+380443344734"), phone("+380635249289")], // C-021
  tender: { phone: phone("+380635249334"), email: "zavet.tender2@gmail.com" }, // C-018
  exportDept: { phone: phone("+380674626942"), email: "zavet.trade@gmail.com" },   // C-019
  email: "zavet@zavet.kiev.ua",             // company.contacts.emails[0]
  telegram: "https://t.me/zapovit_bot",     // messengers[0]
  viber: "viber://pa?chatURI=KeyCRMapp",    // messengers[1] (secondary, not verified)
  office: "м. Київ, вул. Стеценка, 30 (лінія 4), 3\u2011й поверх",
  warehouse: "м. Київ, вул. Віктора Некрасова (Північно-Сирецька), 3",
};

const map = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const maps = {
  office: map("Київ, вулиця Стеценка, 30"),
  warehouse: map("Київ, вулиця Віктора Некрасова, 3"),
};

export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/zapovit_zavet/" },
  { name: "Facebook", href: "https://www.facebook.com/zavet.kiev.ua" },
  { name: "YouTube", href: "https://www.youtube.com/user/ZavetUA" },
];

// Hero line-up: the maker's range, none of these repeats in «models». Names checked in the client's catalogue search (zavet.kiev.ua, 2026-11-23).
export const lineup: { code: string; type: string; key: ImgKey; h: number; alt: string }[] = [
  { code: "КФ-2М", type: "Ліжко функціональне двосекційне", key: "kf-2m", h: 172, alt: "Ліжко функціональне двосекційне КФ-2М" },
  { code: "КГ-1МЕ", type: "Крісло гінекологічне", key: "kg-1m", h: 290, alt: "Крісло гінекологічне КГ-1МЕ" },
  { code: "НС-1", type: "Носилки поперечноскладні", key: "ns-1", h: 62, alt: "Носилки поперечноскладні НС-1" },
  { code: "ОРК-021М", type: "Опромінювач ртутно-кварцевий", key: "ork-021m", h: 300, alt: "Опромінювач ртутно-кварцевий ОРК-021М" },
];

// Catalogue directions from the current menu (audit/screens), without COVID (UX-R003).
export const directions: { name: string; key?: ImgKey; alt?: string }[] = [
  { name: "Бактерицидне обладнання", key: "recirc", alt: "Бактерицидні рециркулятори повітря" },
  { name: "Медичні меблі", key: "sm3-4", alt: "Столик маніпуляційний СМ-3 на чотири ящики (євро)" },
  { name: "Лабораторні меблі" },
  { name: "Стерилізація", key: "gp", alt: "Стерилізатор повітряний ГП" },
  { name: "Медичне обладнання", key: "m-4", alt: "Стіл масажний спеціальний М-4" },
  { name: "Обігрівачі" },
  { name: "Сумки та укладки", key: "bags", alt: "Медичні сумки" },
  { name: "Інструменти" },
];

// Models people search for (SE-C009). Every model: photo on the floor, line, code, caption.
export const models: { code: string; type: string; key?: ImgKey; h?: number; alt?: string; light?: boolean }[] = [
  { code: "СМ-3", type: "Столики маніпуляційні на два, чотири й п'ять ящиків", key: "sm3-4", h: 230, alt: "Столик маніпуляційний СМ-3 на чотири ящики (євро)" },
  { code: "ШМ-1/2", type: "Шафи медичні", key: "shm-1", h: 244, alt: "Шафа медична ШМ-1" },
  { code: "ГП", type: "Стерилізатори повітряні ГП-20, ГП-40, ГП-80, ГП-160", key: "gp", h: 150, alt: "Стерилізатор повітряний ГП" },
  { code: "Аерекс", type: "Рециркулятори бактерицидні", key: "aereks-pro", h: 236, alt: "Рециркулятор бактерицидний Аерекс Профешин", light: true },
  { code: "КП", type: "Кушетка процедурна, євро", key: "kp-euro", h: 190, alt: "Кушетка процедурна КП (євро)" },
  { code: "СУР", type: "Рюкзак-укладка, піксель", key: "sur", h: 210, alt: "Рюкзак-укладка СУР (піксель)" },
];

export const operations = ["Рубка", "Гнуття", "Лазерна різка", "Зварювання", "Вальцювання", "Токарні роботи"]; // C-024

export const proofs = [ // C-022, C-023
  { figure: "25+", text: "років власного виробництва" },
  { figure: "2005", text: "звання «Лідер галузі»" },
  { figure: "2009", text: "«Експортер року»" },
  { figure: "2012", text: "«Підприємство року»" },
  { figure: "ISO 9001", text: "система менеджменту якості" },
  { figure: "40+", text: "видів продукції з дипломами «100 кращих товарів України»" },
];

export const futurePages = [
  "Калькулятор опромінювачів", "Кольори оббивок", "Прайс-лист", "Доставка", "Оплата",
  "Статті", "Політика конфіденційності", "Умови повернення",
];
