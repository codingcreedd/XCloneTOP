import React, { useState } from 'react';
import Modal from './Modal'; // Import the Modal component

const Message = ({ msg, clientId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={`flex ${msg?.User ?.id === clientId ? 'justify-end' : 'justify-start'} cursor-pointer`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${msg?.User ?.id === clientId ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10'} backdrop-filter backdrop-blur-lg rounded-lg px-4 py-2 shadow-sm`}>
                {!(msg?.User ?.id === clientId) && <p className="font-medium text-xs mb-1 text-white text-opacity-60">{msg?.User ?.username}</p>}
                {msg?.description && <p className="text-sm">{msg?.description}</p>}
                {msg.imageUrl && (
                    <img 
                        src={msg?.imageUrl} 
                        alt="Shared image" 
                        className="mt-2 rounded-md max-w-full h-auto cursor-pointer"
                        onClick={handleImageClick}
                    />
                )}
                <p className="text-xs text-white text-opacity-60 mt-1 text-right">{msg?.createdAt}</p>
            </div>

            {/* Modal for enlarged image */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                imageUrl={msg.imageUrl} 
            />
        </div>
    );
};

export default Message;