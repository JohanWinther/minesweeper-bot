var Bot = function() {

    this.board = new Array(game.rows);
    for (var y = 0; y < this.board.length; y++) {
        this.board[y] = Array(game.cols).fill(-1);
    }
}

Bot.prototype.printBoard = function() {
    console.clear();
    let textLine = "";
    for (let y = 0; y < game.rows; y++) {
        for (let x = 0; x < game.cols; x++) {
            let label = Bot.prototype.getBoardElement(x, y).getAttribute('aria-label');
            if (label === "Field") {
                textLine += "■ ";
            } else if (label === "Empty field") {
                textLine += "▫ ";
            } else if (label === "Flagged as potential bomb") {
                textLine += "* "
            } else {
                textLine += parseInt(label) + " ";
            }
        }
        textLine += '\n';
    }
    console.log(textLine);
}

Bot.prototype.updateBoard = function() {
    for (let y = 0; y < game.rows; y++) {
        for (let x = 0; x < game.cols; x++) {
            let label = Bot.prototype.getBoardElement(x, y).getAttribute('aria-label');
            if (label === "Field") {
                this.board[y][x] = -1;
            } else if (label === "Empty field") {
                this.board[y][x] = 0;
                //} else if (label === "Flagged as potential bomb") {
                //    this.board[y][x] = -2;
            } else {
                this.board[y][x] = parseInt(label);
            }
        }
    }
}

Bot.prototype.toggleLocation = function(x, y, action) {
    if (action === 'flag') {
        let element = this.getBoardElement(x, y);
        let e = element.ownerDocument.createEvent('MouseEvents');
        e.initMouseEvent('contextmenu', true, true,
        element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
        false, false, false,2, null);
        !element.dispatchEvent(e);
        this.board[y][x] = -2;
    } else if (action === 'clear') {
        this.getBoardElement(x, y).click();
        this.updateBoard();
    }
    this.printBoard();
}

Bot.prototype.getBoardElement = function(x, y) {
    if ( (0 <= x && x < game.cols) && (0 <= y && y < game.rows) ) {
        return document.querySelector(`.cell.x${x+1}.y${y+1}`);
    } else {
        throw new Error(`Coordinates out of bounds (${game.cols}×${game.rows}).`);
    }
}

Bot.prototype.solve = function() {

    var getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

    // Start in random place
    this.toggleLocation(getRandomInt(game.cols), getRandomInt(game.rows), 'clear');
    var bombsLeft = game.number_of_bombs - Array.prototype.filter.call(document.getElementsByClassName('cell'), function (target) { return target.isFlagged }).length
    
    while (bombsLeft > 0) {
        for (let y = 0; y < game.rows; y++) {
            for (let x = 0; x < game.cols; x++) {
                let el = this.getBoardElement(x, y);
                if (el.isMasked || el.isFlagged || el.mine_count === 0) {
                    continue;
                } else {
                    this.toggleLocation(x, y, 'clear');
                }
            }
        }
        bombsLeft = game.number_of_bombs - Array.prototype.filter.call(document.getElementsByClassName('cell'), function (target) { return target.isFlagged }).length
    }
}

bot = new Bot();

bot.solve();