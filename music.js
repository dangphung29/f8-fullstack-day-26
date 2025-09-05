const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $(`.cd`)
const header = $(`header`)
const playList = $(`.playlist`)
const playBtn = $(`.btn-toggle-play`)
const audio = $(`audio`)
const progress = $(`.progress`)
const phatLaiBtn = $(`.fa-redo`)
const phatRandomBtn = $(`.fa-random`)
const cdThumb = $(`.cd-thumb`)



const app = {
    songs: [
        {
            name: "Chờ ngày mưa tan",
            singer: "Noo Phước Thịnh",
            path: "./data/ChoNgayMuaTan-NooPhuocThinhfeatTonnyViet-6400309.mp3",
            image: "./data/cho ngay mua tan.jpg"
        },
        {
            name: "Chân ngắn",
            singer: "Cẩm Vân",
            path: "./data/ChanNgan-CamVanPhamTMT-3516402.mp3",
            image:
                "./data/chan ngan.jpg"
        },
        {
            name: "Quả phụ tướng",
            singer: "Phạm Hoàng Dũng",
            path:
                "./data/QuaPhuTuongRemix-DungHoangPhamSinkra-8471408.mp3",
            image: "./data/qua phu tuong.jpg"
        },
        {
            name: "Sai lầm của anh",
            singer: "Nhật Khang",
            path: "./data/SaiLamCuaAnh-NhatKhang-6896993.mp3",
            image:
                "./data/sai lam cua anh.jpg"
        },
        {
            name: "Để em rời xa",
            singer: "Hoàng Tôn",
            path: "./data/DeEmRoiXa-HoangTon-2759506.mp3",
            image:
                "./data/de em roi xa.jpg"
        },
        {
            name: "Bán duyên",
            singer: "Đình Dũng",
            path: "./data/MiniMixBanDuyen-DJ-6053953.mp3",
            image:
                "./data/ban duyen.jpg"
        }
    ],
    randomSongIndex: [],
    isPhatLai: false,
    isPhatRandom: false,
    isPlaying: false,
    songIndex: 0,
    definePropertys: function () {
        Object.defineProperty(this, `nowSong`, {
            get: function () {
                return app.songs[app.songIndex]
            }
        })
    },
    getRandomSongIndex: function () {
        this.randomSongIndex = this.songs.map((song, index) => index).filter(songIndex => songIndex !== this.songIndex)
    },
    save: function () {
        const appStatus = {
            isPhatLai: this.isPhatLai,
            isPhatRandom: this.isPhatRandom,
            songIndex: this.songIndex,
        }
        localStorage.setItem('appStatus', JSON.stringify(appStatus))
    },
    loadSetting: function () {
        const setting = JSON.parse(localStorage.getItem('appStatus')) || {
            isPhatLai: false,
            isPhatRandom: false,
            songIndex: 0,
        }
        this.isPhatLai = setting.isPhatLai
        this.isPhatRandom = setting.isPhatRandom
        this.songIndex = setting.songIndex

        phatLaiBtn.style.color = this.isPhatLai === true ? `#ec1f55` : ''
        phatRandomBtn.style.color = this.isPhatRandom === true ? `#ec1f55` : ''
        this.renderNowSong()

    },
    handlePhatRandom: function () {
        this.randomSongIndex.length === 0 && this.getRandomSongIndex()
        let random = Math.round((Math.random()) * (this.randomSongIndex.length - 1))
        this.songIndex = this.randomSongIndex[random]
        this.randomSongIndex.splice(random, 1)
        this.renderNowSong()
        this.save()
    },

    handlerEvents: function () {
        let _this = this
        // Xử lý sự kiên scroll phóng to thu nhỏ CD
        document.onscroll = function () {
            const newWidth = 200 - window.scrollY
            if (newWidth < 0) {
                cd.style.width = 0
            }
            else {
                cd.style.width = newWidth + `px`
                cd.style.opacity = newWidth / 200
            }
        }
        // Xử lý quay cd 
        const animateCD = cdThumb.animate([{ transform: `rotate(360deg)` }], {
            duration: 6000,
            iterations: Infinity
        })
        animateCD.pause()

        // Xử lý sự kiện click bài hát để chuyển bài hát
        playList.onclick = function (e) {
            if (e.target.closest(`.song`) && !e.target.closest(`.option`)) {
                _this.songIndex = Number(e.target.closest(`.song`).getAttribute(`data-index`))
            }
            _this.renderNowSong()
            audio.play()
            animateCD.cancel()
            _this.save()
        }
        // Xử lý sự kiện click btn play
        playBtn.onclick = function () {
            if (!_this.isPlaying) {
                audio.play()
            }
            else {
                audio.pause()
            }

        }
        audio.onplay = function () {
            $(`.player`).classList.add(`playing`)
            _this.isPlaying = true
            animateCD.play()
        }
        audio.onpause = function () {
            $(`.player`).classList.remove(`playing`)
            _this.isPlaying = false
            animateCD.pause()
        }
        // Xử lý sự kiên click btn phát lại
        phatLaiBtn.onclick = function () {
            if (_this.isPhatRandom === true) {
                if (_this.isPhatLai === false) {
                    _this.isPhatLai = true
                    phatLaiBtn.style.color = `#ec1f55`
                    _this.isPhatRandom = false
                    phatRandomBtn.style.color = ``
                }
            } else {
                if (_this.isPhatLai === false) {
                    _this.isPhatLai = true
                    phatLaiBtn.style.color = `#ec1f55`
                } else {
                    _this.isPhatLai = false
                    phatLaiBtn.style.color = ``
                }
            }
            _this.save()
        }
        // Xử lý khi click btn phatRandom
        phatRandomBtn.onclick = function () {
            if (_this.isPhatLai === true) {
                if (_this.isPhatRandom === false) {
                    _this.isPhatRandom = true
                    phatRandomBtn.style.color = `#ec1f55`
                    _this.isPhatLai = false
                    phatLaiBtn.style.color = ``
                }
            } else {
                if (_this.isPhatRandom === false) {
                    _this.isPhatRandom = true
                    phatRandomBtn.style.color = `#ec1f55`
                } else {
                    _this.isPhatRandom = false
                    phatRandomBtn.style.color = ``
                }
            }
            _this.save()
        }


        // Xử lý sự kiện click btn next

        const nextBtn = $(`.fa-step-forward`)
        nextBtn.onclick = function () {
            // Xử lý đổi màu khi click
            nextBtn.style.color = `#ec1f55`
            setTimeout(function () {
                nextBtn.style.color = ``
            }, 200)
            // Xử lý next bài
            //Case 1 bai
            if (_this.songs.length === 1) {
                _this.renderNowSong()
                audio.play()
                return
            }

            //Case random
            if (_this.isPhatRandom === true) {
                _this.handlePhatRandom()
                audio.play()
                return
            }

            //Case thong thuong
            if (_this.songIndex + 1 == _this.songs.length) {
                _this.songIndex = 0

            } else {
                _this.songIndex += 1
            }
            _this.renderNowSong()
            audio.play()

            animateCD.cancel()
            _this.save()
        }
        // Xử lý sự kiện click btn back
        const backBtn = $(`.fa-step-backward`)
        backBtn.onclick = function () {
            // Xử lý đổi màu khi click
            backBtn.style.color = `#ec1f55`
            setTimeout(function () {
                backBtn.style.color = ``
            }, 200)
            // Xử lý back bài
            if (audio.currentTime > 2) {
                _this.renderNowSong()
                audio.play()
                return
            }

            if (_this.songs.length === 1) {
                _this.renderNowSong()
                audio.play()
                return
            }

            if (_this.isPhatRandom === true) {
                _this.handlePhatRandom()
                audio.play()
                return
            }

            if (_this.songIndex == 0) {
                _this.songIndex = _this.songs.length - 1
            } else {
                _this.songIndex -= 1
            }
            _this.renderNowSong()
            audio.play()
            animateCD.cancel()
            _this.save()
        }

        // Xử lý tiến độ bài hát
        audio.ontimeupdate = function () {
            if (audio.currentTime / audio.duration) {
                progress.value = (audio.currentTime / audio.duration) * 100
            }
        }
        // Xử lý khi tua
        progress.oninput = function (e) {
            audio.currentTime = (e.target.value / 100) * audio.duration
            audio.play()
        }
        // Xử lý khi bài hát kết thúc auto next
        audio.onended = function () {
            if (_this.isPhatLai === false && _this.isPhatRandom === false) {
                if (_this.songIndex + 1 == _this.songs.length) {
                    _this.songIndex = 0
                } else {
                    _this.songIndex += 1
                }
                _this.renderNowSong()
                _this.save()
            } else {
                if (_this.isPhatRandom === true) {
                    _this.handlePhatRandom()
                }
            }
            audio.play()
        }
    },
    renderSongs: function () {
        let html = this.songs.map(function (song, index) {
            return `
            <div class="song" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
            `
        })
        playList.innerHTML = html.join(``)
    },
    renderNowSong: function () {
        const _this = this
        header.innerHTML = `<h4>Now playing:</h4><h2>${this.nowSong.name}</h2>`
        $(`.cd-thumb`).style.backgroundImage = `url('${this.nowSong.image}')`
        $(`audio`).src = this.nowSong.path
        const listSong = playList.querySelectorAll(`.song`)
        listSong.forEach(function (song, index) {
            if (song.style.backgroundColor = `#ec1f55`) {
                song.style.backgroundColor = ``
                $$(`.title`)[index].style.color = `black`
                $$(`.author`)[index].style.color = `black`
            }
            if (index === _this.songIndex) {
                song.style.backgroundColor = `#ec1f55`
                $$(`.title`)[index].style.color = `#FFFFFF`
                $$(`.author`)[index].style.color = `White`
            }
        })
    },
    start: function () {
        this.definePropertys()
        this.renderSongs()
        this.handlerEvents()
        this.loadSetting()
    }
}

app.start()









