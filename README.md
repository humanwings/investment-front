# investment-front

Frontend project for the investment system.

## Startup

### Requirements

- Node.js
- npm

Recommended:

- Node.js 16.x
- npm 8.x or later

### Install Dependencies

```bash
npm install
```

## Run

### Development

```bash
npm run dev
```

Default local address:

- `http://localhost:9528`

Current development API base URL is configured in `.env.development`:

- `VUE_APP_BASE_API=http://localhost:8080`

Make sure the backend service is running before starting frontend development.

### Production Build

```bash
npm run build:prod
```

Build output directory:

- `dist/`

### Staging Build

```bash
npm run build:stage
```

### Preview Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Technical Implementation

### Core Stack

- Vue 2
- Vue Router
- Vuex
- Element UI
- Axios
- SCSS

### Project Structure

- `src/views/`
  UI pages
- `src/router/`
  route configuration
- `src/store/`
  Vuex store
- `src/api/`
  frontend API wrappers
- `src/layout/`
  layout shell and sidebar/navbar structure
- `src/components/`
  shared components
- `src/utils/`
  common utilities

### Runtime Behavior

- Frontend and backend communicate through HTTP APIs
- Authentication state is managed with Vuex and token storage
- Sidebar menus are driven by router configuration
- Environment-specific API addresses are controlled by `.env.*`

