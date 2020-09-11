const SETTING = {
    start: false,
    score: 0,
    speed: 0,
    traffic: 0,
    level: 0
};

let level = SETTING.level;

const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.game-area'),
    car = document.createElement('div'),
    topScore = document.querySelector('#top-score');

/*const audio = document.createElement('embed'); // для добавления видео, аудио, флеша, ...

audio.src = 'audio.mp3';
audio.type = 'audio/mp3';
audio.style.cssText =  `position:absolute;top:-1000px;`;*/

const audio = document.createElement('audio');
const crach = new Audio('');
audio.autobuffer = true;
audio.src = 'audio.mp3';
audio.loop = true;
const countSection = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM);

gameArea.style.height = countSection * HEIGHT_ELEM;

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const result = parseInt(localStorage.getItem('nfjs_score', SETTING.score));

topScore.textContent = result ? result : 0;
    
const addLocalStorage = () => {
    if (result < SETTING.score) {
        localStorage.setItem('nfjs_score', SETTING.score);
        topScore.textContent = SETTING.score;
    }
};

function getQuantityElements(heightElement) {
    return (gameArea.offsetHeight / heightElement + 1);
};

function startGame(event) {
    const target = event.target;
    if (target === start) {return};

    switch (target.id) {
        case 'easy':
            SETTING.speed = 3;
            SETTING.traffic = 4;
            break;
        case 'medium':
            SETTING.speed = 5;        
            SETTING.traffic = 3;
            break;
        case 'hard':
            SETTING.speed = 8;
            SETTING.traffic = 2;
            break;
    }

    audio.play();
    start.classList.add('hide');
    gameArea.innerHTML = '';

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * HEIGHT_ELEM) + 'px';
        line.style.height = HEIGHT_ELEM /2 + 'px';
        line.y = i * HEIGHT_ELEM;
        gameArea.append(line);
    }
    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * SETTING.traffic); i++) {
        const enemy = document.createElement('div');
        const randonEnemy = Math.floor(Math.random() * MAX_ENEMY);
        enemy.classList.add('enemy');
        enemy.style.height = HEIGHT_ELEM + 'px';
        enemy.style.width = HEIGHT_ELEM / 2 + 'px';
        const periodEnemy = -HEIGHT_ELEM * SETTING.traffic * (i + 1);
        enemy.y = periodEnemy < 100 ? -100 * SETTING.traffic * (i + 1) : periodEnemy;
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url('./image/enemy${randonEnemy}.png') center / cover no-repeat`;
        gameArea.append(enemy);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
    }

    SETTING.score = 0;
    SETTING.start = true;
    gameArea.append(car);
    car.style.left = Math.floor((gameArea.offsetWidth - car.offsetWidth) / 2);
    car.style.top = 'auto';
    car.style.bottom = '10px';
    //document.body.append(audio); // embed требует добавления на страницу */
    SETTING.x = car.offsetLeft;
    SETTING.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    
    if (SETTING.start) {
        SETTING.level = Math.floor(SETTING.score / 1000);
    
        if (SETTING.level !== level) {
            level = SETTING.level;
            SETTING.speed += 1;
        }
        SETTING.score += SETTING.speed;
        score.innerHTML = 'SCORE<br>' + SETTING.score;
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
        if (line.y >= gameArea.offsetHeight) {
            line.y = -HEIGHT_ELEM;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    const randonEnemy = Math.floor(Math.random() * MAX_ENEMY);
    enemy.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left + 5 <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            SETTING.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
            addLocalStorage();
            audio.pause();
            /*crash.play();*/
        }
        item.y += SETTING.speed / 2;
        item.style.top = item.y + 'px';
        
        if (item.y >= gameArea.offsetHeight) {
            item.y = -HEIGHT_ELEM * SETTING.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px';
            item.style.background = `transparent url('./image/enemy${randonEnemy}.png') center / cover no-repeat`;
            
        }

    });

}

car.classList.add('car');
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);