var socket = io("http://localhost:5000")

socket.on("connect", function () {
    console.log("Connected")
})

function capture(video, scaleFactor) {
    if(scaleFactor == null){
        scaleFactor = 1
    }
    var w = video.videoWidth * scaleFactor
    var h = video.videoHeight * scaleFactor
    var canvas = document.createElement("canvas")
    canvas.width  = w
    canvas.height = h
    var ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0, w, h)
    return canvas
} 

const video = document.querySelector("#video")
video.width = 700
video.height = 375

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream
            video.play()
        })
        .catch(function (err) {
            console.log(`Error - ${err}`)
        })
}

socket.on("response_back", function (image) {
    const image_id = document.getElementById("image")
    image_id.width = 500
    image_id.height = 375
    image_id.src = image
})

const FPS = 20

setInterval(() => {
    var type = "image/png"
    var video_element = document.getElementById("video")
    var frame = capture(video_element, 1)
    var data = frame.toDataURL(type)
    data = data.replace("data:" + type + ";base64,", "")
    socket.emit("image", data)
}, 10000 / FPS)