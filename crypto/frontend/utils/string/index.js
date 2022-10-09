const PATTERN1 = /([a-z0-9])([A-Z])/g;
const PATTERN2 = /([A-Z])([A-Z])(?=[a-z])/g;
const PATTERN3 = /(_| )/g;
const PATTERN4 = /(-| )/g;
const PATTERN5 = /([A-Z])([A-Z])(?=[a-z])/g;
const PATTERN6 = /([a-z])([A-Z])/g;
const PATTERN7 = /(_|-)/g;
const PATTERN8 = /\w\S*/g;
const PATTERN9 = /( )/g;

/**
 * Converts a string from `camelCase`, `PascalCase`, `snake_case`,
 * `kebab-case`, `Title Case` or `raw strings` to `CONSTANT_CASE`.
 *
 * @example
 * toConstantCase('productId'); // → PRODUCT_ID
 *
 * @example
 * toConstantCase('eBook'); // → E_BOOK
 *
 * @example
 * toConstantCase('HTMLInput-Element'); // → HTML_INPUT_ELEMENT
 *
 * @example
 * toConstantCase('first_option'); // → FIRST_OPTION
 *
 * @example
 * toConstantCase('First_Option'); // → FIRST_OPTION
 *
 * @example
 * toConstantCase('Raw strings ALLOWED'); // → RAW_STRINGS_ALLOWED
 *
 * @example
 * toConstantCase('Foo Bar Baz'); // → FOO_BAR_BAZ
 */
export const toConstantCase = (str) =>
  str
    .replace(PATTERN1, '$1_$2')
    .replace(PATTERN2, '$1_$2')
    .replace(PATTERN4, '_')
    .toUpperCase();

/**
 * Converts a string from `camelCase`, `PascalCase`, `snake_case`,
 * `CONSTANT_CASE`, `Title Case` or `raw strings` to lower case `kebab-case`.
 *
 * @example
 * toKebabCase('productId'); // → product-id
 *
 * @example
 * toKebabCase('eBook'); // → e-book
 *
 * @example
 * toKebabCase('HTMLInput-Element'); // → html-input-element
 *
 * @example
 * toKebabCase('first_option'); // → first-option
 *
 * @example
 * toKebabCase('First_Option'); // → first-option
 *
 * @example
 * toKebabCase('FIRST_OPTION'); // → first-option
 *
 * @example
 * toKebabCase('Raw strings ALLOWED'); // → raw-strings-allowed
 *
 * @example
 * toKebabCase('Foo Bar Baz'); // → foo-bar-baz
 */
export const toKebabCase = (str) =>
  str
    .replace(PATTERN1, '$1-$2')
    .replace(PATTERN2, '$1-$2')
    .replace(PATTERN3, '-')
    .toLowerCase();

/**
 * Converts a string from `camelCase`, `snake_case`, `kebab-case`,
 * `CONSTANT_CASE`, `Title Case` or `raw strings` to `ToPascalCase`.
 *
 * @example
 * toPascalCase('productId'); // → ProductId
 *
 * @example
 * toPascalCase('eBook'); // → Ebook
 *
 * @example
 * toPascalCase('html-input-element'); // → HtmlInputElement
 *
 * @example
 * toPascalCase('first_option'); // → FirstOption
 *
 * @example
 * toPascalCase('First_Option'); // → FirstOption
 *
 * @example
 * toPascalCase('FIRST_OPTION'); // → FirstOption
 *
 * @example
 * toPascalCase('Raw strings ALLOWED'); // → RawStringsAllowed
 *
 * @example
 * toPascalCase('Foo Bar Baz'); // → FooBarBaz
 */
export const toPascalCase = (str) =>
  str
    .replace(PATTERN5, '$1 $2')
    .replace(PATTERN6, '$1 $2')
    .replace(PATTERN7, ' ')
    .replace(
      PATTERN8,
      (substr) =>
        substr.charAt(0).toUpperCase() + substr.slice(1).toLowerCase(),
    )
    .replace(PATTERN9, '');

/**
 * Converts a string from `camelCase`, `PascalCase`, `CONSTANT_CASE`,
 * `kebab-case`, `Title Case` or `raw strings` to `snake_case`.
 *
 * @example
 * toSnakeCase('productId'); // → product_id
 *
 * @example
 * toSnakeCase('eBook'); // → e_book
 *
 * @example
 * toSnakeCase('HTMLInput-Element'); // → html_input_element
 *
 * @example
 * toSnakeCase('FIRST_OPTION'); // → first_option
 *
 * @example
 * toSnakeCase('Raw strings ALLOWED'); // → raw_strings_allowed
 *
 * @example
 * toSnakeCase('Foo Bar Baz'); // → foo_bar_baz
 */
export const toSnakeCase = (str) =>
  str
    .replace(PATTERN1, '$1_$2')
    .replace(PATTERN2, '$1_$2')
    .replace(PATTERN4, '_')
    .toLowerCase();

/**
 * Converts a string from `camelCase`, `snake_case`, `kebab-case`,
 * `CONSTANT_CASE`, `PascalCase` or `raw strings` to `To Title Case`.
 *
 * @example
 * toTitleCase('productId'); // → Product Id
 *
 * @example
 * toTitleCase('eBook'); // → Ebook
 *
 * @example
 * toTitleCase('html-input-element'); // → Html Input Element
 *
 * @example
 * toTitleCase('first_option'); // → First Option
 *
 * @example
 * toTitleCase('First_Option'); // → First Option
 *
 * @example
 * toTitleCase('FIRST_OPTION'); // → First Option
 *
 * @example
 * toTitleCase('Raw strings ALLOWED'); // → Raw Strings Allowed
 */
export const toTitleCase = (str) =>
  str
    .replace(PATTERN5, '$1 $2')
    .replace(PATTERN6, '$1 $2')
    .replace(PATTERN7, ' ')
    .replace(
      PATTERN8,
      (substr) =>
        substr.charAt(0).toUpperCase() + substr.slice(1).toLowerCase(),
    );
