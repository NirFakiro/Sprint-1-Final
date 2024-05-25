'use strict'

const MINE = '🧨'
const FLAG = '🚩'
const EMPTY = ''
var countFlag = 0
var touchingMine = false
var gameBoard
var gTimerInterval
var gStartTime
var fristClick

var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}
var gBoard = {
  minesAroundCount: 0,
  isShow: false,
  isMine: false,
  isMarked: false,
}

var gLevel = {
  size: 13,
  mines: 10,
}

function onInit() {
  fristClick = true
  countFlag = 0
  gGame.secsPassed = 0
  resetTimer()
  closeModal()

  gameBoard = createBoard()
  var elMinesBtn = document.querySelector('.header-btn span.flag')
  elMinesBtn.innerText = countFlag
  setMInesNegsCount(gameBoard)

  renderBoard(gameBoard)
}

function createBoard() {
  const board = []
  for (var i = 0; i < gLevel.size; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShow: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  addMines(board, gLevel.mines)
  console.log('board:', board)

  return board
}

function renderBoard(board) {
  var strHTML = ''
  var length = gLevel.size
  for (var i = 0; i < length; i++) {
    strHTML += `<tr>`
    for (var j = 0; j < length; j++) {
      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellRightClicked(event,this, ${i},${j})" class="${className}">${
        !cell.isShow ? '' : cell.minesAroundCount
      }</td>`
    }
    strHTML += `</tr>`
  }

  const elContainer = document.querySelector('.board')
  elContainer.innerHTML = strHTML
}

function setMInesNegsCount(board) {
  var size = gameBoard.length
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var mineCount = 0

      // neg cells
      for (var si = i - 1; si <= i + 1; si++) {
        for (var sj = j - 1; sj <= j + 1; sj++) {
          if (si >= 0 && si < size && sj >= 0 && sj < size) {
            if (si !== i || sj !== j) {
              if (board[si][sj].isMine) {
                mineCount++
              }
            }
          }
        }
      }
      board[i][j].minesAroundCount = mineCount
    }
  }
  return mineCount
}

function onCellClicked(elCell, rowIdx, colIdx) {
  if (fristClick) {
    startTimer()
    fristClick = false
  }

  var currCell = gameBoard[rowIdx][colIdx]
  if (!currCell.isShow) {
    expandShown(gameBoard, rowIdx, colIdx)

    // Update Modal
    gGame.shownCount++
    gGame.secsPassed++
    currCell.isShow = true

    // Update Dom
    var currCell = gameBoard[rowIdx][colIdx]
    if (currCell.minesAroundCount === 0 && !currCell.isMine) {
      elCell.style.backgroundColor = '#868e96'
    } else {
      elCell.innerText = currCell.minesAroundCount
      elCell.style.backgroundColor = '#868e96'
    }

    // Check loss
    if (currCell.isMine) {
      elCell.innerText = MINE
      touchingMine = true
      uncoverBoard()
      resetTimer()
    }
  }
  // Check victory
  var countCell = gLevel.size ** 2
  var minesNum = gLevel.mines
  var secsPassed = gGame.secsPassed
  var diff = countCell - minesNum
  if (secsPassed >= diff) {
    openModal()
    resetTimer()
  }
}

function onCellRightClicked(event, elCell, i, j) {
  event.preventDefault()
  var currCell = gameBoard[i][j]
  //Update Modal
  currCell.isMarked = true

  //Update DOM
  elCell.innerText = FLAG
  countFlag++
  updateFlagBtn()
}

function addMines(board, numMines) {
  for (var i = 0; i < numMines; i++) {
    const emptyLocation = getEmptyLocation(board)
    console.log('Mines location:', emptyLocation)
    //Update Modal
    board[emptyLocation.i][emptyLocation.j].isMine = true
  }
}

function expandShown(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board.length) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = board[i][j]
      var elCell = document.querySelector(`.cell-${i}-${j}`)

      if (
        !currCell.isShow &&
        currCell.minesAroundCount === 0 &&
        !currCell.isMine
        // Update Modal
      ) {
        gGame.shownCount++
        gGame.secsPassed++
        currCell.isShow = true

        // Update DOM
        if (currCell.minesAroundCount === 0 && !currCell.isMine) {
          elCell.style.backgroundColor = '#868e96'
        } else {
          elCell.innerText = currCell.minesAroundCount
          elCell.style.backgroundColor = '#868e96'
        }
      }
    }
  }
}

function openModal() {
  const elModal = document.querySelector('.modal')
  const elMsg = elModal.querySelector('.msg')
  elMsg.innerText = 'You won!!!'
  elModal.style.display = 'block'
}

function closeModal() {
  const elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
}
