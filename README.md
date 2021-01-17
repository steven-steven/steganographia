# Steganographia

An invisible digital watermark service using [Stegastamp](https://github.com/tancik/StegaStamp)

## How to use

1. Install dependencies and run dev server:

```bash
yarn install
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

4. Setup Python environment (python 3.3-3.7)
```
pip install -r requirements.txt
pip install tensorflow=1.13.1 
```

6. Cockroachdb setup
- Create ```certs``` folder under ```src```, put ```doot-hack-ca.crt``` under this folder.
- Create ```config``` folder under ```src```, put ```dbConfig.tsx``` under this folder.
- Make sure your local/server IP is registered under Networking, Authorized Networks.

5. Run `yarn dev`, then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo
 
Encoding data to an image:
<div style="text-align:center">
<img src="/verificationDemo.gif" width="300" />
</div>

Retrieving watermark data from the image:

<img src="/encodingDemo.gif" width="300" />
