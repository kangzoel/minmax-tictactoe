import anime from 'animejs/lib/anime.es.js'
import $ from 'jquery/dist/jquery.slim.js'

const $cells = $('.cell')
const $restartButton = $('#restartButton')
const $playAs = $('[name=play_as]')
const $x = $('.x')
const $o = $('.o')
const $paths = $('path')

let playAs = 'x'
let canMove = true

let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

function init() {
  // draw grid lines
  anime({
    targets: '#svg_1 line',
    x2: 233,
    duration: 300,
    easing: 'easeOutQuad',
  })
}

const scoring = () => ({
  x: 1,
  o: -1,
  tie: 0,
})

function computer() {
  return playAs === 'x' ? 'o' : 'x'
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
      board[x][y] = playAs == 'x' ? 'x' : 'o'
      const score = minimax(board, depth + 1, false)
      board[x][y] = ''
      bestScore = Math.max(score, bestScore)
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (const { x, y } of possibleMoves()) {
      board[x][y] = playAs == 'x' ? 'o' : 'x'
      const score = minimax(board, depth + 1, true)
      board[x][y] = ''
      bestScore = Math.min(score, bestScore)
    }
    return bestScore
  }
}

function computerMove() {
  let bestScore = playAs == 'x' ? Infinity : -Infinity
  let move

  for (const { x, y } of possibleMoves()) {
    board[x][y] = computer()
    const score = minimax(board, 0, playAs == 'x')
    board[x][y] = ''
    if (playAs == 'x') {
      if (score < bestScore) {
        bestScore = score
        move = { x, y }
      }
    } else {
      if (score > bestScore) {
        bestScore = score
        move = { x, y }
      }
    }
  }

  turn(move.x, move.y, playAs === 'x' ? 'o' : 'x')

  const humanIndex = playAs === 'x' ? 0 : 1
  const computerIndex = humanIndex === 0 ? 1 : 0

  $playAs[computerIndex].checked = true

  setTimeout(() => {
    canMove = true

    $playAs[humanIndex].checked = true
  }, 500)
}

function turn(x, y, who) {
  if (board[x][y] === '') {
    board[x][y] = who

    show($(`[data-x="${x}"][data-y=${y}]`).data('id'), who)
  }
}

function equals3(a, b, c) {
  return a === b && b === c
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

  if (winner === '') {
    winner = null
  }

  if (winner === null && possibleMoves().length == 0) {
    return 'tie'
  } else {
    return winner
  }
}

$cells.on('click', function () {
  $playAs.attr('disabled', '')

  const { x, y } = $(this).data()

  const winner = checkWinner()

  if (canMove && winner === null) {
    turn(x, y, playAs)

    canMove = false

    if (checkWinner() == null) {
      setTimeout(() => {
        computerMove()
      }, 500)
    } else {
      canMove = true
    }
  }
})

$playAs.on('click', function () {
  playAs = $(this).val()

  if (playAs == 'o') {
    $playAs.attr('disabled', '')

    computerMove()
  }
})

$restartButton.on('click', function () {
  playAs = 'x'
  $playAs.removeAttr('disabled')
  $playAs[0].checked = true

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
