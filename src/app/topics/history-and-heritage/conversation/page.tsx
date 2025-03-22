'use client';

// import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, Square, Play } from 'lucide-react';

export default function InterviewPractice() {
 const questions = [
   "What is an ancient tradition that is important to your culture?",
   "Can you describe a historical monument you admire?", 
   "Why is it important to preserve cultural heritage?",
   "What traditions do you celebrate with your family?",
   "What historical event has shaped your community?"
 ];

 const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
 const [history, setHistory] = useState([]);
 const [isRecording, setIsRecording] = useState(false);
 const [mediaRecorder, setMediaRecorder] = useState(null);
 const [audioChunks, setAudioChunks] = useState([]);
 // Removed commented out state variables that were causing lint errors

 // We don't need this effect if we're not using isBrowserCompatible
 // useEffect(() => {
 //   if (typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
 //     setIsBrowserCompatible(true);
 //   }
 // }, []);

 const startRecording = async () => {
  if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
    alert("Your browser doesn't support audio recording");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: true,
      video: false // Make sure we're only requesting audio recording
    });
    
    if (!stream) {
      throw new Error('No audio stream available');
    }

    const recorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm' // Use supported format
    });
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setAudioChunks(prev => [...prev, event.data]);
      }
    };
    
    setMediaRecorder(recorder);
    setIsRecording(true);
    setAudioChunks([]);
    recorder.start(200); // Record in 200ms chunks
  } catch (err) {
    console.error("Error:", err);
    alert("Please enable microphone access in your browser settings");
  }
};

 const stopRecording = () => {
   if (mediaRecorder?.state === 'recording') {
     setIsRecording(false);
     mediaRecorder.stop();
     mediaRecorder.onstop = () => {
       const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
       const audioUrl = URL.createObjectURL(audioBlob);
       setHistory(prev => [...prev, {
         question: questions[currentQuestionIndex],
         answer: audioUrl
       }]);
       setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
     };
   }
 };

 const playQuestion = () => {
   if (window.speechSynthesis) {
     const utterance = new SpeechSynthesisUtterance(questions[currentQuestionIndex]);
     utterance.lang = 'en-US';
     window.speechSynthesis.speak(utterance);
   }
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 relative">
     <div className="max-w-4xl mx-auto mt-16">
       <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
         <div className="mb-8">
           <h2 className="text-2xl font-semibold text-gray-800 mb-4">
             Question {currentQuestionIndex + 1}:
           </h2>
           <div className="flex items-center justify-between">
             <p className="text-xl text-gray-700">{questions[currentQuestionIndex]}</p>
             <button
               onClick={playQuestion}
               className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
             >
               <Play className="w-6 h-6" />
             </button>
           </div>
         </div>

         <div className="flex justify-center mb-8">
           {!isRecording ? (
             <button
               onClick={startRecording}
               className="flex items-center space-x-2 px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all"
             >
               <Mic className="w-6 h-6" />
               <span>Start Recording</span>
             </button>
           ) : (
             <button
               onClick={stopRecording}
               className="flex items-center space-x-2 px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all animate-pulse"
             >
               <Square className="w-6 h-6" />
               <span>Stop Recording</span>
             </button>
           )}
         </div>

         {history.length > 0 && (
           <div className="space-y-4">
             <h3 className="text-xl font-semibold text-gray-800 mb-4">Previous Answers:</h3>
             {history.map((entry, index) => (
               <div key={index} className="bg-gray-50 p-4 rounded-xl">
                 <p className="text-gray-700 mb-2">{entry.question}</p>
                 <audio controls className="w-full">
                   <source src={entry.answer} type="audio/wav" />
                 </audio>
               </div>
             ))}
           </div>
         )}
       </div>
     </div>

     <div className="absolute top-4 left-4">
       <Link
         href="/"
         className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-300"
       >
         🏠
       </Link>
     </div>
   </div>
 );
}