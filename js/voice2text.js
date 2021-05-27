class Voice2Text {
	constructor() {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

		this.grammar = "#JSGF V1.0; grammar is a unit of meaningful speech;";
		this.recognition = new SpeechRecognition();
		this.synthesis = window.speechSynthesis;
		this.speechRecognitionList = new SpeechGrammarList();
		this.speechRecognitionList.addFromString(this.grammar, 1);
		this.recognition.grammars = this.speechRecognitionList;
		this.recognition.lang = "en-US";
		this.recognition.interimResults = true;
		this.recognition.continuous = true;
		this.final = "";
		this.notice = document.createElement("aside");
	}

	startRecognition() {
		this.recognition.start();
	}

	stopRecognition() {
		this.recognition.stop();
	}

	inputHandler(event){
			this.transcript = Array.from(event.results).map((results) =>{
				return  results[0];
			}).map((result) =>{
				return result.transcript;
			}).join(" ");

			this.notepad.textContent = this.transcript;
		}

	init(notepad) {
		if (notepad == null) {
			throw new Error(`Notepad has to be a valid HTMLElement, ${notepad} supplied.`);
		}
		notepad.parentNode.insertBefore(this.notice, notepad); //Create noticebaord
		this.notepad = notepad;
		this.recognition.addEventListener("error", this.errorHandler.bind(this));
		this.recognition.addEventListener("result", this.inputHandler.bind(this));
		this.recognition.addEventListener("soundstart", this.handleSpeechStart.bind(this));
		this.recognition.addEventListener("speechend", this.handleSpeechEnd.bind(this));
		
	}

	copyText(){
  navigator.clipboard.writeText(this.notepad.textContent).then((x) =>{
      this.show("Copying to clipboard was successful!");
    }).catch((error) =>{
      this.show(`Fatal Error: Could not copy text: ${error}`);
    });
	}

clearNote(){
	this.show("Notes cleared!");
  this.notepad.textContent = "";
}

	handleSpeechStart(event) {
		console.log("Some sound is being received");
		// this.notepad.textContent = "";
	}

	handleSpeechEnd(event) {
		console.log("Sound has stopped");
		console.log(event);
	}
		
	show(text, pane) {
		(pane || this.notice).textContent = text;
	}

	errorHandler(event) {
		this.show(`Error occurred in recognition: ${event.error}`, this.notepad);
	}

	promptSave(button) {
		if (button == null) {
			return this.show("Error: Invalid download button!");
		}
		const blob = new Blob([this.notepad.textContent], {
			type: "application/octet-stream;charset=utf-8"
		});
    button.href = window.URL.createObjectURL(blob);
    button.download = "Note-" + (new Date());
	}

	promptSave() {
		const content this.notepad.textContent;
		const uriContent = `data:application/octet-stream,${encodeURIComponent(content)}`
		// location.href = uriContent;
		const win = window.open(uriContent, "neuesDokument");
	}

}