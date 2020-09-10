const SETTING = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

const MAX_ENEMY = 7;

const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.game-area'),
    car = document.createElement('div');

/*const audio = document.createElement('embed'); // для добавления видео, аудио, флеша, ...

audio.src = 'audio.mp3';
audio.type = 'audio/mp3';
audio.style.cssText =  `position:absolute;top:-1000px;`;*/

const audio = document.createElement('audio');
audio.src = 'audio.mp3';
audio.loop = true;


const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
    audio.play();
    start.classList.add('hide');
    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.append(line);
    }
    for (let i = 0; i < getQuantityElements(100 * SETTING.traffic); i++) {
        const enemy = document.createElement('div');
        const randonEnemy = Math.floor(Math.random() * MAX_ENEMY);
        enemy.classList.add('enemy');
        enemy.y = -100 * SETTING.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url('./image/enemy${randonEnemy}.png') center / cover no-repeat`;
        gameArea.append(enemy);
    }


    SETTING.start = true;
    gameArea.append(car);
    //document.body.append(audio); // embed требует добавления на страницу */
    SETTING.x = car.offsetLeft;
    SETTING.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    if (SETTING.start) {
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && SETTING.x > 0) {
            SETTING.x -= SETTING.speed;
        }
        if (keys.ArrowRight && SETTING.x < (gameArea.offsetWidth - car.offsetWidth)) {
            SETTING.x += SETTING.speed;
        }
        if (keys.ArrowDown && SETTING.y < (gameArea.offsetHeight - car.offsetHeight)) {
            SETTING.y += SETTING.speed;
        }
        if (keys.ArrowUp && SETTING.y > 0) {
            SETTING.y -= SETTING.speed;
        }
        car.style.left = SETTING.x + 'px';
        car.style.top = SETTING.y + 'px';
        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = true;
    }
}

function stopRun(event) {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = false;
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        line.y += SETTING.speed;
        line.style.top = line.y + 'px';
        if (line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    const randonEnemy = Math.floor(Math.random() * MAX_ENEMY);
    enemy.forEach(function (item) {
        item.y += SETTING.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100 * SETTING.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            item.style.background = `transparent url('./image/enemy${randonEnemy}.png') center / cover no-repeat`;
        }
    });

}

car.classList.add('car');
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);