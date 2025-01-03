# Vue 3 Script Setup with TypeScript

This project is a Vue 3 application using the script setup syntax with TypeScript. It also includes environment variable configuration for `VITE_GOOGLE_AI_STUDIO_API_KEY`.

## Project Setup

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/NguyenDucTruyen/QuillBot.git
    cd QuillBot
    ```

2. Install dependencies:
    ```sh
    pnpm install
    # or
    yarn install
    #or
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory and add your Google AI Studio API key:
```env
VITE_GOOGLE_AI_STUDIO_API_KEY=your_api_key_here
```

### Compiles and hot-reloads for development
```sh
pnpm dev
# or
yarn dev
# or
npm run dev
```

### Compiles and minifies for production
```sh
pnpm build
# or
yarn build
# or
npm run build
```

### Lints and fixes files
```sh
pnpm lint
# or
yarn lint
# or
npm run lint
```

## Project Structure

- `src/` - Source code directory
- `public/` - Public assets directory
- `env/` - Environment configuration

## License

This project is licensed under the MIT License.

