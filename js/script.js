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

    class gameObject {
        constructor(position, cell, character) {
            this.position = position;
            this.cell = cell;
            this.character = character;
        }

        renderObject() {
            this.cell.classList.add(`${this.character}`);
        }
    }

    class Enemy extends gameObject{

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
    }


    class Player extends gameObject {
        constructor(position, cell, character, kvami) {
            super(position, cell, character);
            this.kvami = kvami;
        }

        userAction(cell, index) {
            gameStatus.innerHTML = "Game Active";
            gameStatus.style.color = neutral;
            this.cell.classList.remove(`${this.character}`);
            this.cell = cell;
            this.position = index;
            this.cell.classList.add(`${this.character}`);
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

        }

        checkKvami() {

        }

        checkEnemy() {
            for (let enemy of enemies) {
                enemy.generateDirection();
            }
        }
    }

    let positionKvami = Math.floor(Math.random() * (tableSize - 2)) + 1;
    let Tikki = new gameObject(positionKvami, cells[positionKvami], "Tikki");
    Tikki.renderObject();

    let enemies = [];
    function createEnemy() {
        checkPosition: for (let i = 0; i < 5; i++) {
            let position = Math.floor(Math.random() * (tableSize - 2)) + 1;
            if (positionKvami === position || [1, 6, 7].includes(position)) {
                i--;
                continue checkPosition;
            }
            for (let akuma of enemies) {
                if (akuma.position === position) {
                    i--;
                    continue checkPosition;
                }
            }
            enemies.push(new Enemy(position, cells[position], "Akuma"));
            enemies[i].renderObject();
        }
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


    function resetGame() {
    }
});