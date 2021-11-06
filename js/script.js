window.addEventListener('DOMContentLoaded', () => {
    class Kvami {
        constructor(position, cell, character) {
            this.position = position;
            this.cell = cell;
            this.character = character;
        }

        renderKvami() {

        }
    }

    class Enemy {
        constructor(position, cell, character) {
            this.position = position;
            this.cell = cell;
            this.character = character;
        }

        renderEnemy() {

        }

        enemyAction() {

        }

        setEnemyAction() {

        }
    }


    class Player {
        constructor(position, cell, character, kvami) {
            this.position = position;
            this.cell = cell;
            this.character = character;
            this.kvami = kvami;
        }

        renderPlayer() {

        }

        userAction() {

        }

        setActionFromMouse() {

        }

        setActionFromKey() {

        }

        checkFinish() {

        }

        checkKvami() {

        }

        checkEnemy() {

        }
    }


    function resetGame() {
    }
});