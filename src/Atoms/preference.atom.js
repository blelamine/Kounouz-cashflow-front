import { atom } from "recoil";
const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      // isReset
      //   ? localStorage.removeItem(key)
      //   :
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const PreferenceAtom = atom({
  key: "PreferenceAtom", // unique ID (with respect to other atoms/selectors)
  default: { agencyId: null, exercice: new Date().getFullYear() }, // default value (aka initial value),
  effects_unstable: [localStorageEffect("preference_atom")],
});
