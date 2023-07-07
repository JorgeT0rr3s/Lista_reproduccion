"use strict"
// add elemnts
const bgBody = ["#e5e7e9", "#ff4545", "#f8ded3", "#ffc382", "#f5eda6", "#ffcbdc", "#dcf3f3"];
const body = document.body;
const player = document.querySelector(".player");
const playerHeader = player.querySelector(".player__header");
const playerControls = player.querySelector(".player__controls");
const playerPlayList = player.querySelectorAll(".player__song");
const playerSongs = player.querySelectorAll(".audio");
const playButton = player.querySelector(".play");
const nextButton = player.querySelector(".next");
const backButton = player.querySelector(".back");
const playlistButton = player.querySelector(".playlist");
const slider = player.querySelector(".slider");
const sliderContext = player.querySelector(".slider__context");
const sliderName = sliderContext.querySelector(".slider__name");
const sliderTitle = sliderContext.querySelector(".slider__title");
const sliderContent = slider.querySelector(".slider__content");
const sliderContentLength = playerPlayList.length - 1;
const sliderWidth = 100;
let left = 0;
let count = 0;
let song = playerSongs[count];
let isPlay = false;
const pauseIcon = playButton.querySelector("img[alt = 'pause-icon']");
const playIcon = playButton.querySelector("img[alt = 'play-icon']");
const progres = player.querySelector(".progres");
const progresFilled = progres.querySelector(".progres__filled");
let isMove = false;

// creat functions
// En la siguiente funion openPlayer, se esta agregando algunos estilos o efectos visuales cuando se reprodusca una cancion.
function openPlayer() {
    playerHeader.classList.add("open-header");
    playerControls.classList.add("move");
    slider.classList.add("open-slider");
  }
  //En la funcion closePlayer se hace lo contrario a la funcion OpenPlayer, es decir se retiran esos efectos o clases en css
  function closePlayer() {
    playerHeader.classList.remove("open-header");
    playerControls.classList.remove("move");
    slider.classList.remove("open-slider");
  }
  // la funcion next controla el movimiento del slyder de reproducción de la cancion.
  function next(index) {
    count = index || count;
    // este if indica que si el slyder llego al final no siga aplicando las demas lineas de codigo
    if (count == sliderContentLength) { 
      count = count;
      return;
    }
    //En las siguientes lineas de codigo se controla el avance del slyder y cuando se cambia a la siguiente cancion
    left = (count + 1) * sliderWidth;
    left = Math.min(left, (sliderContentLength) * sliderWidth);
    sliderContent.style.transform = `translate3d(-${left}%, 0, 0)`;
    count++;
    run();
  }
  // en la funcion back, se controla el boton de retroceso, que retroceda la cancion o que cambie a la anterior
  function back(index) {
    count = index || count;
    if (count == 0) {
      count = count;
      return;
    }
    left = (count - 1) * sliderWidth;
    left = Math.max(0, left);
    sliderContent.style.transform = `translate3d(-${left}%, 0, 0)`;
    count--;
    //aqui se llama a la funcion run
    run();
  }

  function changeSliderContext() {
    //aqui se asigna una animacion opacity
    sliderContext.style.animationName = "opacity";
    // aqui se actualiza el texto  de sliderName con lo que tenga player__title y el texto de sliderTitle con lo que tenga player__song-name, lo que indica que se cambia el nombre de la cancion que esta sonando
    sliderName.textContent = playerPlayList[count].querySelector(".player__title").textContent;
    sliderTitle.textContent = playerPlayList[count].querySelector(".player__song-name").textContent;
    //La siguiente cndicion se utiliza para duplicar el nombre de la cancion si es mayor a 16 caracteres
    if (sliderName.textContent.length > 16) {
      const textWrap = document.createElement("span");
      textWrap.className = "text-wrap";
      textWrap.innerHTML = sliderName.textContent + " " + sliderName.textContent;
      sliderName.innerHTML = "";
      sliderName.append(textWrap);
    }
    //aqui se realiza lo mismo del anterior if pero para el sliderTitle, esto se hace debido a que la palabra no cabe completamente dentro del div. Por lo cual se duplica para que se vaya deslizando
    if (sliderTitle.textContent.length >= 18) {
      const textWrap = document.createElement("span");
      textWrap.className = "text-wrap";
      textWrap.innerHTML = sliderTitle.textContent + " " + sliderTitle.textContent;
      sliderTitle.innerHTML = "";
      sliderTitle.append(textWrap);
    }
  }
  //Aqui se cambia el color del fondo de la pagina segun la cancion que se este reproduciendo
  function changeBgBody() {
    body.style.backgroundColor = bgBody[count];
  }
  // la funcion selectSong se usa cuando se seleccciona una cancion directamente del listado
  function selectSong() {
    song = playerSongs[count];
    //con el for se recorren todos los items del array playerSongs
    for (const item of playerSongs) {
      //con este condicional se pregunta si la cancion que estan seleccionando es igual o no a la que se esta reproducciendo, si no se pausa la canción y se esablece el tiempo de la cancion a cero
      if (item != song) {
        item.pause();
        item.currentTime = 0;
      }
    }
    //con este condicional informa que si precionan reproduccior o play inicie la reproduccion de la cancion.
    if (isPlay) song.play();
  }
  //La funcion run llama algunas funciones para que se generen cambios en el slider de repoduccion.
  function run() {
    //aqui se cambia el icono, nombre y titulo de la cancion en el slider
    changeSliderContext();
    //aqui se cambia el color de fondo 
    changeBgBody();
    //aqui se llama a la funcion selectSong.
    selectSong();
  }
  //La funcion playSong determina las acciones que se ejecutan si se oprime pause o play.
  function playSong() {
    // si oprimen el pause, se esconde el icono de play y se muestra el de pausa
    if (song.paused) {
      song.play();
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      // si no se establece isplay como falso lo que significa que la cancion no esta repoduciendose y no debe aparecer ningun icono
      song.pause();
      isPlay = false;
      playIcon.style.display = "";
      pauseIcon.style.display = "";
    }
  }
  function progresUpdate() {
    //en esta parte de la funcion se calcula el tiempo de duracion de la cancion para ajustar el slider de reproduccion
    const progresFilledWidth = (this.currentTime / this.duration) * 100 + "%";
    progresFilled.style.width = progresFilledWidth;
    //con esta condicion se esta revisando si la cancion ya termino de reproducirse para cambiar a la siguiente cancion.
    if (isPlay && this.duration == this.currentTime) {
      next();
    }
    // esta condicion se usa para cuando se haya reproducido la ultima cancion de la lista. aparezca el icono de play, y se cambie el estado de la funcion isPlay a falso.
    if (count == sliderContentLength && song.currentTime == song.duration) {
      playIcon.style.display = "block";
      pauseIcon.style.display = "";
      isPlay = false;
    }
  }

  function scurb(e) {
    // If we use e.offsetX, we have trouble setting the song time, when the mousemove is running
    const currentTime = ((e.clientX - progres.getBoundingClientRect().left) / progres.offsetWidth) * song.duration;
    song.currentTime = currentTime;
  }
  //esta funcion calcula y muestra en display el tiempo de la cancion en el formato min:seg
  function durationSongs() {
    let min = parseInt(this.duration / 60);// aca se calcula cuantos minutos tiene la cancion
    if (min < 10) min = "0" + min;// aca se asegura que siempre se muestren dos digitos
    let sec = parseInt(this.duration % 60);// aca se calcula cuantos segundos tiene la cancion
    if (sec < 10) sec = "0" + sec;// aca se asegura que siempre se muestreen dos digitos
    const playerSongTime = `${min}:${sec}`; // aca se crea una cadena de texto, para mostrar min : seg
    this.closest(".player__song").querySelector(".player__song-time").append(playerSongTime);// aca se agrega para mostrar el tiempo en display
  }
  changeSliderContext();
  // add events
  //en las siguientes lineas de codigo se establecen los eventos que podrian ocurrir (manupulacion por parte del usuario)
  sliderContext.addEventListener("click", openPlayer); // si hacen click en el area de sliderContext, se llama la funcion openPlayer.
  sliderContext.addEventListener("animationend", () => sliderContext.style.animationName = '');
  playlistButton.addEventListener("click", closePlayer);//este evento es para cuando se haga click en el icono de play_list y llama a la funcion closePlayer
  nextButton.addEventListener("click", () => {
    next(0)
  });// presionar el icono de next llama a la funcion next y la inicializa en cero
  backButton.addEventListener("click", () => {
    back(0)//presionar el icono de back llama a la funcion back y la inicializa en cero
  });
  playButton.addEventListener("click", () => {
    isPlay = true;
    playSong();
  });// presionar el icono de play llama a la funcion playSong
  playerSongs.forEach(song => {
    song.addEventListener("loadeddata", durationSongs);
    song.addEventListener("timeupdate", progresUpdate);
  });
  
  progres.addEventListener("pointerdown", (e) => {
    scurb(e);
    isMove = true;
  });
  document.addEventListener("pointermove", (e) => {
    if (isMove) {
      scurb(e);
      song.muted = true;
    }
  });
  document.addEventListener("pointerup", () => {
    isMove = false;
    song.muted = false;
  });
  // el siguiente codigo se usa para ejecutar acciones cuando se presione click en cualqueira de los elementos de la lista, para cambiar la cancion que esta en reproduccion.
  playerPlayList.forEach((item, index) => {
    item.addEventListener("click", function () {
      //si se presiono una cancion que se encuentra despues de la cancion que se esta reproduciendo se llama la funcion next con decremento en 1. esto no lo entiendo porque se resta 1
      if (index > count) {
        next(index - 1);
        return;
      }
      // si la cancion esta antes que la cancion que se esta reproduciendo se llama la funcion back con incremento en 1. Esto si no lo entiendo porque se incrementa 1
      if (index < count) {
        back(index + 1);
        return;
      }
    });
  });