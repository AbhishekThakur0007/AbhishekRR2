// Place this at the top of your file or in a separate `types.d.ts` file

interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
  
  declare var SpeechRecognition: {
    prototype: SpeechRecognition
    new (): SpeechRecognition
  }
  
  declare var webkitSpeechRecognition: {
    prototype: SpeechRecognition
    new (): SpeechRecognition
  }
  