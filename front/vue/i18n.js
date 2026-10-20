import Vue from "vue";

/**
 * Minimal translation helper.
 *
 * Keys are the English source strings, so `$t("Projects")` simply returns the
 * key while no alternative locale is registered. Everything stays English and
 * components do not need to be touched if a locale is added later.
 */

function normalize() {
    return "en";
}

export const lang = normalize();

export function setLang() {
    // no alternative locale is enabled
}

export function t(key, params) {
    if (key === null || key === undefined) {
        return "";
    }
    let value = key;
    if (params) {
        value = value.replace(/\{(\w+)\}/g, (match, name) =>
            Object.prototype.hasOwnProperty.call(params, name)
                ? String(params[name])
                : match
        );
    }
    return value;
}

export function tn(count, singular, plural) {
    return t(count === 1 ? singular : plural);
}

Vue.prototype.$t = t;
Vue.prototype.$tn = tn;
Vue.prototype.$lang = lang;

export default {
    install(vue) {
        vue.prototype.$t = t;
        vue.prototype.$tn = tn;
        vue.prototype.$lang = lang;
    },
};
