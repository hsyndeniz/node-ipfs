### Steemia IPFS
Steemia server code implementation for IPFS image upload service!

### How to Install

Download IPFS => https://ipfs.io/docs/install/

Start an IPFS node with your CLI;
```
ipfs daemon 
```
It will start working at localhost:5001
```
git clone https://github.com/hsynterkr/steemia-ipfs
cd steemia-ipfs
npm install
npm start
```
It will start working at localhost:5000
Now you can upload photos to your local IPFS node.

You can send a HTTP POST request to <em><b>localhost:5000/upload</b></em>  to upload an image file!
```
