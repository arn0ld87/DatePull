import React from 'react';
import Card from '../components/Card';

const HistoryView: React.FC = () => {
    return (
        <Card title="Verlauf">
            <div className="text-center p-8">
                <h3 className="text-lg font-semibold text-brand-text-primary">Bald verfügbar</h3>
                <p className="mt-2 text-brand-text-secondary">
                    Hier können Sie bald Ihre vergangenen Analysen einsehen.
                </p>
            </div>
        </Card>
    );
};

export default HistoryView;
