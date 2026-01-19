class FusionChess {
    constructor() {
        this.board = [];
        this.pieces = [];
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.validMoves = [];
        this.stepCount = 0;
        this.maxSteps = 50;
        this.hasCheckOccurred = false;
        this.scores = { red: 0, black: 0 };
        this.capturedPieces = { red: [], black: [] };
        this.moveHistory = [];
        this.gameOver = false;

        this.pieceValues = {
            'pawn': 1,
            'advisor': 2,
            'cannon': 2,
            'elephant': 3,
            'bishop': 3,
            'knight': 3,
            'rook': 4,
            'queen': 5,
            'king': 0,
            'general': 0
        };

        this.pieceSymbols = {
            'red': {
                'king': '王',
                'queen': '后',
                'rook': '车',
                'rook_chinese': '车',
                'bishop': '象',
                'bishop_chinese': '相',
                'knight': '马',
                'knight_chinese': '马',
                'pawn': '兵',
                'general': '帅',
                'advisor': '仕',
                'elephant': '相',
                'cannon': '炮'
            },
            'black': {
                'king': '王',
                'queen': '后',
                'rook': '车',
                'rook_chinese': '车',
                'bishop': '象',
                'bishop_chinese': '象',
                'knight': '马',
                'knight_chinese': '马',
                'pawn': '卒',
                'general': '将',
                'advisor': '士',
                'elephant': '象',
                'cannon': '炮'
            }
        };

        this.init();
    }

    init() {
        this.setupBoard();
        this.setupPieces();
        this.drawBoard();
        this.renderPieces();
        this.setupEventListeners();
        this.updateUI();
    }

    setupBoard() {
        this.board = Array(10).fill(null).map(() => Array(9).fill(null));
    }

    setupPieces() {
        this.pieces = [];

        const redPieces = [
            { type: 'rook_chinese', row: 9, col: 0, color: 'red' },
            { type: 'knight_chinese', row: 9, col: 1, color: 'red' },
            { type: 'elephant', row: 9, col: 2, color: 'red' },
            { type: 'advisor', row: 9, col: 3, color: 'red' },
            { type: 'general', row: 9, col: 4, color: 'red' },
            { type: 'queen', row: 9, col: 5, color: 'red' },
            { type: 'bishop', row: 9, col: 6, color: 'red' },
            { type: 'knight', row: 9, col: 7, color: 'red' },
            { type: 'rook', row: 9, col: 8, color: 'red' },
            { type: 'pawn', row: 8, col: 0, color: 'red' },
            { type: 'pawn', row: 8, col: 2, color: 'red' },
            { type: 'pawn', row: 8, col: 4, color: 'red' },
            { type: 'pawn', row: 8, col: 6, color: 'red' },
            { type: 'pawn', row: 8, col: 8, color: 'red' },
            { type: 'cannon', row: 6, col: 1, color: 'red' },
            { type: 'cannon', row: 6, col: 7, color: 'red' }
        ];

        const blackPieces = [
            { type: 'rook_chinese', row: 0, col: 0, color: 'black' },
            { type: 'knight_chinese', row: 0, col: 1, color: 'black' },
            { type: 'elephant', row: 0, col: 2, color: 'black' },
            { type: 'advisor', row: 0, col: 3, color: 'black' },
            { type: 'general', row: 0, col: 4, color: 'black' },
            { type: 'queen', row: 0, col: 5, color: 'black' },
            { type: 'bishop', row: 0, col: 6, color: 'black' },
            { type: 'knight', row: 0, col: 7, color: 'black' },
            { type: 'rook', row: 0, col: 8, color: 'black' },
            { type: 'pawn', row: 1, col: 0, color: 'black' },
            { type: 'pawn', row: 1, col: 2, color: 'black' },
            { type: 'pawn', row: 1, col: 4, color: 'black' },
            { type: 'pawn', row: 1, col: 6, color: 'black' },
            { type: 'pawn', row: 1, col: 8, color: 'black' },
            { type: 'cannon', row: 3, col: 1, color: 'black' },
            { type: 'cannon', row: 3, col: 7, color: 'black' }
        ];

        [...redPieces, ...blackPieces].forEach((piece, index) => {
            piece.id = index;
            this.pieces.push(piece);
            this.board[piece.row][piece.col] = piece;
        });
    }

    drawBoard() {
        const canvas = document.getElementById('chessboard');
        const ctx = canvas.getContext('2d');
        const cellWidth = canvas.width / 9;
        const cellHeight = canvas.height / 10;

        ctx.fillStyle = '#f5deb3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;

        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(cellWidth / 2, cellHeight / 2 + i * cellHeight);
            ctx.lineTo(canvas.width - cellWidth / 2, cellHeight / 2 + i * cellHeight);
            ctx.stroke();
        }

        for (let i = 0; i < 9; i++) {
            ctx.beginPath();
            ctx.moveTo(cellWidth / 2 + i * cellWidth, cellHeight / 2);
            ctx.lineTo(cellWidth / 2 + i * cellWidth, canvas.height - cellHeight / 2);
            ctx.stroke();
        }

        ctx.font = '16px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('楚河', canvas.width / 4, canvas.height / 2 + 5);
        ctx.fillText('汉界', (canvas.width * 3) / 4, canvas.height / 2 + 5);

        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(cellWidth / 2 + 3 * cellWidth, cellHeight / 2, 3 * cellWidth, 3 * cellHeight);
        ctx.strokeRect(cellWidth / 2 + 3 * cellWidth, cellHeight / 2 + 7 * cellHeight, 3 * cellWidth, 3 * cellHeight);

        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cellWidth / 2 + 3 * cellWidth, cellHeight / 2);
        ctx.lineTo(cellWidth / 2 + 5 * cellWidth, cellHeight / 2 + 2 * cellHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cellWidth / 2 + 5 * cellWidth, cellHeight / 2);
        ctx.lineTo(cellWidth / 2 + 3 * cellWidth, cellHeight / 2 + 2 * cellHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cellWidth / 2 + 3 * cellWidth, cellHeight / 2 + 7 * cellHeight);
        ctx.lineTo(cellWidth / 2 + 5 * cellWidth, cellHeight / 2 + 9 * cellHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cellWidth / 2 + 5 * cellWidth, cellHeight / 2 + 7 * cellHeight);
        ctx.lineTo(cellWidth / 2 + 3 * cellWidth, cellHeight / 2 + 9 * cellHeight);
        ctx.stroke();
    }

    renderPieces() {
        const container = document.getElementById('pieces-container');
        container.innerHTML = '';

        this.pieces.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.className = `piece ${piece.color}`;
            pieceElement.dataset.id = piece.id;
            
            let symbol = this.pieceSymbols[piece.color][piece.type];
            let ruleType = '';
            
            if (piece.type.includes('chinese')) {
                ruleType = '中';
            } else if (['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'].includes(piece.type)) {
                ruleType = '国';
            }
            
            pieceElement.innerHTML = `
                <span class="piece-symbol">${symbol}</span>
                ${ruleType ? `<span class="rule-type">${ruleType}</span>` : ''}
            `;

            const cellWidth = 450 / 9;
            const cellHeight = 500 / 10;
            pieceElement.style.left = `${piece.col * cellWidth + cellWidth / 2 - 22.5}px`;
            pieceElement.style.top = `${piece.row * cellHeight + cellHeight / 2 - 22.5}px`;

            if (this.selectedPiece && this.selectedPiece.id === piece.id) {
                pieceElement.classList.add('selected');
            }

            pieceElement.addEventListener('click', (e) => this.handlePieceClick(e, piece));
            container.appendChild(pieceElement);
        });

        this.renderValidMoves();
    }

    renderValidMoves() {
        const container = document.getElementById('pieces-container');
        const existingMoves = container.querySelectorAll('.valid-move');
        existingMoves.forEach(move => move.remove());

        this.validMoves.forEach(move => {
            const moveElement = document.createElement('div');
            moveElement.className = 'valid-move';

            const cellWidth = 450 / 9;
            const cellHeight = 500 / 10;
            moveElement.style.left = `${move.col * cellWidth + cellWidth / 2 - 10}px`;
            moveElement.style.top = `${move.row * cellHeight + cellHeight / 2 - 10}px`;

            if (this.board[move.row][move.col]) {
                moveElement.classList.add('capture-move');
                moveElement.style.left = `${move.col * cellWidth + cellWidth / 2 - 22.5}px`;
                moveElement.style.top = `${move.row * cellHeight + cellHeight / 2 - 22.5}px`;
            }

            moveElement.addEventListener('click', () => this.handleMoveClick(move));
            container.appendChild(moveElement);
        });
    }

    handlePieceClick(e, piece) {
        if (this.gameOver) return;

        e.stopPropagation();

        if (piece.color === this.currentPlayer) {
            this.selectedPiece = piece;
            this.validMoves = this.getValidMoves(piece);
            this.renderPieces();
        }
    }

    handleMoveClick(move) {
        if (!this.selectedPiece || this.gameOver) return;

        const capturedPiece = this.board[move.row][move.col];
        if (capturedPiece) {
            this.handleCapture(capturedPiece);
        }

        this.movePiece(this.selectedPiece, move.row, move.col);
        this.selectedPiece = null;
        this.validMoves = [];
        this.stepCount++;

        this.checkForCheck();
        this.checkForGameOver();

        if (!this.gameOver) {
            this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        }

        this.renderPieces();
        this.updateUI();
    }

    movePiece(piece, newRow, newCol) {
        const fromRow = piece.row;
        const fromCol = piece.col;
        
        this.board[fromRow][fromCol] = null;
        piece.row = newRow;
        piece.col = newCol;
        this.board[newRow][newCol] = piece;

        this.moveHistory.push({
            piece: { ...piece },
            fromRow: fromRow,
            fromCol: fromCol,
            toRow: newRow,
            toCol: newCol,
            captured: null
        });
    }

    handleCapture(capturedPiece) {
        const capturingColor = this.currentPlayer;
        this.scores[capturingColor] += this.pieceValues[capturedPiece.type];
        this.capturedPieces[capturingColor].push(capturedPiece);

        this.pieces = this.pieces.filter(p => p.id !== capturedPiece.id);

        if (capturedPiece.type === 'king' || capturedPiece.type === 'general') {
            this.endGame(capturingColor === 'red' ? 'black' : 'red', '对方王/将被吃');
        }
    }

    getValidMoves(piece) {
        const moves = [];
        const { type, row, col, color } = piece;

        switch (type) {
            case 'king':
                moves.push(...this.getKingMoves(piece));
                break;
            case 'queen':
                moves.push(...this.getQueenMoves(piece));
                break;
            case 'rook':
            case 'rook_chinese':
                moves.push(...this.getRookMoves(piece));
                break;
            case 'bishop':
                moves.push(...this.getBishopMoves(piece));
                break;
            case 'bishop_chinese':
                moves.push(...this.getElephantMoves(piece));
                break;
            case 'knight':
                moves.push(...this.getKnightMoves(piece));
                break;
            case 'knight_chinese':
                moves.push(...this.getKnightChineseMoves(piece));
                break;
            case 'pawn':
                moves.push(...this.getPawnMoves(piece));
                break;
            case 'general':
                moves.push(...this.getGeneralMoves(piece));
                break;
            case 'advisor':
                moves.push(...this.getAdvisorMoves(piece));
                break;
            case 'elephant':
                moves.push(...this.getElephantMoves(piece));
                break;
            case 'cannon':
                moves.push(...this.getCannonMoves(piece));
                break;
        }

        return moves.filter(move => this.isValidPosition(move.row, move.col));
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 10 && col >= 0 && col < 9;
    }

    getKingMoves(piece) {
        const moves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        directions.forEach(([dr, dc]) => {
            const newRow = piece.row + dr;
            const newCol = piece.col + dc;

            if (this.isValidPosition(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });

        return moves;
    }

    getQueenMoves(piece) {
        return [...this.getRookMoves(piece), ...this.getBishopMoves(piece)];
    }

    getRookMoves(piece) {
        const moves = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        directions.forEach(([dr, dc]) => {
            let newRow = piece.row + dr;
            let newCol = piece.col + dc;

            while (this.isValidPosition(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.color !== piece.color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
                newRow += dr;
                newCol += dc;
            }
        });

        return moves;
    }

    getBishopMoves(piece) {
        const moves = [];
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

        directions.forEach(([dr, dc]) => {
            let newRow = piece.row + dr;
            let newCol = piece.col + dc;

            while (this.isValidPosition(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.color !== piece.color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
                newRow += dr;
                newCol += dc;
            }
        });

        return moves;
    }

    getKnightMoves(piece) {
        const moves = [];
        const directions = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        directions.forEach(([dr, dc]) => {
            const newRow = piece.row + dr;
            const newCol = piece.col + dc;

            if (this.isValidPosition(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });

        return moves;
    }

    getKnightChineseMoves(piece) {
        const moves = [];
        const directions = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        directions.forEach(([dr, dc]) => {
            const newRow = piece.row + dr;
            const newCol = piece.col + dc;
            const blockRow = piece.row + (Math.abs(dr) === 2 ? Math.sign(dr) : 0);
            const blockCol = piece.col + (Math.abs(dc) === 2 ? Math.sign(dc) : 0);

            if (this.isValidPosition(newRow, newCol)) {
                if (!this.board[blockRow][blockCol]) {
                    const target = this.board[newRow][newCol];
                    if (!target || target.color !== piece.color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
        });

        return moves;
    }

    getPawnMoves(piece) {
        const moves = [];
        const direction = piece.color === 'red' ? -1 : 1;
        const startRow = piece.color === 'red' ? 8 : 1;

        const newRow = piece.row + direction;
        if (this.isValidPosition(newRow, piece.col)) {
            if (!this.board[newRow][piece.col]) {
                moves.push({ row: newRow, col: piece.col });

                if (piece.row === startRow) {
                    const doubleRow = piece.row + 2 * direction;
                    if (this.isValidPosition(doubleRow, piece.col) && !this.board[doubleRow][piece.col]) {
                        moves.push({ row: doubleRow, col: piece.col });
                    }
                }
            }
        }

        const captureDirections = [[direction, -1], [direction, 1]];
        captureDirections.forEach(([dr, dc]) => {
            const newRow = piece.row + dr;
            const newCol = piece.col + dc;

            if (this.isValidPosition(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (target && target.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });

        return moves;
    }

    getGeneralMoves(piece) {
        const moves = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const palaceRows = piece.color === 'red' ? [7, 8, 9] : [0, 1, 2];
        const palaceCols = [3, 4, 5];

        directions.forEach(([dr, dc]) => {
            const newRow = piece.row + dr;
            const newCol = piece.col + dc;

            if (palaceRows.includes(newRow) && palaceCols.includes(newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });

        return moves;
    }

    getAdvisorMoves(piece) {
        const moves = [];
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        const palaceRows = piece.color === 'red' ? [7, 8, 9] : [0, 1, 2];
        const palaceCols = [3, 4, 5];

        directions.forEach(([dr, dc]) => {
            const newRow = piece.row + dr;
            const newCol = piece.col + dc;

            if (palaceRows.includes(newRow) && palaceCols.includes(newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });

        return moves;
    }

    getElephantMoves(piece) {
        const moves = [];
        const directions = [[-2, -2], [-2, 2], [2, -2], [2, 2]];
        const riverBoundary = piece.color === 'red' ? 5 : 4;

        directions.forEach(([dr, dc]) => {
            const newRow = piece.row + dr;
            const newCol = piece.col + dc;
            const blockRow = piece.row + dr / 2;
            const blockCol = piece.col + dc / 2;

            const validRow = piece.color === 'red' ? newRow >= riverBoundary : newRow <= riverBoundary;

            if (this.isValidPosition(newRow, newCol) && validRow) {
                if (!this.board[blockRow][blockCol]) {
                    const target = this.board[newRow][newCol];
                    if (!target || target.color !== piece.color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
        });

        return moves;
    }

    getCannonMoves(piece) {
        const moves = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        directions.forEach(([dr, dc]) => {
            let newRow = piece.row + dr;
            let newCol = piece.col + dc;
            let jumped = false;

            while (this.isValidPosition(newRow, newCol)) {
                const target = this.board[newRow][newCol];

                if (!jumped) {
                    if (!target) {
                        moves.push({ row: newRow, col: newCol });
                    } else {
                        jumped = true;
                    }
                } else {
                    if (target) {
                        if (target.color !== piece.color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                        break;
                    }
                }

                newRow += dr;
                newCol += dc;
            }
        });

        return moves;
    }

    checkForCheck() {
        const opponentColor = this.currentPlayer === 'red' ? 'black' : 'red';
        const opponentPieces = this.pieces.filter(p => p.color === opponentColor);

        opponentPieces.forEach(piece => {
            const moves = this.getValidMoves(piece);
            moves.forEach(move => {
                const target = this.board[move.row][move.col];
                if (target && (target.type === 'king' || target.type === 'general')) {
                    this.hasCheckOccurred = true;
                    document.getElementById('check-indicator').textContent = '将军!';
                }
            });
        });
    }

    checkForGameOver() {
        if (this.stepCount >= this.maxSteps && !this.hasCheckOccurred) {
            if (this.scores.red > this.scores.black) {
                this.endGame('red', '50步结束，红方得分更高');
            } else if (this.scores.black > this.scores.red) {
                this.endGame('black', '50步结束，黑方得分更高');
            } else {
                this.endGame('draw', '50步结束，双方得分相同');
            }
        }
    }

    endGame(winner, message) {
        this.gameOver = true;
        const modal = document.getElementById('game-over-modal');
        const title = document.getElementById('game-over-title');
        const messageEl = document.getElementById('game-over-message');

        if (winner === 'red') {
            title.textContent = '红方获胜!';
            title.style.color = '#e74c3c';
        } else if (winner === 'black') {
            title.textContent = '黑方获胜!';
            title.style.color = '#2c3e50';
        } else {
            title.textContent = '和棋!';
            title.style.color = '#333';
        }

        messageEl.textContent = message;
        modal.style.display = 'block';
    }

    updateUI() {
        document.getElementById('red-score').textContent = this.scores.red;
        document.getElementById('black-score').textContent = this.scores.black;
        document.getElementById('step-count').textContent = this.stepCount;

        const redTurn = document.getElementById('red-turn');
        const blackTurn = document.getElementById('black-turn');
        const statusMessage = document.getElementById('status-message');

        if (this.currentPlayer === 'red') {
            redTurn.classList.add('active');
            blackTurn.classList.remove('active');
            statusMessage.textContent = '轮到红方';
        } else {
            blackTurn.classList.add('active');
            redTurn.classList.remove('active');
            statusMessage.textContent = '轮到黑方';
        }

        this.updateCapturedPieces();
    }

    updateCapturedPieces() {
        const redContainer = document.getElementById('captured-red-pieces');
        const blackContainer = document.getElementById('captured-black-pieces');

        redContainer.innerHTML = '';
        blackContainer.innerHTML = '';

        this.capturedPieces.red.forEach(piece => {
            const pieceEl = document.createElement('div');
            pieceEl.className = 'captured-piece black';
            pieceEl.textContent = this.pieceSymbols['black'][piece.type];
            redContainer.appendChild(pieceEl);
        });

        this.capturedPieces.black.forEach(piece => {
            const pieceEl = document.createElement('div');
            pieceEl.className = 'captured-piece red';
            pieceEl.textContent = this.pieceSymbols['red'][piece.type];
            blackContainer.appendChild(pieceEl);
        });
    }

    setupEventListeners() {
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('undo-btn').addEventListener('click', () => this.undoMove());
        document.getElementById('rules-btn').addEventListener('click', () => this.showRules());
        document.getElementById('play-again-btn').addEventListener('click', () => this.newGame());

        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        document.querySelectorAll('.promotion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pieceType = e.target.dataset.piece;
                this.handlePromotion(pieceType);
            });
        });
    }

    newGame() {
        document.getElementById('game-over-modal').style.display = 'none';
        this.board = [];
        this.pieces = [];
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.validMoves = [];
        this.stepCount = 0;
        this.hasCheckOccurred = false;
        this.scores = { red: 0, black: 0 };
        this.capturedPieces = { red: [], black: [] };
        this.moveHistory = [];
        this.gameOver = false;

        document.getElementById('check-indicator').textContent = '';

        this.setupBoard();
        this.setupPieces();
        this.drawBoard();
        this.renderPieces();
        this.updateUI();
    }

    undoMove() {
        if (this.moveHistory.length === 0 || this.gameOver) return;

        const lastMove = this.moveHistory.pop();
        const piece = this.pieces.find(p => p.id === lastMove.piece.id);

        if (piece) {
            this.board[piece.row][piece.col] = null;
            piece.row = lastMove.fromRow;
            piece.col = lastMove.fromCol;
            this.board[piece.row][piece.col] = piece;
        }

        if (lastMove.captured) {
            this.pieces.push(lastMove.captured);
            this.board[lastMove.toRow][lastMove.toCol] = lastMove.captured;
            this.scores[lastMove.captured.color === 'red' ? 'black' : 'red'] -= this.pieceValues[lastMove.captured.type];
            this.capturedPieces[lastMove.captured.color === 'red' ? 'black' : 'red'].pop();
        }

        this.stepCount--;
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        this.selectedPiece = null;
        this.validMoves = [];

        this.renderPieces();
        this.updateUI();
    }

    showRules() {
        const modal = document.getElementById('rules-modal');
        const content = document.getElementById('rules-content');

        content.innerHTML = `
            <h3>游戏概述</h3>
            <p>东西方融合象棋是将国际象棋和中国象棋两种经典棋类游戏的精华融合在一起的创新棋类游戏。</p>

            <h3>棋子分值系统</h3>
            <ul>
                <li>兵：1分</li>
                <li>士/仕：2分</li>
                <li>炮：2分</li>
                <li>象/相：3分</li>
                <li>马：3分</li>
                <li>车：4分</li>
                <li>后：5分</li>
                <li>将/帅和王：0分（被吃即输）</li>
            </ul>

            <h3>胜负判定</h3>
            <ul>
                <li>吃掉对方的王或将/帅</li>
                <li>将死对方的王或将/帅</li>
                <li>50步内得分判定：在50步内，如果没有发生将军，游戏结束时得分高的一方获胜</li>
                <li>50步后得分相同：在50步内如果没有将军且双方得分相同，则为和棋</li>
            </ul>

            <h3>操作说明</h3>
            <ul>
                <li>点击己方棋子选中</li>
                <li>绿色圆点表示可移动位置</li>
                <li>红色圆点表示可吃子位置</li>
                <li>点击目标位置完成移动</li>
            </ul>
        `;

        modal.style.display = 'block';
    }

    handlePromotion(pieceType) {
        const modal = document.getElementById('promotion-modal');
        modal.style.display = 'none';

        if (this.selectedPiece) {
            const oldType = this.selectedPiece.type;
            this.selectedPiece.type = pieceType;
            const scoreDiff = this.pieceValues[pieceType] - this.pieceValues[oldType];
            this.scores[this.selectedPiece.color] += scoreDiff;

            this.renderPieces();
            this.updateUI();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new FusionChess();
});