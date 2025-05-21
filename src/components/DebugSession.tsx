'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function DebugSession() {
    const { data: session, status } = useSession();
    const [expanded, setExpanded] = useState(false);

    if (status === 'loading') {
        return <div className="text-white bg-slate-800 p-4 rounded-md">Loading session...</div>;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setExpanded(!expanded)}
                className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
            >
                {expanded ? 'Hide' : 'Debug'} Session
            </button>

            {expanded && (
                <div className="mt-2 p-4 bg-slate-900 border border-slate-700 rounded-md text-white max-w-md max-h-96 overflow-auto">
                    <div className="mb-2">
                        <span className="font-bold">Status:</span> {status}
                    </div>
                    {session ? (
                        <>
                            <div className="mb-2">
                                <span className="font-bold">User:</span> {session.user?.name || 'N/A'}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Email:</span> {session.user?.email || 'N/A'}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Discord ID:</span> {session.user?.discordId || 'N/A'}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Is Admin:</span> {session.user?.isAdmin ? 'Yes' : 'No'}
                            </div>
                            <div className="mt-4">
                                <span className="font-bold">Raw Session Data:</span>
                                <pre className="mt-2 p-2 bg-slate-800 rounded text-xs">
                                    {JSON.stringify(session, null, 2)}
                                </pre>
                            </div>
                        </>
                    ) : (
                        <div>No active session</div>
                    )}
                </div>
            )}
        </div>
    );
}
