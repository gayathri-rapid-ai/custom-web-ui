import React from 'react';

interface FooterProps {
    styles?: React.CSSProperties;
}

const Footer: React.FC<FooterProps> = ({ styles }) => {
    return (
        <footer style={styles}>
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </footer>
    );
};

export default Footer;