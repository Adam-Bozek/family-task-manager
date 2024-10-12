import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importing english translations
import enNavigation from "./en/en_navigation.json";
import enHome from "./en/en_home.json";
import enPricing from "./en/en_pricing.json";
import enContact from "./en/en_contact.json";

// Importing slovak translations
import skNavigation from "./sk/sk_navigation.json";
import skHome from "./sk/sk_home.json";
import skPricing from "./sk/sk_pricing.json";
import skContact from "./sk/sk_contact.json";

// Combining translations into single object
const resources = {
	en: {
		navigation: enNavigation,
		home: enHome,
		pricing: enPricing,
		contact: enContact,
	},
	sk: {
		navigation: skNavigation,
		home: skHome,
		pricing: skPricing,
		contact: skContact,
	},
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "sk",
		resources,
		ns: ["navigation", "home", "pricing", "contact"],
		defaultNS: "navigation",
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
