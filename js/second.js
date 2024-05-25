'use strict'
function updateFlagBtn() {
  var elMinesBtn = document.querySelector('.header-btn span.flag')
  elMinesBtn.innerText = countFlag
}
function getEmptyLocation(board) {
  const emptyLocations = []

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      const currCell = board[i][j]

      if (currCell.isMine === false) {
        emptyLocations.push({ i, j })
      }
    }
  }

  if (!emptyLocations.length) return null

  const randomIdx = getRandomInt(0, emptyLocations.length - 1)
  return emptyLocations[randomIdx]
}

function uncoverBoard() {
  for (var i = 0; i < gameBoard.length; i++) {
    for (var j = 0; j < gameBoard.length; j++) {
      var currCell = gameBoard[i][j]
      var elCell = document.querySelector(`.cell-${i}-${j}`)

      // Update the Dom
      if (currCell.isMine) elCell.innerText = MINE
      else if (currCell.minesAroundCount === 0) {
      } else {
        elCell.innerText = currCell.minesAroundCount
      }
    }
  }
}

function newGame() {
  onInit()
}

function onChooseLevl(elBtn) {
  console.log('elBtn:', elBtn.innerText)
  if (elBtn.innerText === 'Easy') {
    gLevel.size = 13
    gLevel.mines = 10
  } else if (elBtn.innerText === 'Medium') {
    gLevel.size = 16
    gLevel.mines = 40
  } else if (elBtn.innerText === 'Hard') {
    gLevel.size = 20
    gLevel.mines = 80
  }
  onInit()
  renderBoard(gameBoard)
}

function startTimer() {
  gStartTime = Date.now()
  gTimerInterval = setInterval(() => {
    var seconds = ((Date.now() - gStartTime) / 1000).toFixed(2)
    var elTimer = document.querySelector('.header-btn span.timer')
    elTimer.innerText = seconds
  }, 10)
}

function resetTimer() {
  clearInterval(gTimerInterval)
  var elTimer = document.querySelector('.header-btn span.timer')
  elTimer.innerText = '0.00'
}
