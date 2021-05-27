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

	init({notepad, copy, share, save, pdf, clear}) {
		if (!(notepad && copy && share && save && pdf && clear)) {
			console.log(arguments[0]);
			throw new Error(`Pads have to be valid HTMLElement objects`);
		}
			
		notepad.parentNode.insertBefore(this.notice, notepad); //Create noticebaord
		this.notepad = notepad;

		copy.addEventListener("click", this.copyNote.bind(this));
		share.addEventListener("click", this.shareNote.bind(this));
		save.addEventListener("click", this.createBlob.call(this, save).saveNote.bind(this));
		pdf.addEventListener("click", this.pdfNote.bind(this));
		clear.addEventListener("click", this.clearNote.bind(this));

		this.recognition.addEventListener("error", this.errorHandler.bind(this));
		this.recognition.addEventListener("result", this.inputHandler.bind(this));
		this.recognition.addEventListener("soundstart", this.handleSpeechStart.bind(this));
		this.recognition.addEventListener("speechend", this.handleSpeechEnd.bind(this));
		
	}

	copyNote(){
  navigator.clipboard.writeText(this.notepad.textContent).then((x) =>{
      this.show("Copying to clipboard was successful!");
    }).catch((error) =>{
      this.show(`Fatal Error: Could not copy text: ${error}`);
    });
	}

	shareNote() {
		const d = new File([this.notepad.textContent], this.filename, {
			type: "text/plain;charset=utf-8"
		});
		const data = {
			"title": "Voice2Text: sharing Note.",
			"text": this.notepad.textContent,
			"url": window.location.href,
			// files: [d]
		};

		(async () =>{
			try {
			await navigator.share(data);
			this.show("Note shareD successfully!")
		} catch(error) {
			this.show(`Error encountered: ${error}`)
		}
		})();
	}

	saveNote() {
		const blob = new Blob([this.notepad.textContent], {
			type: "application/octet-stream;charset=utf-8"
		});
    this.save.href = window.URL.createObjectURL(blob);
    this.show("Note has been successfully saved!");
	}	

	pdfNote() {
		function onClick() {
  var pdf = new jsPDF('p', 'pt', 'letter');
  pdf.canvas.height = 72 * 11;
  pdf.canvas.width = 72 * 8.5;

  pdf.fromHTML(document.body);

  pdf.save('test.pdf');
};

var element = document.getElementById("clickbind");
element.addEventListener("click", onClick);
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

	createBlob(button) {
		if (button == null) {
			return this.show("Error: Invalid download button!");
		}
		this.save = button;
		const blob = new Blob([this.notepad.textContent], {
			type: "application/octet-stream;charset=utf-8"
		});
		const d = new Date();
		const date = String(d).match(/[A-z]+\s\d{2}\s\d{4}/i)[0].replace(/\s/g, ".");
    button.href = window.URL.createObjectURL(blob);
    this.filename = `Note-${date}.${d.getTime()}.txt`;
    button.download =  this.filename;
    return this;
	}

	promptSave_() {
		const content = this.notepad.textContent;
		const uriContent = `data:application/octet-stream,${encodeURIComponent(content)}`
		// location.href = uriContent;
		const win = window.open(uriContent, "neuesDokument");
	}

}