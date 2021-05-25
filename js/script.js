;(function(w, d){

	const query = d.querySelector.bind(d);
	const mic = query(".mic img");
	mic.on = true;

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
			return
		}
		mic.on = false;
		mic.src = alternate;
		mic.alt = "Microphone switch Off";
	}

}(window, document));