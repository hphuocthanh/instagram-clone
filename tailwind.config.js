module.exports = {
  future: {
    removeDeprecatedGapUtilities: false
  },
  purge: {
    enabled: true,
    content: ['./src/**/*.js', './src/**/**/*.js']
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      display: ['group-hover']
    }
  },
  theme: {
    fill: (theme) => ({
      red: theme('colors.red.primary')
    }),
    colors: {
      white: '#ffffff',
      blue: {
        medium: '#005c98'
      },
      black: {
        light: '#262626',
        faded: '#00000059'
      },
      gray: {
        base: '#616161',
        background: '#fafafa',
        primary: '#dbdbdb'
      },
      red: {
        primary: '#ed4956'
      }
    },
    fontSize: {
      xxs: '0.625rem',
      '3xl': '1.75rem'
    }
  }
};
