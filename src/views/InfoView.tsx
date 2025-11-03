import React from 'react';
import Card from '../components/Card';

const InfoView: React.FC = () => {
    return (
        <Card title="Über DatePullAI">
            <div className="space-y-4 text-brand-text-secondary">
                 <p>
                    DatePullAI ist ein intelligenter Assistent, der entwickelt wurde, um Ihnen das Extrahieren von Terminen aus Stundenplänen zu erleichtern.
                </p>
                <p>
                    Laden Sie einfach ein Bild, eine PDF-Datei oder fügen Sie den Text Ihres Stundenplans ein. Die KI analysiert die Eingabe, identifiziert alle relevanten Termine und bereitet sie für den Export in Ihren persönlichen Kalender vor.
                </p>
                <h4 className="font-bold text-brand-text-primary pt-2">Wie es funktioniert:</h4>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Wählen Sie aus, ob Sie eine Datei hochladen oder Text einfügen möchten.</li>
                    <li>Laden Sie Ihre Datei hoch oder kopieren Sie den Text in das dafür vorgesehene Feld.</li>
                    <li>Klicken Sie auf "Stundenplan analysieren".</li>
                    <li>Überprüfen Sie die extrahierten Termine.</li>
                    <li>Exportieren Sie alle Termine als iCal-Datei oder fügen Sie einzelne Termine direkt zu Ihrem bevorzugten Kalenderdienst hinzu.</li>
                </ol>
            </div>
        </Card>
    );
};

export default InfoView;