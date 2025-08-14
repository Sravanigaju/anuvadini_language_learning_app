import React, { useState } from 'react';

const LanguageDropdown = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', "Kannada", "Punjab"];

    const handleChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    return (
        <select
            value={selectedLanguage}
            onChange={handleChange}
            style={styles.select}
        >
            <option value="" disabled>Select language</option>
            {languages.map((lang, index) => (
                <option key={index} value={lang}>
                    {lang}
                </option>
            ))}
        </select>
    );
};

const styles = {
    select: {
        padding: '6px 18px',
        fontSize: '0.98rem',
        borderRadius: '20px',
        border: '1px solid #e0e0e0',
        background: '#fff',
        color: '#222',
        boxShadow: '0 1px 6px rgba(40,107,218,0.07)',
        outline: 'none',
        transition: 'border 0.2s, box-shadow 0.2s',
        fontFamily: 'inherit',
        cursor: 'pointer',
        margin: 0,
    },
};

export default LanguageDropdown;
