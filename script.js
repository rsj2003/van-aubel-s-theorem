const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const page = {w: window.innerWidth, h: window.innerHeight, x: window.innerWidth / 2, y: window.innerHeight / 2};
const mouse = {x: 0, y: 0, px: 0, py: 0, down: false, select: {id: -1, x: 0, y: 0, dx: 0, dy: 0, dist: 0}};
const dots = [];
const center = [];
const pi = Math.PI;

const moveTo = (ctx, x, y) => {
  ctx.moveTo(page.x + x, page.y + y);
}

const lineTo = (ctx, x, y) => {
  ctx.lineTo(page.x + x, page.y + y);
}

const arc = (ctx, x, y, size, start = 0, end = pi * 2, dist = false) => {
  ctx.arc(page.x + x, page.y + y, size, start, end, dist);
}

const draw = e => {
  ctx.clearRect(0, 0, page.w, page.h);
  const lineCoord = [];

  for(let i = 0; i < dots.length; i++) {
    const item = dots[i];
    let next;
    
    if(i !== dots.length - 1) next = dots[i + 1];
    else next = dots[0];

    let x = item.x - next.x;
    let y = item.y - next.y;
    let length = Math.sqrt((x * x) + (y * y));
    let deg = Math.atan2(y, x);
    let coord = {x: item.x, y: item.y};
    let theta = pi * 2 / dots.length;

    moveTo(ctx, item.x, item.y);

    for(let j = 0; j < dots.length; j++) {
      coord.x = coord.x - (Math.cos(deg) * length);
      coord.y = coord.y - (Math.sin(deg) * length);
      lineTo(ctx, coord.x, coord.y);
      deg -= theta;
    }
    coord.x = coord.x - (Math.cos(deg) * length / 2);
    coord.y = coord.y - (Math.sin(deg) * length / 2);
    deg -= theta;
    coord.x = coord.x - (Math.cos(deg) * length / 2);
    coord.y = coord.y - (Math.sin(deg) * length / 2);

    lineCoord.push({x: coord.x, y: coord.y});

    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#333";
    ctx.stroke();
    ctx.beginPath();
  }
  for(let i = 0; i < dots.length / 2; i++) {
    const start = lineCoord[i];
    const end = lineCoord[i + dots.length / 2];

    let color;
    if(i % 3 === 0) color = "red";
    if(i % 3 === 1) color = "green";
    if(i % 3 === 2) color = "blue";

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    moveTo(ctx, start.x, start.y);
    lineTo(ctx, end.x, end.y);
    ctx.stroke();
    ctx.beginPath();

    const x = start.x - end.x;
    const y = start.y - end.y;
    const dist = Math.sqrt((x * x) + (y * y));

    ctx.font = '20px serif';
    ctx.fillText(dist, 10, 24 * (i + 1));
  }
  for(let i = 0; i < dots.length; i++) {
    const item = dots[i];
    let next;
    
    if(i !== dots.length - 1) next = dots[i + 1];
    else next = dots[0];
    
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#888";
    if(i !== 0) {
      arc(ctx, item.x, item.y, 10);
      ctx.fill();
      ctx.beginPath();
    }
    if(i === dots.length - 1) {
      arc(ctx, next.x, next.y, 10);
      ctx.fill();
      ctx.beginPath();
    }
  }
}

const init = e => {
  page.w = window.innerWidth;
  page.h = window.innerHeight;
  page.x = page.w / 2;
  page.y = page.h / 2;

  canvas.width = page.w;
  canvas.height = page.h;

  dots.push({x: 100, y: 0});
  dots.push({x: 0, y: 100});
  dots.push({x: -100, y: 0});
  dots.push({x: 0, y: -100});

  draw();
}

canvas.addEventListener("mousedown", e => {
  mouse.px = e.offsetX - page.x;
  mouse.py = e.offsetY - page.y;
  mouse.down = true;

  for(let i = 0; i < dots.length; i++) {
    const item = dots[i];
    let x = mouse.px - item.x;
    let y = mouse.py - item.y;
    let dist = Math.sqrt((x * x) + (y * y));
    
    if(dist <= 10) {
      if(mouse.select.id === -1) {
        mouse.select.id = i;
        mouse.select.x = item.x;
        mouse.select.y = item.y;
        mouse.select.dx = x;
        mouse.select.dy = y;
        mouse.select.dist = dist;
      }else if(mouse.select.dist > dist) {
        mouse.select.id = i;
        mouse.select.x = item.x;
        mouse.select.y = item.y;
        mouse.select.dx = x;
        mouse.select.dy = y;
        mouse.select.dist = dist;
      }
    }
  }
})

document.addEventListener("mousemove", e => {
  if(e.target === canvas) {
    mouse.x = e.offsetX - page.x;
    mouse.y = e.offsetY - page.y;
  }
  if(mouse.down && mouse.select.id !== -1) {
    const item = dots[mouse.select.id];

    item.x = mouse.select.x + mouse.x - mouse.px - mouse.select.dx;
    item.y = mouse.select.y + mouse.y - mouse.py - mouse.select.dy;

    draw();
  }
})

document.addEventListener("mouseup", e => {
  mouse.down = false;
  mouse.select.id = -1;
})

init();