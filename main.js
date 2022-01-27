import anime from 'animejs/lib/anime.es.js'
import $ from 'jquery/dist/jquery.slim.js'

const $cells = $('.cell')
const $restartButton = $('#restartButton')
const $playAs = $('.choice')
const $x = $('.x')
const $o = $('.o')
const $paths = $('path')

let firstTurn = true

function human() {
  return firstTurn ? 'x' : 'o'
}

function ai() {
  return firstTurn ? 'o' : 'x'
}

let canMove = true
let gameStarted = false

let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

const scoring = () => ({
  [ai()]: 1,
  [human()]: -1,
  tie: 0,
})

function init() {
  // draw grid lines
  anime({
    targets: '#svg_1 line',
    x2: 233,
    duration: 300,
    easing: 'easeOutQuad',
  })
}

function possibleMoves() {
  let moves = []

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (board[x][y] === '') {
        moves.push({ x, y })
      }
    }
  }

  return moves
}

function show(cellId, what) {
  const $cell = $(`[data-id="${cellId}"]`)
  const $svg = $cell.find(`.${what}`)

  $svg.css('display', 'block')

  switch (what) {
    case 'o':
      anime({
        targets: `[data-id="${cellId}"] .x-arc`,
        strokeDashoffset: 0,
        easing: 'easeInOutQuad',
        duration: 200,
      })
      break
    case 'x':
      anime({
        targets: `[data-id="${cellId}"] .x-line`,
        strokeDashoffset: 0,
        easing: 'easeOutQuad',
        duration: 150,
        delay: anime.stagger(100),
      })
      break
  }
}

function minimax(board, depth, isMaximizing) {
  const winner = checkWinner()
  if (winner !== null) {
    return scoring()[winner]
  }

  if (isMaximizing) {
    let bestScore = -Infinity
    for (const { x, y } of possibleMoves()) {
      board[x][y] = ai()
      const score = minimax(board, depth + 1, false)
      board[x][y] = ''
      bestScore = Math.max(score, bestScore)
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (const { x, y } of possibleMoves()) {
      board[x][y] = human()
      const score = minimax(board, depth + 1, true)
      board[x][y] = ''
      bestScore = Math.min(score, bestScore)
    }
    return bestScore
  }
}

function computerMove() {
  let bestScore = -Infinity
  let move

  for (const { x, y } of possibleMoves()) {
    board[x][y] = ai()
    const score = minimax(board, 0, false)
    board[x][y] = ''
    if (score > bestScore) {
      bestScore = score
      move = { x, y }
    }
  }

  turn(move.x, move.y, ai())

  setTimeout(() => {
    canMove = true
    $playAs.toggleClass('active')
  }, 500)
}

function turn(x, y, who) {
  board[x][y] = who

  show($(`[data-x="${x}"][data-y=${y}]`).data('id'), who)

  if (checkWinner() !== null) {
    setTimeout(() => {
      announceWinner()
    }, 600)
  }
}

function equals3(a, b, c) {
  return a === b && b === c && a !== ''
}

function checkWinner() {
  let winner = null

  // rows & columns
  for (let i = 0; i < 3; i++) {
    // row
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i]
    }
    // column
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0]
    }
  }

  // diagonals
  const mainD = equals3(board[0][0], board[1][1], board[2][2])
  const secondD = equals3(board[0][2], board[1][1], board[2][0])
  if (mainD || secondD) {
    winner = board[1][1]
  }

  if (winner === null && possibleMoves().length == 0) {
    winner = 'tie'
  }

  return winner
}

function toggleTurn(who = null) {
  if (who !== null) {
    const up = who.toUpperCase()
    const no = up == 'X' ? 'O' : 'X'

    $(`#choice${up}`).addClass('active')
    $(`#choice${no}`).removeClass('active')
  } else {
    $('#choiceX, #choiceO').toggleClass('active')
  }
}

function announceWinner() {
  alert(`winner: ${checkWinner()}`)
  canMove = false
}

$cells.on('click', function () {
  gameStarted = true

  $('#playerChoice').addClass('disabled')

  const { x, y } = $(this).data()

  if (canMove && checkWinner() === null && board[x][y] === '') {
    canMove = false

    turn(x, y, human())

    if (checkWinner() === null) {
      $playAs.toggleClass('active')

      setTimeout(() => {
        computerMove()
      }, 400)
    }
  }
})

$playAs.on('click', function () {
  const playAs = $(this).data('play-as')

  firstTurn = playAs == 'x'

  if (!firstTurn && !gameStarted) {
    gameStarted = true

    $('#playerChoice').addClass('disabled')

    computerMove()
  }
})

$restartButton.on('click', function () {
  firstTurn = true
  canMove = true
  gameStarted = false

  $('#playerChoice').removeClass('disabled')

  toggleTurn('x')

  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]

  $x.css({ display: 'none' })
  $o.css({ display: 'none' })

  $.each($paths, function () {
    $(this).css({ 'stroke-dashoffset': $(this).data('stroke-dashoffset') })
  })
})

init()
