module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neutral-100': 'var(--neutral-100)',
        'white': 'var(--white)',
        'white-f4': 'var(--white-f)',
        'light-9a': 'var(--light-9a)',
        'green': 'var(--green)'
      }
    },
    fontSize: {
      'size-12': '.6rem',
      'size-14': '.7rem',
      'size-16': '.8rem',
      'size-24': '1.2rem',
      'size-32': '1.6rem',
      'size-48': '2.4rem'
    },
    screens: {
    }
  },
  plugins: []
}
