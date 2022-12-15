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
  isLock1(): boolean;
  isLock2(): boolean;
  isFalling(): boolean;
  canFall(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
  drop(): void;
  rest(): void;
  update(y: number, x: number): void;
}

class Air implements Tile {
  update(y: number, x: number) {
    if (map[y][x].canFall() && map[y + 1][x].isAir()) {
      map[y][x].drop();
      map[y + 1][x] = map[y][x];
      map[y][x] = new Air();
    } else if (map[y][x].isFalling()) {
      map[y][x].rest();
    }
  }

  canFall() {
    return false;
  }
  isFalling() {
    return false;
  }
  drop() {}
  rest() {}
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
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class Flux implements Tile {
  update(y: number, x: number) {
    if (map[y][x].canFall() && map[y + 1][x].isAir()) {
      map[y][x].drop();
      map[y + 1][x] = map[y][x];
      map[y][x] = new Air();
    } else if (map[y][x].isFalling()) {
      map[y][x].rest();
    }
  }

  canFall() {
    return false;
  }
  isFalling() {
    return false;
  }
  drop() {}
  rest() {}
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
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class Unbreakable implements Tile {
  update(y: number, x: number) {
    if (map[y][x].canFall() && map[y + 1][x].isAir()) {
      map[y][x].drop();
      map[y + 1][x] = map[y][x];
      map[y][x] = new Air();
    } else if (map[y][x].isFalling()) {
      map[y][x].rest();
    }
  }

  canFall() {
    return false;
  }
  isFalling() {
    return false;
  }
  drop() {}
  rest() {}
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {}

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
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
  update(y: number, x: number) {
    if (map[y][x].canFall() && map[y + 1][x].isAir()) {
      map[y][x].drop();
      map[y + 1][x] = map[y][x];
      map[y][x] = new Air();
    } else if (map[y][x].isFalling()) {
      map[y][x].rest();
    }
  }

  canFall() {
    return false;
  }
  isFalling() {
    return false;
  }
  drop() {}
  rest() {}
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {}

  draw(g: CanvasRenderingContext2D, x: number, y: number) {}

  isAir() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(tile: Tile, dx: number): void;
}

class Falling implements FallingState {
  isFalling() {
    return true;
  }
  moveHorizontal(tile: Tile, dx: number) {}
}

class Resting implements FallingState {
  isFalling() {
    return false;
  }
  moveHorizontal(tile: Tile, dx: number) {
    if (
      map[playery][playerx + dx + dx].isAir() &&
      !map[playery + 1][playerx + dx].isAir()
    ) {
      map[playery][playerx + dx + dx] = tile;
      moveToTile(playerx + dx, playery);
    }
  }
}

class FallStrategy {
  constructor(private falling: FallingState) {
    this.falling = falling;
  }
  getFalling() { return this.falling; }
  update(tile: Tile, y: number, x: number) {
    this.falling = map[y+1][x].isAir() ? new Falling() : new Resting();
    this.drop(tile, y, x);
  }

  private drop(tile: Tile, y: number, x: number) {
    if (this.falling.isFalling()) {
      map[y + 1][x] = tile;
      map[y][x] = new Air();
    }
  }
}

class Stone implements Tile {
  private falling: FallingState;
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.falling = falling;
    this.fallStrategy = new FallStrategy(falling);
  }
  update(y: number, x: number) {
    this.fallStrategy.update(this, y, x);
  }

  canFall() {
    return true;
  }
  isFalling() {
    return this.falling.isFalling();
  }
  drop() {
    this.falling = new Falling();
  }
  rest() {
    this.falling = new Resting();
  }
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {
    this.fallStrategy.getFalling().moveHorizontal(this, dx);
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
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
  private falling: FallingState;
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.falling = falling;
    this.fallStrategy = new FallStrategy(falling);
  }
  update(y: number, x: number) {
    this.fallStrategy.update(this, y, x);
  }

  canFall() {
    return true;
  }
  isFalling() {
    return this.falling.isFalling();
  }
  drop() {
    this.falling = new Falling();
  }
  rest() {
    this.falling = new Resting();
  }
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {
    this.fallStrategy.getFalling().moveHorizontal(this, dx);
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class Key implements Tile {
  constructor(private color: string, private removeStrategy: RemoveStrategy) {
    this.color = color;
    this.removeStrategy = removeStrategy;
  }
  update(y: number, x: number) {
    if (map[y][x].canFall() && map[y + 1][x].isAir()) {
      map[y][x].drop();
      map[y + 1][x] = map[y][x];
      map[y][x] = new Air();
    } else if (map[y][x].isFalling()) {
      map[y][x].rest();
    }
  }

  canFall() {
    return false;
  }
  isFalling() {
    return false;
  }
  drop() {}
  rest() {}
  moveVertical(dy: number) {
    remove(this.removeStrategy);
    moveToTile(playerx, playery + dy);
  }

  moveHorizontal(dx: number) {
    remove(new RemoveLock1());
    moveToTile(playerx + dx, playery);
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.color;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
}

class MyLock implements Tile {
  constructor(private color: string, private lock1: boolean) {
    this.color = color;
    this.lock1 = lock1;
  }
  update(y: number, x: number) {
    if (map[y][x].canFall() && map[y + 1][x].isAir()) {
      map[y][x].drop();
      map[y + 1][x] = map[y][x];
      map[y][x] = new Air();
    } else if (map[y][x].isFalling()) {
      map[y][x].rest();
    }
  }

  canFall() {
    return false;
  }
  isFalling() {
    return false;
  }
  drop() {}
  rest() {}
  moveVertical(dy: number) {}

  moveHorizontal(dx: number) {}

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.color;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isAir() {
    return false;
  }
  isLock1() {
    return this.lock1;
  }
  isLock2() {
    return !this.lock1;
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
      return new Stone(new Resting());
    case RawTile.FALLING_STONE:
      return new Stone(new Falling());
    case RawTile.BOX:
      return new Box(new Resting());
    case RawTile.FALLING_BOX:
      return new Box(new Falling());
    case RawTile.KEY1:
      return new Key("#ffcc00", new RemoveLock1());
    case RawTile.LOCK1:
      return new MyLock("#ffcc00", true);
    case RawTile.KEY2:
      return new Key("#00ccff", new RemoveLock2());
    case RawTile.LOCK2:
      return new MyLock("#00ccff", false);
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

function remove(shouldRemove: RemoveStrategy) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (shouldRemove.check(map[y][x])) {
        map[y][x] = new Air();
      }
    }
  }
}

interface RemoveStrategy {
  check(tile: Tile): boolean;
}

class RemoveLock1 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock1();
  }
}

class RemoveLock2 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock2();
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

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].update(y, x);
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
