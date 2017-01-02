# scratch2bb8

scratch2bb8 is [ScratchX](http://scratchx.org/) extension that enables Scratch to control [BB-8](http://www.sphero.com/starwars/bb8).

## Platforms

- MacOS 10.12.2(Sierra)
  - node.js is required

## Install Helper App

To control BB-8, Helper App needs to be installed. You need node.js to run it.

```
% wget https://github.com/champierre/scratch2bb8/archive/gh-pages.zip
% unzip gh-pages.zip
% mv scratch2bb8-gh-pages scratch2bb8
% cd scratch2bb8/scratch2bb8_helper
% npm install
```

## Run scratch2bb8

1. Open [ScratchX](http://scratchx.org/) page.
2. Click "Open Extension URL" and paste the following URL, then click "Open".

  ```
  http://champierre.github.io/scratch2bb8/scratch2bb8.js
  ```
3. On Warning dialog, click "I understand, continue" if you trust scratch2bb8.
4. Scan devices and find your BB-8. The name starts with "BB-".

  ```
  % cd scratch2bb8/scratch2bb8_helper
  $ node_modules/.bin/cylon-ble-scan
  (Ctrl-C to exit)
  ```

5. Run the Helper App:

  ```
  % UUID=xxxxxx node scratch2bb8_helper.js
  ```

6. If the Helper App says "Working.", you can control BB-8 from ScratchX using the custom blocks in "More Blocks" group.
