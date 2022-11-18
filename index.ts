const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE,
  FALLING_STONE,
  BOX,
  FALLING_BOX,
  KEY1,
  LOCK1,
  KEY2,
  LOCK2,
}

interface Tile {
  isAir(): boolean;
  isFallingStone(): boolean;
  isStony(): boolean;
  isFallingBox(): boolean;
  isBoxy(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
}

class Air implements Tile {
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }

  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {}

  isAir() {
    return true;
  }
  isFallingStone() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class Flux implements Tile {
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }

  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isFallingStone() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class Unbreakable implements Tile {
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {}

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isFallingStone() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class Player implements Tile {
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {}

  draw(g: CanvasRenderingContext2D, x: number, y: number) {}

  isAir() {
    return false;
  }
  isFallingStone() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

enum FallingState {
  FALLING,
  RESTING,
}

class Stone implements Tile {
  private readonly falling: FallingState;
  constructor(falling: FallingState) {
    this.falling = falling;
  }
  isStony() {
    return true;
  }
  isBoxy() {
    return false;
  }
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {
    if (
      !this.falling &&
      map[playery][playerx + dx + dx].isAir() &&
      !map[playery + 1][playerx + dx].isAir()
    ) {
      map[playery][playerx + dx + dx] = this;
      moveToTile(playerx + dx, playery);
    }
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isFallingStone() {
    return this.falling === FallingState.FALLING;
  }
  isFallingBox() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class Box implements Tile {
  isStony() {
    return false;
  }
  isBoxy() {
    return true;
  }
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {
    if (
      map[playery][playerx + dx + dx].isAir() &&
      !map[playery + 1][playerx + dx].isAir()
    ) {
      map[playery][playerx + dx + dx] = this;
      moveToTile(playerx + dx, playery);
    }
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isFallingStone() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class FallingBox implements Tile {
  isStony() {
    return false;
  }
  isBoxy() {
    return true;
  }
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {}

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isFallingStone() {
    return false;
  }
  isFallingBox() {
    return true;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class Key1 implements Tile {
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  moveVertical(dy: number) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  }

  moveHorizontal(dx: number) {
    removeLock1();
    moveToTile(playerx + dx, playery);
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isFallingStone() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class Key2 implements Tile {
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  moveVertical(dy: number) {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }

  moveHorizontal(dx: number) {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isFallingStone() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class Lock1 implements Tile {
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {}

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isFallingStone() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isLock1() {
    return true;
  }
  isLock2() {
    return false;
  }
}

class Lock2 implements Tile {
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {}

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isFallingStone() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return true;
  }
}

function transformTile(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR:
      return new Air();
    case RawTile.FLUX:
      return new Flux();
    case RawTile.UNBREAKABLE:
      return new Unbreakable();
    case RawTile.PLAYER:
      return new Player();
    case RawTile.STONE:
      return new Stone(FallingState.RESTING);
    case RawTile.FALLING_STONE:
      return new Stone(FallingState.FALLING);
    case RawTile.BOX:
      return new Box();
    case RawTile.FALLING_BOX:
      return new FallingBox();
    case RawTile.KEY1:
      return new Key1();
    case RawTile.LOCK1:
      return new Lock1();
    case RawTile.KEY2:
      return new Key2();
    case RawTile.LOCK2:
      return new Lock2();
    default:
      throw new Error("Unexpected tile type: " + tile);
  }
}

interface Input {
  handleInput(): void;
}

class Right implements Input {
  handleInput() {
    map[playery][playerx + 1].moveHorizontal(1);
  }
}

class Left implements Input {
  handleInput() {
    map[playery][playerx + -1].moveHorizontal(-1);
  }
}

class Up implements Input {
  handleInput() {
    map[playery + -1][playerx].moveVertical(-1);
  }
}

class Down implements Input {
  handleInput() {
    map[playery + 1][playerx].moveVertical(1);
  }
}

let playerx = 1;
let playery = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
let map: Tile[][];

let inputs: Input[] = [];

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air();
      }
    }
  }
}

function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function handleInputs() {
  while (inputs.length > 0) {
    let current = inputs.pop();
    current.handleInput();
  }
}

function updateTile(y: number, x: number) {
  if (map[y][x].isStony() && map[y + 1][x].isAir()) {
    map[y + 1][x] = new Stone(FallingState.FALLING);
    map[y][x] = new Air();
  } else if (map[y][x].isBoxy() && map[y + 1][x].isAir()) {
    map[y + 1][x] = new FallingBox();
    map[y][x] = new Air();
  } else if (map[y][x].isFallingStone()) {
    map[y][x] = new Stone(FallingState.RESTING);
  } else if (map[y][x].isFallingBox()) {
    map[y][x] = new Box();
  }
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(y, x);
    }
  }
}

function update() {
  handleInputs();
  updateMap();
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function createGraphics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");

  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function draw() {
  let g = createGraphics();

  drawMap(g);
  drawPlayer(g);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}

window.onload = () => {
  transformMap();
  gameLoop();
};

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", (e) => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});
