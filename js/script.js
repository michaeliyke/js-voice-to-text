;(function(w, d){

	const query = d.querySelector.bind(d);
	const mic = query(".mic img");
	const pads = {
		notepad: query("article.notepad p"),
		copy: query("article.tools .copy"),
		share: query("article.tools .share"),
		save: query("article.tools .save"),
		pdf: query("article.tools .pdf"), 
		clear: query("article.tools .clear")
	};

	const speech = new Voice2Text();
	speech.init(pads);

	mic.addEventListener("click", start);

	function start(even1) {
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