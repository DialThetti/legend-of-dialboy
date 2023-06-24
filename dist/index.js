(()=>{"use strict";var t={216:function(t,e,i){var n=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(o,r){function a(t){try{l(n.next(t))}catch(t){r(t)}}function s(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.CoreModule=void 0;const o=i(638),r=i(429),a=i(252),s=i(653),l=i(13),c=i(394);class d{constructor(t){this.sharedModule=t,this.entityCollider=new c.EntityCollider,this.playerState=new a.PlayerStateService,this.mapLoader=new l.MapLoaderService}main(){return n(this,void 0,void 0,(function*(){let t=yield this.mapLoader.loadMap("m7_7");this.playerState.map=t;const e=new r.KeyListener(this.playerState,this.sharedModule.loggerService),i=new s.WorldClock(this.playerState,e,this.mapLoader,this.entityCollider);e.start(),this.sharedModule.clock.repeat((()=>{i.update()}))}))}static get(){return n(this,void 0,void 0,(function*(){return d.instance||(d.instance=new d(yield o.SharedModule.get()),yield d.instance.main()),d.instance}))}}e.CoreModule=d},394:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.EntityCollider=void 0,e.EntityCollider=class{collide(t,e){return this.entityIn(t,e)||this.entityIn(e,t)}entityIn(t,e){return this.in({x:t.position.x,y:t.position.y},e)||this.in({x:t.position.x+t.size.width,y:t.position.y},e)||this.in({x:t.position.x,y:t.position.y+t.size.height},e)||this.in({x:t.position.x+t.size.width,y:t.position.y+t.size.height},e)}in(t,e){return e.position.x<=t.x&&t.x<=e.position.x+e.size.width&&e.position.y<=t.y&&t.y<=e.position.y+e.size.height}}},429:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.KeyListener=void 0,e.KeyListener=class{constructor(t,e){this.playerState=t,this.loggerService=e,this.keys={LEFT:!1,RIGHT:!1,UP:!1,DOWN:!1,A:!1,B:!1,START:!1,SELECT:!1}}keyDown(t){switch(t.key){case"w":this.keys.UP=!0,this.playerState.direction="UP";break;case"a":this.keys.LEFT=!0,this.playerState.direction="LEFT";break;case"s":this.keys.DOWN=!0,this.playerState.direction="DOWN";break;case"d":this.keys.RIGHT=!0,this.playerState.direction="RIGHT"}}keyUp(t){switch(t.key){case"w":this.keys.UP=!1;break;case"a":this.keys.LEFT=!1;break;case"s":this.keys.DOWN=!1;break;case"d":this.keys.RIGHT=!1}}start(){document.addEventListener("keydown",(t=>this.keyDown(t)),!1),document.addEventListener("keyup",(t=>this.keyUp(t)),!1)}}},834:function(t,e){var i=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(o,r){function a(t){try{l(n.next(t))}catch(t){r(t)}}function s(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.loadJson=e.loadImage=void 0,e.loadImage=function(t){return i(this,void 0,void 0,(function*(){return new Promise((e=>{var i;const n=document.querySelector(`[data-id="${t}"]`);if(n)return e(n);const o=new Image;o.dataset.id=t,o.src=t,o.onload=()=>e(o),null===(i=document.querySelector("#img-reg"))||void 0===i||i.appendChild(o)}))}))},e.loadJson=function(t){return i(this,void 0,void 0,(function*(){const e=yield fetch(t);return yield e.json()}))}},13:function(t,e,i){var n=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(o,r){function a(t){try{l(n.next(t))}catch(t){r(t)}}function s(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.MapLoaderService=void 0;const o=i(834);e.MapLoaderService=class{loadMap(t){return n(this,void 0,void 0,(function*(){const e=yield(0,o.loadJson)(`./map/${t}.json`);return e.entities||(e.entities=[]),e.map&&(e.tiles=e.map.map((t=>t.split("").map((t=>this.mapToTile(t)))))),e}))}mapToTile(t){var e;return null!==(e={o:1," ":2,b:10,J:12,"^":13,L:14,"`":18,x:19,"/":20}[t])&&void 0!==e?e:2}}},252:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.PlayerStateService=void 0,e.PlayerStateService=class{constructor(){this.direction="UP",this.position={x:5,y:5},this.step=0,this.inventory={swordL1:!1,rupees:0}}isSolidTile(t){var e,i;const n=null!==(i=null===(e=this.map.tiles[Math.floor(t.y)])||void 0===e?void 0:e[Math.floor(t.x)])&&void 0!==i?i:-1;return this.map.properties.solid.includes(n)}}},653:function(t,e){var i=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(o,r){function a(t){try{l(n.next(t))}catch(t){r(t)}}function s(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.WorldClock=void 0,e.WorldClock=class{constructor(t,e,i,n){this.playerState=t,this.keyListener=e,this.mapLoader=i,this.entityCollider=n,this.blockTrigger=!1}update(){return i(this,void 0,void 0,(function*(){const{x:t,y:e}=this.playerState.position;if(this.keyListener.keys.LEFT){if(this.currentWalk="l",this.playerState.direction="LEFT",this.tileCollision(-.1,0))return;this.playerState.position.x-=.1,this.playerState.step+=1}else if(this.keyListener.keys.RIGHT){if(this.currentWalk="r",this.playerState.direction="RIGHT",this.tileCollision(.1,0))return;this.playerState.position.x+=.1,this.playerState.step+=1}else if(this.keyListener.keys.UP){if(this.currentWalk="u",this.playerState.direction="UP",this.tileCollision(0,-.1))return;this.playerState.position.y-=.1,this.playerState.step+=1}else if(this.keyListener.keys.DOWN){if(this.currentWalk="d",this.playerState.direction="DOWN",this.tileCollision(0,.1))return;this.playerState.position.y+=.1,this.playerState.step+=1}this.playerState.step>10&&(this.playerState.step-=10),this.checkCollide()}))}tileCollision(t,e){const i=16*this.playerState.position.x+2,n=16*this.playerState.position.y;return t<0?this.playerState.isSolidTile({x:i/16+t,y:n/16})||this.playerState.isSolidTile({x:i/16+t,y:(n+10)/16}):t>0?this.playerState.isSolidTile({x:(i+12)/16+t,y:n/16})||this.playerState.isSolidTile({x:(i+12)/16+t,y:(n+10)/16}):e<0?this.playerState.isSolidTile({x:i/16,y:n/16+e})||this.playerState.isSolidTile({x:(i+12)/16,y:n/16+e}):e>0&&(this.playerState.isSolidTile({x:i/16,y:(n+10)/16+e})||this.playerState.isSolidTile({x:(i+12)/16,y:(n+10)/16+e}))}checkCollide(){return i(this,void 0,void 0,(function*(){if(this.blockTrigger)return;let{x:t,y:e}=this.playerState.position;t*=16,e*=16,this.playerState.map.entities.forEach((i=>{const n=16*i.position.x,o=16*i.position.y;this.entityCollider.collide({position:{x:t+2,y:e},size:{width:12,height:10}},{position:{x:n,y:o},size:i.size})&&this.handleCollide(i)}))}))}handleCollide(t){return i(this,void 0,void 0,(function*(){if(t.traits.find((t=>"solid"===t.name))&&("l"===this.currentWalk&&(this.playerState.position.x+=.1),"r"===this.currentWalk&&(this.playerState.position.x-=.1),"u"===this.currentWalk&&(this.playerState.position.y+=.1),"d"===this.currentWalk&&(this.playerState.position.y-=.1)),t.traits.find((t=>"portal"==t.name))){const e=t.traits.find((t=>"portal"==t.name));this.playerState.position.x=null==e?void 0:e.payload.position.x,this.playerState.position.y=null==e?void 0:e.payload.position.y,this.playerState.map=yield this.mapLoader.loadMap(null==e?void 0:e.payload.map)}if(t.traits.find((t=>"pickup"===t.name))){const e=t.traits.find((t=>"pickup"==t.name));(null==e?void 0:e.payload.respawn)||this.playerState.inventory[e.payload.id]||(this.playerState.inventory[e.payload.id]=!0)}}))}}},46:function(t,e,i){var n=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(o,r){function a(t){try{l(n.next(t))}catch(t){r(t)}}function s(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.GameModule=void 0;const o=i(569);class r{constructor(t){this.render=t}static get(){return n(this,void 0,void 0,(function*(){return r.instance||(r.instance=new r(yield o.RenderModule.get())),r.instance}))}}e.GameModule=r},569:function(t,e,i){var n=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(o,r){function a(t){try{l(n.next(t))}catch(t){r(t)}}function s(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.RenderModule=void 0;const o=i(216),r=i(750),a=i(995),s=i(638);class l{constructor(t,e){this.core=t,this.shared=e,this.fps=60}load(){return n(this,void 0,void 0,(function*(){const t=document.getElementById("screen");this.ctx=t.getContext("2d"),this.ctx.scale(1,1);const e=new a.PlayerRenderService(this.core.playerState),i=new r.WorldRenderService(this.core.playerState);yield i.load(),yield e.load(),this.shared.clock.repeat((()=>{i.drawWorld(this.ctx),e.drawPlayer(this.ctx)}))}))}static get(){return n(this,void 0,void 0,(function*(){return l.instance||(l.instance=new l(yield o.CoreModule.get(),yield s.SharedModule.get()),yield l.instance.load()),l.instance}))}}e.RenderModule=l},995:function(t,e,i){var n=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(o,r){function a(t){try{l(n.next(t))}catch(t){r(t)}}function s(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.PlayerRenderService=void 0;const o=i(834);e.PlayerRenderService=class{constructor(t){this.playerState=t}load(){return n(this,void 0,void 0,(function*(){this.player=yield(0,o.loadImage)("./gfx/link.png")}))}drawPlayer(t){var e;return n(this,void 0,void 0,(function*(){const i=this.playerState.map.entities.filter((t=>t.traits.find((t=>"renderable"===t.name))));yield Promise.all(i.map((e=>n(this,void 0,void 0,(function*(){const i=e.traits.find((t=>"renderable"===t.name)),n=e.traits.find((t=>"pickup"===t.name));if(n&&!n.payload.respawn&&this.playerState.inventory[n.payload.id])return;const r=yield(0,o.loadImage)("./gfx/"+(null==i?void 0:i.payload.spritesheet)),a=null==i?void 0:i.payload.position;t.drawImage(r,a.x,a.y,e.size.width,e.size.height,16*e.position.x,16*e.position.y+64,e.size.width,e.size.height)})))));let[r,a]=null!==(e={LEFT:[30,0],UP:[60,0],DOWN:[0,0],RIGHT:[91,0]}[this.playerState.direction])&&void 0!==e?e:[0,0];this.playerState.step>5&&(a+=30),t.drawImage(this.player,r,a,16,16,Math.floor(16*this.playerState.position.x),Math.floor(16*(4+this.playerState.position.y)-6),16,16),window.debug&&(t.strokeStyle="blue",this.playerState.map.entities.forEach((e=>{t.strokeRect(16*e.position.x,64+16*e.position.y,e.size.width,e.size.height)})),t.strokeRect(16*this.playerState.position.x,64+16*this.playerState.position.y-6,16,16),t.strokeStyle="red",t.strokeRect(16*this.playerState.position.x+2,64+16*this.playerState.position.y,12,10))}))}}},750:function(t,e,i){var n=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(o,r){function a(t){try{l(n.next(t))}catch(t){r(t)}}function s(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.WorldRenderService=void 0;const o=i(834);e.WorldRenderService=class{constructor(t){this.playerState=t}load(){return n(this,void 0,void 0,(function*(){this.tiles=yield(0,o.loadImage)("./gfx/tiles-overworld.png")}))}drawWorld(t){t.fillStyle="rgb(20,20,20)",t.fillRect(0,0,256,240);for(let e=0;e<this.playerState.map.tiles.length;e++)for(let i=0;i<this.playerState.map.tiles[e].length;i++)t.drawImage(this.tiles,17*(this.playerState.map.tiles[e][i]%6+6*this.playerState.map.color)+1,17*Math.floor(this.playerState.map.tiles[e][i]/6)+1,16,16,16*i,64+16*e,16,16)}}},106:function(t,e){var i=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(o,r){function a(t){try{l(n.next(t))}catch(t){r(t)}}function s(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.ClockService=void 0,e.ClockService=class{tick(t,e){setTimeout((()=>i(this,void 0,void 0,(function*(){requestAnimationFrame((()=>this.tick(t,e))),t()}))),e)}repeat(t,e=1e3/60){this.tick(t,e)}}},909:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.LoggerService=void 0,e.LoggerService=class{log(t){console.log(t)}}},638:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.SharedModule=void 0;const n=i(106),o=i(909);class r{constructor(){this.loggerService=new o.LoggerService,this.clock=new n.ClockService}static get(){return r.instance||(r.instance=new r),r.instance}}e.SharedModule=r}},e={};(function i(n){var o=e[n];if(void 0!==o)return o.exports;var r=e[n]={exports:{}};return t[n].call(r.exports,r,r.exports,i),r.exports})(46).GameModule.get()})();