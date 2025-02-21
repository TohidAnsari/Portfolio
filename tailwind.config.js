/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './**/*.html', // Adjust this path based on your project structure
    './**/*.js',   // Add JS, JSX, or TSX files here if you're using them
    './**/*.ejs',  // For React JSX files
    // Add more paths as needed
  ],
  theme: {
    extend: {
      screens:{
        'xs': {'min': '400px'}
      }
    },
  },
  plugins: [],
}

