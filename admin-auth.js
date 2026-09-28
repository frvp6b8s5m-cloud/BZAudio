/* PART 1: CURATOR SIGNATURE */
const CURATOR_SIGNATURE='2d1c79d3c0eff7af3fd493305f5b9247a40b808b594bc48e98a1f163d7ac8d84';
async function digestHex(text){const data=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(data),b=>b.toString(16).padStart(2,'0')).join('');}

/* PART 2: SESSION */
document.addEventListener('DOMContentLoaded',()=>{const form=document.querySelector('#loginForm');if(!form)return;form.addEventListener('submit',async e=>{e.preventDefault();const u=document.querySelector('#artist-id').value.trim(),p=document.querySelector('#secure-key').value,status=document.querySelector('#loginStatus');const button=form.querySelector('button');button.disabled=true;status.textContent='[VERIFYING_SIGNATURE...]';try{if(await digestHex(`${u}:${p}`)!==CURATOR_SIGNATURE)throw 0;sessionStorage.setItem('bz_curator_session','active');status.textContent='[ENGINE_INITIALIZED]';setTimeout(()=>location.replace('./dashboard.html'),350);}catch{status.textContent='ACCESS DENIED // SIGNATURE MISMATCH';document.querySelector('#secure-key').value='';}finally{button.disabled=false;}})});

/* PART 3: DASHBOARD GUARD */
function requireCurator(){if(sessionStorage.getItem('bz_curator_session')!=='active')location.replace('./admin.html');}