/*
2C - Tow of Clubs 
2D - Tow of Daimonds 
2H - Tow of Hearts 
2S - Tow of Spades 
*/

let deck          = [];
const typesCards  = ["C", "D", "H", "S"];
const specials    = ["A", "J", "Q", "K"];

const winnerMessage = [
  "El gran mono ha ganado, y las bananas son suyas. ¡Chimpancé perdedor, vuelve a la jungla!",
  "El rey de la selva ha triunfado. ¡Ni un racimo de bananas salva al oponente!",
  "El simio superior ha demostrado su dominio. ¡Bananas para el ganador!",
  "El mono astuto ha ganado la partida. ¡El oponente se queda sin bananas y sin honor!",
  "El gorila invencible ha arrasado. ¡Ni las bananas más dulces salvan al perdedor!",
  "El campeón de la jungla ha hablado. ¡Las bananas son suyas y la derrota es del otro!",
  "El mono veloz ha ganado más rápido que un robo de bananas. ¡Victoria absoluta!",
  "El señor de los árboles ha triunfado. ¡El oponente se queda colgando sin bananas!",
  "El simio estratégico ha ganado. ¡Ni con mil bananas alcanzan su nivel!",
  "El gran macaco ha demostrado su superioridad. ¡Bananas para el vencedor!",
  "El mono maestro ha ganado. ¡El oponente solo tiene cáscaras de consuelo!",
  "El rey de las bananas ha hablado. ¡La jungla entera celebra su victoria!",
  "El primate invencible ha triunfado. ¡Ni el mono más listo le gana!",
  "El mono legendario ha ganado. ¡Las bananas son suyas y la derrota es del otro!",
  "El simio todopoderoso ha arrasado. ¡El oponente se queda sin bananas y sin gloria!",
  "El gran gorila ha ganado. ¡Ni King Kong le hace sombra!",
  "El mono triunfador ha celebrado con un racimo de bananas. ¡Victoria épica!",
  "El campeón de los árboles ha ganado. ¡El oponente se resbala en su derrota!",
  "El simio imbatible ha demostrado su grandeza. ¡Bananas y gloria para él!",
  "El mono invencible ha ganado. ¡El oponente solo tiene cáscaras de vergüenza!"
];

const defeatMessage = [
  "¡Banana split! Perdiste, mono despistado.",
  "¡Te quedaste sin bananas, chimpancé perdedor!",
  "¡Eso fue un resbalón de banana épico, gorila!",
  "¡Hasta los monos lloran cuando pierden como tú!",
  "¡Te cargo la banana y te dejo colgando del árbol!",
  "¡Ni con un racimo de bananas salvas esa partida, macaco!",
  "¡Te pelé como banana, mono frustrado!",
  "¡Perdiste más rápido que un mono sin bananas!",
  "¡Te dejaron en la jungla sin bananas, simio perdedor!",
  "¡Hasta las bananas se ríen de tu derrota, primate!",
  "¡Te resbalaste en tu propia banana, mono torpe!",
  "¡Ni King Kong te salva de esta derrota, gorila!",
  "¡Te quedaste sin bananas y sin dignidad, chimpancé!",
  "¡Perdiste como mono en tierra de gorilas!",
  "¡Te cargo la banana y te mando de vuelta a la selva!",
  "¡Hasta los orangutanes juegan mejor que tú!",
  "¡Te pelé como banana madura, mono perdedor!",
  "¡Te quedaste sin bananas y sin argumentos, primate!",
  "¡Perdiste más rápido que un mono robando bananas!",
  "¡Te resbalaste en la cáscara de la derrota, simio!"
];

// Sonido 
let isMiusicPlaying   = false;
let soundCard         = new Audio();
let winner            = new Audio();
let gameOver          = new Audio();

soundCard.src     = 'assets/music/card_ringtone_1.mp3';
winner.src        = 'assets/music/winner.mp3';
gameOver.src      = 'assets/music/negative.mp3';

// Botones
const btnPlayGame   = document.querySelector('#btnPlayGame');
const btnGetCard    = document.querySelector('#btnGetCard');
const btnStop       = document.querySelector('#btnStop');

// Usario puntos
const userPoints        = document.querySelector('#user-points');
// Computadora puntos 
const compuPoints       = document.querySelector('#compu-points');
// Seccion de cartas del usuario
const sectionCardUser   = document.querySelector('#jugador-cartas');
// Seccion de cartas del COMPU
const sectionCardCompu  = document.querySelector('#compu-cartas');

// Inicializar marcadores 
let accumulatedPointsUser     = 0;
let accumulatedPointsCOMPU    = 0;
userPoints.innerText          = accumulatedPointsUser;
compuPoints.innerText         = accumulatedPointsCOMPU;

// Funcion para evaluar si se activo la musica del juego
const playMiusicGame = ( soundGame, miusicPlaying ) => {
  if( !miusicPlaying ){
    soundGame.play();
    isMiusicPlaying = true;
  }
}

// Esta funcion me crea un mazo de cartas
const createDeck = () => {
  for (let i = 2; i <= 10; i++) {
    for (let typeCard of typesCards) {
      deck.push(i + typeCard);
    }
  }

  for (let special of specials) {
    for (let typeCard of typesCards) {
      deck.push(special + typeCard);
    }
  }

  deck = _.shuffle(deck);

  return deck;
};

// Funcion que me obtiene un index aleatorio;
const getRandomIndex = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const finalAlert = ( status = 0 ) => {

  let randomIndex = getRandomIndex(0,19);
  // Derrota
  if( status == 0){
    message = defeatMessage[randomIndex];
    gameOver.play();
  }
  // Victoria
  if ( status == 1 ) {
    message = winnerMessage[randomIndex];
    lanzarConfetiLateral();
    winner.play();
  }
  // Empate
  if( status == 2){
    message = "Empate!!!";
    gameOver.play();
  }

  alertify.alert( message ).set('basic', true); 
  btnStop.disabled = true;
  btnGetCard.disabled = true;
 
}

// Esta funcion me permite tomar una carta
const getCard = () => {
  // Evalua si hay cartas en el Deck
  if (deck.length == 0) {
    throw "No hay cartas en el Deck";
  }

  const indexRandom  = getRandomIndex(0, deck.length - 1);
  //const cards      = deck[indexRandom];
  let cartaEliminada = deck.splice(indexRandom, 1);

  return cartaEliminada.toString();
};

const valueCardAndNotification = (card, turn = false) => {
  // Alerta que muesta la carta que salio  
  (turn) ? alertify.warning(card) : alertify.error(card) ;
  let value = card.substring(0, card.length - 1);
  return ( isNaN(value) ) ? ( ( value === 'A' ) ? 11 : 10 ) : value * 1;
};

function lanzarConfetiLateral() {
    var duration = 2 * 1000; 
    var end = Date.now() + duration;
    var colors = ['#FF5733', '#FFD700', '#32CD32', '#1E90FF', '#FFB4A2']; // Colores rojo y blanco

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 }, // Lado izquierdo
            colors: colors
        });

        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 }, // Lado derecho
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

// Turno de la COMPU
const turnCOMPU = async ( minPoints ) => {
  // Por lo menos pedir una carta por turno
  
  do {
    await new Promise( resolve => setTimeout(resolve, 800) );
    // Obtener la carta y calcular puntos
    let valueCard           = getCard()
    let card                = valueCardAndNotification(valueCard);
    accumulatedPointsCOMPU  += card;
    compuPoints.innerText    = accumulatedPointsCOMPU;

    // Crear la imagen de la carta
    const imgCard = document.createElement('img');
    imgCard.classList.add('carta','animate__animated','animate__fadeInRight');
    imgCard.src = `assets/cartas_banana/${ valueCard }.png`;

    // Crear la imagen de la carta
    sectionCardCompu.append(imgCard);
    soundCard.play();

    if(minPoints > 21){
      break;
    }
  } while((accumulatedPointsCOMPU < minPoints) && minPoints <= 21);
  messageStatus();
}

const messageStatus = () => {

  if ( accumulatedPointsCOMPU == accumulatedPointsUser ) {
    console.log(accumulatedPointsUser);
    console.log(accumulatedPointsCOMPU);
  }

  ( accumulatedPointsCOMPU == accumulatedPointsUser ) ? finalAlert(2) : ( accumulatedPointsCOMPU > 21) ? finalAlert(1) : finalAlert(0);;
  
}

// EVENTOS
document.addEventListener("DOMContentLoaded", function () {

  isMiusicPlaying       = false;

  btnStop.disabled      = true;
  btnGetCard.disabled   = true;

  // Nuevo Juego
  btnPlayGame.addEventListener('click', () => {
    deck = [];
    // Creacion del deck
    createDeck();
    sectionCardUser.innerHTML   = "";
    sectionCardCompu.innerHTML  = "";

accumulatedPointsUser     = 0;
accumulatedPointsCOMPU    = 0;
userPoints.innerText          = accumulatedPointsUser;
compuPoints.innerText         = accumulatedPointsCOMPU;

    btnStop.disabled            = false;
    btnGetCard.disabled         = false;

    let soundGame = new Audio();
    soundGame.src = 'assets/music/sound_game.mp3';
    soundGame.loop = true;
    
    playMiusicGame( soundGame, isMiusicPlaying); 
    
    
  });

  // Pedir una carta
  btnGetCard.addEventListener('click', () => {

    // Obtener la carta y calcular puntos
    let valueCard           = getCard()
    let card                = valueCardAndNotification(valueCard,true);
    accumulatedPointsUser  += card;
    userPoints.innerText    = accumulatedPointsUser;

    // Crear la imagen de la carta
    const imgCard = document.createElement('img');
    imgCard.classList.add('carta','animate__animated','animate__fadeInRight');
    imgCard.src = `assets/cartas_banana/${ valueCard }.png`;
    
    // Crear la imagen de la carta
    sectionCardUser.append(imgCard);
    soundCard.play();

    if(accumulatedPointsUser > 21){
      turnCOMPU(accumulatedPointsUser);
    }else if(accumulatedPointsUser === 21) {
      turnCOMPU(accumulatedPointsUser);
    }

  });

  // Detenerse
  btnStop.addEventListener('click', () => {
    turnCOMPU(accumulatedPointsUser);
    btnStop.disabled = true;
    btnGetCard.disabled = true;
  });

});

