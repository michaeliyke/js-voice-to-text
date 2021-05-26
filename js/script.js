;(function(w, d){

	const query = d.querySelector.bind(d);
	const mic = query(".mic img");
	const notepad = query("article.notepad p");
	// mic.on = true;

	const speech = new Voice2Text();
	speech.init(notepad);

	mic.addEventListener("click", start);

	function start(event) {
		toogleIcon();
	}

	function toogleIcon() {
		const icon = "img/mic-on.png";
		const alternate = "img/mic-mut.png";
		if (mic.on !== true) {
			mic.on = true;
			mic.src = icon;
			mic.alt = "Microphone switch On";
			speech.startRecognition();
			return
		}
		mic.on = false;
		mic.src = alternate;
		speech.stopRecognition();
		mic.alt = "Microphone switch Off";
	}

}(window, document));