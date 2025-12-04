const search_button = document.getElementById('search_button')
const image = document.getElementById('icon')
const link = document.getElementById('link')
const qr_URL = 'https://zoom.earth/maps/satellite/#view={lat},{lon},6z/place={lat},{lon}'

//Animation
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const drops = [] 
const text = []
const fontSize = 30
const spacer = -10
const speed = 40 - localStorage.getItem('precipitation')

//Starting values
canvas.height = window.innerHeight - 280
canvas.width = window.innerWidth - 10
const columns = canvas.width/(fontSize + spacer)

for(let i = 0;  i < columns; i++) {
    drops[i] = Math.random()*50-50
}

//For smooth resizing
window.addEventListener('resize', resizeCanvas)

function resizeCanvas(){
    canvas.height = window.innerHeight - 280
    canvas.width = window.innerWidth - 10
    draw()
}

const draw = () => {
    if (localStorage.getItem('dark') == 0){
        if (this.chars == 'X'){
            context.fillStyle = '#87CEEB'
        }else{
            context.fillStyle = "rgb(255,255,255)"
        }
    }else{
        context.fillStyle = "#121212"
    }
    context.fillRect(0,0, canvas.width, canvas.height)

    for(let i = 0; i < columns; i++) {
        if (this.chars == 'X'){
            context.fillStyle = '#ffffff'
        }else{
            context.fillStyle = '#0000ff'
        }
        drops[i]++
        text[i] = this.chars.charAt(Math.floor(Math.random() * Math.random() * this.chars.length))
        context.fillText(text[i], i*(fontSize+spacer), drops[i]*(fontSize+spacer))
        
        if(drops[i]*(fontSize+spacer) > canvas.height) {
            drops[i] = Math.random()*50 - 50
        }
    }
}

search_button.addEventListener('click', () => {
    window.location.href = 'index.html'
});


function generateQR() {
    if (localStorage.getItem('dark') == 0){
        document.body.style.background = localStorage.getItem('temp')
    }else{
        document.body.classList.toggle('dark-mode')
    }
    if (localStorage.getItem('precipitation') > 0){
        setInterval(resizeCanvas, speed)
    }
    if (localStorage.getItem('precipitation_type').includes('SNOW')){
        this.chars = 'X'
    }else{
        this.chars = '|'
    }
    const lat = localStorage.getItem('lat');
    const lon = localStorage.getItem('lon');
    const new_URL = qr_URL.replaceAll('{lat}', lat).replaceAll('{lon}', lon);
    link.href = new_URL
    QRCode.toDataURL(new_URL).then(dataUrl => {
        image.src = dataUrl
    });
}

generateQR();