const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next');
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  songs: [
    {
      name: "Nếu em còn tồn tại",
      singer: "Trịnh Đình Quang",
      path: "./assets/mp3/neu-em-con-ton-tai.mp3",
      image: "./assets/img/song1.jpg",
    },
    {
      name: "Thất tình ",
      singer: "Trịnh Đình Quang",
      path: "./assets/mp3/that-tinh.mp3",
      image: "./assets/img/song2.jpg",
    },
    {
      name: "Ai chung tình được mãi",
      singer: "Thương Võ",
      path: "./assets/mp3/ai-chung-tinh-duoc-mai.mp3",
      image: "./assets/img/song3.jpg",
    },
    {
      name: "Họ yêu ai mất rồi",
      singer: "Doãn Hiếu",
      path: "./assets/mp3/ho-yeu-ai-mat-roi.mp3",
      image: "./assets/img/song4.jpg",
    },

    {
      name: "Tình yêu màu hồng",
      singer: "Freak-D",
      path: "./assets/mp3/tinh-yeu-mau-hong.mp3",
      image: "./assets/img/song5.jpg",
    },
    
  ],
  // render
  render: function () {
    const htmls = this.songs.map((song) => {
      return `<div class="song">
        <div
          class="thumb"
          style="
            background-image: url('${song.image}')
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`
    })
    $(".playlist").innerHTML = htmls.join("")
  },
  defineProperties: function(){
    Object.defineProperty(this,'currentSong',{
      get: function(){
        return this.songs[this.currentIndex]
      }
    })
  },
  handleEvents: function(){

    // xu ly cd quay/dung
    const cdThumbAnimate = cdThumb.animate([
      {
        transform: 'rotate(360deg'
      }
    ],{
      duration: 10000,// 10s 
      interactions: Infinity,

    })
    cdThumbAnimate.pause()


    const _this = this
    // xu ly phong to / thu nho cd
    const cdwidth = cd.offsetWidth


    document.onscroll = function(){
      const scrollTop = window.scrollY
      const newCdWidth = cdwidth - scrollTop
      
      cd.style.width = newCdWidth>0 ? newCdWidth + 'px' : 0
      cd.style.opacity = newCdWidth / cdwidth

    }

    // xu ly khi play
    playBtn.onclick = function(){
      if(_this.isPlaying){
        audio.pause()
      }
      else{
        audio.play()
      }
     
    }
    // khi song play  
    audio.onplay =function(){
      player.classList.add('playing')
      _this.isPlaying = true
      cdThumbAnimate.play()
    }
    // khi song pause 
    audio.onpause =function(){
      player.classList.remove('playing')
      _this.isPlaying = false
      cdThumbAnimate.pause()
    }

    // tien do bai hat
    audio.ontimeupdate = function (){
      if(audio.duration){
        const progressPercent = Math.floor(audio.currentTime/audio.duration * 100 )
        progress.value = progressPercent
      }
      
    }

    // xu ly tua 
    progress.onchange = function (e){
      const seekTime = audio.duration/ 100*e.target.value
      audio.currentTime = seekTime
    }
    // next song
    nextBtn.onclick = function(){
      if(_this.isRandom){
        _this.randomSong()
      }else{

        _this.nextSong()
      }
        audio.play()
    }
    preBtn.onclick = function(){
      if(_this.isRandom){
        _this.randomSong()
      }else{

        _this.preSong()
      }
      audio.play()
    }
    // random song
    randomBtn.onclick = function(e){
     _this.isRandom = ! _this.isRandom
      randomBtn.classList.toggle('active',_this.isRandom)
     
    }
    // xu ly next khi end
    audio.onended = function(){
      if(_this.isRandom){
        _this.randomSong()
      }else{

        _this.nextSong()
      }
        audio.play()
    }

  },
  loadCurrentSong: function(){
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
    
  },
  randomSong: function(){
    let newIndex
    do{
      newIndex = Math.floor(Math.random() * this.songs.length)

    }while(newIndex === this.currentIndex)
    this.currentIndex = newIndex
    
    this.loadCurrentSong()
  },
  nextSong: function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0
    }
    this.loadCurrentSong()
    
  },
  preSong: function(){
    this.currentIndex--
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length -1 
    }
    this.loadCurrentSong()
    
  },
  start: function () {
    // Dinh nghia cac thuoc tinh cho object
    this.defineProperties()

    // lang nghe/ xu ly cac su kien trong dom
    this.handleEvents()
    // tai thong tin bai hat dau tien vao ui
    this.loadCurrentSong()
    // render ung dung
    this.render()
  },
}
app.start()
