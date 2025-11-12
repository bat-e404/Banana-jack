/*
2C - Two of Clubs (Tréboles)
2D - Two of Diamonds (Diamantes)
2H - Two of Hearts (Corazones)
2S - Two of Spades (Espadas)
*/

// --------------------------------------------------------------------
// VARIABLES PRINCIPALES DEL JUEGO
// --------------------------------------------------------------------

// Mazo de cartas
let deck = [];

// Tipos de cartas: C = Clubs, D = Diamonds, H = Hearts, S = Spades
const typesCards = ["C", "D", "H", "S"];

// Cartas especiales
const specials = ["A", "J", "Q", "K"];

// --------------------------------------------------------------------
// MENSAJES ALEATORIOS DE RESULTADO (GANAR / PERDER)
// --------------------------------------------------------------------

// Frases que aparecen cuando el jugador gana
const winnerMessage = [ /* ... 20 frases humorísticas ... */ ];

// Frases que aparecen cuando el jugador pierde
const defeatMessage = [ /* ... 20 frases humorísticas ... */ ];

// --------------------------------------------------------------------
// CONFIGURACIÓN DE SONIDOS
// --------------------------------------------------------------------
let isMiusicPlaying   = false;  // Controla si la música está activa
let soundCard         = new Audio();  // Sonido al tomar carta
let winner            = new Audio();     // Sonido de victoria
let gameOver          = new Audio();   // Sonido de derrota

// Rutas de los archivos de audio
soundCard.src   = 'assets/music/card_ringtone_1.mp3';
winner.src      = 'assets/music/winner.mp3';
gameOver.src    = 'assets/music/negative.mp3';

// --------------------------------------------------------------------
// ELEMENTOS DEL DOM (Botones y contadores)
// --------------------------------------------------------------------
const btnPlayGame       = document.querySelector('#btnPlayGame');
const btnGetCard        = document.querySelector('#btnGetCard');
const btnStop           = document.querySelector('#btnStop');

const userPoints        = document.querySelector('#user-points');
const compuPoints       = document.querySelector('#compu-points');
const sectionCardUser   = document.querySelector('#jugador-cartas');
const sectionCardCompu  = document.querySelector('#compu-cartas');

// --------------------------------------------------------------------
// VARIABLES DE PUNTUACIÓN
// --------------------------------------------------------------------
let accumulatedPointsUser   = 0;
let accumulatedPointsCOMPU  = 0;
userPoints.innerText        = accumulatedPointsUser;
compuPoints.innerText       = accumulatedPointsCOMPU;

// --------------------------------------------------------------------
// FUNCIÓN: Reproduce música solo una vez
// --------------------------------------------------------------------
const playMiusicGame = (soundGame, miusicPlaying) => {
  if (!miusicPlaying) {
    soundGame.play();
    isMiusicPlaying = true;
  }
};

// --------------------------------------------------------------------
// FUNCIÓN: Crear el mazo de cartas (deck)
// --------------------------------------------------------------------
const createDeck = () => {
  // Cartas del 2 al 10
  for (let i = 2; i <= 10; i++) {
    for (let typeCard of typesCards) {
      deck.push(i + typeCard);
    }
  }

  // Cartas especiales: A, J, Q, K
  for (let special of specials) {
    for (let typeCard of typesCards) {
      deck.push(special + typeCard);
    }
  }

  // Baraja el mazo usando lodash
  deck = _.shuffle(deck);
  return deck;
};

// --------------------------------------------------------------------
// FUNCIÓN: Generar número aleatorio (índice de carta)
// --------------------------------------------------------------------
const getRandomIndex = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// --------------------------------------------------------------------
// FUNCIÓN: Mensaje final según resultado
// --------------------------------------------------------------------
const finalAlert = (status = 0) => {
  let randomIndex = getRandomIndex(0, 19);
  let message = '';

  if (status == 0) { // Derrota
    message = defeatMessage[randomIndex];
    gameOver.play();
  }

  if (status == 1) { // Victoria
    message = winnerMessage[randomIndex];
    lanzarConfetiLateral();
    winner.play();
  }

  if (status == 2) { // Empate
    message = "Empate!!!";
    gameOver.play();
  }

  // Muestra alerta con alertify
  alertify.alert(message).set('basic', true);

  // Deshabilita los botones
  btnStop.disabled = true;
  btnGetCard.disabled = true;
};

// --------------------------------------------------------------------
// FUNCIÓN: Obtener una carta del mazo
// --------------------------------------------------------------------
const getCard = () => {
  if (deck.length == 0) throw "No hay cartas en el Deck";

  const indexRandom = getRandomIndex(0, deck.length - 1);
  const cartaEliminada = deck.splice(indexRandom, 1);

  return cartaEliminada.toString();
};

// --------------------------------------------------------------------
// FUNCIÓN: Calcular valor de carta y mostrar alerta
// --------------------------------------------------------------------
const valueCardAndNotification = (card, turn = false) => {
  // Muestra aviso de la carta (alertify)
  (turn) ? alertify.warning(card) : alertify.error(card);

  let value = card.substring(0, card.length - 1);

  // Si es letra → A vale 11, J/Q/K valen 10
  return isNaN(value) ? (value === 'A' ? 11 : 10) : value * 1;
};

// --------------------------------------------------------------------
// FUNCIÓN: Efecto visual de confeti lateral (victoria)
// --------------------------------------------------------------------
function lanzarConfetiLateral() {
  var duration = 2 * 1000;
  var end = Date.now() + duration;
  var colors = ['#FF5733', '#FFD700', '#32CD32', '#1E90FF', '#FFB4A2'];

  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// --------------------------------------------------------------------
// FUNCIÓN: Turno de la computadora
// --------------------------------------------------------------------
const turnCOMPU = async (minPoints) => {
  // La compu pide al menos una carta
  do {
    await new Promise(resolve => setTimeout(resolve, 800));

    let valueCard = getCard();
    let card = valueCardAndNotification(valueCard);
    accumulatedPointsCOMPU += card;
    compuPoints.innerText = accumulatedPointsCOMPU;

    // Mostrar carta de la compu
    const imgCard = document.createElement('img');
    imgCard.classList.add('carta', 'animate__animated', 'animate__fadeInRight');
    imgCard.src = `assets/cartas_banana/${valueCard}.png`;
    sectionCardCompu.append(imgCard);

    soundCard.play();

    if (minPoints > 21) break;
  } while ((accumulatedPointsCOMPU < minPoints) && minPoints <= 21);

  messageStatus();
};

// --------------------------------------------------------------------
// FUNCIÓN: Determinar resultado final
// --------------------------------------------------------------------
const messageStatus = () => {
  (accumulatedPointsCOMPU == accumulatedPointsUser)
    ? finalAlert(2)
    : (accumulatedPointsCOMPU > 21)
    ? finalAlert(1)
    : finalAlert(0);
};

// --------------------------------------------------------------------
// EVENTOS PRINCIPALES DEL JUEGO
// --------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  isMiusicPlaying = false;
  btnStop.disabled = true;
  btnGetCard.disabled = true;

  // NUEVO JUEGO
  btnPlayGame.addEventListener('click', () => {
    deck = [];
    createDeck();
    sectionCardUser.innerHTML = "";
    sectionCardCompu.innerHTML = "";

    accumulatedPointsUser = 0;
    accumulatedPointsCOMPU = 0;
    userPoints.innerText = accumulatedPointsUser;
    compuPoints.innerText = accumulatedPointsCOMPU;

    btnStop.disabled = false;
    btnGetCard.disabled = false;

    let soundGame = new Audio();
    soundGame.src = 'assets/music/sound_game.mp3';
    soundGame.loop = true;

    playMiusicGame(soundGame, isMiusicPlaying);
  });

  // PEDIR CARTA
  btnGetCard.addEventListener('click', () => {
    let valueCard = getCard();
    let card = valueCardAndNotification(valueCard, true);
    accumulatedPointsUser += card;
    userPoints.innerText = accumulatedPointsUser;

    const imgCard = document.createElement('img');
    imgCard.classList.add('carta', 'animate__animated', 'animate__fadeInRight');
    imgCard.src = `assets/cartas_banana/${valueCard}.png`;
    sectionCardUser.append(imgCard);

    soundCard.play();

    if (accumulatedPointsUser >= 21) {
      turnCOMPU(accumulatedPointsUser);
    }
  });

  // DETENER TURNO
  btnStop.addEventListener('click', () => {
    turnCOMPU(accumulatedPointsUser);
    btnStop.disabled = true;
    btnGetCard.disabled = true;
  });
});
