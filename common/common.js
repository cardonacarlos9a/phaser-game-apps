export function speak(text) {
    const synth = window.speechSynthesis || window.SpeechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'es-CO';
    utterThis.pitch = 1;
    utterThis.rate = 1 
    synth.speak(utterThis);
    console.log(synth.getVoices())
}

export function createText(context){
    const degrees = context.add.text(200, 399, '0°jhjh', { fontFamily: 'Bradley Hand', fontSize: 28, color: '#eeeeee' })
}