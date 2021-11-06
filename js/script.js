window.addEventListener('DOMContentLoaded', () => {

    const cells = Array.from(document.querySelectorAll('.cell'));
    const gameStatus = document.querySelector(".status");
    const reset = document.querySelector("#reset");
    const currentLevel = document.querySelector(".level");
    const keyToFinish = document.querySelector(".kvami");

    const tableSize = cells.length;
    const tableRow = Math.sqrt(tableSize);

    const warning = "#ff3860";
    const complete = "#3bff9d";
    const neutral = "white";

    let isGameActive = true;
    let userLevel = 1;
    let enemies = [];

    class GameObject {

        constructor(character) {
            this.position = null;
            this.cell = null;
            this.character = character;
        }

        renderObject() {
            this.cell.classList.add(`${this.character}`);
        }

    }

    class Kvami extends GameObject {

        constructor(character) {
            super(character);
            this.value = this.generatePosition();
            this.position = this.value;
            this.cell = cells[this.value];
        }

        generatePosition() {
            return Math.floor(Math.random() * (tableSize - 2)) + 1;
        }
    }

    class Enemy extends GameObject{

        constructor(character) {
            super (character);
        }


        generateDirection() {
            let direction = Math.floor(Math.random() * 4);
            switch (direction) {
                case 0:
                    direction = -1;
                    break;
                case 1:
                    direction = 1;
                    break;
                case 2:
                    direction = tableRow;
                    break;
                case 3:
                    direction = -tableRow;
                    break;
            }
            this.setEnemyAction(direction);
        }

        attack(character) {
            if (this.cell.classList.contains(`${character}`)) {
                gameStatus.innerHTML = "Defeat";
                gameStatus.style.color = warning;
                return true;
            }
        }

        enemyAction(direction) {
            this.cell.classList.remove(`${this.character}`);
            this.cell = cells[this.position + direction];
            this.position += direction;
            this.cell.classList.add(`${this.character}`);
        }

        setEnemyAction(direction) {
            if (
                this.position + direction > tableSize - 1 ||
                this.position + direction < 0 ||
                cells[this.position + direction].classList.contains(
                    `${this.character}`
                ) ||
                this.position + direction < 0 ||
                cells[this.position + direction].classList.contains(
                    `${Tikki.character}`
                ) ||
                (direction === 1 && [5, 11, 17, 23, 29, 35].includes(this.position)) ||
                (direction === -1 && [0, 6, 12, 18, 24, 30].includes(this.position))
            ) {
                this.generateDirection();
            } else {
                this.enemyAction(direction);
            }
        }

        createEnemy() {
            let position = Math.floor(Math.random() * (tableSize - 2)) + 1;
            if (Tikki.position === position || [1, 6, 7].includes(position)) {
                return false;
            } else {
                if ( enemies.length > 0 ) {
                    for (let akuma of enemies) {
                        if (akuma.position === position) {
                            return false;
                        } else {
                            this.determinePosition(position);
                            this.renderObject();
                        }
                    }
                }  else {
                    this.determinePosition(position);
                    this.renderObject();
                }
            }
        }

        determinePosition(index) {
            this.position = index;
            this.cell = cells[index];
        }
    }


    class Player extends GameObject{
        constructor(position, cell, character, kvami) {
            super();
            this.position = position;
            this.cell = cell;
            this.character = character;
            this.kvami = kvami;
        }

        userAction(cell, index) {
            gameStatus.innerHTML = "Game Active";
            gameStatus.style.color = neutral;
            this.cell.classList.remove(`${this.character}`);
            this.cell = cell;
            this.position = index;
            this.cell.classList.add(`${this.character}`);
            const suicide = this.checkSuicide();
            if (suicide) {
                isGameActive = false;
                userLevel = 1;
                return;
            }
            this.checkKvami();
            this.checkFinish();
            this.checkEnemy();
        }

        setActionFromMouse(cell, index) {
            if (
                Math.abs(this.position - index) === Math.sqrt(tableSize) ||
                Math.abs(this.position - index) === 1
            ) {
                this.userAction(cell, index);
            } else {
                gameStatus.innerHTML = "You can't do it!";
                gameStatus.style.color = warning;
            }
        }

        setActionFromKey(event) {
            if (
                event.code === "ArrowRight" &&
                ![5, 11, 17, 23, 29, 35].includes(this.position)
            ) {
                this.userAction(cells[this.position + 1], this.position + 1);
            } else if (
                event.code === "ArrowLeft" &&
                ![0, 6, 12, 18, 24, 30].includes(this.position)
            ) {
                this.userAction(cells[this.position - 1], this.position - 1);
            } else if (
                event.code === "ArrowDown" &&
                ![30, 31, 32, 33, 34, 35].includes(this.position)
            ) {
                this.userAction(
                    cells[this.position + Math.sqrt(tableSize)],
                    this.position + Math.sqrt(tableSize)
                );
            } else if (
                event.code === "ArrowUp" &&
                ![0, 1, 2, 3, 4, 5].includes(this.position)
            ) {
                this.userAction(
                    cells[this.position - Math.sqrt(tableSize)],
                    this.position - Math.sqrt(tableSize)
                );
            } else {
                gameStatus.innerHTML = "You can't do it!";
                gameStatus.style.color = warning;
            }
        }

        checkFinish() {
            if (this.position === tableSize - 1 && this.kvami === true) {
                userLevel += 1;
                resetGame();
            }
        }

        checkKvami() {
            if (this.cell.classList.contains("Tikki")) {
                this.cell.classList.remove("Tikki");
                this.kvami = true;
                keyToFinish.innerText = "Kvami: yes";
                this.cell.classList.remove(`${this.character}`);
                this.character = "amulet";
                this.cell.classList.add(`${this.character}`);
            }
        }

        checkEnemy() {
            for (let enemy of enemies) {
                enemy.generateDirection();
                let checkDie = enemy.attack(`${this.character}`);
                if (checkDie) {
                    isGameActive = false;
                    userLevel = 1;
                }
            }
        }

        checkSuicide() {
            if (this.cell.classList.contains("Akuma")) {
                gameStatus.innerHTML = "Defeat";
                gameStatus.style.color = warning;
                return true;
            }
        }
    }


    let Tikki = new Kvami("Tikki");
    Tikki.renderObject();

    function createEnemy() {
        for (let i = 0; i < userLevel; i++) {
            if ( i>=5 ) {
                break
            }
            let enemy = new Enemy("Akuma")
            if ( enemy.createEnemy() === false ) {
                i--;
                continue;
            }
            enemies.push(enemy);
        }
        console.log(enemies);
    }

    createEnemy();


    let LadyBug = new Player(0, cells[0], "LadyBug", false);

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            if (isGameActive) {
                LadyBug.setActionFromMouse(cell, index);
            }
        });
    });

    window.addEventListener("keydown", (e) => {
        if (isGameActive) {
            LadyBug.setActionFromKey(e);
        }
    });

    reset.addEventListener("click", () => {
        userLevel = 1;
        resetGame();
        gameStatus.innerHTML = "Game Active";
        gameStatus.style.color = neutral;
    });

    function resetGame() {
        cells.forEach((cell) => {
            cell.classList.remove("LadyBug");
            cell.classList.remove("amulet");
            cell.classList.remove("Akuma");
            cell.classList.remove("Tikki");
        });
        isGameActive = true;
        gameStatus.innerHTML = "Level Complete!";
        gameStatus.style.color = complete;
        Tikki = new Kvami("Tikki");
        Tikki.renderObject();
        currentLevel.innerText = `Level: ${userLevel}`;
        LadyBug = new Player(0, cells[0], "LadyBug", false);
        keyToFinish.innerText = "Kvami: no";
        LadyBug.renderObject();
        enemies = [];
        createEnemy();
    }
});