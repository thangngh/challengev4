const getLocalStorage = (name: string) => {
  return localStorage.getItem(name);
};

const setLocalStorage = (name: string, token: string) => {
  localStorage.setItem(name, token);
};

const removeLocalStorage = (name: string) => {
  localStorage.removeItem(name);
};

export { getLocalStorage, setLocalStorage, removeLocalStorage };
