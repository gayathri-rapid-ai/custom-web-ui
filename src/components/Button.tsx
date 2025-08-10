export const Button: React.FC<{
  text: string;
  onClick?: () => void;
}> = ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
);