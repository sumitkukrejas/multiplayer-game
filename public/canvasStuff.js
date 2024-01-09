// player.locX = Math.floor(500 * Math.random() + 10);
// player.locY = Math.floor(500 * Math.random() + 10);
////////////////////////////////////
////////////////draw////////////////
////////////////////////////////////
const draw = () => {
  //reset the context translate back to default
  context.setTransform(1, 0, 0, 1, 0, 0);

  //clear rect clears out the canvas every frame
  context.clearRect(0, 0, canvas.width, canvas.height);

  //clamp the screen
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;
  //translate move the canvas
  context.translate(camX, camY);

  players.forEach((p) => {
    if (!p.playerData) {
      return;
    }
    context.beginPath();
    context.fillStyle = p.playerData.color;
    context.arc(
      p.playerData.locX,
      p.playerData.locY,
      p.playerData.radius,
      0,
      2 * Math.PI
    );
    // context.arc(200, 200, 10, 0, 2 * Math.PI);
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = "rgb(0,255,0)";
    context.stroke();
  });

  //draw orbs
  orbs.forEach((orb) => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(draw); //controlled loop--runs recursively every frame
};

canvas.addEventListener("mousemove", (event) => {
  const mousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;
  if (angleDeg >= 0 && angleDeg < 90) {
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector ? xVector : 0.1;
  player.yVector = yVector ? yVector : 0.1;
});
