const app = require("../servers").app;
const io = require("../servers").io;
const checkForOrbCollisions =
  require("./checkCollisions").checkForOrbCollisions;
const checkForPlayerCollisions =
  require("./checkCollisions").checkForPlayerCollisions;
module.exports = io;

//===========CLASSES===============
const Player = require("./classes/Player");
const PlayerConfig = require("./classes/PlayerConfig");
const PlayerData = require("./classes/PlayerData");
const Orb = require("./classes/Orb");
//=================================
const orbs = [];

const settings = {
  defaultNumberOfOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
  defaultGenericOrbSize: 5,
};

const players = [];
const playersForUsers = [];
let tickTockInterval;
initGame();

io.on("connect", (socket) => {
  //player connected
  let player = {};
  socket.on("init", (playerObj, ackCallback) => {
    if (players.length === 0) {
      //tick-tock-- 30 frame per seconds
      tickTockInterval = setInterval(() => {
        io.to("game").emit("tick", playersForUsers); //send event to game room
      }, 33); //30 frames
    }

    socket.join("game");
    const playerName = playerObj.playerName;
    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);
    players.push(player); //server use only
    playersForUsers.push({ playerData });
    ackCallback({ orbs, indexInPlayers: playersForUsers.length - 1 }); //send the orbs array
  });

  socket.on("tock", (data) => {
    if (!player.playerConfig) {
      return;
    }
    speed = player.playerConfig.speed;

    //   player.xVector = xVector ? xVector : 0.1;
    //   player.yVector = yVector ? yVector : 0.1;

    const xV = (player.playerConfig.xVector = data.xVector);
    const yV = (player.playerConfig.yVector = data.yVector);

    if (
      (player.playerData.locX > 5 && xV < 0) ||
      (player.playerData.locX < settings.worldWidth && xV > 0)
    ) {
      player.playerData.locX += speed * xV;
    }
    if (
      (player.playerData.locY > 5 && yV > 0) ||
      (player.playerData.locY < settings.worldHeight && yV < 0)
    ) {
      player.playerData.locY -= speed * yV;
    }
    //check orb collisions
    const captureOrbI = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );
    if (captureOrbI !== null) {
      orbs.splice(captureOrbI, 1, new Orb(settings));

      const orbData = {
        captureOrbI,
        newOrb: orbs[captureOrbI],
      };

      //emit
      io.to("game").emit("orbSwitch", orbData);
      io.to("game").emit("updateLeaderBoard", getLeaderBoard());
    }

    //player collisons
    const absorbData = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      playersForUsers,
      socket.id
    );
    if (absorbData) {
      io.to("game").emit("playerAbsorbed", absorbData);
    }
  });

  socket.on("disconnect", () => {
    //if empty players array stop tick
    if (players.length === 0) {
      clearInterval(tickTockInterval);
    }
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

function getLeaderBoard() {
  const leaderBoardArray = players.map((curPlayer) => {
    if(curPlayer.playerData){
      return {
        name: curPlayer.playerData.name,
        score: curPlayer.playerData.score,
      }
    }
    else{
      return {}
    }
  });
  return leaderBoardArray;
}
