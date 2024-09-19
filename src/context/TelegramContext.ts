import { useEffect, useState } from 'react';

interface TelegramWebApp {
    initDataUnsafe?: {
        user?: TelegramUser;
    };
    setHeaderColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
    expand: () => void;
    ready: () => void;
}

interface TelegramUser {
    id: number;
    first_name: string;
    photo_url: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

declare global {
    interface Window {
        Telegram?: {
            WebApp?: TelegramWebApp;
        };
    }
}

const useTelegram = () => {
    const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [startParam, setStartParam] = useState<string | null>(null);

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            setWebApp(tg);
            setUser(tg.initDataUnsafe?.user || null);
            
            const urlParams = new URLSearchParams(window.location.search);
            const param = urlParams.get('tgWebAppStartParam');
            setStartParam(param);

            tg.setHeaderColor('#101010');
            tg.setBackgroundColor('#101010');
            tg.expand();

            tg.ready();
        } else {
            console.log("Telegram WebApp object not found");
        }
    }, []);

    return { webApp, user, startParam };
};

export default useTelegram;