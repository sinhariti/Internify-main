import { useState, useEffect, useRef } from 'react';
import annyang from 'annyang';

export const useVoiceAssistant = ({ onSpeechEnd, onListeningStart, onListeningEnd }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (annyang) {
            annyang.addCallback('start', () => {
                setIsListening(true);
                onListeningStart && onListeningStart();
            });

            annyang.addCallback('end', () => {
                setIsListening(false);
                onListeningEnd && onListeningEnd();
            });

            annyang.addCallback('result', (phrases) => {
                const transcript = phrases[0];
                console.log('User said:', transcript);
                onSpeechEnd(transcript);
                annyang.pause(); // Pause listening after a result
            });

            annyang.addCallback('error', (err) => {
                console.error('Annyang error:', err);
                if (err.error === 'network') {
                    onSpeechEnd('network_error'); // Use a specific code
                } else if (err.error === 'not-allowed') {
                    onSpeechEnd('permission_denied');
                } else {
                    onSpeechEnd('speech_recognition_error');
                }
            });

            // Start listening automatically
            annyang.start({ autoRestart: true, continuous: false });
        }

        return () => {
            if (annyang) {
                annyang.abort(); // Clean up annyang when component unmounts
            }
        };
    }, [onSpeechEnd, onListeningStart, onListeningEnd]);

    return { isListening };
};