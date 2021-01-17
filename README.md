# Steganographia

an invisible digital watermark using Stegastamp

## How to use

1. Install dependencies and run dev server:

```bash
yarn install

# then
yarn dev
```

2. Download the pretrained model from Stegastamp
```
# encoder model
wget http://people.eecs.berkeley.edu/~tancik/stegastamp/saved_models.tar.xz
tar -xJf saved_models.tar.xz
rm saved_models.tar.xz
# decoder model
wget http://people.eecs.berkeley.edu/~tancik/stegastamp/detector_models.tar.xz
tar -xJf detector_models.tar.xz
rm detector_models.tar.xz
```

3. Move `saved_models' and 'detector_models' folder into the public folder

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Recommended extensions for VSCode

If you're a beginner and don't know which extensions you need, definitely install these:

1. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Adds error highlighting to VSCode.
2. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): Auto-fixes formatting errors everytime you hit save.
3. [TailwindCSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss): Tailwind className suggestions as you type
4. [Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind): Makes sure your tailwind classes have the correct order which makes components easier to read.
