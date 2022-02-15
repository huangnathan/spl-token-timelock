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
    spacing: {
      'space-8': '.4rem',
      'space-12': '.6rem',
      'space-14': '.7rem',
      'space-16': '.8rem',
      'space-18': '.9rem',
      'space-24': '1.2rem',
      'space-32': '1.6rem',
      'space-40': '2rem',
      'space-48': '2.4rem',
      'space-64': '3.2rem'
    },
    screens: {
    }
  },
  plugins: []
}
