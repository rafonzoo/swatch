export const hasTheme = () => {
  return localStorage.getItem('swc-theme');
};

export const getTheme = () => {
  return hasTheme() || 'light';
};

export const setTheme = (): void => {
  const dataTheme = document.querySelector('[data-theme]');
  const themeName = dataTheme?.getAttribute('data-theme');

  dataTheme?.setAttribute('data-theme', themeName === 'light' ? 'dark' : 'light');
  localStorage.setItem('swc-theme', themeName === 'light' ? 'dark' : 'light');
};

export const randomize = (minimum: number, maximum: number) => {
  const timeout = maximum - minimum + 1;
  const random = Math.random() * timeout;

  return Math.floor(random + minimum);
};

export const capitalize = (s: string) => {
  const firstChar = s.charAt(0);
  const restChars = s.slice(1);

  return firstChar.toUpperCase() + restChars;
};

export const serialize = <T = any>(form: HTMLFormElement): T => {
  const data = new FormData(form);
  const obj: { [x: string]: any } = {};

  for (const pair of data.entries()) {
    const [key, value] = pair;
    obj[key] = value;
  }

  return obj as T;
};

export const timeout = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const timerize = (minimum: number, maximum: number) => {
  return randomize(minimum, maximum - minimum);
};

export const lazyImage = <T = Element> (target: T[], callback: () => void) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const target = entry.target as HTMLImageElement;
          const wrapper = target.closest('li');

          target.src = target.dataset.src || '#';
          target.classList.remove('lazy');
          target.parentElement?.classList.remove('placeholder');

          target.onload = () => callback();

          if (wrapper) {
            const childs = wrapper.querySelectorAll<HTMLImageElement>('.lazy');
            Array.from(childs).forEach((child) => {
              child.src = child.dataset.src || '#';
              child.classList.remove('lazy');
            });
          }

          observer.unobserve(target);
        }, 1000);
      }
    });
  });

  target.forEach(img => observer.observe(img as unknown as Element));
};
