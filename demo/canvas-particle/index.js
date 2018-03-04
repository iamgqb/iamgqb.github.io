const PI = Math.PI;
const PARTICLE_NUM = 20; // 粒子数
const DISTANCE_THRESHOLD = 100; // 网线间距
const SPEED = 1; // 最大运动速度

function random(range) {
  return range ? Math.random() * range : Math.random();
}

function randomDir() {
  return random() - 0.5 > 0 ? 1 : -1;
}

(function() {
  let canvas = document.getElementById('particle'),
    ctx = canvas.getContext('2d');

  let cWidth = canvas.width = document.documentElement.clientWidth,
    cHeight = canvas.height = document.documentElement.clientHeight;

  // 画布染色
  let fillCanvas = () => {
    ctx.clearRect(0, 0, cWidth, cHeight);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cWidth, cHeight);
  }

  // 粒子绘画
  let drawParticle = (particles) => {
    ctx.fillStyle = "#fff";
    particles.forEach((item) => {
      ctx.beginPath();
      item = calcParticle(item);
      ctx.arc(item.centerX, item.centerY, 2, 0, 2 * PI);
      ctx.fill();
    })
  }

  // 粒子位置更新
  let calcParticle = (particle) => {
    particle.centerX += particle.speedX;
    particle.centerY += particle.speedY;
    if (particle.centerX < 0 || particle.centerX > cWidth) {
      particle.speedX *= -1;
    }
    if (particle.centerY < 0 || particle.centerY > cHeight) {
      particle.speedY *= -1;
    }
    return particle;
  }

  // 连线绘制
  let drawWire = (particles) => {
    // 计算
    let len = particles.length;
    for (let i = 0; i < len; i++) {
      let particleI = particles[i];
      for (let j = i + 1; j < len; j++) {
        let particleJ = particles[j];

        var distance = Math.sqrt((particleI.centerX - particleJ.centerX) * (particleI.centerX - particleJ.centerX) + (particleI.centerY - particleJ.centerY) * (particleI.centerY - particleJ.centerY));

        if (distance > DISTANCE_THRESHOLD) {
          continue;
        } else {
          // 绘制
          ctx.strokeStyle = 'rgba(255,255,255,' + (1 - distance / DISTANCE_THRESHOLD) + ')';
          ctx.beginPath();
          ctx.moveTo(particleI.centerX, particleI.centerY);
          ctx.lineTo(particleJ.centerX, particleJ.centerY);
          ctx.stroke();
        }
      }
    }
  }

  let draw = () => {
    fillCanvas();
    drawParticle(particleArr);
    drawWire(particleArr);
    window.requestAnimationFrame(draw);
  }

  let particleArr = [];
  for (let i = 0; i < PARTICLE_NUM; i++) {
    particleArr.push({
      centerX: random(cWidth),
      centerY: random(cHeight),
      speedX: random(SPEED) * randomDir(),
      speedY: random(SPEED) * randomDir()
    });
  }

  draw();
})();
