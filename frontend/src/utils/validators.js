export const validators = {
 email: (value) => {
   const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
   return emailRegex.test(value) || 'Geçerli bir e-posta adresi giriniz';
 },

 required: (value) => {
   return value && value.trim() !== '' || 'Bu alan zorunludur';
 },

 minLength: (min) => (value) => {
   return value && value.length >= min || `En az ${min} karakter olmalıdır`;
 },
};