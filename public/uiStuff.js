
//set height and width of canvas = window
let wHeight = window.innerHeight;
let wWidth = window.innerWidth;
//canvas obj needs to be in a varialble
const canvas = document.querySelector('#the-canvas');
//use context to draw 2d
const context = canvas.getContext('2d');
canvas.height = wHeight;
canvas.width = wWidth;


const loginModal = new bootstrap.Modal(document.querySelector('#loginModal'));
const spawnModal = new bootstrap.Modal(document.querySelector('#spawnModal'));
//this player
const player = {};
let orbs = [];
let players = [];
window.addEventListener('load', ()=>{
    loginModal.show();
})

document.querySelector('.name-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    player.name = document.querySelector('#name-input').value;
    document.querySelector('.player-name').innerHTML+= player.name;
    loginModal.hide();
    spawnModal.show();
    
})

document.querySelector('.start-game').addEventListener('click', (e)=>{
    //hide start modal
    spawnModal.hide();
    //show hidden on start
    const  elArray= Array.from(document.querySelectorAll('.hiddenOnStart'));
    elArray.forEach(el=>el.removeAttribute('hidden'));
    init();
})

