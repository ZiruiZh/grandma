import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/node_modules/three/build',{recursive:true});
await copyFile('index.html','dist/index.html');
await cp('src','dist/src',{recursive:true});
await copyFile('node_modules/three/build/three.module.js','dist/node_modules/three/build/three.module.js');
await copyFile('node_modules/three/build/three.core.js','dist/node_modules/three/build/three.core.js');
await copyFile('node_modules/three/LICENSE','dist/node_modules/three/LICENSE');
console.log('Built standalone static game in dist/');
