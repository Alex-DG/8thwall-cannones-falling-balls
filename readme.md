# { AR 8thWall ~ Three.js } Cannon-es ⚡

## Description

- Experiment falling ball using Three.js + Cannon-es
- FPS monitoring
- You can add an url parameter such as `?multi=true` to add balls in the AR scene by 50 at once

## Setup

1. Create `.env.local` file in the project root and add your 8th Wall key inside:

```
VITE_8THWALL_APP_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
```

2. Run the following commands:

```bash
# Install dependencies (only the first time)
yarn

# Run the local server
yarn dev

# Build for production in the dist/ directory
yarn build
```

https://8thwall-cannones-falling-balls.vercel.app => add ball one by one
https://8thwall-cannones-falling-balls.vercel.app?multi=true => add balls by 50
