class BreakPoint {

}

class AudioPlayer {
    queue = []
    cursor = 0
    autoNext = false
    notStarted = true
    playing = false
    paused = true
    reset = false

    constructor(audioPaths, autoNext = false, audioInstances = null) {
        if (audioInstances !== null) {
            for (let item in audioInstances) {
                if (item === "---") {
                    this.queue.push(new BreakPoint())
                }
                else {
                    this.queue.push(item)
                }
            }
        }
        else {
            for (let item of audioPaths) {
                this.queue.push(new Audio(item))
            }
        }

        this.autoNext = autoNext
        if (autoNext) {
            for (let i = 0; i < this.queue.length - 1; i++) {
                if (this.queue[i] instanceof BreakPoint || this.queue[i + 1] instanceof BreakPoint) {
                    continue
                }

                this.queue[i].on("ended", function () {
                    this.cursor++
                    this.queue[i + 1].play()
                })
            }

            this.queue[this.queue.length - 1].on("ended", function () {
                this.cursor = 0
                this.playing = false
            })
        }
    }

    play() {
        if (this.playing) {
            return
        }

        if (!this.notStarted && this.paused) {
            this.queue[this.cursor].play()
            return
        }

        if (!this.autoNext) {
            this.queue[this.cursor].on("ended", function () {
                this.cursor++
                this.playing = false
            })
        }

        this.playing = true
        this.notStarted = false
        this.paused = false
        this.queue[this.cursor].play()
    }

    pause() {
        if (this.paused) {
            return
        }

        this.queue[this.cursor].pause()
        this.playing = false
        this.paused = true
    }

    stop() {
        this.pause()
        this.queue[this.cursor].currentTime = 0
        this.cursor = 0
        this.notStarted = 0
    }
}