import React from 'react';

const Footer = () => {
    return (
        <footer className="footer bg-gray-800 text-white fixed bottom-0 left-0 w-full z-50">
            <div className="container mx-auto py-2 flex items-center justify-end">
                <img src="/CC.png" alt="footer" className="h-8 mr-2" />
                <span className="text-sm">© 2024 Harkaiz Trujillo y Aridane Cabrera</span>
            </div>
        </footer>
    );
};

export default Footer;
