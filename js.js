const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const PLAYER_STORAGE_KEY = 'USER_PLAYER';

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $(".btn-repeat")
const playlist = $('.playlist');
const volume = $(".volume");

const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            id: 0,
            name:'TheNight',
            singer:'Avicii',
            path: './asset/music/The Nights - Avicii.mp3',
            image:'./asset/img/thenight.jpg'
        },
        {
            id:1,
            name:'Hey Brother',
            singer:'Avicii',
            path: './asset/music/Hey Brother - Avicii.mp3',
            image:'./asset/img/heybrother.jpg'
        },
        {
            id:2,
            name:'Waiting for love',
            singer:'Avicii',
            path: './asset/music/Waiting For Love - Avicii.mp3',
            image:'./asset/img/waitingforlove.jpg'
        },
        {
            id:3,
            name:'ato_hitotsu',
            singer:'funky_monkey_baby',
            path: './asset/music/Ato-Hitotsu-Funky-Monkey-Babys.mp3',
            image:'./asset/img/atohitotsu.jpg'
        },
        {
            id:4,
            name:'dream',
            singer:'leftyhandcream',
            path: './asset/music/DREAM-Shimizu-Shota-Lefty-Hand-Cream.mp3',
            image:'./asset/img/dream.jfif'
        },
        {
            id:5,
            name:'kiseki',
            singer:'leftyhandcream',
            path: './asset/music/GReeeeN-Whiteeeen-Covered-by-Lefty-Hand-Cream-Lefty-Hand-Cream.mp3',
            image:'./asset/img/kiseki.jpg'
        },
        {
            id:6,
            name:'kiuccuagio',
            singer:'anri',
            path: './asset/music/Kaze-no-Kioku-Anri-Kumaki.mp3',
            image:'./asset/img/kiuccuagio.jpg'
        },
        {
            id:7,
            name:'nguoitheoduoianhsang',
            singer:'tuvi',
            path: './asset/music/Nguoi-theo-duoi-anh-sang-Tu-Vi.mp3',
            image:'./asset/img/nguoitheoduoianhsang.jpg'
        },
        {
            id:8,
            name:'truonganconuong',
            singer:'laocanma',
            path: './asset/music/Truong-An-Co-Nuong-Lao-Can-Ma.mp3',
            image:'./asset/img/truonganconuong.jpg'
        },
        {
            id:9,
            name:'uchikagehanabi',
            singer:'daoko',
            path: './asset/music/Uchiage-Hanabi-Fireworks-DAOKO-Kenshi-Yonezu-Cover-KOBASOLO-x-Harutya-x-Ryo-Irai.mp3',
            image:'./asset/img/uchikagehanabi.jfif'
        },
        {
            id:10,
            name:'xuanthangba',
            singer:'tina',
            path: './asset/music/Xuan-Thang-Ba-Tu-Nam-Ti-Na.mp3',
            image:'./asset/img/xuanthangba.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''} ${song.id}">
                        <div class="thumb" style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`
        
        })
        playlist.innerHTML = htmls.join('')
        
    },
    definedProperties : function() {
        Object.defineProperty(this, "currentSong", {
            get : function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent : function() {
        // x??? l?? cu???n l??m nh???
        const _this = this
        const cdWidth = cd.offsetWidth

        // l??m cho ???nh xoay

        const cdThumbRotate = cdThumb.animate([
            { transform : 'rotate(360deg)'}
        ], {
            duration:10000,
            iterations: Infinity,
        })
        cdThumbRotate.pause()


        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const cdNewWidth = cdWidth - scrollTop

            cd.style.width = cdNewWidth > 0 ? cdNewWidth + "px" : 0
            cd.style.opacity = cdNewWidth / cdWidth
        }
        // b???m n??t play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // khi b???m n??t play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbRotate.play()
        }
        // khi b???m n??t pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbRotate.pause()
        }
        // khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function(e) {
            // t???o bug kh??ng load ???????c server n??n kh??ng d??ng c??i n??y v:
            // while(audio.duration != NaN) {
            //     const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
            //     progress.value = progressPercent
            // }
            if(audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progressPercent 
                // console.log(progress.value)   
            }
        }

        // volume
        volume.oninput = function() {
            audio.volume = volume.value * 0.01
        }
        
        // khi tua b??i h??t
        progress.oninput = function(e) {
            const seekTime = progress.value * audio.duration * 0.01
            audio.currentTime = seekTime
        }
        // khi b???m n??t next
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi b???m n??t l??i
        prevBtn.onclick = function() {
            _this.prevSong()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi b??i h??t h???t 
        audio.onended = function() {
            if(_this.currentIndex < _this.songs.length - 1) {
                nextBtn.click()
                audio.play()
            }
            if(_this.isRepeat) {
                _this.repeatSong()
                audio.play()
            }
        }
        // t???o random b??i h??t
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle("active",_this.isRandom)
        }
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle("active",_this.isRepeat)
        }
        // L???ng nghe h??nh vi click v??o playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');

            if (songNode || e.target.closest('.option')) {

                // X??? l?? khi click v??o song
                if (songNode) {
                    const lenClassName = songNode.className
                    _this.currentIndex = Number(lenClassName.slice(6,lenClassName.length))
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

        //         // // //  X??? l?? khi click v??o song option
                if (e.target.closest('.option')) {
                    console.log('option');
                }
        //         // if(songNode) {
        //         //     console.log(songNode)
            }
        }
    },
    scrollToActiveSong : function() {
        let location 
        if(this.currentIndex <= 3) {
            location = 'end'
        } else {
            location = this.currentIndex <= 7 ? 'center' : 'start'
        }
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: location,
                inline: 'nearest',
            })
        }, 300)
    },

    loadCurrentSong : function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        volume.value = 100
        this.scrollToActiveSong()
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong :function() {
        this.currentIndex ++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong :function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let randomSong
        do {
           randomSong = Math.floor((Math.random() * this.songs.length) + 0)
        }   
        while(randomSong === this.currentIndex)
        this.currentIndex = randomSong
        this.loadCurrentSong()
    },
    repeatSong: function() {
        this.currentIndex--
        this.loadCurrentSong()
    },
    
    start: function() {

        // G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig();

        // t???i danh s??ch b??i h??t l??n
        this.render()

        // ?????nh ngh??a b??i ?????u ti??n 
        this.definedProperties()

        // load b??i h??t ?????u ti??n
        this.loadCurrentSong()

        // x??? l?? s??? ki???n k??o thu nh??? symbol
        this.handleEvent()

        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}
app.start()