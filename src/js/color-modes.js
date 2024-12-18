/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
  'use strict';

  // Get stored theme from local storage
  const getStoredTheme = () => localStorage.getItem('theme');

  // Set stored theme in local storage
  const setStoredTheme = (theme) => localStorage.setItem('theme', theme);

  // Get preferred theme based on stored theme and current dark mode
  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    console.log(`storedTheme: ${storedTheme}`);
    if (storedTheme) return storedTheme;
    return 'auto';
  };

  // Set the current theme based on the preferred theme
  const setTheme = (theme) => {
    if (theme === 'auto') {
      document.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  };

  // Show the active theme
  const showActiveTheme = (theme = false) => {
    console.log(`theme: ${theme}`);
    if (!theme) {
      document.querySelector('[data-bs-theme-value="auto"]').setAttribute('checked', true);
    }

    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);

    // Reset all other buttons
    document.querySelectorAll('[data-bs-theme-value]').forEach((element) => {
      element.setAttribute('checked', false);
      element.setAttribute('aria-pressed', 'false');
    });

    // Set the active button and its aria-pressed attribute
    switch (theme) {
      case 'light':
        btnToActive.setAttribute('checked', true);
        btnToActive.setAttribute('aria-pressed', 'true');
        break;
      case 'dark':
        btnToActive.setAttribute('checked', true);
        btnToActive.setAttribute('aria-pressed', 'true');
        break;
      case 'auto':
        btnToActive.setAttribute('checked', true);
        btnToActive.setAttribute('aria-pressed', 'true');
        break;
    }
  };

  // Update the theme when dark mode changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    setTheme(getPreferredTheme());
    showActiveTheme(getPreferredTheme());
  });

  // Initialize the theme on page load
  window.addEventListener('DOMContentLoaded', () => {
    setTheme(getPreferredTheme());
    showActiveTheme(getPreferredTheme());

    // Add event listener to each button
    document.querySelectorAll('[data-bs-theme-value]').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        console.log(toggle.getAttribute('data-bs-theme-value'));
        const theme = toggle.getAttribute('data-bs-theme-value');
        setStoredTheme(theme);
        setTheme(theme);
        showActiveTheme(theme, true);
      });
    });
  });
})();